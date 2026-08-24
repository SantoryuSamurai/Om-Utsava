const links = [
  ["Contact", "/contact"],
  ["Terms", "/terms"],
  ["Refunds", "/refunds"],
  ["Privacy", "/privacy"],
];

export function PolicyPage({ eyebrow, title, children }) {
  return <main className="legal-page"><header className="legal-header"><a className="legal-brand" href="/"><span>OM UTSAVA</span><small>Shantinagar, Bangarpet</small></a><a className="text-link" href="/">Back to website <span className="arrow">→</span></a></header><article className="legal-content"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1>{children}</article><footer className="legal-footer"><p>© 2026 Om Utsava Organising Committee</p><nav aria-label="Policy navigation">{links.map(([label, href]) => <a href={href} key={href}>{label}</a>)}</nav></footer></main>;
}
