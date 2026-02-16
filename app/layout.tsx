import type { Metadata, Viewport } from 'next';
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
          <ThemeProvider>{children}</ThemeProvider>
        </IntlProvider>
      </body>
    </html>
  );
}
