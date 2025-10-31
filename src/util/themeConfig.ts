import { settingsSchema, themeSchema, themeSettingsSchema, type SettingsSchema } from "@validation/settings";
import configData from "../config/settings.toml";
import peppermint from "../config/themes/peppermint.toml";
import spearmint from "../config/themes/spearmint.toml";
import brookmint from "../config/themes/brookmint.toml";
import hemingway from "../config/themes/hemingway.toml";

function getConfig(data: unknown) {
  try {
    return themeSettingsSchema.parse(data);
  } catch (error) {
    return null;
  }
}

const themes = {
  peppermint: themeSchema.parse(peppermint),
  spearmint: themeSchema.parse(spearmint),
  brookmint: themeSchema.parse(brookmint),
  hemingway: themeSchema.parse(hemingway),
};

const data = getConfig(configData);
let settings: SettingsSchema;

if (data) {
  const selectedTheme = configData.theme || "peppermint";
  const themeConfig = themes[selectedTheme as keyof typeof themes];
  
  settings = {
    ...themeConfig,
    ...data,
  };
} else {
  settings = settingsSchema.parse(configData);
}

export default settings;