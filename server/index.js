import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import router from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api', router)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Serverr running on port ${PORT}`)
})