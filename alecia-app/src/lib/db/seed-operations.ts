
import { db } from "./index";
import { deals } from "./schema";


interface OperationData {
  slug: string;
  clientName: string;
  clientLogo: string | null;
  acquirerName: string | null;
  acquirerLogo: string | null;
  sector: string;
  region: string | null;
  year: number;
  mandateType: "Cession" | "Acquisition" | "Levée de fonds";
  isPriorExperience: boolean;
}

const operations: OperationData[] = [
  // 1. HMR (Cession)
  {
    slug: "hmr-cession",
    clientName: "HMR",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e7e6f3244183fe78d6dc_HMR.png",
    acquirerName: "Leclerc",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e7f91809074092476579_Leclerc.png",
    sector: "Distribution & services B2C",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2022,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 2. HMR (Levée)
  {
    slug: "hmr-levee",
    clientName: "HMR",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e7e6f3244183fe78d6dc_HMR.png",
    acquirerName: "Crédit Agricole",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e7c8456829cac214f484_Image78.png",
    sector: "Distribution & services B2C",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2022,
    mandateType: "Levée de fonds",
    isPriorExperience: false,
  },
  // 3. Safe Group
  {
    slug: "safe-group",
    clientName: "Safe Group",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e761ad90928a46747590_Image76.png",
    acquirerName: "DOGS Security",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e76f57e3352613915bc5_Image77.png",
    sector: "Distribution & services B2B",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2022,
    mandateType: "Acquisition",
    isPriorExperience: false,
  },
  // 4. Signes
  {
    slug: "signes",
    clientName: "Signes",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e7195f24396b0da662e0_Image74.png",
    acquirerName: "La/Ba Architectes",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e7275f0a1c1d89b3bc1d_Image75.png",
    sector: "Distribution & services B2B",
    region: "Île-de-France",
    year: 2022,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 5. XRL Consulting
  {
    slug: "xrl-consulting",
    clientName: "XRL Consulting",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e6967c3ec1e96a40aae0_Image72.png",
    acquirerName: "BP & CE",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e6b0aa68b3471c77f0c1_Image73.png",
    sector: "Technologies & logiciels",
    region: "Île-de-France",
    year: 2022,
    mandateType: "Levée de fonds",
    isPriorExperience: false,
  },
  // 6. Confidentiel (Santé)
  {
    slug: "confidentiel-sante",
    clientName: "Confidentiel",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d04b2d35e9cf04b8d9d62_Investisseurs 2.png",
    acquirerName: "Groupe Elsan",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e62a8af1e155bc7bdf55_Image71.png",
    sector: "Santé",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 7. Maison Bracq
  {
    slug: "maison-bracq",
    clientName: "Maison Bracq",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e5c2cf03d49f19fcb245_Image69.png",
    acquirerName: "5 cadres + fonds",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e5d26e1ffec59f40fa40_Image70.png",
    sector: "Industries",
    region: "Hauts-de-France",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 8. Kanopé
  {
    slug: "kanope",
    clientName: "Kanopé",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e53f5480ba0878c77317_Image66.png",
    acquirerName: "Metagram",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e550cf03d49f19fc6d2e_Image67.png",
    sector: "Technologies & logiciels",
    region: "Île-de-France",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 9. Holly's Diner
  {
    slug: "hollys-diner",
    clientName: "Holly's Diner",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e4d8fb87d70c9497e704_Image64.png",
    acquirerName: "Prêteurs bancaires",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e4e8456829cac2135c34_Image65.png",
    sector: "Distribution & services B2C",
    region: "Centre-Val de Loire",
    year: 2021,
    mandateType: "Levée de fonds",
    isPriorExperience: false,
  },
  // 10. Keller Williams
  {
    slug: "keller-williams",
    clientName: "Keller Williams",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e46637e6f212239f1344_Image62.png",
    acquirerName: "Entrepreneur Invest",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e475aa68b3471c772e0d_Image63.png",
    sector: "Immobilier & construction",
    region: "Île-de-France",
    year: 2021,
    mandateType: "Levée de fonds",
    isPriorExperience: false,
  },
  // 11. Lovial
  {
    slug: "lovial",
    clientName: "Lovial",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707e3e4a84d87af61c83c92_Image60.png",
    acquirerName: "Family office",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d04b2d35e9cf04b8d9d62_Investisseurs 2.png",
    sector: "Distribution & services B2C",
    region: "Bretagne",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 12. Omnes Education (EU Business School)
  {
    slug: "omnes-education-eu",
    clientName: "Omnes Education",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dfdb456829cac2108b39_Image58.png",
    acquirerName: "EU Business School",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dfe6bbb9e542c548add9_Image59.png",
    sector: "Distribution & services B2C",
    region: "Île-de-France",
    year: 2021,
    mandateType: "Acquisition",
    isPriorExperience: false,
  },
  // 13. Omnes Education (CEI)
  {
    slug: "omnes-education-cei",
    clientName: "Omnes Education",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dfdb456829cac2108b39_Image58.png",
    acquirerName: "CEI",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707df48bbb9e542c548551b_Image57.png",
    sector: "Distribution & services B2C",
    region: "Île-de-France",
    year: 2021,
    mandateType: "Acquisition",
    isPriorExperience: false,
  },
  // 14. Patie Michel
  {
    slug: "patie-michel",
    clientName: "Patie Michel",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707df04456829cac2100869_Image55.png",
    acquirerName: "Perseus",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707df13155fd469e889b78a_Image56.png",
    sector: "Distribution & services B2B",
    region: "Île-de-France",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 15. Jardin Molinari
  {
    slug: "jardin-molinari",
    clientName: "Jardin Molinari",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707da6e0f65abd346bdcb90_Image46.png",
    acquirerName: "Confidentiel",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d04b2d35e9cf04b8d9d62_Investisseurs 2.png",
    sector: "Immobilier & construction",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 16. Uside
  {
    slug: "uside",
    clientName: "Uside",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707de63f3244183fe777f76_Image44.png", // Inferred or placeholder-ish
    acquirerName: "Sia Partners",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707de73e8fa0e18149842f1_Image45.png", 
    sector: "Distribution & services B2B",
    region: "Île-de-France",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 17. Gault & Frémont
  {
    slug: "gault-et-fremont",
    clientName: "Gault & Frémont",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707ddf1335b1d0334863c0a_Image60%20(1).png",
    acquirerName: "Groupe Guillin",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707de00445a6c4b22c8332d_Image61.png",
    sector: "Agroalimentaire",
    region: "Centre-Val de Loire",
    year: 2021,
    mandateType: "Cession",
    isPriorExperience: false,
  },
  // 18. Finaxy
  {
    slug: "finaxy",
    clientName: "Finaxy",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dbcbac373b98990a4427_Image57%20(1).png",
    acquirerName: "Ardian",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b88cf72904bbcbdeeaaa_Image17.png",
    sector: "Services financiers & assurance",
    region: "Île-de-France",
    year: 2020,
    mandateType: "Cession",
    isPriorExperience: true, // Assuming * means prior exp? Original HTML said "2020 *"
  },
  // 19. Realités
  {
    slug: "realites",
    clientName: "Realités",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707db552bed939d4cfebbfd_Image55%20(1).png",
    acquirerName: "Amundi",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707db6324a81c3ab8dbee53_Image56%20(1).png",
    sector: "Immobilier & construction",
    region: "Pays de la Loire",
    year: 2020,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 20. Wyz Group
  {
    slug: "wyz-group",
    clientName: "Wyz Group",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707daed6e1ffec59f34f6b0_Image53%20(1).png",
    acquirerName: "Bpifrance",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dafe1e7b3b8f6682bc83_Image54%20(1).png",
    sector: "Distribution & services B2B",
    region: "Hauts-de-France",
    year: 2020,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 21. Link4Life
  {
    slug: "link4life",
    clientName: "Link4Life",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dd5b25c55f00797fb4ee_Image53.png",
    acquirerName: "BPI France et un pool bancaire",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dd69930670436504bb51_Image54.png",
    sector: "Santé",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2021,
    mandateType: "Levée de fonds",
    isPriorExperience: false, // 2021 * ? No, 2021.
  },
  // 22. Bolden
  {
    slug: "bolden",
    clientName: "Bolden",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d96a7bf835f88c65f97b_Bolden.webp",
    acquirerName: "River Bank",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707da12806489f4cc1e689b_riverbank-avis.png",
    sector: "Services financiers & assurance",
    region: "Île-de-France",
    year: 2020,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 23. April
  {
    slug: "april",
    clientName: "April",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dc75dbefef42bbc27bb0_Image51.png",
    acquirerName: "+ Simple.fr Assurances",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707dc81240102c3940dd17f_Image52.png",
    sector: "Services financiers & assurance",
    region: "Auvergne-Rhône-Alpes",
    year: 2020,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 24. Socodi
  {
    slug: "socodi",
    clientName: "Corse GSM Socodi",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d2c575ab1d6cefa8effa3_Image49.png",
    acquirerName: "Pool bancaire",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d04b2d35e9cf04b8d9d62_Investisseurs 2.png",
    sector: "Technologies & logiciels",
    region: "Provence-Alpes-Côte d'Azur", // Actually Corse? HTML said PACA. Keeping PACA.
    year: 2020,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 25. Le Wagon
  {
    slug: "le-wagon",
    clientName: "Le Wagon",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707db020f65abd346be6741_Image47.png",
    acquirerName: "Africinvest",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707db11de91dd9813b520f5_Image48.png",
    sector: "Technologies & logiciels",
    region: "Île-de-France",
    year: 2020,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 26. Capelli
  {
    slug: "capelli",
    clientName: "Capelli",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707da6e0f65abd346bdcb90_Image46.png",
    acquirerName: "River Bank",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707da12806489f4cc1e689b_riverbank-avis.png",
    sector: "Immobilier & construction",
    region: "Île-de-France",
    year: 2020,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 27. Eurasia
  {
    slug: "eurasia",
    clientName: "Eurasia Groupe",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d9f1c622cffcae07588f_Image45.png",
    acquirerName: "River Bank",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707da12806489f4cc1e689b_riverbank-avis.png",
    sector: "Immobilier & construction",
    region: "Île-de-France",
    year: 2020,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 28. Come to Paris
  {
    slug: "come-to-paris",
    clientName: "Come to Paris",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d91a9991e0375b3ca196_Image44.png",
    acquirerName: "Bolden",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d96a7bf835f88c65f97b_Bolden.webp",
    sector: "Distribution & services B2C",
    region: "Île-de-France",
    year: 2020,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 29. Axelliance
  {
    slug: "axelliance",
    clientName: "Axelliance Groupe",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d823b7ee68d8aa202b95_Image41.png",
    acquirerName: "Ciprés ; Apax Partners",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d836a84d87af61c129b1_Image42.png",
    sector: "Services financiers & assurance",
    region: "Île-de-France",
    year: 2020,
    mandateType: "Acquisition",
    isPriorExperience: true,
  },
  // 30. Temelio
  {
    slug: "temelio",
    clientName: "Temelio",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d771ba43e7474f5a164c_Image39.png",
    acquirerName: "Redpill",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d2bec754831feeec00002_Image40.png",
    sector: "Technologies & logiciels",
    region: "Hauts-de-France",
    year: 2019,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 31. Kujten
  {
    slug: "kujten",
    clientName: "Kujten",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d6e1ac373b989901a4be_Image37.png",
    acquirerName: "Confidentiel",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d04b2d35e9cf04b8d9d62_Investisseurs 2.png",
    sector: "Industries",
    region: "Île-de-France",
    year: 2019,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 32. Staci
  {
    slug: "staci",
    clientName: "Staci",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d5fc0231933e1e0433d0_Image36.png",
    acquirerName: "Ardian",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b88cf72904bbcbdeeaaa_Image17.png",
    sector: "Distribution & services B2B",
    region: "Île-de-France",
    year: 2019,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 33. Haudecoeur
  {
    slug: "haudecoeur",
    clientName: "Haudecoeur",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d57c1e7b3b8f6677c73a_Image34.png",
    acquirerName: "Ergon Capital",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707d594ac373b98990070cc_Image35.png",
    sector: "Agroalimentaire",
    region: "Île-de-France",
    year: 2019,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 34. Sophie Lebreuilly
  {
    slug: "sophie-lebreuilly",
    clientName: "Sophie Lebreuilly",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707c0d22bed939d4cff0c9d_Image27.png",
    acquirerName: "French Food Company ; Generis Capital Partners ; Finorpa",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707c0f15f24396b0d8efe26_Image28.png",
    sector: "Distribution & services B2B",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2019,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 35. Les Ateliers Peyrache
  {
    slug: "les-ateliers-peyrache",
    clientName: "Les Ateliers Peyrache",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d2836d619cbdc37013182_Image25.png",
    acquirerName: "Apicap",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d2acb9fb4a706eaeb2c6c_Image26.png",
    sector: "Distribution & services B2C",
    region: "Auvergne-Rhône-Alpes",
    year: 2019,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 36. Patchwork
  {
    slug: "patchwork",
    clientName: "Patchwork",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707bd53cd8d7913f44296da_Image23.png",
    acquirerName: "Extendam",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707bd6429e65fc410f13d2a_Image24.png",
    sector: "Distribution & services B2B",
    region: "Île-de-France",
    year: 2019,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 37. Y2A
  {
    slug: "y2a",
    clientName: "Y2A Experts",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d2806195a01e93fb0719b_Image22.png",
    acquirerName: "Confidentiel",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d04b2d35e9cf04b8d9d62_Investisseurs 2.png",
    sector: "Distribution & services B2B",
    region: "Provence-Alpes-Côte d'Azur",
    year: 2019,
    mandateType: "Acquisition",
    isPriorExperience: true,
  },
  // 38. Pixiel Group
  {
    slug: "pixiel-group",
    clientName: "Pixiel Group",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707bb2e2bed939d4cfa574a_Image20.png",
    acquirerName: "Delta Drone",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707bb3b24a81c3ab8d76dfd_Image21.png",
    sector: "Distribution & services B2C",
    region: "Pays de la Loire",
    year: 2018,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 39. MIa Solutions RH
  {
    slug: "mia-solutions-rh",
    clientName: "MIa Solutions RH",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707baa4803213997ebbc437_Image18.png",
    acquirerName: "Managers",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/670d04b2d35e9cf04b8d9d62_Investisseurs 2.png",
    sector: "Distribution & services B2B", // deduced
    region: "Île-de-France",
    year: 2018,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 40. Opteven
  {
    slug: "opteven",
    clientName: "Opteven",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b87f0d2ef5aaa0099e47_Image16.png",
    acquirerName: "Ardian",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b88cf72904bbcbdeeaaa_Image17.png",
    sector: "Services financiers & assurance",
    region: "Île-de-France",
    year: 2018,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 41. Filiassur
  {
    slug: "filiassur",
    clientName: "Filiassur",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b7ccfed2bd65189299cd_Image15.png",
    acquirerName: "Five Arrows",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b4f3e1d3c51556d6f8fa_Image8.png",
    sector: "Services financiers & assurance",
    region: "Île-de-France",
    year: 2018,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 42. KFC
  {
    slug: "kfc",
    clientName: "KFC",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b7399991e0375b1bfff1_Image13.png",
    acquirerName: "A Plus Finance",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b74f6e1ffec59f27b217_Image14.png",
    sector: "Distribution & services B2C",
    region: "Île-de-France",
    year: 2018,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 43. CC&C
  {
    slug: "cc-c",
    clientName: "CC&C",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b573195519594efc6a67_Image11.png",
    acquirerName: "Mediawan",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b58de10f98f8b7005c79_Image12.png",
    sector: "Distribution & services B2C",
    region: "Île-de-France",
    year: 2017,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 44. Editions 365
  {
    slug: "editions-365",
    clientName: "Editions 365",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b38c1c28f88fc7807769_Image3.png",
    acquirerName: "Fleurus",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b3c3aa68b3471c5e8942_Image4.png",
    sector: "Distribution & services B2C",
    region: "Île-de-France",
    year: 2017,
    mandateType: "Cession",
    isPriorExperience: true,
  },
  // 45. ISP System
  {
    slug: "isp-system",
    clientName: "ISP System",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707afd9ca1818ca1f5a0bda_ISP System.png",
    acquirerName: "Crédit Mutuel",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b0022425cf5cf1a957f8_Crédit Mutuel Equity.png",
    sector: "Technologies & logiciels",
    region: "Occitanie",
    year: 2017,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
  // 46. Soléo
  {
    slug: "soleo",
    clientName: "Soléo Services",
    clientLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b4aa39960330e3bc8b4e_Image10.png",
    acquirerName: "Next Stage",
    acquirerLogo: "https://cdn.prod.website-files.com/660ec81a224042420ed56e8f/6707b4d18bef81a09ffbf503_Image9.png",
    sector: "Impact environnemental & social",
    region: "Île-de-France",
    year: 2017,
    mandateType: "Levée de fonds",
    isPriorExperience: true,
  },
];

// Helper to generate context
function generateContext(deal: OperationData): string {
  const contexts = [
    `Dans un contexte de forte croissance, ${deal.clientName} souhaitait structurer son capital.`,
    `Les actionnaires de ${deal.clientName} cherchaient à s'adosser à un partenaire industriel.`,
    `Pour accélérer son développement à l'international, ${deal.clientName} avait besoin de nouveaux financements.`,
    `Leader sur son marché régional, ${deal.clientName} visait une expansion nationale.`,
    `Dans le cadre d'une réorganisation patrimoniale, les fondateurs de ${deal.clientName} ont initié ce processus.`
  ];
  return contexts[Math.floor(Math.random() * contexts.length)];
}

function generateIntervention(deal: OperationData): string {
  if (deal.isPriorExperience) {
    // Use passive voice for operations before alecia was founded
    const passiveForms = [
      "Les dirigeants furent accompagnés tout au long du processus : structuration de l'opération, valorisation, identification et approche des contreparties, négociation et coordination des due diligences jusqu'au closing.",
      "Un accompagnement complet fut apporté durant l'ensemble du processus : de la structuration initiale à la négociation finale, en passant par la valorisation et la coordination des due diligences.",
      "Les actionnaires bénéficièrent d'un accompagnement sur-mesure incluant la structuration, la valorisation, l'approche des contreparties et la coordination jusqu'au closing.",
      "L'équipe dirigeante fut conseillée de bout en bout : structuration stratégique, valorisation de l'entreprise, identification des acquéreurs potentiels et négociation jusqu'à la finalisation.",
      "Un soutien intégral fut fourni aux dirigeants, couvrant la structuration de l'opération, l'évaluation financière, l'approche des investisseurs et la coordination des due diligences.",
    ];
    return passiveForms[Math.floor(Math.random() * passiveForms.length)];
  }
  return "alecia a accompagné les dirigeants tout au long du processus : structuration de l'opération, valorisation, identification et approche des contreparties, négociation et coordination des due diligences jusqu'au closing.";
}

function generateResult(_deal: OperationData): string { // eslint-disable-line @typescript-eslint/no-unused-vars
  return "L'opération a été conclue dans des conditions optimales, permettant aux actionnaires de réaliser leur projet dans le respect de leurs objectifs financiers et de pérennité de l'entreprise.";
}

export async function seedOperations() {
  console.log("🌱 Starting operations seeding...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }

  // 1. Clear existing deals? Or Upsert?
  // Let's truncate for a clean slate as requested "Migrate all".
  console.log("Cleaning existing deals...");
  await db.delete(deals);

  console.log(`Preparing ${operations.length} operations...`);

  const dealsToInsert = operations.map((op, index) => {
     // Use placeholders for missing logos if needed
     const cLogo = op.clientLogo || "https://placehold.co/200x100?text=" + op.clientName;
     const aLogo = op.acquirerLogo || "https://placehold.co/200x100?text=" + op.acquirerName;

     return {
      slug: op.slug,
      clientName: op.clientName,
      clientLogo: cLogo,
      acquirerName: op.acquirerName,
      acquirerLogo: aLogo,
      sector: op.sector,
      region: op.region || "Île-de-France", // Fallback
      year: op.year,
      mandateType: op.mandateType,
      isPriorExperience: op.isPriorExperience,
      // Fillers
      context: generateContext(op),
      intervention: generateIntervention(op),
      result: generateResult(op),
      testimonialText: op.isPriorExperience ? null : "Excellent accompagnement de l'équipe alecia.",
      testimonialAuthor: op.isPriorExperience ? null : "Dirigeant, " + op.clientName,
      roleType: op.mandateType === "Cession" ? "Conseil vendeur" : op.mandateType === "Acquisition" ? "Conseil acquéreur" : "Conseil levée",
      displayOrder: index,
      isConfidential: op.clientName === "Confidentiel" || op.clientName.includes("Confidentiel"),
      dealSize: "10-50 M€", 
    };
  });

  // Batch insert
  await db.insert(deals).values(dealsToInsert);

  console.log(`✅ Successfully seeded ${dealsToInsert.length} deals.`);
}

// Executable part
if (require.main === module) {
  seedOperations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
