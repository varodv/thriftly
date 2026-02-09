'use client';

import type { PropsWithChildren } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { MESSAGES } from '@/i18n';

export function IntlProvider({ children }: PropsWithChildren) {
  return (
    <ReactIntlProvider locale="en" messages={MESSAGES}>
      {children}
    </ReactIntlProvider>
  );
}
