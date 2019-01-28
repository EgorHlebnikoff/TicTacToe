require('dotenv').config();

const path = require("path"),
    srcPath = path.resolve(__dirname, "../src/"),
    distPath = path.resolve(__dirname, "../../public/"),
    TSLintPlugin = require('tslint-webpack-plugin');

const plugins = process.env.MODE === 'production' ? [] : [
    new TSLintPlugin({
        files: [srcPath + "/**/*.tsx"],
        config: "./tslint.json",
        waitForLinting: true
    })
];

module.exports = {
    mode: process.env.MODE === 'production' ? 'production' : 'development',
    devtool: process.env.MODE === 'production' ? 'source-map' : 'inline-source-map',
    entry: srcPath + "/App.tsx",
    output: {
        filename: "bundle.js",
        path: distPath,
        publicPath: "/"
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader?" + JSON.stringify({
                    configFile: 'frontend/config/tsconfig.json'
                }),
                exclude: /node_modules/
            }
        ]
    },
    plugins: plugins
};