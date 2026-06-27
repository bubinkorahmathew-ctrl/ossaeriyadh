import { getUser } from '@/actions/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { uploadDocument } from '@/actions/documents';
import styles from './teacher.module.css';

export default async function TeacherDashboard() {
  const user = await getUser();
  
  if (!user || user.role !== 'teacher') {
    redirect('/');
  }

  // Fetch classes for this teacher
  const classes = db.prepare('SELECT * FROM classes').all() as { id: number, name: string }[];
  
  const recentDocs = db.prepare(`
    SELECT documents.*, classes.name as class_name 
    FROM documents 
    JOIN classes ON documents.class_id = classes.id
    WHERE documents.uploaded_by = ?
    ORDER BY created_at DESC
    LIMIT 5
  `).all(user.id) as { id: number, title: string, file_path: string, class_name: string, created_at: string }[];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Teacher Dashboard</h1>
      
      <div className={styles.grid}>
        <div className="glass-card">
          <h2>Upload a Document</h2>
          <form action={uploadDocument} className={styles.form}>
            <input type="hidden" name="uploaderId" value={user.id} />
            <input type="hidden" name="sundaySchoolId" value={user.sunday_school_id || ''} />
            
            <div className="form-group">
              <label className="form-label">Select Class</label>
              <select name="classId" className="form-input" required>
                <option value="">-- Select Class --</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Document Title</label>
              <input type="text" name="title" className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea name="description" className="form-input" rows={3}></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">File</label>
              <input type="file" name="file" className="form-input" required />
            </div>

            <button type="submit" className="btn-primary">
              Upload Document
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h2>Recent Uploads</h2>
          {recentDocs.length === 0 ? (
            <p className={styles.emptyState}>No documents uploaded yet.</p>
          ) : (
            <ul className={styles.docList}>
              {recentDocs.map(doc => (
                <li key={doc.id} className={styles.docItem}>
                  <div>
                    <strong>{doc.title}</strong>
                    <span className={styles.docClass}>{doc.class_name}</span>
                  </div>
                  <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className={styles.downloadLink}>View</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
