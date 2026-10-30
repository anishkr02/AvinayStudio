export function isAllowedImageUrl(url: string): boolean {
  if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/\\')) {
    return true;
  }

  if (url.startsWith('data:image/')) {
    return true;
  }

  try {
    const imageUrl = new URL(url);
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    return Boolean(
      imageUrl.protocol === 'https:' &&
      supabaseUrl &&
      imageUrl.hostname === new URL(supabaseUrl).hostname
    );
  } catch {
    return false;
  }
}

export function safeImageSrc(
  url?: string | null,
  fallback = '/images/hero-laptop.jpg'
): string {
  return url && isAllowedImageUrl(url) ? url : fallback;
}
