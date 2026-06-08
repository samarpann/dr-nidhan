import { MetadataRoute } from 'next';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://drnidan.in';

  // Base static routes
  const routes = ['', '/about', '/contact', '/testimonials', '/products', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // In a real app, you would fetch these dynamically at build time or ISR
  // For this demo, we'll construct the sitemap statically to avoid build-time DB dependencies
  // if you want true dynamic sitemap, you'd fetch from supabase here:
  /*
  const { data: products } = await supabase.from('products').select('slug');
  const productRoutes = products?.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  })) || [];
  */

  return [...routes];
}
