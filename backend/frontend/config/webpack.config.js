//Копия webpack.config.js для решения проблемы с поиском модуля в коде сервера

const path = require("path"),
    srcPath = path.resolve(__dirname, "../src/"),
    distPath = path.resolve(__dirname, "../../public/"),
    TSLintPlugin = require('tslint-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
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
    plugins: [
        new TSLintPlugin({
            files: [srcPath + "/**/*.tsx"],
            config: "./tslint.json",
            waitForLinting: true
        })
    ],
    devServer: {
        hot: true,
        port: 4500
    }
};