/* eslint-disable */

require('dotenv').config()
const mix = require('laravel-mix')
require('laravel-mix-eslint')

const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const StyleLintPlugin = require('stylelint-webpack-plugin')

mix
  .setPublicPath('assets/')
  .options({
    postCss: [
      // https://github.com/ai/webp-in-css
      require('webp-in-css/plugin')(),
      // group our media queries
      require('css-mqpacker')(),
      // automate the way of writing SCSS functions to transform pxtorem by using PostCSS plugin
      require('postcss-pxtorem')({
        rootValue: 16,
        propList: [
          'font',
          'font-size',
          'line-height',
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'margin',
          'margin-right',
          'margin-left',
          'margin-top',
          'margin-bottom',
          'padding',
          'padding-right',
          'padding-left',
          'padding-top',
          'padding-bottom',
        ],
        mediaQuery: false,
      }),
      // fixes known flexbox bugs if found
      require('postcss-flexbugs-fixes')(),
      // https://css-tricks.com/font-display-masses/
      require('postcss-font-display')({
        display: 'swap',
        replace: false,
      }),
      // autoprefixer and etc.
      require('postcss-preset-env')({
        autoprefixer: {
          flexbox: 'no-2009',
        },
      }),
    ],
    terser: {
      terserOptions: {
        parse: {
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
          comparisons: false,
          inline: 2,
        },
        mangle: {
          safari10: true,
        },
        output: {
          ecma: 5,
          comments: false,
          ascii_only: true,
        },
      },
      parallel: true,
      cache: true,
    },
  })
  .webpackConfig(webpack => ({
    externals: {
      jquery: 'jQuery',
    },
    plugins: [
      new StyleLintPlugin({
        files: 'src/scss/**/*.scss',
        configFile: '.stylelintrc',
        syntax: 'scss',
      }),
      new BundleAnalyzerPlugin(),
    ],
  }))
  .sass('src/scss/style.scss', 'assets/css/')
  .eslint({
    fix: true,
    cache: false,
    failOnError: true,
    configFile: '.eslintrc',
  })
  .js('src/js/index.js', 'assets/js/script.js')
  .browserSync({
    proxy: process.env.PROXY,
    host: process.env.PROXY,
    files: [
      'assets/**/*.*',
      'layouts/**/*.*',
      'pages/**/*.*',
      'partials/**/*.*',
    ],
  })
  .sourceMaps(false, 'inline-cheap-source-map')
  .extract()
  .version()
