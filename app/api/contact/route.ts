import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { firstName, lastName, email, subject, message } = await req.json();

  const { error } = await resend.emails.send({
    from: "Halation Studio <onboarding@resend.dev>",
    to: "hello@halationstudio.com",
    replyTo: email,
    subject: subject || `New inquiry from ${firstName} ${lastName}`,
    text: `Name: ${firstName} ${lastName}\nEmail: ${email}\n\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
