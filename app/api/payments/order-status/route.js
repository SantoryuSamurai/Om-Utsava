import { NextResponse } from "next/server";

export const runtime = "nodejs";

function cashfreeBaseUrl() {
  return process.env.CASHFREE_ENV === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

function cashfreeHeaders() {
  return {
    "x-api-version": "2025-01-01",
    "x-client-id": process.env.CASHFREE_APP_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
  };
}

function paymentMode(paymentGroup) {
  if (!paymentGroup) return "Online payment";
  return String(paymentGroup).replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
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
    headers: cashfreeHeaders(),
    cache: "no-store",
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json({ message: "We could not verify this payment yet." }, { status: 502 });
  }

  let receipt = null;

  if (result.order_status === "PAID") {
    const [paymentsResponse, extendedOrderResponse] = await Promise.all([
      fetch(`${cashfreeBaseUrl()}/orders/${encodeURIComponent(orderId)}/payments`, { headers: cashfreeHeaders(), cache: "no-store" }),
      fetch(`${cashfreeBaseUrl()}/orders/${encodeURIComponent(orderId)}/extended`, { headers: cashfreeHeaders(), cache: "no-store" }),
    ]);
    const payments = paymentsResponse.ok ? await paymentsResponse.json().catch(() => []) : [];
    const extendedOrder = extendedOrderResponse.ok ? await extendedOrderResponse.json().catch(() => ({})) : {};
    const successfulPayment = Array.isArray(payments)
      ? payments.find((payment) => payment.payment_status === "SUCCESS")
      : null;

    if (successfulPayment?.cf_payment_id && successfulPayment.payment_completion_time) {
      receipt = {
        orderId: result.order_id,
        transactionId: String(successfulPayment.cf_payment_id),
        paymentMode: paymentMode(successfulPayment.payment_group),
        paymentStatus: "Successful",
        paidOn: successfulPayment.payment_completion_time,
        contributor: String(extendedOrder.customer_details?.customer_name || result.customer_details?.customer_name || "Om Utsava contributor"),
        amount: result.order_amount,
      };
    }
  }

  return NextResponse.json({ status: result.order_status, amount: result.order_amount, orderId: result.order_id, receipt });
}
