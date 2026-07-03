const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendBookingConfirmation({ to, name, roomName, date, startTime, endTime, purpose }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    await transporter.sendMail({
      from: `"MeetBook" <${process.env.EMAIL_USER}>`,
      to,
      subject: `✅ Booking Confirmed - ${roomName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #1e293b;">Booking Confirmed! 🎉</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your meeting room has been successfully booked.</p>
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Room:</strong> ${roomName}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${startTime} - ${endTime}</p>
            <p style="margin: 4px 0;"><strong>Purpose:</strong> ${purpose}</p>
          </div>
          <p style="color: #64748b; font-size: 13px;">If you need to cancel, please do so at least 30 minutes before the meeting.</p>
          <p style="color: #64748b; font-size: 13px;">— The MeetBook Team</p>
        </div>
      `
    });
    console.log(`[Email] Booking confirmation sent to ${to}`);
  } catch (err) {
    console.error('[Email] Failed to send:', err.message);
  }
}

async function sendCancellationEmail({ to, name, roomName, date, startTime, endTime }) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
  try {
    await transporter.sendMail({
      from: `"MeetBook" <${process.env.EMAIL_USER}>`,
      to,
      subject: `❌ Booking Cancelled - ${roomName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #dc2626;">Booking Cancelled</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your booking has been cancelled.</p>
          <div style="background: #fef2f2; border-radius: 8px; padding: 16px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Room:</strong> ${roomName}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 4px 0;"><strong>Time:</strong> ${startTime} - ${endTime}</p>
          </div>
          <p style="color: #64748b; font-size: 13px;">You can book another room anytime on MeetBook.</p>
          <p style="color: #64748b; font-size: 13px;">— The MeetBook Team</p>
        </div>
      `
    });
  } catch (err) {
    console.error('[Email] Failed to send cancellation:', err.message);
  }
}

module.exports = { sendBookingConfirmation, sendCancellationEmail };
