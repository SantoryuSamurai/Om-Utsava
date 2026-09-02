"use client";

import { useEffect, useState } from "react";
import { downloadReceipt } from "./receipt";

export default function PaymentStatus() {
  const [state, setState] = useState({
    loading: true,
    status: "",
    amount: "",
    message: "Verifying your contribution...",
    receipt: null,
  });
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order_id");
    if (!orderId) {
      setState({ loading: false, status: "", amount: "", message: "We could not find a payment reference.", receipt: null });
      return;
    }

    fetch(`/api/payments/order-status?order_id=${encodeURIComponent(orderId)}`, { cache: "no-store" })
      .then(async (response) => ({ response, body: await response.json() }))
      .then(({ response, body }) => {
        if (!response.ok) throw new Error(body.message);
        setState({ loading: false, status: body.status, amount: body.amount, message: "", receipt: body.receipt || null });
      })
      .catch((error) => setState({
        loading: false,
        status: "",
        amount: "",
        message: error.message || "We could not verify this payment yet.",
        receipt: null,
      }));
  }, []);

  const paid = state.status === "PAID";
  const pending = state.status === "ACTIVE" || state.status === "PENDING";

  async function handleReceiptDownload() {
    if (!state.receipt || isDownloadingReceipt) return;
    setIsDownloadingReceipt(true);
    try {
      await downloadReceipt(state.receipt);
    } finally {
      setIsDownloadingReceipt(false);
    }
  }

  return (
    <main className="payment-status-page">
      <section className="payment-status-card">
        <p className="eyebrow">Om Utsava 2026</p>
        {state.loading ? <>
          <h1>Verifying your <em>contribution.</em></h1>
          <p>Please wait a moment.</p>
        </> : paid ? <>
          <h1>Thank you for your <em>offering.</em></h1>
          <p>Your contribution of {"\u20B9"}{state.amount} has been verified. Ganapati Bappa Morya.</p>
          {state.receipt ? <button className="button receipt-button" type="button" onClick={handleReceiptDownload} disabled={isDownloadingReceipt}>
            {isDownloadingReceipt ? "Preparing receipt..." : "Download receipt"}
          </button> : <p className="receipt-note">Your payment is verified. Your receipt will be available once Cashfree finishes processing its payment details.</p>}
        </> : pending ? <>
          <h1>Your payment is <em>pending.</em></h1>
          <p>Please complete the payment in Cashfree. Refresh this page after you finish.</p>
        </> : <>
          <h1>Payment not <em>completed.</em></h1>
          <p>{state.message || "No contribution was received. You may try again."}</p>
        </>}
        <a className="payment-return" href="/">{"\u2190"} Return to Om Utsava</a>
      </section>
    </main>
  );
}
