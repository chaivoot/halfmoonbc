import { faqs, farm, pricing, seo, siteUrl } from "@/lib/site";

// Structured data for Google: the farm as a local business, plus the FAQ shown on the page.
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
        name: farm.name,
        description: seo.description,
        url: siteUrl,
        image: `${siteUrl}/opengraph-image.jpg`,
        logo: `${siteUrl}/icon.png`,
        telephone: "+66918268488",
        priceRange: `เริ่มต้น ${pricing.startingPrice}`,
        foundingDate: "2023",
        address: {
          "@type": "PostalAddress",
          addressLocality: "เมืองระนอง",
          addressRegion: "ระนอง",
          addressCountry: "TH",
        },
        geo: { "@type": "GeoCoordinates", latitude: farm.geo.lat, longitude: farm.geo.lng },
        hasMap: `https://www.google.com/maps/search/?api=1&query=${farm.geo.lat},${farm.geo.lng}`,
        areaServed: "TH",
        parentOrganization: { "@type": "Organization", name: "Hero Pet Farm" },
        sameAs: [farm.facebookUrl, farm.instagramUrl, farm.lineUrl],
      },
      {
        "@type": "FAQPage",
        "@id": `${siteUrl}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so a value can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
