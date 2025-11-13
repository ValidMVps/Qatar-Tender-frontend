// pages/terms.tsx (or app/terms/page.tsx for App Router)
import Footer from "@/components/Footer";
import NavbarLanding from "@/components/Navbarladning";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="container mx-auto p-8 max-w-7xl bg-white  border-gray-100 rounded-2xl">
      <NavbarLanding />
      <h1 className="text-2xl font-bold mb-6 mt-20 text-foreground">
        Terms of Service
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Legal Notice</h2>
        <p className="text-sm text-muted-foreground">
          Operated by Escape Ventures. Contact:{" "}
          <a
            href="mailto:support@gotenderly.com"
            className="text-blue-600 hover:underline"
          >
            support@gotenderly.com
          </a>
          . We provide an online technology platform for posting, discovering,
          and managing tenders; we are not a party to any tender, bid,
          evaluation, or award.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-semibold">Platform Terms</h2>
        <ol className="list-decimal pl-6 space-y-4 text-sm text-foreground">
          <li>
            <strong>Acceptance & Changes</strong>
            <p>
              By using the Services, the entity you represent (“User”) accepts
              these Terms. We may update Terms, pricing, and features effective
              on notice (in-app/email); continued use = acceptance.
            </p>
          </li>
          <li>
            <strong>Role & No Guarantees</strong>
            <p>
              We provide tools only. We do not verify Users, documents, or
              outcomes; no fiduciary/procurement duties; no guarantee of uptime,
              awards, or results.
            </p>
          </li>
          <li>
            <strong>Our Discretion</strong>
            <p>
              We may refuse, limit, suspend, or terminate any account or tender;
              modify or discontinue features; change eligibility; or remove
              content at any time to protect the platform, comply with law, or
              for operational reasons. Platform timestamps are authoritative.
            </p>
          </li>
          <li>
            <strong>User Responsibilities</strong>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Bidders: Bids are complete, accurate, and binding through the
                stated bid-validity period unless the Bidders rejects in
                writing.
              </li>
              <li>
                Tenderers: Tenders, criteria, and timelines are accurate and
                lawful; evaluation will follow posted criteria only.
              </li>
              <li>
                Users must comply with procurement, competition, anti-bribery,
                sanctions/export-control, AML, and IP laws; keep credentials
                secure; and not interfere with the Service.
              </li>
            </ul>
          </li>
          <li>
            <strong>Confidentiality</strong>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                Users must keep all non-public tender, bid, and counterparty
                information strictly confidential, use it only for the relevant
                tender, and limit access to need-to-know personnel.
              </li>
              <li>
                The Platform applies commercially reasonable measures while
                hosting content. The Platform has no liability for disclosures
                caused by User acts/omissions, third-party services selected by
                Users, lawful requests, or events beyond reasonable control.
                Users are solely responsible for what they disclose and for any
                encryption/watermarks they require.
              </li>
            </ul>
          </li>
          <li>
            <strong>Content & Data License</strong>
            <p>
              Users retain rights to their content. Users grant the Platform a
              worldwide, royalty-free license to host, process, transmit, scan
              for security/fraud/quality, and create aggregated/anonymized data
              for analytics and product improvement during and after the term,
              without identifying any User or opportunity.
            </p>
          </li>
          <li>
            <strong>Compliance Checks & Audit</strong>
            <p>
              We may perform KYC/sanctions/debarment screening, request
              documents, and conduct remote audits of use. Non-cooperation may
              lead to suspension/termination.
            </p>
          </li>
          <li>
            <strong>Fees</strong>
            <p>
              Fees per order/pricing page; non-refundable unless we state
              otherwise in writing. We may change prices with notice. Taxes
              extra. Late sums accrue the maximum lawful charge. We may suspend
              for non-payment.
            </p>
          </li>
          <li>
            <strong>Third-Party Services</strong>
            <p>
              Integrations (e.g., e-signature, storage, messaging, document
              preview) are provided “as is” under their own terms. We are not
              responsible for them.
            </p>
          </li>
          <li>
            <strong>Indemnity</strong>
            <p>
              User will indemnify, defend, and hold harmless the Platform and
              its affiliates for claims, damages, costs (including legal fees)
              arising from: (a) User content or conduct; (b) User violations of
              law or third-party rights; (c) disputes between tenderers and
              bidders.
            </p>
          </li>
          <li>
            <strong>Warranties & Disclaimers</strong>
            <p>
              THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE.” WE DISCLAIM
              ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING FITNESS, ACCURACY,
              AND NON-INFRINGEMENT. Users are solely responsible for legal
              sufficiency of tenders/bids and for results.
            </p>
          </li>
          <li>
            <strong>Liability Limit</strong>
            <p>
              To the maximum extent permitted by law, the Platform’s total
              liability for all claims in any 12-month period is limited to the
              fees paid to the Platform in the 3 months before the event. The
              Platform is not liable for indirect, incidental, special,
              consequential, punitive damages, or lost profits, revenue,
              goodwill, or data. Nothing limits liability for willful misconduct
              where such limitation is prohibited by law.
            </p>
          </li>
          <li>
            <strong>Suspension & Termination</strong>
            <p>
              We may suspend/terminate immediately for suspected misuse,
              legal/compliance risk, or non-payment; or for convenience with
              notice. Users may terminate anytime (no refunds). On termination,
              we may provide a time-limited export of remaining data if the
              account is in good standing.
            </p>
          </li>
          <li>
            <strong>Governing Law, Venue, Arbitration, Class Waiver</strong>
            <p>
              These Terms are governed by the laws of the State of Qatar
              (excluding conflict-of-laws rules). Disputes are resolved by
              binding arbitration under the rules of the Qatar International
              Center for Conciliation and Arbitration (QICCA) in Doha, Qatar,
              before one arbitrator. No class or representative actions. Either
              party may seek injunctive relief in court for misuse of IP or
              confidentiality breaches. Exclusive venue for such relief: Doha,
              Qatar.
            </p>
          </li>
          <li>
            <strong>Assignment; Subcontracting; Publicity; Feedback</strong>
            <p>
              We may assign or subcontract freely. User may not assign without
              our written consent. We may use User name and logo as a reference
              unless User opts out via email. Feedback is licensed to us
              irrevocably for any purpose.
            </p>
          </li>
          <li>
            <strong>Force Majeure</strong>
            <p>
              No liability for delays/failures caused by events beyond
              reasonable control (including internet/backbone outages, acts of
              government, war, labor issues, changes in law).
            </p>
          </li>
          <li>
            <strong>Precedence</strong>
            <p>
              If there’s a conflict: (1) Signed Order Form or MSA controls; (2)
              then these Terms; (3) then referenced policies.
            </p>
          </li>
        </ol>
      </section>

      <p className="text-sm text-muted-foreground mt-6">
        For our Privacy Policy, please see{" "}
        <Link href="/privacy" className="text-blue-600 hover:underline">
          here
        </Link>
        .
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        For any questions, contact us at{" "}
        <a
          href="mailto:support@gotenderly.com"
          className="text-blue-600 hover:underline"
        >
          support@gotenderly.com
        </a>
        .
      </p>
      <Footer />
    </div>
  );
}
