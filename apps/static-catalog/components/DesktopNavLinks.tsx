import React, { FC } from "react";
import Link from "next/link";

const DesktopTopLinks: FC = () => {
  return (
    <div className="hidden md:flex flex-wrap items-end justify-end gap-4">
      <Link
        className="hover:underline"
        href="/"
        title="Go to Home Page of Sapna Shri Jewellers"
      >
        Home
      </Link>

      <Link
        className="hover:underline"
        href="/calculator"
        title="Jewelry Price Calculator"
      >
        Calculator
      </Link>

      <Link
        className="hover:underline"
        href="/huid"
        title="HUID (Hallmark Unique Identification)"
      >
        Hallmarking
      </Link>

      <Link
        className="hover:text-primary"
        href="/search"
        title="Search Catalog"
      >
        Search
      </Link>

      <Link
        className="hover:text-primary"
        href="/qr"
        title="Payment QR Code"
      >
        QR
      </Link>
    </div>
  );
};

export default DesktopTopLinks;
