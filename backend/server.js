const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// Environment Simulation
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'nyayasetu_secure_jwt_secret_key_2026';

// 1. In-Memory User Simulation (Replacing DB for mock payload)
const MOCK_USERS = [
    {
        id: 1,
        name: 'Shiva Sharma',
        email: 'shiva.sharma@example.com',
        password: 'securepassword123', // In production, this would be hashed via bcrypt
        plan: 'Premium Plan'
    },
    {
        id: 2,
        name: 'Legal Associate',
        email: 'associate@firm.com',
        password: 'password',
        plan: 'Basic Plan'
    }
];

// 2. JWT Verification Middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user payload
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }
};

// 3. Login API Endpoint
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find User
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate strict JWT (1 day expiry)
    const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, plan: user.plan },
        JWT_SECRET,
        { expiresIn: '1d' }
    );

    return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, plan: user.plan }
    });
});

// 4. Protected Route Test / Verification Endpoint
app.get('/api/auth/verify', verifyToken, (req, res) => {
    // If middleware passes, return the user session
    res.json({ message: 'Token is valid', user: req.user });
});

// Start Output
app.listen(PORT, () => {
    console.log(`NyayaSetu Authentication Server securely running on port ${PORT}`);
});
