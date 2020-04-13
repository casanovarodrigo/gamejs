require('dotenv').config()
import express from "express"
import bodyParser from "body-parser"
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'
import moduleAlias from "module-alias";


const appPath = `./${process.env.NODE_ENV === 'production'? 'build' : 'src'}/app/`

moduleAlias.addAlias(`@app`, path.resolve(`${appPath}`))
moduleAlias.addAlias(`@game`, path.resolve(`${appPath}/js/game/`))


const app = express()

if (process.env.NODE_ENV == "development"){
    app.use(morgan('dev'))
}

app.use(bodyParser.json())
app.use(helmet())


app.use(express.static(path.resolve('./public')))
 
app.get('/', function (req, res) {
  const view = path.resolve(`./src/app/views/game.html`)
  console.log(view)
  res.sendFile(view)
});

module.exports = app