const path = require("path"),
    distPath = path.resolve(__dirname, "/public/"),
    TSLintPlugin = require('tslint-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: "./src/app.tsx",
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
                loader: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new TSLintPlugin({
            files: ["./src/**/*.tsx"],
            config: "./tslint.json",
            waitForLinting: true
        })
    ],
    devServer: {
        hot: true,
        port: 4500
    }
};