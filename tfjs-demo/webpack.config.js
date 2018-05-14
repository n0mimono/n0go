module.exports = {
    mode: 'development',
    entry: __dirname + "/src/index.tsx",
    output: {
      path: __dirname + "/dist/contents",
      publicPath: "/contents",
      filename: "bundle.js"
    },
    module: {
      rules: [
          {
              test: /\.tsx?$/,
              loader: 'awesome-typescript-loader'
          },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    devServer: {
      contentBase: 'dist',
      port: 3000,
      open: true
    }
  }
