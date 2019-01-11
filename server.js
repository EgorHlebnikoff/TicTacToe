const express = require('express'),
    webpack = require('webpack'),
    config = require('./webpack.config'),
    middleware = require('webpack-dev-middleware'),
    path = require('path'),
    app = express(),
    port = 5000;

const compiler = webpack(config);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.use(middleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.listen(port, error => {
    if (error) {
        console.log(error);
        return;
    }

    console.log("Application running on port: " + port);
});