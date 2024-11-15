const { withNativeWind } = require("nativewind/metro");
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("sql"); // <--- add this

module.exports = withNativeWind(config, { input: "./global.css" });
