import { NextResponse } from 'next/server';
import { sendEmail } from '@/services/nodemailer';

export const POST = async (req: Request) => {
  const EMAIL_ADDRESS = process.env.NEXT_PUBLIC_EMAIL_ADDRESS;
  const EMAIL_PASSWORD = process.env.NEXT_PUBLIC_EMAIL_PASSWORD;

  if (!EMAIL_ADDRESS || !EMAIL_PASSWORD) {
    throw new Error('Check the provided email and password combination');
  }
  const { email, message, subject } = await req.json();

  const emailMessage = {
    from: email,
    to: EMAIL_ADDRESS,
    subject: 'Contact Form Submission',
    html: `<p>Email: ${email}</p>
        <p>Subject: ${subject}</p>
        <p>Message: ${message}</p>`,
  };

  await sendEmail(EMAIL_ADDRESS, EMAIL_PASSWORD, emailMessage);

  return NextResponse.json(
    {
      message: 'Message sent successfully',
    },
    { status: 200 }
  );
};
