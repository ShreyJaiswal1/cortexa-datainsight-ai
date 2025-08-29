export default function robots() {
  const base = 'https://cortexa.lazyshrey.xyz'; // update if different
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
