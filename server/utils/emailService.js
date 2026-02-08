const nodemailer = require('nodemailer');

// Create transporter
// For production: Use environment variables
// For development (fallback): Log to console if no credentials
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendPasswordResetEmail = async (email, resetUrl) => {
    // If no credentials, mock the email for development
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('==================================================');
        console.log('📧 [MOCK EMAIL SERVICE] Password Reset Request');
        console.log(`To: ${email}`);
        console.log(`Link: ${resetUrl}`);
        console.log('==================================================');
        return;
    }

    const mailOptions = {
        from: `"Fiscora Security" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset your Fiscora password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #2563eb;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password for your Fiscora account.</p>
                <p>Click the button below to set a new password:</p>
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 16px 0;">Reset Password</a>
                <p style="color: #64748b; font-size: 14px;">This link will expire in 1 hour.</p>
                <p style="color: #64748b; font-size: 14px;">If you didn't request this, please ignore this email.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Email service failed');
    }
};

module.exports = { sendPasswordResetEmail };
