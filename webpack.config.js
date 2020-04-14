const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports ={
    mode: 'development',
	module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader'
                }

            },
            // {
            //     test: /\.html$/,
            //     use: [
            //         {
            //             loader: 'html-loader',
            //             options: {minimize: false}
            //         }
            //     ]
            // }

        ]
    },
    // plugins: [
    //     new HtmlWebpackPlugin({
    //         template: './src/app/views/game.html',
    //         filename:'./index.html'
    //     })
    // ],
    devtool: 'source-map'
}