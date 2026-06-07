const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// FIX 1: CORS origin was set to http://localhost:5000 (backend itself).
// Changed to allow frontend dev server on port 5173.
app.use(cors({
    origin: [
        'http://localhost:5173',  // Vite dev server
        'http://localhost:4173',  // Vite preview
        'http://localhost:3000',  // Fallback
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    credentials: true
}));

app.use(express.json())

// FIX 2: Original code had routes mounted twice:
//   routes(app)  -> mounts /api/user, /api/product, etc.
//   app.use('/api', rootRouter)  -> would mount them again as /api/api/...
// Removed the duplicate. Only call routes(app) once.
const routes = require('./src/routes')
routes(app)

app.get('/', (req, res) => {
    res.send('API running....')
})

// FIX 3: require path was '../backend/src/routes' which is wrong relative to server.js location.
// Corrected above to './src/routes'.

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
})
