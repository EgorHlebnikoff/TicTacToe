import * as express from 'express';
import * as webpack from 'webpack';
import * as middleware from 'webpack-dev-middleware';
import * as config from '../../frontend/config/webpack.config';

export default function setWebpackMiddleware(app: express.Application): void {
    const compiler = webpack(config);

    app.use(middleware(compiler, {
        noInfo: true,
        publicPath: config.output.publicPath,
    }));
}
