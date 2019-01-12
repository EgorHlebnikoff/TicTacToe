import * as webpack from 'webpack';
import * as middleware from 'webpack-dev-middleware';
import * as config from '../frontend/config/webpack.config';
import app from './app/App';

const compiler = webpack(config);
const port = 5000;

app.use(middleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
}));

app.listen(port, (error) => {
    if (error) {
        console.log(error);

        return;
    }

    console.log(`Application running on port: ${port}`);
});
