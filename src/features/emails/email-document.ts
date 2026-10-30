const STRICT_POLICY = "default-src 'none'; img-src data: cid:; style-src 'unsafe-inline'; font-src data:"

function escapeAttribute(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export function buildEmailDocument(html: string, contentSecurityPolicy: string | null): string {
  const policy = escapeAttribute(contentSecurityPolicy?.trim() || STRICT_POLICY)
  return `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="${policy}"><base target="_blank"></head><body>${html}</body></html>`
}
