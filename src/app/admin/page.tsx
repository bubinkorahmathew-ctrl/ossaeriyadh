import { redirect } from 'next/navigation';
import { getUser } from '@/actions/auth';
import { createUser, createClass } from '@/actions/admin';
import db from '@/lib/db';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const user = await getUser();

  if (!user || user.role !== 'admin') {
    redirect('/login');
  }

  const users = db.prepare('SELECT * FROM users').all() as { id: number, name: string, role: string }[];
  const classes = db.prepare(`
    SELECT classes.*, users.name as teacher_name 
    FROM classes 
    LEFT JOIN users ON classes.teacher_id = users.id
  `).all() as { id: number, name: string, teacher_id: number, teacher_name: string }[];
  
  const teachers = users.filter(u => u.role === 'teacher');

  return (
    <div className={styles.main}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <p className={styles.subtitle}>Manage users and classes across the portal.</p>
      </header>

      <div className={styles.grid}>
        <div className="glass-card">
          <h2>Create New User</h2>
          <form action={createUser} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-input" required>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="head_master">Head Master</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create User</button>
          </form>

          <h2 style={{ marginTop: '2rem' }}>Users ({users.length})</h2>
          <div className={styles.list}>
            {users.map(u => (
              <div key={u.id} className={styles.listItem}>
                <span className={styles.itemName}>{u.name}</span>
                <span className={styles.itemBadge}>{u.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <h2>Create New Class</h2>
          <form action={createClass} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Class Name</label>
              <input type="text" name="name" className="form-input" required placeholder="Biology 101" />
            </div>
            <div className="form-group">
              <label className="form-label">Assign Teacher</label>
              <select name="teacherId" className="form-input" required>
                <option value="">-- Select a Teacher --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Create Class</button>
          </form>

          <h2 style={{ marginTop: '2rem' }}>Classes ({classes.length})</h2>
          <div className={styles.list}>
            {classes.map(c => (
              <div key={c.id} className={styles.listItem}>
                <span className={styles.itemName}>{c.name}</span>
                <span className={styles.itemBadge}>Teacher: {c.teacher_name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
