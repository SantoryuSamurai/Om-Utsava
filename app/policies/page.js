import { PolicyPage } from "../policy-page";

export const metadata = { title: "Policies | Om Utsava" };

export default function PoliciesPage() {
  return <PolicyPage eyebrow="Om Utsava policies" title="Clear information for every contribution."><p>Review our contribution information and public policies before proceeding to payment.</p><div className="policy-list"><a href="/contact"><strong>Contact Us</strong><span>Om Utsava Organising Committee contact details</span></a><a href="/terms"><strong>Terms & Conditions</strong><span>Purpose and terms of voluntary contributions</span></a><a href="/refunds"><strong>Refunds & Cancellations</strong><span>Final and non-refundable contribution policy</span></a><a href="/privacy"><strong>Privacy Policy</strong><span>How donor contact information is handled</span></a></div></PolicyPage>;
}
