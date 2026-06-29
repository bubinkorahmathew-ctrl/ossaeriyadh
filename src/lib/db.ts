import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'portal.db');
const isFirstRun = !fs.existsSync(dbPath);

const db = new Database(dbPath);

if (isFirstRun) {
  console.log("Initializing database schema...");

  db.exec(`
    CREATE TABLE IF NOT EXISTS sunday_schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('teacher', 'student', 'admin', 'head_master')),
      
      -- Hierarchical fields
      sunday_school_id INTEGER,
      headmaster_id INTEGER,
      teacher_id INTEGER,
      class_id INTEGER,
      
      -- Student-specific data fields
      dob TEXT,
      parents_name TEXT,
      contact_number TEXT,
      other_activity TEXT,
      
      FOREIGN KEY(sunday_school_id) REFERENCES sunday_schools(id),
      FOREIGN KEY(headmaster_id) REFERENCES users(id),
      FOREIGN KEY(teacher_id) REFERENCES users(id),
      FOREIGN KEY(class_id) REFERENCES classes(id)
    );

    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      file_path TEXT NOT NULL,
      class_id INTEGER NOT NULL,
      sunday_school_id INTEGER NOT NULL,
      uploaded_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(sunday_school_id) REFERENCES sunday_schools(id),
      FOREIGN KEY(uploaded_by) REFERENCES users(id)
    );
  `);

  console.log("Seeding initial data...");

  // Seed Sunday Schools (1 to 6)
  const insertSchool = db.prepare('INSERT INTO sunday_schools (name) VALUES (?)');
  for (let i = 1; i <= 6; i++) {
    insertSchool.run(`Sunday School ${i}`);
  }

  // Seed Classes (Jesus Kid, Class 1 to 12)
  const insertClass = db.prepare('INSERT INTO classes (name) VALUES (?)');
  insertClass.run('Jesus Kid');
  for (let i = 1; i <= 12; i++) {
    insertClass.run(`Class ${i}`);
  }

  // Create Users with demo credentials
  const insertUser = db.prepare(`
    INSERT INTO users (
      name, username, password, role, 
      sunday_school_id, headmaster_id, teacher_id, class_id,
      dob, parents_name, contact_number, other_activity
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  // Admin has no specific sunday school
  const adminId = insertUser.run('System Admin', 'admin', 'admin', 'admin', null, null, null, null, null, null, null, null).lastInsertRowid;
  
  // Head Master assigned to Sunday School 1
  const headMasterId = insertUser.run('Principal Johnson', 'headmaster', 'headmaster', 'head_master', 1, null, null, null, null, null, null, null).lastInsertRowid;
  
  // Teacher assigned under Head Master (and Sunday School 1)
  const teacherId = insertUser.run('Mr. Smith', 'teacher', 'teacher', 'teacher', 1, headMasterId, null, null, null, null, null, null).lastInsertRowid;
  
  // Students assigned under Teacher and Class (and Sunday School 1)
  // Assuming Class ID 2 = Class 1, Class ID 3 = Class 2
  const student1Id = insertUser.run(
    'Alice Johnson', 'student', 'student', 'student', 
    1, null, teacherId, 2, 
    '2015-05-12', 'Mr. & Mrs. Johnson', '123-456-7890', 'Choir'
  ).lastInsertRowid;

  const student2Id = insertUser.run(
    'Bob Williams', 'student2', 'student2', 'student', 
    1, null, teacherId, 3, 
    '2014-11-20', 'Mr. Williams', '098-765-4321', 'Altar Boy'
  ).lastInsertRowid;
}

export default db;
