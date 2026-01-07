import { Navbar } from "@/components/public/layout/navbar";
import { Footer } from "@/components/public/layout/footer";
import { HomeClient } from "@/components/public/home/HomeClient";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <HomeClient />
      <Footer />
    </>
  );
}
