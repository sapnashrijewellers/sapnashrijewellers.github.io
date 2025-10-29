import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="flex justify-center py-10 px-4">
      <main className="max-w-[900px] w-full p-6 shadow-lg rounded-2xl">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Privacy Policy</h1>
          <p className="">
            Sapna Shri Jewellers — Effective date: October 29, 2025
          </p>
        </header>

        <section className="leading-relaxed mb-5">
          <p>
            This Privacy Policy explains how <strong>Sapna Shri Jewellers</strong>{" "}
            ("we", "us", or "our") collects, uses, stores and discloses information
            when you use our Progressive Web App (PWA) and the Android app (TWA)
            that wraps it. Our website and app are intended as a public catalogue
            of products; we do <strong>not</strong> collect personal information
            except for push notification subscription details as described below.
          </p>
        </section>

        <h2 className="text-xl font-semibold mt-5 mb-2 text-gray-800">
          Summary (short)
        </h2>
        <section className="leading-relaxed mb-5">
          <ul className="list-disc ml-5 space-y-1">
            <li>We only collect push notification subscription data.</li>
            <li>
              We do <strong>not</strong> use cookies, analytics, or user tracking.
            </li>
            <li>
              Hosting: GitHub Pages and Cloudflare Workers & KV (free tier) are
              used to serve the site and store push subscription objects.
            </li>
            <li>
              You can unsubscribe from push notifications at any time via the app
              or your browser settings.
            </li>
          </ul>
        </section>

        <Section title="Information we collect">
          <p>
            <strong>Push subscription data only.</strong> When you opt in to receive
            push notifications we will store the minimal subscription information
            required to send pushes. This typically includes:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>
              <strong>Endpoint URL</strong> — the push service endpoint (a URL
              managed by the browser or platform).
            </li>
            <li>
              <strong>Public key / cryptographic keys</strong> (e.g.{" "}
              <code className="bg-gray-500 px-1 rounded">p256dh</code> and{" "}
              <code className="bg-gray-500 px-1 rounded">auth</code> tokens) used
              for encrypted push delivery.
            </li>
            <li>
              <strong>Optional metadata</strong> such as subscription timestamp and
              platform (e.g. "android" or "web").
            </li>
          </ul>
          <p>
            We do <strong>not</strong> collect your name, email, phone number,
            location, payment information, or any other personal identifiers as
            part of normal site usage.
          </p>
        </Section>

        <Section title="How we use the information">
          <p>Subscription data is used solely to deliver push notifications you opted into. Examples:</p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Announcements about new collections or offers.</li>
            <li>Order or service related messages (if opted in).</li>
          </ul>
          <p>We do not use subscription data for profiling, advertising, or third-party marketing.</p>
        </Section>

        <Section title="Storage & hosting">
          <p>
            Your subscription data is stored on Cloudflare Workers and KV (free
            tier) that we operate. Cloudflare may process or cache requests per
            their policies. Hosting is provided by GitHub Pages.
          </p>
          <p>
            <strong>Important:</strong> We retain push subscription entries only as
            long as necessary to send notifications and until you unsubscribe.
          </p>
        </Section>

        <Section title="Cookies & tracking">
          <p>
            We do <strong>not</strong> use cookies for analytics or tracking. We
            do not embed third-party analytics or advertising scripts. Any future
            third-party additions will be disclosed.
          </p>
        </Section>

        <Section title="Third parties">
          <p>
            We may use third-party services (GitHub Pages, Cloudflare) to host or
            deliver content. They only process minimal data to serve the app. We do
            not share subscription data with advertisers or analytics companies.
          </p>
        </Section>

        <Section title="Your rights & choices">
          <p>
            <strong>Unsubscribe from push notifications:</strong> You can revoke
            push permission in multiple ways:
          </p>
          <ul className="list-disc ml-5 space-y-1">
            <li>Use unsubscribe controls in the app/site (if available).</li>
            <li>
              From your browser or Android settings, disable notifications for
              Sapna Shri Jewellers.
            </li>
            <li>Uninstall the app or clear site permissions.</li>
          </ul>
          <p>
            To request deletion of your stored data, contact us at{" "}
            <a
              href="mailto:privacy@sapnashrijewellers.in"
              className="underline text-gray-800"
            >
              privacy@sapnashrijewellers.in
            </a>
            .
          </p>
        </Section>

        <Section title="Security">
          <p>
            We use reasonable technical and organizational measures to protect
            stored subscription data. Access is restricted to authorized systems.
            However, no internet transmission is 100% secure — contact us at{" "}
            <a
              href="mailto:privacy@sapnashrijewellers.in"
              className="underline text-gray-800"
            >
              privacy@sapnashrijewellers.in
            </a>{" "}
            if you believe your data has been compromised.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Our site and app are for general audiences and not directed toward
            children under 13. If a child has provided data, contact us for
            removal.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this policy periodically. The “Effective date” above
            shows the latest revision. Continued use means acceptance of changes.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            If you have questions or requests regarding this policy, contact:
          </p>
          <p>
            <strong>Sapna Shri Jewellers</strong>
            <br />
            Email:{" "}
            <a
              href="mailto:privacy@sapnashrijewellers.in"
              className="underline text-gray-800"
            >
              privacy@sapnashrijewellers.in
            </a>
            <br />
            Hosted on: GitHub Pages and Cloudflare Workers & KV (free tier)
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md text-yellow-900">
            Please replace{" "}
            <code className="bg-gray-100 px-1 rounded">
              privacy@sapnashrijewellers.in
            </code>{" "}
            with your real contact email before publishing this page.
          </div>
        </Section>

        <footer className="mt-8 text-sm text-gray-600">
          <p>Last updated: October 29, 2025</p>
        </footer>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="leading-relaxed mb-5">
      {title && (
        <h2 className="text-xl font-semibold mt-5 mb-2 text-gray-800">{title}</h2>
      )}
      {children}
    </section>
  );
}