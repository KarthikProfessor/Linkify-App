require('dotenv').config()
const connectDB = require("./config/db")
const app = require("./app")

const port = process.env.PORT
app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`)
})

connectDB();