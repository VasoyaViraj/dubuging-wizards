import express from "express";

const router = express.Router();

router.post("/water-alert", (req, res) => {
  const { location, severity } = req.body;

  res.json({
    service: "healthcare",
    action: "hospitals_notified",
    location,
    severity,
    message: `Hospitals alerted about water shortage in ${location}`,
  });
});

export default router;
