export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Balık Nerede",
    "description": "Balık avcıları için sosyal platform. Nerede, ne zaman, hangi balığı yakaladığını paylaş.",
    "url": "https://baliknerde.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://baliknerde.com?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Balık Nerede",
      "logo": {
        "@type": "ImageObject",
        "url": "https://baliknerde.com/logo.png"
      }
    },
    "sameAs": [
      "https://twitter.com/baliknerde",
      "https://instagram.com/baliknerde"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}
