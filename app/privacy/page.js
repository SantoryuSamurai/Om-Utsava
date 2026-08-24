import { PolicyPage } from "../policy-page";

export const metadata = { title: "Privacy Policy | Om Utsava" };

export default function PrivacyPage() {
  return <PolicyPage eyebrow="Privacy Policy" title="Your details are handled with care."><p>When you choose to contribute, we collect your name and mobile number to create and support the payment request.</p><h2>Payment information</h2><p>Payment details are collected and processed by Cashfree Payments. Om Utsava does not collect or store card, UPI PIN, or bank-account credentials on this website.</p><h2>How information is used</h2><p>Your contact details are used only for contribution-related communication, payment support, and compliance with payment-provider requirements. We do not publish donor personal information.</p><h2>Contact</h2><p>For privacy-related questions, please <a href="/contact">contact the Om Utsava Organising Committee</a>.</p></PolicyPage>;
}
