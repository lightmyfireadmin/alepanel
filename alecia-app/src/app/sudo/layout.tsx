/**
 * Sudo Panel Layout
 * 
 * Minimal layout - no theme providers, no analytics.
 * This needs to work when everything else is broken.
 */
export default function SudoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>SUDO PANEL | Alecia</title>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
