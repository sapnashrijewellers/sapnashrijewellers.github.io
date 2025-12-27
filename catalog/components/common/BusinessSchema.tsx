export default function BusinessSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JewelryStore", // More specific than LocalBusiness
    "name": "Sapna Shri Jewellers",
    "image": "https://sapnashrijewellers.in/static/img/shop.png",
    "@id": "https://sapnashrijewellers.in",
    "url": "https://sapnashrijewellers.in",
    "telephone": "+91-8234042231", // Use your actual number
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Railway Station Main Road, Near Jain Mandir", // Update with exact address
      "addressLocality": "Nagda",
      "addressRegion": "MP",
      "postalCode": "456335",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 23.4542, 
      "longitude": 75.4144
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday","Sunday"],
        "opens": "10:00",
        "closes": "20:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/share/14JjQReswYv/",
      "https://www.instagram.com/sapna_shri_jewllers/",
      "https://www.youtube.com/@SapnaShriJewellers-b1f/shorts"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}