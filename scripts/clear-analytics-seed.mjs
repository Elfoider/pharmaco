import { collection, deleteDoc, getDocs, query, where, doc } from "firebase/firestore";

import { ANALYTICS_SEED_TAG, COLLECTIONS, getSeedFirestore } from "./analytics-seed/config.mjs";

async function clearCollectionBySeedTag(db, collectionName) {
  const snap = await getDocs(query(collection(db, collectionName), where("seedTag", "==", ANALYTICS_SEED_TAG)));
  for (const item of snap.docs) {
    await deleteDoc(doc(db, collectionName, item.id));
  }
  return snap.size;
}

async function run() {
  const db = getSeedFirestore();
  const deletedSaleItems = await clearCollectionBySeedTag(db, COLLECTIONS.saleItems);
  const deletedSales = await clearCollectionBySeedTag(db, COLLECTIONS.sales);
  const deletedProducts = await clearCollectionBySeedTag(db, COLLECTIONS.products);

  console.log(`Limpieza completada (${ANALYTICS_SEED_TAG}).`);
  console.log(`sale_items: ${deletedSaleItems}, sales: ${deletedSales}, products: ${deletedProducts}`);
}

run().catch((error) => {
  console.error("Error limpiando seed analytics:", error);
  process.exit(1);
});
