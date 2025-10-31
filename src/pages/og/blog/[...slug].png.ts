import { getEntry, type CollectionEntry } from 'astro:content';
import fs from 'fs';
import path from 'path';
import { ImageResponse } from '@vercel/og';
import { getBlogPages, getRootPages } from '@lib/getRootPages';
import config from '@util/themeConfig';
import type { AllContent } from '../../../types/content';

const boldFontPath = 'node_modules/@fontsource/gabarito/files/gabarito-latin-700-normal.woff' as const;
const regularFontPath = 'node_modules/@fontsource/gabarito/files/gabarito-latin-400-normal.woff' as const;
 
interface Props {
  params: { slug: string };
}

function getPostCoverPath(entry: CollectionEntry<'blog'>) {
  if (!entry.data.image) {
    return '/default-blog-image.png';
  }
  return entry.data.image.src;
}

function getPostCoverImage(entry: CollectionEntry<'blog'>) {
  const imagePath = getPostCoverPath(entry);
  if (process.env.NODE_ENV === 'development') {
    return path.resolve(imagePath.replace(/\?.*/, '').replace('/@fs', ''));
  }
  return path.resolve(imagePath.replace('/', 'dist/'));
}
 
export async function GET({ params }: Props) {
  const title = config.general.title;
  const { slug } = params;
  const entry = await getEntry('blog', slug);

  if (!entry) {
    throw new Error("Unable to find " + slug);
  }

  // using custom font files
  const GabartitoSansBold = fs.readFileSync(path.resolve(boldFontPath));
  const GabaritoSansRegular = fs.readFileSync(
    path.resolve(regularFontPath),
  );
  let postCover;
  try {
    postCover = fs.readFileSync(getPostCoverImage(entry));
  } catch (error) {
    postCover = null;
  }

  const image = postCover ? {
    type: 'img',
    props: {
      src: postCover.buffer,
    },
  } :               {
    type: 'div',
    props: {
      tw: 'bg-gray-200 rounded-full'
    },
  };
 
  const html = {
    type: 'div',
    props: {
      children: [
        {
          type: 'div',
          props: {
            tw: 'w-[200px] h-[200px] flex rounded-3xl overflow-hidden',
            children: [
              image
            ],
          },
        },
        {
          type: 'div',
          props: {
            tw: 'pl-10 shrink flex flex-col max-w-xl',
            children: [
              {
                type: 'div',
                props: {
                  tw: 'text-zinc-800',
                  style: {
                    fontSize: '48px',
                    fontFamily: 'Gabarito Bold',
                  },
                  children: entry.data.title,
                },
              },
              {
                type: 'div',
                props: {
                  tw: 'text-zinc-500 mt-2',
                  style: {
                    fontSize: '18px',
                    fontFamily: 'Gabarito Regular',
                  },
                  children: entry.data.title,
                },
              },
            ],
          },
        },
        {
          type: 'div',
          props: {
            tw: 'absolute right-[40px] bottom-[40px] flex items-center',
            children: [
              {
                type: 'div',
                props: {
                  tw: 'text-gray-900 text-4xl',
                  style: {
                    fontFamily: 'Gabarito Bold',
                  },
                  children: `${title}`,
                },
              },
            ],
          },
        },
      ],
      tw: 'w-full h-full flex items-center justify-center relative px-22',
      style: {
        background: '#fff',
        fontFamily: 'Gabarito Regular',
      },
    },
  };
 
  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: 'Gabarito Bold',
        data: GabartitoSansBold.buffer,
        style: 'normal',
      },
      {
        name: 'Gabarito Regular',
        data: GabaritoSansRegular.buffer,
        style: 'normal',
      },
    ],
  });
}

export async function getStaticPaths() {
  return await getBlogPages();
}