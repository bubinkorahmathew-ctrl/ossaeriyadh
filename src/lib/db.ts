import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'portal.db');

// Ensure the database file exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, '');
}

const db = new Database(dbPath, { verbose: console.log });

// Initialize database schema
export function initDB() {
  const schema = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('teacher', 'student', 'admin', 'head_master'))
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      teacher_id INTEGER NOT NULL,
      FOREIGN KEY(teacher_id) REFERENCES users(id)
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
      uploaded_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(uploaded_by) REFERENCES users(id)
    );
  `;

  db.exec(schema);

  // Seed data if empty
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count === 0) {
    console.log("Seeding initial data...");
    
    // Create users
    const insertUser = db.prepare('INSERT INTO users (name, role) VALUES (?, ?)');
    const adminId = insertUser.run('System Admin', 'admin').lastInsertRowid;
    const headMasterId = insertUser.run('Principal Johnson', 'head_master').lastInsertRowid;
    const teacherId = insertUser.run('Mr. Smith', 'teacher').lastInsertRowid;
    const student1Id = insertUser.run('Alice Johnson', 'student').lastInsertRowid;
    const student2Id = insertUser.run('Bob Williams', 'student').lastInsertRowid;

    // Create a class
    const insertClass = db.prepare('INSERT INTO classes (name, teacher_id) VALUES (?, ?)');
    const mathClassId = insertClass.run('Advanced Mathematics', teacherId).lastInsertRowid;
    const physicsClassId = insertClass.run('Physics 101', teacherId).lastInsertRowid;

    // Enroll students
    const insertEnrollment = db.prepare('INSERT INTO enrollments (student_id, class_id) VALUES (?, ?)');
    insertEnrollment.run(student1Id, mathClassId);
    insertEnrollment.run(student1Id, physicsClassId);
    insertEnrollment.run(student2Id, mathClassId);
  }
}

// Ensure the schema is initialized when this file is imported
initDB();

export default db;
