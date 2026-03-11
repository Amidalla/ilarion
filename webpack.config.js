const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const fs = require('fs');
const pages = fs.readdirSync(path.resolve(__dirname, 'src')).filter(fileName => fileName.endsWith('.html'));
const postHtmlInclude = require('posthtml-include');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    return {
        entry: {
            app: "./src/assets/js/index.js"
        },
        output: {
            filename: 'js/bundle.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
            assetModuleFilename: (pathData) => {
                const filepath = path
                    .dirname(pathData.filename)
                    .split('/')
                    .slice(1)
                    .join('/');
                return `${filepath}/[name][ext]`;
            },
        },
        mode: isProduction ? 'production' : 'development',
        devServer: {
            static: "./src",
            compress: true,
            port: 8080,
            hot: true,
        },
        module: {
            rules: [
                {
                    test: /\.html$/i,
                    use: [
                        {
                            loader: 'html-loader',
                            options: {
                                esModule: false,
                                minimize: false,
                                sources: {
                                    list: [
                                        '...',
                                        {
                                            tag: 'img',
                                            attribute: 'data-src',
                                            type: 'src',
                                        },
                                        {
                                            tag: 'source',
                                            attribute: 'data-srcset',
                                            type: 'src',
                                        },
                                        {
                                            tag: 'video',
                                            attribute: 'poster',
                                            type: 'src',
                                        }
                                    ],
                                }
                            },
                        },
                        {
                            loader: 'posthtml-loader',
                            options: {
                                plugins: [
                                    postHtmlInclude({ root: path.resolve(__dirname, 'src') })
                                ],
                            },
                        },
                    ],
                },
                {
                    test: /\.(s[ac]ss|css)$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.(mp4|webm|ogg)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: 'video/[name][ext]'
                    }
                }
            ],
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
            new FaviconsWebpackPlugin({
                logo: path.resolve(__dirname, 'src/assets/images/favicon-source.png'),
                prefix: 'assets/images/favicon/',
                mode: 'webapp',
                devMode: 'webapp',
                cache: true,
                inject: true,
                favicons: {
                    icons: {
                        coast: false,
                        yandex: false,
                        android: true,
                        appleIcon: true,
                        appleStartup: false,
                        favicons: true,
                        firefox: false,
                        windows: true
                    }
                }
            }),
            ...pages.map(page => new HtmlWebpackPlugin({
                template: path.join(__dirname, 'src', page),
                filename: page,
                minify: false,
            })),
        ],
    }
};