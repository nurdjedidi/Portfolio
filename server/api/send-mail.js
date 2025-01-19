// server/api/send-mail.js
import { Resend } from 'resend'; // Assurez-vous d'installer le package Resend
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend("re_McfbyRo5_EGaL6bZHPt8DFA6yzUp54PSx");

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, lastName, email, message } = body;

  try {
    // Envoi de l'email
    await resend.emails.send({
      from: 'noreply@portfolionurdjedd.com',
      to: email,
      subject: '[portfolionurdjedd.com]: your email has been successfully sent',
      text: 'This is an automated message, please do not reply.',
    });

    // Envoi de la notification
    await resend.emails.send({
      from: 'noreply@portfolionurdjedd.com',
      to: 'djedidinur@gmail.com',
      subject: '[portfolionurdjedd.com]: New Message from Portfolio',
      text: `${name} ${lastName}  ${email} wrote:\n\n${message}`,
    });

    return { status: 'success' };
  } catch (err) {
    console.error("Erreur lors de l'envoi du mail", err.message);
    return { status: 'error', message: err.message };
  }
});
