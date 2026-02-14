import Link from 'next/link';

interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm text-brand-500 mb-6">
      <Link href="/" className="hover:text-brand-300 transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-brand-700">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-brand-300 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-brand-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
