import express from 'express'
import enfantRoute from './routes/enfantRoute.js'

const app = express()

app.use(express.json())

// les routes viendront ici
 app.use('/api/enfants', enfantRoute)

export default app