
import { getRealTrainData, getRealFlightData } from "../alecia-app/src/lib/services/real-transport";

console.log("Verifying Real Transport Data (SNCF & OpenSky)...");

async function verify() {
  const parisNice = await getRealTrainData("Paris", "Nice");
  console.log("Paris -> Nice Trains:", parisNice);

  const niceParis = await getRealTrainData("Nice", "Paris");
  console.log("Nice -> Paris Trains:", niceParis);

  const parisLyon = await getRealTrainData("Paris", "Lyon");
  console.log("Paris -> Lyon Trains:", parisLyon);

  const parisNicePlanes = await getRealFlightData("Paris", "Nice");
  console.log("Paris -> Nice Planes (Recent):", parisNicePlanes);

  const niceParisPlanes = await getRealFlightData("Nice", "Paris");
  console.log("Nice -> Paris Planes (Recent):", niceParisPlanes);
}

verify();
