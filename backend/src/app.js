import express from 'express'

const app = express()

app.use(express.json())

// les routes viendront ici
// app.use('/api/parents', routesParents)

export default app