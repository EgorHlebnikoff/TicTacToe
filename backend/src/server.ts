const express = require('express');
const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const path = require('path');
const config = require('../frontend/config/webpack.config');
const app = express();
const port = 5000;

const compiler = webpack(config);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(middleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
}));

app.listen(port, (error) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log("Application running on port: " + port);
});