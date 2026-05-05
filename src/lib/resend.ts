export async function sendWelcomeEmail(email: string, name?: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "SessionTimer <noreply@sessiontimer.app>",
    to: email,
    subject: "Welcome to SessionTimer",
    html: `<h1>Welcome${name ? `, ${name}` : ""}!</h1><p>Your account is ready. Start building sessions at <a href="${process.env.NEXT_PUBLIC_APP_URL}/app">SessionTimer</a>.</p>`,
  });
}

export async function sendProConfirmationEmail(email: string): Promise<void> {
  if (!process.env.RESEND_API_KEY) return;
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: "SessionTimer <noreply@sessiontimer.app>",
    to: email,
    subject: "You're now on SessionTimer Pro!",
    html: `<h1>You're on Pro!</h1><p>Unlimited saved sessions, all timer modes, and premium themes are now unlocked.</p>`,
  });
}
