const express = require('express')
const app = express()
const path = require('path');



const ejs = require('ejs')

const compression = require('compression')



app.use(compression())

// Weergavemap
app.set('views', 'assets/views')
// Weergave engine
app.set('view engine', 'ejs')



app.get('/', (req, res) => {
  res.render('index')
})


// Server has started text
app.listen(3000, () => {
  console.log('Whats up! The server has started on port 3000. Have fun!')
})