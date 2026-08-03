import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(name, email) {
  try {
    await transporter.sendMail({
      from: `"LOOP AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🎉 Welcome to LOOP AI",

      html: `
      <div style="font-family:Arial,sans-serif;padding:30px">
          <h2>Welcome to LOOP AI, ${name}! 👋</h2>

          <p>Your account has been created successfully.</p>

          <p>You can now:</p>

          <ul>
              <li>📊 Upload Customer Feedback</li>
              <li>🤖 Analyze Sentiment using AI</li>
              <li>💬 Chat with LOOP AI Assistant</li>
              <li>📈 Generate Reports</li>
          </ul>

          <br>

          <p>We're excited to have you with us.</p>

          <br>

          <strong>LOOP AI Team</strong>
      </div>
      `,
    });

    console.log("✅ Welcome email sent");

    return true;

  } catch (err) {

    console.error("Email Error:", err);

    return false;
  }
}