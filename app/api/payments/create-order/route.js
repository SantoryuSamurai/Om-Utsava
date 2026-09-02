import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MINIMUM_AMOUNT = 1;
const MAXIMUM_AMOUNT = 500000;

function cashfreeBaseUrl() {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

export async function POST(request) {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    return NextResponse.json({ message: "Payment setup is not ready yet." }, { status: 503 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Please check the contribution details." }, { status: 400 });
  }

  const amount = Number(body.amount);
  const name = String(body.name || "").trim().replace(/\s+/g, " ");
  const phone = String(body.phone || "").replace(/\D/g, "");

  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < MINIMUM_AMOUNT || amount > MAXIMUM_AMOUNT) {
    return NextResponse.json({ message: `Please enter an amount between ₹${MINIMUM_AMOUNT} and ₹${MAXIMUM_AMOUNT}.` }, { status: 400 });
  }
  if (name.length < 2 || name.length > 80) {
    return NextResponse.json({ message: "Please enter your name." }, { status: 400 });
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ message: "Please enter a valid 10-digit Indian mobile number." }, { status: 400 });
  }

  const orderId = `om_utsava_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
  const origin = new URL(request.url).origin;
  const response = await fetch(`${cashfreeBaseUrl()}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-version": "2025-01-01",
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
      "x-idempotency-key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: `donor_${phone}`,
        customer_name: name,
        customer_phone: phone,
      },
      order_meta: { return_url: `${origin}/payment-status?order_id={order_id}` },
      order_note: "Om Utsava 2026 contribution",
    }),
    cache: "no-store",
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.payment_session_id) {
    console.error("Cashfree create order failed", { status: response.status, code: result.code });
    return NextResponse.json({ message: "We could not start the payment. Please try again." }, { status: 502 });
  }

  return NextResponse.json({
    paymentSessionId: result.payment_session_id,
    environment: process.env.CASHFREE_ENV === "production" ? "production" : "sandbox",
  });
}
