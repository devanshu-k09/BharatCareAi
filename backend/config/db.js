import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const DB_PATH    = path.join(__dirname, '../data/db.json');

const defaultData = { users: [], chats: [], complaints: [] };

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) return { ...defaultData };
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    return { ...defaultData };
  }
}

function writeDB(data) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// Initialise on first load
export function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    writeDB(defaultData);
    console.log('New database created at: ' + DB_PATH);
  } else {
    console.log('Database loaded from: ' + DB_PATH);
  }
}

const db = {
  get data() { return readDB(); },
  read()  { /* sync read – no-op */ },
  write(data) { writeDB(data); }
};

export default db;
