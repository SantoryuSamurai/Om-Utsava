import "./globals.css";
import "./om-utsava.css";
import Script from "next/script";

export const metadata = {
  title: "Om Utsava 2026 | Shanthi Nagar, Bangarpet",
  description: "Contribute towards the six-day Ganesh Chaturthi celebration at Om Utsava, Shanthi Nagar, Bangarpet.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}<Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" /></body>
    </html>
  );
}
