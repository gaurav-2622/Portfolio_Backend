const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.MAIL_USER,
        subject: `Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send the message. Please try again later." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
