// config what we want webpack to do: looking our src/index.js and bundle all of that codes together into a single bundle file

const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),  // __dirname >>> get the current directory of this file
    filename: 'bundle.js'
  },
  watch: true   // real-time watch
}