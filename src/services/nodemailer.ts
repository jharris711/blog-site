import nodemailer from 'nodemailer';
import { Message } from '@/types/Message';

const initNodemailer = async (user: string, pass: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user,
      pass,
    },
  });

  await new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        reject(error);
      } else {
        resolve(success);
      }
    });
  });

  return { transporter };
};

export const sendEmail = async (email: string, pw: string, msg: Message) => {
  if (!email || !pw) return;

  const { transporter } = await initNodemailer(email, pw);

  await new Promise((resolve, reject) => {
    transporter.sendMail(msg, (err, info) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(info);
      }
    });
  });
};
