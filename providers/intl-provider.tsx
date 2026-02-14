'use client';

import type { ComponentProps, PropsWithChildren } from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { MESSAGES } from '@/i18n';

export function IntlProvider({ children }: PropsWithChildren) {
  const formats: ComponentProps<typeof ReactIntlProvider>['formats'] = {
    number: {
      currency: {
        style: 'currency',
        currency: 'EUR',
      },
    },
  };

  return (
    <ReactIntlProvider locale="en" messages={MESSAGES} formats={formats}>
      {children}
    </ReactIntlProvider>
  );
}
