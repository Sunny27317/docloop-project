import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, businessName, score } = body as {
      clientName: string;
      businessName: string;
      score: number;
    };

    if (!clientName || !businessName) {
      return NextResponse.json(
        { error: "clientName and businessName are required" },
        { status: 400 }
      );
    }

    const urgency =
      score >= 75 ? "gentle"
      : score >= 50 ? "firm"
      : "urgent";

    const drafts: Record<string, { subject: string; body: string }> = {
      gentle: {
        subject: `Action Required: Documents Needed for ${businessName}`,
        body: `Hi ${clientName},

I hope you're doing well. I'm reaching out as we're still awaiting a few documents for your account at ${businessName}.

Could you please take a moment to upload the outstanding items at your earliest convenience? Everything can be submitted securely through your client portal.

If you have any questions or run into any issues, don't hesitate to reach out — I'm happy to help.

Thanks so much,
[Your Name]`,
      },
      firm: {
        subject: `Reminder: Outstanding Documents Required — ${businessName}`,
        body: `Hi ${clientName},

This is a friendly reminder that we're still missing some documents required to complete your engagement for ${businessName}.

Timely submission helps us avoid delays and ensures everything is processed accurately. Please submit the outstanding items through your client portal as soon as possible.

If there's anything preventing you from submitting, please let me know right away so we can find a solution together.

Thank you,
[Your Name]`,
      },
      urgent: {
        subject: `URGENT: Final Notice — Documents Required for ${businessName}`,
        body: `Hi ${clientName},

We have now sent multiple reminders regarding outstanding documents for ${businessName}, and we have yet to receive the required items.

Without these documents, we will be unable to complete your engagement on time, which may result in penalties or additional fees.

Please submit all outstanding documents through your client portal immediately, or contact us today to discuss your situation.

Regards,
[Your Name]`,
      },
    };

    const draft = drafts[urgency];

    return NextResponse.json({
      subject: draft.subject,
      body: draft.body,
      meta: {
        urgency,
        score,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
