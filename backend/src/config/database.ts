import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'sitcam.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

console.log('Base de datos SITCAM conectada:', dbPath);

export default db;