import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import axios from "axios" // <--- NEW: Import Axios

const app = express()

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

// Body parsing middleware
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(express.static("public"))
app.use(cookieParser())

// --- 🛡️ 1. SECURITY SENTINEL MIDDLEWARE ---
// This runs on EVERY request to check for attacks
app.use(async (req, res, next) => {
    // Skip checking the AI route itself (to prevent infinite loops)
    if (req.path === '/api/ai/route' || req.path === '/api/health') return next();

    try {
        // Ask Python: "Is this IP safe?" (Timeout 500ms to keep it fast)
        const aiCheck = await axios.post('http://127.0.0.1:8000/api/security/validate', {
            ip: req.ip || "127.0.0.1",
            latency: 0, 
            is_error: false
        }, { timeout: 500 });

        // If Python says BLOCK, we stop the request here
        if (aiCheck.data.blocked) {
            console.log(`⛔ NEXUS SENTINEL BLOCKED: ${req.ip}`);
            return res.status(403).json({ 
                success: false, 
                message: "Access Denied by AI Security Shield",
                reason: aiCheck.data.reason
            });
        }
    } catch (err) {
        // If Python is offline, we allow traffic (Fail Open)
        // console.warn("AI Sentinel offline, skipping check.");
    }
    next();
});


// Import routes
import authRoutes from './routes/auth.routes.js'
import adminRoutes from './routes/admin.routes.js'
import citizenRoutes from './routes/citizen.routes.js'
import officerRoutes from './routes/officer.routes.js'

// Mount routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/citizen", citizenRoutes)
app.use("/api/officer", officerRoutes)


// --- 🧠 2. AI ROUTER ENDPOINT ---
// Frontend calls this to route complaints
app.post('/api/ai/route', async (req, res) => {
    try {
        const { query } = req.body; 

        // Call Python AI Service
        const pythonResponse = await axios.post('http://127.0.0.1:8000/api/route-query', {
            description: query,
            source: "Web Dashboard"
        });

        res.json({
            success: true,
            data: pythonResponse.data
        });
    } catch (error) {
        console.error("❌ AI Error:", error.message);
        res.status(500).json({ success: false, message: "AI Service Unavailable" });
    }
});


// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "UP", service: "Nexus Gateway", timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found.' })
})

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(500).json({ success: false, message: 'Internal server error.' })
})

export { app }