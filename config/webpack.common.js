const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const paths = require('./paths');
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'src/phaser.js');

module.exports = {
    // Where webpack looks to start building the bundle
    entry: [paths.src + '/app.ts'],

    // Where webpack outputs the assets and bundles
    output: {
        path: paths.build,
        filename: 'bundle.js',
        publicPath: '/',
    },

    // Customize the webpack build process
    plugins: [
        // Removes/cleans build folders and unused assets when rebuilding
        new CleanWebpackPlugin(),

        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: paths.assets,
        //             to: paths.public + '/assets/',
        //         },
        //     ],
        // }),

        // Generates an HTML file from a template
        // Generates deprecation warning: https://github.com/jantimon/html-webpack-plugin/issues/1501
        new HtmlWebpackPlugin({
            title: 'Mage Arena',
            template: paths.src + '/template.html', // template file
            filename: 'index.html', // output file
        }),
    ],

    // Determine how modules within the project are treated
    module: {
        rules: [
            {
                test: /\.ts|\.tsx$/,
                include: paths.src,
                loader: 'ts-loader'
            },
            {
                test: require.resolve('Phaser'),
                loader: 'expose-loader',
                options: { exposes: { globalName: 'Phaser', override: true } }
            },
            {
                test: /\.(gif|png|jpe?g|svg|xml)$/i,
                use: 'file-loader',
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
        ],
    },

    resolve: {
        modules: [paths.src, 'node_modules'],
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@': paths.src,
            assets: paths.public,
            phaser: phaser
        },
    },
}