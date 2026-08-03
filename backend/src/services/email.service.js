import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(name, email) {
  try {
    const { data, error } = await resend.emails.send({
      from: "LOOP AI <onboarding@resend.dev>",
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

          <p>Thank you for choosing LOOP AI.</p>

          <br>

          <strong>LOOP AI Team</strong>
      </div>
      `,
    });

    if (error) {
      console.error(error);
      return false;
    }

    console.log("Welcome email sent:", data.id);
    return true;

  } catch (err) {
    console.error(err);
    return false;
  }
}