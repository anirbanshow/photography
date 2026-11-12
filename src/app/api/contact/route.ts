import { Resend } from "resend";
import { contactSchema } from "@/lib/contact";

export const runtime = "nodejs";

const maxBodyBytes = 32 * 1024;
const failedMessage = "Your message could not be sent. Please try again or email the studio directly.";

async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maxBodyBytes) {
    throw new RangeError("Contact request is too large");
  }

  const reader = request.body?.getReader();
  if (!reader) return null;

  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let body = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      bytes += value.byteLength;
      if (bytes > maxBodyBytes) {
        await reader.cancel().catch(() => undefined);
        throw new RangeError("Contact request is too large");
      }
      body += decoder.decode(value, { stream: true });
    }
    return JSON.parse(body + decoder.decode()) as unknown;
  } finally {
    reader.releaseLock();
  }
}

export async function POST(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") {
    return Response.json({ message: "Submit your inquiry from the contact page." }, { status: 403 });
  }

  const mediaType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    return Response.json({ message: "Expected a JSON request." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await readBody(request);
  } catch (error) {
    const tooLarge = error instanceof RangeError;
    return Response.json(
      { message: tooLarge ? "This inquiry is too large." : "Invalid request data." },
      { status: tooLarge ? 413 : 400 },
    );
  }

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { message: "Check the form fields and try again." },
      { status: 422 },
    );
  }

  const { name, email, projectType, budget, message, website } = result.data;
  // Return the ordinary success status without sending mail when the trap is filled.
  if (website) return Response.json({ ok: true });

  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  if (!key || !from || !to) {
    return Response.json(
      { message: "Online inquiries are temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  }

  const idempotencyKey = request.headers.get("idempotency-key");
  const hasValidKey = idempotencyKey &&
    /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}$/i.test(idempotencyKey);

  try {
    const { data, error } = await new Resend(key).emails.send({
      from,
      to,
      replyTo: email,
      subject: `Photography inquiry · ${projectType}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project: ${projectType}`,
        `Budget: ${budget || "Not specified"}`,
        "",
        message,
      ].join("\n"),
    }, {
      signal: AbortSignal.timeout(12_000),
      idempotencyKey: hasValidKey ? `inquiry/${idempotencyKey}` : undefined,
    });

    if (error || !data?.id) {
      console.error("Contact email delivery failed", error?.name ?? "missing delivery ID");
      return Response.json({ message: failedMessage }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    console.error("Contact email provider could not be reached");
    return Response.json({ message: failedMessage }, { status: 502 });
  }
}
