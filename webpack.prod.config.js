var path = require('path');

module.exports = {
    devtool: 'eval',
    entry: [
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'gh-pages'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel',
            include: path.join(__dirname, 'src'),
            query: {
                optional: ['es7.classProperties']
            }
        }, {
            test: /\.json$/,
            loader: 'json',
            include: path.join(__dirname, 'metrics')
        }]
    }
};
