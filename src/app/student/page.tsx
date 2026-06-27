import { getUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import styles from './student.module.css';

export default async function StudentDashboard() {
  const user = await getUser();
  
  if (!user || user.role !== 'student') {
    redirect('/');
  }

  // Fetch classes this student is enrolled in
  const classes = db.prepare(`
    SELECT c.id, c.name, t.name as teacher_name
    FROM classes c
    JOIN enrollments e ON c.id = e.class_id
    JOIN users t ON c.teacher_id = t.id
    WHERE e.student_id = ?
  `).all(user.id) as { id: number, name: string, teacher_name: string }[];

  const classIds = classes.map(c => c.id);
  
  let documents: { id: number, title: string, description: string, file_path: string, created_at: string, class_id: number, teacher_name: string }[] = [];
  
  if (classIds.length > 0) {
    const placeholders = classIds.map(() => '?').join(',');
    documents = db.prepare(`
      SELECT d.id, d.title, d.description, d.file_path, d.created_at, d.class_id, u.name as teacher_name
      FROM documents d
      JOIN users u ON d.uploaded_by = u.id
      WHERE d.class_id IN (${placeholders})
      ORDER BY d.created_at DESC
    `).all(...classIds) as any[];
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Student Dashboard</h1>
      
      <div className={styles.grid}>
        <div className="glass-card">
          <h2>My Classes</h2>
          {classes.length === 0 ? (
            <p className={styles.emptyState}>You are not enrolled in any classes yet.</p>
          ) : (
            <ul className={styles.classList}>
              {classes.map(c => (
                <li key={c.id} className={styles.classItem}>
                  <strong>{c.name}</strong>
                  <span className={styles.teacherName}>Instructor: {c.teacher_name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card">
          <h2>Class Documents</h2>
          {documents.length === 0 ? (
            <p className={styles.emptyState}>No documents available for your classes.</p>
          ) : (
            <ul className={styles.docList}>
              {documents.map(doc => {
                const className = classes.find(c => c.id === doc.class_id)?.name;
                return (
                  <li key={doc.id} className={styles.docItem}>
                    <div className={styles.docInfo}>
                      <span className={styles.docClassBadge}>{className}</span>
                      <strong className={styles.docTitle}>{doc.title}</strong>
                      {doc.description && <p className={styles.docDesc}>{doc.description}</p>}
                      <span className={styles.docMeta}>Uploaded by {doc.teacher_name} on {new Date(doc.created_at).toLocaleDateString()}</span>
                    </div>
                    <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      Download
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
