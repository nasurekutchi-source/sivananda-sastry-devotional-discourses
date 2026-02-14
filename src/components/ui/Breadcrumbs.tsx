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
    <nav className="flex items-center gap-2 text-sm text-text-tertiary mb-6">
      <Link href="/" className="hover:text-accent-primary transition-colors">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="text-border-medium">/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-accent-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-accent-primary font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
