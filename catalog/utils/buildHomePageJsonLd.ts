export default function buildHomePageJsonLd(

) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
    return {

        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "JewelryStore",
                "@id": `${baseURL}/#store`,
                "name": "Sapna Shri Jewellers",
                "alternateName": "सपना श्री ज्वेलर्स",
                "url": `${baseURL}`,
                "logo": `${baseURL}/android-chrome-512x512.png`,
                "image": `${baseURL}/android-chrome-512x512.png`,
                "description": "Handcrafted 925 sterling silver and 22K/18K BIS hallmarked gold jewellery in Nagda, Madhya Pradesh.",
                "telephone": "+918234042231",
                "priceRange": "₹₹₹",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Railway Station Main Road, Near Jain Mandir",
                    "addressLocality": "Nagda",
                    "addressRegion": "Madhya Pradesh",
                    "postalCode": "456335",
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": "23.4542",
                    "longitude": "75.4124"
                },
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                        "opens": "11:00",
                        "closes": "20:00"
                    }
                ],
                "sameAs": [
                    "https://www.facebook.com/share/14JjQReswYv/",
                    "https://www.instagram.com/sapna_shri_jewllers_nagda/",
                    "https://www.youtube.com/@SapnaShriJewellers-b1f"
                ]
            },
            {
                "@type": "WebSite",
                "@id": `${baseURL}/#website`,
                "url": `${baseURL}`,
                "name": "Sapna Shri Jewellers",                
            }
        ]


    }
}