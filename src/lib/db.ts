import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Initialize the database connection
// In a real Next.js app, we should be careful with SQLite in serverless environments,
// but for a local prototype or a long-running Node server, this works perfectly.
const dbPath = path.join(process.cwd(), 'portal.db');
const isFirstRun = !fs.existsSync(dbPath);

const db = new Database(dbPath);

// Initialize schema and seed data if this is the first run
if (isFirstRun) {
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
      sunday_school_id INTEGER,
      FOREIGN KEY(sunday_school_id) REFERENCES sunday_schools(id)
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      student_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      PRIMARY KEY (student_id, class_id),
      FOREIGN KEY(student_id) REFERENCES users(id),
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
  const insertUser = db.prepare('INSERT INTO users (name, username, password, role, sunday_school_id) VALUES (?, ?, ?, ?, ?)');
  
  // Admin has no specific sunday school
  const adminId = insertUser.run('System Admin', 'admin', 'admin', 'admin', null).lastInsertRowid;
  
  // Assign to Sunday School 1
  const headMasterId = insertUser.run('Principal Johnson', 'headmaster', 'headmaster', 'head_master', 1).lastInsertRowid;
  // Let's allow either "headmaster" or "head master" as password for headmaster by just matching it later or relying on what they type. The DB has 'headmaster'.
  
  const teacherId = insertUser.run('Mr. Smith', 'teacher', 'teacher', 'teacher', 1).lastInsertRowid;
  const student1Id = insertUser.run('Alice Johnson', 'student', 'student', 'student', 1).lastInsertRowid;
  const student2Id = insertUser.run('Bob Williams', 'student2', 'student2', 'student', 1).lastInsertRowid;

  // Enroll students in classes
  const insertEnrollment = db.prepare('INSERT INTO enrollments (student_id, class_id) VALUES (?, ?)');
  // Assuming Class ID 1 = Jesus Kid, 2 = Class 1, etc.
  insertEnrollment.run(student1Id, 2); // Class 1
  insertEnrollment.run(student2Id, 3); // Class 2
}

export default db;
