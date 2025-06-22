const path = require('path');

module.exports = {
    mode: 'production', // Set to 'production' for optimized builds
    entry: './src/index.js', // Your main entry point
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js', // Output file name
        publicPath: '/', // Public URL of the output directory
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/, // Regex to match JavaScript files
                exclude: /node_modules/, // Exclude node_modules
                use: {
                    loader: 'babel-loader', // Use Babel to transpile ES6+
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'] // Presets for React
                    }
                }
            },
            {
                test: /\.css$/, // Regex to match CSS files
                use: ['style-loader', 'css-loader'], // Loaders for CSS
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'], // Resolve these file extensions
        fallback: {
            "crypto": require.resolve("crypto-browserify"), // Polyfill for crypto
            "stream": require.resolve("stream-browserify"), // Polyfill for stream
             "vm": require.resolve('vm-browserify')

        }
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'), // Serve content from the dist directory
        compress: true,
        port: 9000, // Port for the dev server
        historyApiFallback: true, // Enable HTML5 History API fallback
    },
    optimization: {
        minimize: true, // Minimize the output
    },
};