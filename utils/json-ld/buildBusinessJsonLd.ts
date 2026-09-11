import businessMeta from '@/data/businessMeta.json';
import type { Person } from 'schema-dts';

export default function buildBusinessJsonLd(): Record<string, any> {
    const baseURL = (
        process.env.NEXT_PUBLIC_BASE_URL || businessMeta.url
    ).replace(/\/$/, '');

    /*
     * -------------------------------------------------------------------------
     * IDs
     * -------------------------------------------------------------------------
     */

    const storeId = `${baseURL}/#store`;
    const websiteId = `${baseURL}/#website`;
    const brandId = `${baseURL}/#brand`;
    const founderId = `${baseURL}/#founder`;
    const ownerId = `${baseURL}/#owner`;

    /*
     * -------------------------------------------------------------------------
     * Address
     * -------------------------------------------------------------------------
     */

    const streetAddress = Array.isArray(businessMeta.address.streetAddress)
        ? businessMeta.address.streetAddress.join(', ')
        : businessMeta.address.streetAddress;

    /*
     * -------------------------------------------------------------------------
     * Opening Hours
     * -------------------------------------------------------------------------
     */

    const openingHoursSpecification = businessMeta.hours.days.map(day => ({
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": day,
        "opens": businessMeta.hours.open,
        "closes": businessMeta.hours.close
    }));

    /*
     * -------------------------------------------------------------------------
     * Payment Methods
     * -------------------------------------------------------------------------
     */

    const paymentMethods: string[] = [];

    if (businessMeta.payments.cash) {
        paymentMethods.push("Cash");
    }

    if (businessMeta.payments.creditCard) {
        paymentMethods.push("Credit Card");
    }

    if (businessMeta.payments.debitCard) {
        paymentMethods.push("Debit Card");
    }

    if (businessMeta.payments.upi) {
        paymentMethods.push("UPI");
    }

    /*
     * -------------------------------------------------------------------------
     * External Profiles
     *
     * Google Maps is represented using hasMap.
     * Other real-world profiles are represented using sameAs.
     * -------------------------------------------------------------------------
     */

    const sameAs = [
        businessMeta.profiles.googleBusinessProfile,
        businessMeta.profiles.instagram,
        businessMeta.profiles.youtube,
        businessMeta.profiles.facebook
    ].filter(Boolean);

    /*
     * -------------------------------------------------------------------------
     * Contact Points
     * -------------------------------------------------------------------------
     */

    const contactPoints = [
        {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "telephone": businessMeta.contact.phone,
            "email": businessMeta.contact.email,
            "url": baseURL
        },
        {
            "@type": "ContactPoint",
            "contactType": "WhatsApp Support",
            "telephone": businessMeta.contact.whatsApp,
            "url": `https://wa.me/${businessMeta.contact.whatsApp.replace(/\D/g, '')}`
        }
    ];

    /*
     * -------------------------------------------------------------------------
     * Founder
     * -------------------------------------------------------------------------
     */

    const founderData: Person = {
        "@type": "Person",
        "@id": founderId,
        "name": businessMeta.people.founder.name,
        ...(businessMeta.people.founder.image && {
            "image": businessMeta.people.founder.image
        })
    };

    /*
     * -------------------------------------------------------------------------
     * Owner
     * -------------------------------------------------------------------------
     */

    const ownerData: Person = {
        "@type": "Person",
        "@id": ownerId,
        "name": businessMeta.people.owner.name,
        ...(businessMeta.people.owner.image && {
            "image": businessMeta.people.owner.image
        })
    };

    /*
     * -------------------------------------------------------------------------
     * Services
     *
     * These are actual services provided by the jewellery store.
     * We intentionally do NOT assign serviceArea from salesCoverage.
     * -------------------------------------------------------------------------
     */

    const services = businessMeta.services?.map(service => ({
        "@type": "Service",
        "name": service,
        "provider": {
            "@id": storeId
        }
    })) || [];

    /*
     * -------------------------------------------------------------------------
     * Video
     * -------------------------------------------------------------------------
     */

    const video = businessMeta.video
        ? {
            "@type": "VideoObject",
            "name": `${businessMeta.name} Collection & Showcase`,
            "description": "Handcrafted jewellery collection",
            "url": businessMeta.video.url,
            "embedUrl": businessMeta.video.url.includes('/shorts/')
                ? `https://www.youtube.com/embed/${businessMeta.video.url.split('/shorts/')[1]}`
                : businessMeta.video.url,
            "thumbnailUrl": businessMeta.images,
            "uploadDate": businessMeta.video.uploadDate,
            "publisher": {
                "@id": storeId
            }
        }
        : undefined;

    /*
     * -------------------------------------------------------------------------
     * Business Entity
     * -------------------------------------------------------------------------
     */

    const store = {
        "@type": businessMeta.type,
        "@id": storeId,

        "name": businessMeta.name,
        "alternateName": businessMeta.alternateName,
        "legalName": businessMeta.legalName,

        "url": baseURL,
        "logo": businessMeta.logo,
        "image": businessMeta.images,

        "description": businessMeta.description,

        "email": businessMeta.contact.email,
        "telephone": businessMeta.contact.phone,

        "contactPoint": contactPoints,

        "address": {
            "@type": "PostalAddress",
            "streetAddress": streetAddress,
            "addressLocality": businessMeta.address.addressLocality,
            "addressRegion": businessMeta.address.addressRegion,
            "postalCode": String(businessMeta.address.postalCode),
            "addressCountry": businessMeta.address.addressCountry
        },

        "geo": {
            "@type": "GeoCoordinates",
            "latitude": businessMeta.geo.latitude,
            "longitude": businessMeta.geo.longitude
        },

        "hasMap": businessMeta.profiles.googleMaps,

        "openingHoursSpecification": openingHoursSpecification,

        "founder": {
            "@id": founderId
        },

        "owner": {
            "@id": ownerId
        },

        "brand": {
            "@id": brandId
        },

        "sameAs": sameAs,

        "paymentAccepted": paymentMethods,

        "currenciesAccepted": "INR",

        "knowsAbout": [
            ...businessMeta.knownFor,
            ...businessMeta.productCategories,
            ...businessMeta.productAttributes
        ],

        "knowsLanguage": businessMeta.languages,

        "taxID": businessMeta.registrations.gstin,

        "foundingDate": String(businessMeta.foundingYear),

        ...(services.length > 0 && {
            "service": services
        }),

        ...(video && {
            "video": video
        })
    };

    /*
     * -------------------------------------------------------------------------
     * Website Entity
     * -------------------------------------------------------------------------
     */

    const website = {
        "@type": "WebSite",
        "@id": websiteId,

        "url": baseURL,
        "name": businessMeta.name,
        "description": businessMeta.description,

        "publisher": {
            "@id": storeId
        }
    };

    /*
     * -------------------------------------------------------------------------
     * Brand Entity
     * -------------------------------------------------------------------------
     */

    const brand = {
        "@type": "Brand",
        "@id": brandId,

        "name": businessMeta.name,
        "logo": businessMeta.logo,
        "url": baseURL,

        "description": businessMeta.description,

        "founder": {
            "@id": founderId
        },

        "sameAs": sameAs
    };

    /*
     * -------------------------------------------------------------------------
     * Final JSON-LD Graph
     * -------------------------------------------------------------------------
     */

    return {
        "@context": "https://schema.org",

        "@graph": [
            store,
            founderData,
            ownerData,
            website,
            brand
        ]
    };
}