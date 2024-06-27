const { defineConfig } = require('@vue/cli-service')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  
	configureWebpack: {
		plugins: [new MiniCssExtractPlugin({ ignoreOrder: true })],
		experiments: {
			topLevelAwait: true
		}
	},
	css: {
		extract: { ignoreOrder: true }
	},

  // https://cli.vuejs.org/config/#publicpath
  publicPath: process.env.PUBLICPATH,
  
  // https://webpack.js.org/configuration/dev-server/#devserverserver
  devServer: {
    https: {
      pfx: 'sisprodesa.local_WC.pfx',
      passphrase: 'sispro1*'
    },
    host: 'devweb.sisprodesa.local',
    port: 8000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
})
