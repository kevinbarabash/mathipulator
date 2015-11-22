module.exports = {
    entry: {
        app: "./index.js",
        react_test: "./react/test.js"
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    optional: ['es7.classProperties']
                }
            },
            { test: /\.json$/, exclude: /node_modules/, loader: "json-loader" }
        ]
    }
};
