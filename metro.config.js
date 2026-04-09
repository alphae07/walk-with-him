const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.blacklistRE = /node_modules\/react-native\/node_modules\/react-native\/.*/;

module.exports = config;
