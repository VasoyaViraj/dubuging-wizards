import jwt from 'jsonwebtoken';

/**
 * Middleware to verify Service-to-Service JWT from Nexus Gateway
 * Only allows requests from trusted Nexus Gateway
 */
export const verifyServiceJwt = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No service token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.SERVICE_JWT_SECRET);

        // Verify the token is from Nexus Gateway
        if (decoded.issuer !== 'NEXUS' || decoded.service !== 'NEXUS_GATEWAY') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Invalid service token.'
            });
        }

        // Verify the token is intended for this department
        if (decoded.department !== 'HEALTHCARE') {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: Token not authorized for this department.'
            });
        }

        // Attach decoded info to request
        req.serviceAuth = decoded;
        req.citizenId = req.headers['x-citizen-id'];
        req.requestId = req.headers['x-request-id'];

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Service token expired.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Unauthorized: Invalid service token.'
        });
    }
};
