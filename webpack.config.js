const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')


const IS_DEVELOPMENT = process.env.NODE_ENV ==='dev'

const dirApp = path.join(__dirname,'src')
const dirShared = path.join(__dirname,'shared')
const dirStyles = path.join(__dirname,'styles')
const dirNode = 'node_modules'


module.exports = {
    mode: 'development',
    devtool:'source-map',
    // context: path.resolve(__dirname,'src'),
    // entry: ['./main.js', './main.scss'],
    entry: [
        path.join(dirApp, 'main.js'),
        path.join(dirStyles, 'main.scss')
    ],
    resolve: {
        modules: [
            dirApp,
            dirShared,
            dirStyles,
            
        ]
    },

    output: {
        path: path.resolve(__dirname, 'public')
    },

    module: {
        rules: [
            {
            test: /\.m?js$/,
             exclude: /node_modules/,
              use: {
                   loader: 'babel-loader',
                  }         
            },
            { 
                test: /\.s[ac]ss$/i,
                exclude: /node_modules/,
               use: [
                   {
                       loader: MiniCssExtractPlugin.loader,
                       options: {
                           publicPath:''
                       }
                           
                   },
                       'css-loader',
                       'postcss-loader',
                       'sass-loader',
                
                   ]
         },
         {
            test: /\.(jpg?g|png|gif|svg|woff2?|fnt|webp)$/,
            loader: 'file-loader',
            options: {
                name (file) {
                    return '[hash].[ext]'
                }
            }
        },
        {
            test: /\.(jpe?g|png|gif|svg|webp)$/i,
            use: [
              {
                loader: ImageMinimizerPlugin.loader,
                options: {
                  severityError: "warning", // Ignore errors on corrupted images
                  minimizerOptions: {
                    plugins: ["gifsicle"],
                  },
                },
              },
            ],
          },
          {
              test: /\.(glsl|frag|vert)$/i,
              loader:'raw-loader',
              exclude:/node_modules/
          },
          {
            test: /\.(glsl|frag|vert)$/i,
            loader:'glslify-loader',
            exclude:/node_modules/
          },  
        ]
      },
      optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
      },

        plugins: [
        new MiniCssExtractPlugin({
            filename:'[name].css',
            chunkFilename: '[id].css'
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './shared',
                    to:''
                }
            ]
        }),

        new ImageMinimizerPlugin({
            minimizerOptions: {
              plugins: [
                ["gifsicle", { interlaced: true }],
                ["jpegtran", { progressive: true }],
                ["optipng", { optimizationLevel: 5 }],
              ],
            },
          }),
      ]
}