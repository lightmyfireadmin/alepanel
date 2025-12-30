
import { getMockTransportData } from "../alecia-app/src/lib/services/mock-transport";

console.log("Verifying Transport Logic...");

const pairs = [
  { origin: "Paris", dest: "Lyon" },
  { origin: "Paris", dest: "Nice" },
  { origin: "Lyon", dest: "Nantes" },
  { origin: "Nice", dest: "Paris" }
];

pairs.forEach(pair => {
  console.log(`Checking ${pair.origin} -> ${pair.dest}:`);
  const items = getMockTransportData(pair.origin, pair.dest);
  if (items.length === 0) {
    console.warn("  No items found!");
  } else {
    items.forEach(item => {
      console.log(`  - ${item.type.toUpperCase()} to ${item.destination} at ${item.time} (${item.status})`);
    });
  }
});

console.log("Verification complete.");
