import type { Metadata, Viewport } from 'next';
import { CategoryProvider } from '@/context/category-context';
import { TransactionProvider } from '@/context/transaction-context';
import { IntlProvider } from '@/providers/intl-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'thriftly',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="h-full">
        <IntlProvider>
          <ThemeProvider>
            <TransactionProvider>
              <CategoryProvider>{children}</CategoryProvider>
            </TransactionProvider>
          </ThemeProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
