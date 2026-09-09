/*
Test the implementation:
1. **Google Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema.org Validator**: https://validator.schema.org/
3. **Structured Data Testing Tool**: https://developers.google.com/search/docs/appearance/structured-data
*/
import businessMeta from '@/data/businessMeta.json';

export default function buildBusinessJsonLd() {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL || businessMeta.url;

    // Parse opening times from businessMeta
    const parseTime = (timeString: string) => {
        const date = new Date(timeString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    const openingTime = parseTime(businessMeta.openTime);
    const closingTime = parseTime(businessMeta.closeTime);

    // Build opening hours specification for each day
    const openingHoursSpecification = businessMeta.dayOfWeek.map(day => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": day,
        "opens": openingTime,
        "closes": closingTime
    }));

    // Build street address
    const streetAddress = Array.isArray(businessMeta['address.streetAddress'])
        ? businessMeta['address.streetAddress'].join(', ')
        : businessMeta['address.streetAddress'];

    // Build dynamic payment methods based on business capabilities
    const paymentMethods = [];
    if (businessMeta.acceptCash) paymentMethods.push("Cash");
    if (businessMeta.acceptCreditCard) paymentMethods.push("Credit Card");
    if (businessMeta.acceptDebitCard) paymentMethods.push("Debit Card");
    if (businessMeta.acceptUPI) paymentMethods.push("UPI");
    paymentMethods.push("Mobile Payment"); // Default mobile payment option

    // Build certifications with proper schema
    const certifications = businessMeta.certifications?.map(cert => ({
        "@type": "Thing",
        "name": cert
    })) || [];

    // Build services with proper schema
    const services = businessMeta.services?.map(service => ({
        "@type": "Service",
        "name": service,
        "areaServed": businessMeta.serviceRadius || "IN"
    })) || [];

    // Build multiple contact points including WhatsApp
    const contactPoints = [
        {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "telephone": businessMeta['contact.phone'],
            "email": businessMeta['contact.email'],
            "url": baseURL
        },
        {
            "@type": "ContactPoint",
            "contactType": "WhatsApp Support",
            "telephone": businessMeta['contact.whatsApp'],
            "url": `https://wa.me/${businessMeta['contact.whatsApp'].replace(/\D/g, '')}`
        },
        {
            "@type": "ContactPoint",
            "contactType": "Social Media",
            "url": businessMeta.sameAs?.[0] || baseURL
        }
    ];

    // Build founder with image
    const founderData: any = {
        "@type": "Person",
        "name": businessMeta['people.founder']
    };
    if (businessMeta['founder.image']) {
        founderData.image = businessMeta['founder.image'];
    }

    // Build owner with image
    const ownerData: any = {
        "@type": "Person",
        "name": businessMeta['people.owner']
    };
    if (businessMeta['owner.image']) {
        ownerData.image = businessMeta['owner.image'];
    }

    return {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "JewelryStore",
                "@id": `${baseURL}/#store`,
                "name": businessMeta.name,
                "alternateName": businessMeta.alternateName,
                "url": baseURL,
                "logo": businessMeta.logo,
                "image": [
                    businessMeta.image,
                    businessMeta.logo,
                    `${baseURL}/icon-512x512.png`
                ],
                "description": businessMeta.description,
                "legalName": businessMeta.legalName,
                "email": businessMeta['contact.email'],
                "telephone": businessMeta['contact.phone'],
                "contactPoint": contactPoints,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": streetAddress,
                    "addressLocality": businessMeta['address.addressLocality'],
                    "addressRegion": businessMeta['address.addressRegion'],
                    "postalCode": String(businessMeta['address.postalCode']),
                    "addressCountry": businessMeta['address.addressCountry']
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": businessMeta['geo.latitude'],
                    "longitude": businessMeta['geo.longitude']
                },
                "openingHoursSpecification": openingHoursSpecification,
                "priceRange": "₹₹₹",
                "founder": founderData,
                "owner": ownerData,
                "sameAs": businessMeta.sameAs,
                "areaServed": [
                    {
                        "@type": "AdministrativeArea",
                        "name": businessMeta['address.addressRegion']
                    },
                    {
                        "@type": "Country",
                        "name": businessMeta['address.addressCountry']
                    }
                ],
                ...(businessMeta.serviceRadius && businessMeta.serviceRadius !== "IN" ? {
                    "serviceArea": {
                        "@type": "Place",
                        "name": businessMeta.serviceRadius
                    }
                } : {}),
                "paymentAccepted": paymentMethods,
                "currenciesAccepted": "INR",
                "knowsAbout": businessMeta.knownFor ? [businessMeta.knownFor] : ["Sterling Silver Jewellery", "Gold Jewellery", "BIS Hallmarked Jewellery", "Handcrafted Jewellery"],
                "knowsLanguage": businessMeta.languages || ["en", "hi"],
                "taxID": businessMeta.gstin,
                "businessType": businessMeta.businessType || "JewelryStore",
                ...(businessMeta.establishedDate && {
                    "foundingDate": String(businessMeta.establishedDate)
                }),
                ...(certifications.length > 0 && {
                    "certifications": certifications
                }),
                ...(services.length > 0 && {
                    "service": services
                }),
                // Aggregate Rating linked to Google Business Profile
                ...(businessMeta.trustScore && {
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": String(businessMeta.trustScore),
                        "bestRating": "5",
                        "worstRating": "1",
                        "ratingCount": "50+",
                        "url": businessMeta['google.businessProfileUrl'] || businessMeta['google.mapsUrl'],
                        "description": "Ratings and reviews from Google Business Profile and Google Maps"
                    }
                }),
                ...(businessMeta.video && {
                    "video": {
                        "@type": "VideoObject",
                        "name": `${businessMeta.name} Collection & Showcase`,
                        "description": "Handcrafted jewellery collection",
                        "url": businessMeta.video,
                        "thumbnailUrl": businessMeta.image
                    }
                })
            },
            {
                "@type": "LocalBusiness",
                "@id": `${baseURL}/#localbusiness`,
                "name": businessMeta.name,
                "url": baseURL,
                "telephone": businessMeta['contact.phone'],
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": streetAddress,
                    "addressLocality": businessMeta['address.addressLocality'],
                    "addressRegion": businessMeta['address.addressRegion'],
                    "postalCode": String(businessMeta['address.postalCode']),
                    "addressCountry": businessMeta['address.addressCountry']
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": businessMeta['geo.latitude'],
                    "longitude": businessMeta['geo.longitude']
                },
                "sameAs": businessMeta.sameAs,
                "hasMap": businessMeta['google.mapsUrl'],
                "google.businessProfileUrl": businessMeta['google.businessProfileUrl']
            },
            {
                "@type": "WebSite",
                "@id": `${baseURL}/#website`,
                "url": baseURL,
                "name": businessMeta.name,
                "description": businessMeta.description,
                "publisher": {
                    "@type": "Organization",
                    "@id": `${baseURL}/#store`
                },
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": `${baseURL}/search?q={search_term_string}`
                    },
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@type": "Brand",
                "@id": `${baseURL}/#brand`,
                "name": businessMeta.name,
                "logo": businessMeta.logo,
                "url": baseURL,
                "description": businessMeta.description,
                "founder": founderData,
                "sameAs": businessMeta.sameAs
            }
        ]
    }
}