export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--background)] focus:rounded-lg focus:outline-none font-semibold"
    >
      Aller au contenu principal
    </a>
  );
}
