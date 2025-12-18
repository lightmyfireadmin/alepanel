import { Navbar, Footer } from "@/components/layout";
import { HomeClient } from "@/components/home/HomeClient";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeClient />
      <Footer />
    </>
  );
}
