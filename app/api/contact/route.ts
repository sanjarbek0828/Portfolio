import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  projectType: z.string().trim().min(2).max(80),
  budget: z.string().trim().min(2).max(80),
  message: z.string().trim().min(20).max(2000),
});

export async function POST(request: Request) {
  try {
    const payload = contactSchema.safeParse(await request.json());

    if (!payload.success) {
      return NextResponse.json(
        { ok: false, message: "Please check the submitted fields." },
        { status: 422 },
      );
    }

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

    // Add CONTACT_WEBHOOK_URL in production to forward valid messages to
    // your preferred automation, CRM or email provider.
    if (webhookUrl) {
      const delivery = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload.data, source: "portfolio" }),
        cache: "no-store",
      });

      if (!delivery.ok) {
        return NextResponse.json(
          { ok: false, message: "Message delivery failed." },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ ok: true, demo: !webhookUrl });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request." },
      { status: 400 },
    );
  }
}
