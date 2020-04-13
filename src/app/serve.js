import app  from './app'
const port = process.env.PORT || 4000

const listEndpoints = require('express-list-endpoints')

//app.use(cors({ origin: process.env.CORS_URL })) // CORS Whitelist

// list routes endpoins
// console.log(listEndpoints(app))


app.listen(port, () => {
    console.log('app served on port:', `${process.env.HOST}:${port}`)
})