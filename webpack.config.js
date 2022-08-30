import path from 'path';
import url from 'url';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODE = process.env.NODE_ENV ?? 'development';
const IS_DEV = MODE === 'development';

const imageMinimizer = new ImageMinimizerPlugin({
  // exclude: /\.svg$/i, // <- THIS HELPS!

  minimizer: {
    filename: 'minified-xxx-[name]-yyy[ext]',
    implementation: ImageMinimizerPlugin.sharpMinify,
    options: {
      encodeOptions: {
        jpeg: {
          quality: 90,
        },
        webp: {
          quality: 90,
        },
        avif: {
          quality: 90,
        },
      },
    },
  },
  generator: [
    {
      preset: 'webp',
      implementation: ImageMinimizerPlugin.sharpGenerate,
      filename: 'generated-webp-from-[name][ext]',
      options: {
        encodeOptions: {
          webp: {
            quality: 90,
          },
        },
      },
    },
    {
      preset: 'avif',
      implementation: ImageMinimizerPlugin.sharpGenerate,
      filename: 'generated-avif-from-[name][ext]',
      options: {
        encodeOptions: {
          avif: {
            quality: 90,
          },
        },
      },
    },
  ],
});

export default {
  mode: MODE,

  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },

  output: {
    path: path.join(__dirname, './build'),
    filename: IS_DEV ? 'js/[name].js' : 'js/[name].[chunkhash:8].js',
    chunkFilename: IS_DEV ? 'js/[name].chunk[ext]' : 'js/[name].[chunkhash:8].chunk[ext]',
    assetModuleFilename: IS_DEV ? 'assets/[name][ext]' : 'assets/[name]-[contenthash:8][ext]',
    clean: true,
  },

  optimization: IS_DEV
    ? undefined
    : {
        minimizer: [imageMinimizer],
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            commons: {
              name: 'commons',
              chunks: 'initial',
            },
          },
        },
      },

  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        type: 'asset/resource',
      },
    ],
  },
};
