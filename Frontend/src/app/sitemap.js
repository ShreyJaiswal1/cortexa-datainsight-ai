export default async function sitemap() {
  const base = 'https://cortexa.lazyshrey.xyz';
  const now = new Date();
  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    { url: `${base}/login`, changeFrequency: 'monthly', priority: 0.5 },
  ];
}
