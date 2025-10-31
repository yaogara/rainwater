<div align="center">
  <h1>Minted Directory Astro</h1>
  <p>Markdown driven directory template. Built with Astro and Tailwindcss. Optimized for SEO. Beautiful Customizable Style</p>
</div>

<br/>

<div align="center">
  <img src="https://github.com/user-attachments/assets/febde860-00be-408b-8a13-41953f7178e1" alt="Minted Directory Screenshot" />
</div>

<br/>

## Features:
+ 🖌️ Add listings from is possible from different formats: `markdown`, `csv`, `json`, `google sheets`, `notion`, `airtable`.
+ 🔋 SEO optimized and programmatic SEO out of the box
+ 💻 Pre-built components for directories.
+ 💅 Customizable styles.
+ 🌙 Dark/Light mode
+ 💸 Sponsored Content
+ 👀 Tags + Search

## Getting Started

### Local Development

Duplicate the template then clone the repository.

```sh
git clone git@github.com:youraccount/projectname.git my-directory
```

Or use the github cli to create a repository based on the template and clone in one command:

```sh
gh repo create my-directory --template masterkram/minted-directory-astro --private --clone
```

Go to the cloned folder:
```sh
cd my-directory
```

Install dependencies

```sh
pnpm install
```

Run the website:

```sh
pnpm dev
```

Congrats :tada:

You can start customizing and building your directory.

## Adding Content

Adding content to the directory can be done using one of the following formats:
+ markdown
+ json
+ csv
+ notion
+ google sheets
+ airtable

Remember that listings will not be shown on the live website until the site is re-built and deployed. This is done to ensure the fastest possible performance by serving static html, css and js.

### Using markdown listings:
1. add markdown files to the `src/data/directory` folder. All markdown files will be automatically loaded as listings.
2. You must specify required properties of a listing such as title and description in the [frontmatter]() of the file

### Using json listings:
1. add a single json file: `src/data/directory/directory.json`
2. in this json file, the root element is an array. This array can contain objects which are the listings of the directory. These require the properties of `id`, `name` and `description`.

### Using csv listings:
1. add a single csv file: `src/data/directory/directory.csv`
2. add rows to this csv file, these require the properties of `id`, `name` and `description`.

### Using google sheets listings:
1. Create a [google sheets](https://docs.google.com/spreadsheets/u/0/) document.
2. You need to select your table and click `Format > Convert to table`
3. Make it publicly shareable. When you share the link. copy the id
4. Go to `settings.toml`, here you need to set the `source=sheets` and `key = ` the copied id of the file

Use this spreadsheet as a starting point: [directory google sheet data](https://docs.google.com/spreadsheets/d/1BKVVFysQT8ZuPY8hUp--jwTrN-U20TrtML0idECIWmc/edit?usp=sharing)

### Using notion listings:

### Using airtable listings:


## Customization

To customize the directory style:
+ Change the `--color-primary-x00` variables, `--color-gray-x00` variables in the `src/styles/global.css`
+ Change the font:
  + install from [fontsource]()
  + import font in `BaseLayout.astro`
  + change the `--font-sans` variable in `global.css`
+ Customize the `src/data/config/settings.toml` to your preferences.

### Pre-made styles:
- spearmint
- peppermint

### Adding Content

Add listings by adding markdown files to `/src/content/directory`

## Deployment

Deploy as a static site for best SEO performance:

```bash
pnpm run build
```

## Community

[Join the discord](https://discord.gg/5UbrTNzX7y)
