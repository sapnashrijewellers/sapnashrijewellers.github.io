import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="flex justify-center">
      <main className="max-w-3xl w-full">
        {/* Header */}
        <header className="mb-6 border-b border-border pb-3">
          <h1 className="text-3xl font-bold mb-1">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Sapna Shri Jewellers — Effective date: <time dateTime="2025-10-29">October 29, 2025</time>
          </p>
        </header>

        {/* Summary */}
        <Section title="Summary (short)">
          <ul className="list-disc pl-6 space-y-1">
            <li>We only collect push notification subscription data.</li>
            <li>We do <strong>not</strong> use cookies, analytics, or user tracking.</li>
            <li>
              Hosting: GitHub Pages and Cloudflare Workers & KV (free tier) are used to serve
              the site and store push subscription objects.
            </li>
            <li>You can unsubscribe from push notifications at any time via the app or browser.</li>
          </ul>
        </Section>

        {/* Intro */}
        <Section>
          <p>
            This Privacy Policy explains how <strong>Sapna Shri Jewellers</strong> ("we", "us", or "our")
            collects, uses, stores, and discloses information when you use our Progressive Web App (PWA)
            and Android Trusted Web Activity (TWA). We do <strong>not</strong> collect personal
            information except for minimal push notification subscription data.
          </p>
        </Section>

        <Section title="Information we collect">
          <p>
            <strong>Push subscription data only:</strong> When you opt in to receive notifications,
            we store only the minimal subscription information required to send them. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li><strong>Endpoint URL</strong> — The browser-managed push service URL.</li>
            <li>
              <strong>Public cryptographic keys</strong> (<code className="bg-muted px-1 rounded">p256dh</code>,
              <code className="bg-muted px-1 rounded">auth</code>) for encrypted delivery.
            </li>
            <li><strong>Optional metadata</strong> — timestamp and platform info.</li>
          </ul>
          <p className="mt-2">
            We do <strong>not</strong> collect names, emails, phone numbers, locations, or payment details.
          </p>
        </Section>

        <Section title="How we use the information">
          <p>Subscription data is used <strong>only</strong> to deliver the notifications you opted into, e.g.:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Announcements about new collections or offers.</li>
            <li>Service-related alerts (if enabled).</li>
          </ul>
          <p className="mt-2">
            We never use subscription data for profiling, advertising, or third-party marketing.
          </p>
        </Section>

        <Section title="Storage & hosting">
          <p>
            Subscription data is stored securely on <strong>Cloudflare Workers and KV (free tier)</strong>.
            Hosting is provided by GitHub Pages. Cloudflare may temporarily cache requests as per their
            privacy policies.
          </p>
          <p className="mt-2">
            We retain subscription entries <strong>only as long as needed</strong> to deliver notifications
            and remove them upon unsubscription.
          </p>
        </Section>

        <Section title="Cookies & tracking">
          <p>
            We do <strong>not</strong> use cookies, analytics tools, or third-party trackers. Any
            future additions will be clearly disclosed and optional.
          </p>
        </Section>

        <Section title="Third parties">
          <p>
            We use GitHub Pages and Cloudflare solely for hosting and delivery. They process minimal
            data necessary to serve content and <strong>do not</strong> have access to push subscription data.
          </p>
        </Section>

        <Section title="Your rights & choices">
          <p><strong>To unsubscribe from notifications:</strong></p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Use unsubscribe controls in the app or website (if available).</li>
            <li>Disable notifications for Sapna Shri Jewellers in your browser or device settings.</li>
            <li>Uninstall the app or clear site permissions.</li>
          </ul>
          <p className="mt-2">
            For deletion requests, contact us at{" "}
            <a href="mailto:privacy@sapnashrijewellers.in" className="text-accent underline">
              privacy@sapnashrijewellers.in
            </a>.
          </p>
        </Section>

        <Section title="Security">
          <p>
            We apply reasonable technical and organizational safeguards to protect stored data.
            However, no system is entirely secure. If you suspect unauthorized access, contact us at{" "}
            <a href="mailto:privacy@sapnashrijewellers.in" className="text-accent underline">
              privacy@sapnashrijewellers.in
            </a>.
          </p>
        </Section>

        <Section title="Children">
          <p>
            Our site is for general audiences and not directed to children under 13. If a child’s data
            has been submitted, contact us for prompt deletion.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We may update this Privacy Policy periodically. The “Effective date” above reflects the
            latest version. Continued use signifies acceptance of the updated terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>For questions or requests regarding this policy, contact:</p>
          <address className="not-italic mt-2">
            <strong>Sapna Shri Jewellers</strong>
            <br />
            Email:{" "}
            <a href="mailto:privacy@sapnashrijewellers.in" className="text-accent underline">
              privacy@sapnashrijewellers.in
            </a>
          </address>


        </Section>
        <Section title="Account & Data Deletion Request">
          <p>
            Sapna Shri Jewellers allows users to request deletion of their account-related data at any time.
          </p>
          <p>What data we store:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Google Sign-In identifier (used only to prevent duplicate ratings)</li>
            <li>Product ratings submitted by the user</li>
            <li>Push notification subscription data (if enabled)</li>
          </ul>
          <p>How to request deletion:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Email us at privacy@sapnashrijewellers.in with the subject “Account & Data Deletion Request”</li>
          </ul>

          <p>Please include the Google account email used to sign in</p>

          <p>What happens next:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>We verify the request</li>
            <li>Delete associated data within 7–30 days</li>
          </ul>

          <p>Send confirmation once completed</p>

          <p>You may also disable push notifications at any time via device or browser settings.</p>
        </Section>

        <footer className="mt-10 text-xs text-muted-foreground border-t border-border pt-3">
          <p>Last updated: October 29, 2025</p>
        </footer>
      </main>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="leading-relaxed mb-6">
      {title && <h2 className="text-xl font-semibold mt-6 mb-3 text-foreground">{title}</h2>}
      {children}
    </section>
  );
}
