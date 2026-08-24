import { NextResponse } from "next/server";

export const runtime = "nodejs";

function cashfreeBaseUrl() {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

export async function GET(request) {
  if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
    return NextResponse.json({ message: "Payment setup is not ready yet." }, { status: 503 });
  }

  const orderId = new URL(request.url).searchParams.get("order_id") || "";
  if (!/^om_utsava_[a-f0-9]{24}$/.test(orderId)) {
    return NextResponse.json({ message: "Invalid payment reference." }, { status: 400 });
  }

  const response = await fetch(`${cashfreeBaseUrl()}/orders/${encodeURIComponent(orderId)}`, {
    headers: {
      "x-api-version": "2025-01-01",
      "x-client-id": process.env.CASHFREE_APP_ID,
      "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    },
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json({ message: "We could not verify this payment yet." }, { status: 502 });
  }

  return NextResponse.json({ status: result.order_status, amount: result.order_amount, orderId: result.order_id });
}
