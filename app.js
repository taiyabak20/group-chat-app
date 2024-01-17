const express = require('express')
const app = express()
const signupRoutes = require('./routes/signup')
const cors = require('cors')
app.use(cors())

app.use('/signup', signupRoutes)
app.listen(3000)