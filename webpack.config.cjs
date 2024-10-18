const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const RemoveEmptyFilesPlugin = require('./remove-empty-files-plugin.cjs');

module.exports = (env, argv) => {
    const mode = argv.mode || 'development';

    return {
        mode: mode,
        devtool: (mode === "development") ? 'source-map' : false,
        watch: (mode === "development"),
        entry: {
            'index': './public-src/scripts/index.ts',
            'send': './public-src/scripts/send.ts',
            'box': './public-src/scripts/box.ts',
            'letter': './public-src/scripts/letter.ts',
        },
        output: {
            filename: '[name].bundle.js',
            path: path.resolve(__dirname, 'public/assets'),
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                '@': path.resolve(__dirname, 'public-src'),
                '@web': path.resolve(__dirname, 'public-src'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'ts-loader',
                    },
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-typescript'],
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, 'css-loader'],
                },
                {
                    test: /\.scss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'sass-loader',
                    ],
                },
            ],
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    test: /\.js(\?.*)?$/i,
                    terserOptions: {
                        format: {
                            ascii_only: true,
                        }
                    }
                }),
                new CssMinimizerPlugin({
                    test: /\.(c|sc|sa)ss(\?.*)?$/i,
                }),
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].bundle.css',
            }),
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [
                    '**/*',
                    // path.resolve(__dirname, 'public/dist')
                ],
                cleanStaleWebpackAssets: false,
                protectWebpackAssets: false,
            }),
            new RemoveEmptyFilesPlugin(),
        ],
    }
}
