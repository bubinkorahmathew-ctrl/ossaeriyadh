import { getUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import styles from './student.module.css';

export default async function StudentDashboard() {
  const user = await getUser();
  
  if (!user || user.role !== 'student') {
    redirect('/');
  }

  // Fetch the class this student is enrolled in
  let classes: { id: number, name: string }[] = [];
  if (user.class_id) {
    const studentClass = db.prepare('SELECT id, name FROM classes WHERE id = ?').get(user.class_id) as { id: number, name: string };
    if (studentClass) {
      classes.push(studentClass);
    }
  }

  let documents: { id: number, title: string, description: string, file_path: string, created_at: string, class_id: number, teacher_name: string }[] = [];
  
  if (user.class_id) {
    documents = db.prepare(`
      SELECT d.id, d.title, d.description, d.file_path, d.created_at, d.class_id, u.name as teacher_name
      FROM documents d
      JOIN users u ON d.uploaded_by = u.id
      WHERE d.class_id = ? AND d.sunday_school_id = ?
      ORDER BY d.created_at DESC
    `).all(user.class_id, user.sunday_school_id) as any[];
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
