const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// 1. Database Configuration
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database Connection Failed:", err.message);
    } else {
        console.log("Connected to MySQL Database on Port", process.env.DB_PORT);
        connection.release();
    }
});

// 2. Email Transporter Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASS
    }
});

// 3. Login Route: Verifies credentials and sends formal OTP email
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM admins WHERE email = ? AND password = ?";
    
    db.execute(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Internal server error" });
        
        if (results.length > 0) {
            // Generate 6-digit OTP and 10-minute expiry
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 10 * 60000); 

            // Save OTP to DB
            const updateSql = "UPDATE admins SET otp_code = ?, otp_expires = ? WHERE email = ?";
            db.execute(updateSql, [otp, expires, email], (updateErr) => {
                if (updateErr) return res.status(500).json({ error: "Security protocol failed" });

                // Professional Formal Email Template
                const mailOptions = {
                    from: `"ScholarMap Security" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: 'Action Required: Your Admin Verification Code',
                    html: `
                        <div style="font-family: sans-serif; color: #334155; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
                            <h2 style="color: #1e293b; margin-bottom: 16px;">ScholarMap Administration</h2>
                            <p>Hello,</p>
                            <p>You are receiving this email because a sign-in request was made for your ScholarMap Admin account.</p>
                            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0; font-size: 14px; color: #64748b;">Your verification code is:</p>
                                <h1 style="margin: 10px 0; font-size: 32px; letter-spacing: 5px; color: #0f172a;">${otp}</h1>
                            </div>
                            <p><strong>Instructions:</strong></p>
                            <ol>
                                <li>Enter the 6-digit code provided above into the verification screen.</li>
                                <li>This code will expire in <strong>10 minutes</strong>.</li>
                                <li>If you did not request this code, please secure your account immediately.</li>
                            </ol>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                            <p style="font-size: 12px; color: #94a3b8;">This is an automated security message, please do not reply.</p>
                        </div>
                    `
                };

                transporter.sendMail(mailOptions, (mailErr) => {
                    if (mailErr) return res.status(500).json({ error: "Mail delivery failed" });
                    res.json({ success: true, message: "Verification code sent successfully" });
                });
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

// 4. Verify OTP Route: Validates the code and grants access
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    
    const sql = "SELECT * FROM admins WHERE email = ? AND otp_code = ? AND otp_expires > NOW()";
    
    db.execute(sql, [email, otp], (err, results) => {
        if (err) return res.status(500).json({ error: "Verification process failed" });
        
        if (results.length > 0) {
            // Success! Clear the OTP for security
            db.execute("UPDATE admins SET otp_code = NULL, otp_expires = NULL WHERE email = ?", [email]);
            res.json({ success: true, message: "Authentication successful. Welcome to ScholarMap." });
        } else {
            res.status(401).json({ success: false, message: "Invalid or expired verification code" });
        }
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));