import { ReactNode } from 'react';
import Link from 'next/link';

interface CalculatorLayoutProps {
  children: ReactNode;
  breadcrumb: { label: string; href: string }[];
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function CalculatorLayout({
  children,
  breadcrumb,
  title,
  description,
  icon,
}: CalculatorLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            {breadcrumb.map((item, index) => (
              <li key={item.href}>
                {index === breadcrumb.length - 1 ? (
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{item.label}</span>
                ) : (
                  <>
                    <Link href={item.href} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                      {item.label}
                    </Link>
                    <span className="mx-1">/</span>
                  </>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          {icon && (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-lg shadow-orange-200/40">
              {icon}
            </div>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8 ml-14">{description}</p>

        {children}
      </div>
    </main>
  );
}