require('dotenv').config()
import express from "express"
import bodyParser from "body-parser"
import morgan from 'morgan'
import helmet from 'helmet'

const app = express()

if (process.env.NODE_ENV == "development"){
    app.use(morgan('dev'))
}

app.use(bodyParser.json())
app.use(helmet())


// app.use(express.static(__dirname + '/public'));
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});

module.exports = app