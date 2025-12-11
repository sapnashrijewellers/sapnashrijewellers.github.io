import React from "react";

export default function FooterTrust() {
  // Final numbers pre-rendered
  const yearsOfTrust = 35;
  const happyCustomers = 5000;

  return (
    <footer
      className="
        bg-accent text-card-foreground
        py-16 flex flex-col md:flex-row items-center justify-center gap-16
        shadow-md mt-6 
      "
    >
      {/* Years of Trust */}
      <div className="text-center">
        <h2 className="text-7xl md:text-8xl  text-primary drop-shadow-sm">
          {yearsOfTrust}+
        </h2>
        <p className="mt-2 text-2xl md:text-3xl tracking-wide text-muted-foreground">
          वर्षों का विश्वास
        </p>
      </div>

      {/* Happy Customers */}
      <div className="text-center">
        <h2 className="text-7xl md:text-8xl text-primary drop-shadow-sm">
          {happyCustomers}+
        </h2>
        <p className="mt-2 text-2xl md:text-3xl tracking-wide text-muted-foreground">
          खुश ग्राहक
        </p>
      </div>
    </footer>
  );
}
