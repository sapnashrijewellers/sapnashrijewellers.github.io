import React from "react";

export default function FooterTrust() {
  // Final numbers pre-rendered
  const yearsOfTrust = 35;
  const happyCustomers = 5000;

  return (
    <footer
      className="bg-footer-trust text-footer-trust
        py-16 flex flex-col md:flex-row items-center justify-center gap-16
        shadow-md mt-6 font-cinzel
      "
    >
      {/* Years of Trust */}
      <div className="text-center">
        <h2 className="footer-heading text-7xl md:text-8xl  drop-shadow-sm">
          {yearsOfTrust}+
        </h2>
        <p className="mt-2 text-2xl md:text-3xl tracking-wide ">
          years of trust
        </p>
      </div>

      {/* Happy Customers */}
      <div className="text-center">
        <h2 className="footer-heading text-7xl md:text-8xl  drop-shadow-sm">
          {happyCustomers}+
        </h2>
        <p className="mt-2 text-2xl md:text-3xl tracking-wide ">
          Happy Customers
        </p>
      </div>
    </footer>
  );
}
