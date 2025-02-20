import { c as defineEventHandler, r as readBody } from '../../_/nitro.mjs';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import 'node:http';
import 'node:https';
import 'vue';
import 'node:fs';
import 'node:url';
import 'consola/core';
import 'ipx';
import 'node:path';

dotenv.config();
const resend = new Resend("re_McfbyRo5_EGaL6bZHPt8DFA6yzUp54PSx");
const sendMail = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { firstName, lastName, industry, email, message } = body;
  try {
    await resend.emails.send({
      from: "noreply@portfolionurdjedd.com",
      to: email,
      subject: "[portfolionurdjedd.com]: your email has been successfully sent",
      text: "This is an automated message, please do not reply."
    });
    await resend.emails.send({
      from: "noreply@portfolionurdjedd.com",
      to: "djedidinur@gmail.com",
      subject: "[portfolionurdjedd.com]: New Message from Portfolio",
      text: `Vous avez re\xE7u un nouveau message via le formulaire de contact :

      Nom : ${firstName} ${lastName}
      Email : ${email}
      Industry : ${industry}

      Message :

      ${message}`
    });
    return { status: "success" };
  } catch (err) {
    console.error("Erreur lors de l'envoi du mail", err.message);
    return { status: "error", message: err.message };
  }
});

export { sendMail as default };
//# sourceMappingURL=send-mail.mjs.map
