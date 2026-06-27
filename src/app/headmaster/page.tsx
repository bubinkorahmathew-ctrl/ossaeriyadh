import { redirect } from 'next/navigation';
import { getUser } from '@/actions/auth';
import db from '@/lib/db';
import styles from './headmaster.module.css';

export default async function HeadMasterDashboard() {
  const user = await getUser();

  if (!user || user.role !== 'head_master') {
    redirect('/login');
  }

  // Get total stats
  const totalClasses = (db.prepare('SELECT COUNT(*) as count FROM classes').get() as any).count;
  const totalTeachers = (db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "teacher"').get() as any).count;
  const totalStudents = (db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "student"').get() as any).count;

  // Get recent documents
  const recentDocs = db.prepare(`
    SELECT documents.*, users.name as uploader_name, classes.name as class_name 
    FROM documents 
    JOIN users ON documents.uploaded_by = users.id
    JOIN classes ON documents.class_id = classes.id
    ORDER BY created_at DESC
    LIMIT 10
  `).all() as { id: number, title: string, uploader_name: string, class_name: string, created_at: string }[];

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Head Master Dashboard</h1>
        <p className={styles.subtitle}>Welcome back, {user.name}. Here is an overview of portal activity.</p>
      </header>

      <div className={styles.statsGrid}>
        <div className="glass-card">
          <div className={styles.statLabel}>Total Classes</div>
          <div className={styles.statValue}>{totalClasses}</div>
        </div>
        <div className="glass-card">
          <div className={styles.statLabel}>Total Teachers</div>
          <div className={styles.statValue}>{totalTeachers}</div>
        </div>
        <div className="glass-card">
          <div className={styles.statLabel}>Total Students</div>
          <div className={styles.statValue}>{totalStudents}</div>
        </div>
      </div>

      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <h2>Recent Document Uploads</h2>
        {recentDocs.length > 0 ? (
          <div className={styles.list}>
            {recentDocs.map(doc => (
              <div key={doc.id} className={styles.listItem}>
                <div>
                  <div className={styles.itemName}>{doc.title}</div>
                  <div className={styles.itemSub}>Uploaded by {doc.uploader_name} in {doc.class_name}</div>
                </div>
                <div className={styles.itemBadge}>{new Date(doc.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>No documents have been uploaded recently.</div>
        )}
      </div>
    </div>
  );
}
