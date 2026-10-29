export const SITE_CONFIG = {
  whatsappNumber: '917896554039',
  phoneDisplay: '+91 7896554039',
  phoneTel: '+917896554039',
} as const;

export function waLink(message?: string): string {
  const url = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
  return message === undefined ? url : `${url}?text=${encodeURIComponent(message)}`;
}
