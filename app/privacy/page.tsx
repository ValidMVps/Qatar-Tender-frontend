// pages/privacy.tsx (or app/privacy/page.tsx for App Router)
import Footer from "@/components/Footer";
import NavbarLanding from "@/components/Navbarladning";
import Link from "next/link";

export default function Privacy() {
  return (
    <div className="container mx-auto p-8 max-w-7xl bg-white  border-gray-100 rounded-2xl">
      <NavbarLanding />{" "}
      <h1 className="text-2xl font-bold mb-6 mt-20 text-foreground">
        Privacy Policy
      </h1>
      <section className="space-y-4 text-sm text-foreground">
        <div>
          <strong>Roles.</strong> We act as controller for account, security,
          and platform operations data; and as processor when a tenderer
          instructs processing of user bidding data within a tender.
        </div>
        <div>
          <strong>Data.</strong> We collect and process limited information
          needed to operate, secure, and improve the Services. This includes
          what you submit, what the Service generates during normal use, and
          related records from our service providers.
        </div>
        <div>
          <strong>Use.</strong> Provide and secure the Services; fraud/abuse
          prevention; analytics and product improvement using
          aggregated/anonymized data; legal/regulatory compliance.
        </div>
        <div>
          <strong>Sharing.</strong> With service providers/affiliates (hosting,
          email, support, security, analytics, document preview, e-signature),
          within the same tender between participating Users, and with
          authorities as required by law.
        </div>
        <div>
          <strong>Security.</strong> We operate administrative, technical, and
          physical measures appropriate to our Services and risk profile. No
          method of transmission or storage is 100% secure, and we make no
          additional security commitments.
        </div>
        <div>
          <strong>Retention.</strong> Kept as long as needed for these purposes
          and legal requirements; then deleted or anonymized. Security logs may
          be retained longer.
        </div>
        <div>
          <strong>Rights & Choices.</strong> Admins can access/update
          organization data and configure retention. Marketing emails can be
          opted out. Data requests:{" "}
          <a
            href="mailto:support@gotenderly.com"
            className="text-blue-600 hover:underline"
          >
            support@gotenderly.com
          </a>
          .
        </div>
        <div>
          <strong>Children.</strong> Not for under-18.
        </div>
      </section>
      <p className="text-sm text-muted-foreground mt-6">
        For our Terms of Service, please see{" "}
        <Link href="/terms" className="text-blue-600 hover:underline">
          here
        </Link>
        .
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        For any questions or data requests, contact us at{" "}
        <a
          href="mailto:support@gotenderly.com"
          className="text-blue-600 hover:underline"
        >
          support@gotenderly.com
        </a>
        .
      </p>
      <Footer/>
    </div>
  );
}
