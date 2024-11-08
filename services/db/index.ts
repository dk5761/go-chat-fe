import { openDatabaseSync } from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";

const expo = openDatabaseSync("db.db", { enableChangeListener: true });
const db = drizzle(expo);

export default db;
