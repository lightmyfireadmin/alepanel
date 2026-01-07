import { Navbar } from "@/components/public/layout/navbar";
import { Footer } from "@/components/public/layout/footer";
import { HomeClient } from "@/components/public/home/HomeClient";

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HomeClient />
      <Footer />
    </>
  );
}

