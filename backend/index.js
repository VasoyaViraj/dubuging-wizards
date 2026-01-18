import dotenv from "dotenv"
import connectDB from "./src/db/db.js"
import { app } from './src/app.js'
import User from './src/models/User.model.js'
import Department from './src/models/Department.model.js'
import Service from './src/models/Service.model.js'
import axios from 'axios' // <--- FIXED: Changed from 'require' to 'import'

dotenv.config({
    path: './.env'
})

// ---  AI ROUTER ENDPOINT ---
// The Frontend calls this to get advice
app.post('/api/ai/route', async (req, res) => {
    try {
        const { query } = req.body; 
        console.log(`[Node.js] 📨 Forwarding to AI: "${query}"`);

        // 1. Call Python AI (Port 8000)
        const pythonResponse = await axios.post('http://127.0.0.1:8000/api/route-query', {
            description: query,
            source: "Web Dashboard"
        });

        // 2. Return AI answer
        res.json({
            success: true,
            data: pythonResponse.data
        });

    } catch (error) {
        console.error("❌ AI Service Error:", error.message);
        res.status(500).json({ 
            success: false, 
            message: "AI Engine is offline or busy." 
        });
    }
});

// --- SERVER START ---
connectDB()
    .then(async () => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`\n🚀 Nexus Gateway running at http://localhost:${process.env.PORT || 5000}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err)
    })