module.exports ={
    mode: 'development',
    entry: './src/game/main.js',
    output: {
        filename: 'game.bundled.js',
        path: __dirname + '/public'
    },
	module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    }
                }

            },

        ]
    },
    devtool: 'source-map'
}