/// <reference types="node" />
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx)'],
	addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
	webpackFinal: async (config: any) => {
		config.module.rules.push({
			test: /\.ttf$/,
			use: ['file-loader'],
		});
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules/,
			type: 'javascript/auto',
		});
		config.plugins.push(new MonacoWebpackPlugin({ languages: ['json'] }));

		return config;
	},
};
