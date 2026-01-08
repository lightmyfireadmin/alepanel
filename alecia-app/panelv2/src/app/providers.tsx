"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { UserSync } from "@/components/auth/UserSync";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Import messages statically for French locale
import messages from "../../messages/fr.json";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <UserSync />
        <NextIntlClientProvider locale="fr" messages={messages}>
          {children}
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
