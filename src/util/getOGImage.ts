import themeConfig from "./themeConfig"

function getBasePath(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4321';
  }

  return themeConfig.general.seo.url;
}

export function getOGImage(slug: string) {
  let basePath: string = getBasePath();
  return `${basePath}/og/${slug}.png`;
}