/**
 * Run: npm run seed
 * Make sure MONGO_URI is set or defaults to mongodb://localhost:27017/categories_db
 */

const mongoose = require("mongoose");
const Counter = require("./models/Counter");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to mongo for seeding.");

  // clear collections
  await Category.deleteMany({});
  await Counter.deleteMany({});

  // Example data you gave is re-mapped to sequential ids.
  // We'll provide the list and parent relationships (parent uses id of the already-inserted items)
  // Source names (order chosen to make parents available when referenced):
  const entries = [
    { name: "Air Fresheners", parent: null },
    { name: "Drift", parentName: "Air Fresheners" },
    { name: "Pickle Fragrances", parentName: "Air Fresheners" },
    { name: "Air Purifiers", parent: null },
    { name: "Air Filter", parentName: "Air Purifiers" }, // will be distinct entry
    { name: "nuwaveforever", parentName: "Air Purifiers" },
    { name: "Air Tags/Tracking Devices", parent: null },
    { name: "Allergy Relief", parent: null },
    { name: "Allergy  Gone", parentName: "Allergy Relief" },
    { name: "Air Filter (Allergy)", parentName: "Allergy Relief" },
    { name: "Bee Pollen", parentName: "Allergy Relief" },
    { name: "Eye Drops", parentName: "Allergy Relief" },
    { name: "Nasal Fresh", parentName: "Allergy Relief" },
    { name: "Pills", parentName: "Allergy Relief" },
    { name: "try-nomore", parentName: "Allergy Relief" },
    { name: "Academies/Online Premier Pickleball Schools", parent: null },
  ];

  // insert sequentially and resolve parentName to id
  const nameToId = {};
  for (const e of entries) {
    const parent = e.parentName ? nameToId[e.parentName] ?? null : null;
    const doc = new Category({ name: e.name, parent });
    await doc.save();
    nameToId[e.name] = doc.id;
    console.log(`Inserted ${e.name} as id ${doc.id} (parent ${parent})`);
  }

  console.log("Seeding done.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
