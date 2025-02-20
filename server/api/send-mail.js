import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend("re_McfbyRo5_EGaL6bZHPt8DFA6yzUp54PSx");

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { firstName, lastName, industry, email, message } = body;

  try {
    await resend.emails.send({
      from: 'noreply@portfolionurdjedd.com',
      to: email,
      subject: '[portfolionurdjedd.com]: your email has been successfully sent',
      text: 'This is an automated message, please do not reply.',
    });

    await resend.emails.send({
      from: 'noreply@portfolionurdjedd.com',
      to: 'djedidinur@gmail.com',
      subject: '[portfolionurdjedd.com]: New Message from Portfolio',
      text: `Vous avez reçu un nouveau message via le formulaire de contact :

      Nom : ${firstName} ${lastName}
      Email : ${email}
      Industry : ${industry}

      Message :

      ${message}`,
    });

    return { status: 'success' };
  } catch (err) {
    console.error("Erreur lors de l'envoi du mail", err.message);
    return { status: 'error', message: err.message };
  }
});
