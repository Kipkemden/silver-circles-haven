
export const getCsrfToken = () => {
  return document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;
};

export const securityHeaders = {
  'X-CSRF-Token': getCsrfToken(),
  'X-Requested-With': 'XMLHttpRequest',
};

export const secureCookieOptions = {
  secure: true,
  httpOnly: true,
  sameSite: 'strict'
} as const;
