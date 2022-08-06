// @ts-check

/// <reference path="./src/serviceworker-webpack-plugin.d.ts" />

const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack5-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const r = path.resolve.bind(null, __dirname);

const presetMode = process.env.NODE_ENV || 'development';
const isProduction = (presetMode === 'production');
const BASENAME = process.env.BASENAME || "/";
const VERSION = require("./version")();

/** @type {webpack.Configuration} */
module.exports = {
    mode: presetMode,
    context: __dirname,
    devtool: isProduction ? false : 'cheap-module-source-map',
    entry: {
        'index': r("src/index.tsx"),
    },
    output: {
        path: r("public"),
        filename: isProduction ? "[id].[hash].js" : "[name].js",
    },
    optimization: {
        splitChunks: false,
    },
    performance: {
        maxAssetSize: 500 * 1000,
        maxEntrypointSize: 500 * 1000,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.(js|json|ts|tsx)$/,
                include: r("src"),
                exclude: r("src/sw.ts"),
                loader: 'ts-loader',
                options: {
                    experimentalWatchApi: true,
                    configFile: r("tsconfig.json"),
                },
            },
            {
                test: /\.(js|json|ts|tsx|mjs)$/,
                include: r("src/sw.ts"),
                loader: 'ts-loader',
                options: {
                    experimentalWatchApi: true,
                    configFile: r("tsconfig.sw.json"),
                },
            },
            {
                test: /\.css$/,
                include: r('src'),
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(?:svg|png|webmanifest|ico)$/,
                include: r('src'),
                loader: 'file-loader',
                options: {
                    esModule: false,
                }
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.mjs', '.ts', '.tsx', '.css'],
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
    plugins: [
        // new ForkTsCheckerWebpackPlugin({
        //     async: true,
        //     watch: r("/src"),
        //     tsconfig: r("tsconfig.json"),
        // }),
        new ServiceWorkerWebpackPlugin({
            entry: r("src/sw.ts"),
        }),
        new webpack.EnvironmentPlugin({
            ...process.env,
            VERSION,
            BUILD_TIMESTAMP: +new Date(),
        }),
        new MiniCssExtractPlugin({
            filename: isProduction ? "[id].[hash].css" : "[name].css",
        }),
        new HtmlWebpackPlugin({
            template: r("src/index.html"),
        })
    ]
}
