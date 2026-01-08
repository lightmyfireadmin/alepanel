import { Navbar, Footer } from "@/components/layout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--background)] pt-24">
        {children}
      </main>
      <Footer />
    </>
  );
}
