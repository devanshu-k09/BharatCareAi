import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const DB_PATH    = path.join(__dirname, '../data/db.json');
const TMP_DB_PATH = DB_PATH + '.tmp';

const defaultData = { users: [], chats: [], complaints: [] };
let dbInMemory = null;

function readDB() {
  if (dbInMemory) return dbInMemory;
  try {
    if (!fs.existsSync(DB_PATH)) {
      dbInMemory = { ...defaultData };
      return dbInMemory;
    }
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    dbInMemory = JSON.parse(raw);
    return dbInMemory;
  } catch (err) {
    console.error('Error reading DB.json:', err);
    dbInMemory = { ...defaultData };
    return dbInMemory;
  }
}

function writeDB(data) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    dbInMemory = data;
    // Atomic write to avoid corruption
    fs.writeFileSync(TMP_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(TMP_DB_PATH, DB_PATH);
  } catch (err) {
    console.error('Error writing to DB.json:', err);
  }
}

// Initialise on first load
export function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    writeDB(defaultData);
    console.log('New database created at: ' + DB_PATH);
  } else {
    console.log('Database loaded from: ' + DB_PATH);
    readDB(); // Populate cache
  }
}

const db = {
  get data() { return readDB(); },
  read()  { /* sync read – no-op */ },
  write(data) { writeDB(data); }
};

export default db;
