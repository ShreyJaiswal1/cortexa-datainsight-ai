'use client';

import { ClerkProvider } from '@clerk/nextjs';

export default function ClerkAppearance({ children }) {

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: 'hsl(var(--primary))',
          colorText: 'hsl(var(--text))',
          colorInputBackground: 'hsl(var(--input))',
          colorInputText: 'hsl(var(--foreground))',
          colorDanger: 'hsl(var(--destructive))',
          borderRadius: '0.75rem',
        },
        elements: {
          footer: 'hidden',
          footerAction: 'hidden',
          footerActionText: 'hidden',
          footerActionLink: 'hidden',
          cardFooter: 'hidden',

          /* modal polish */
          modalBackdrop: 'backdrop-blur-xs bg-black/50',
          card: 'p-6 sm:p-8',
          headerTitle: 'text-lg font-semibold',
          headerSubtitle: 'text-sm text-muted-foreground',
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
