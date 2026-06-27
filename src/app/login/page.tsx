import { login } from '@/actions/auth';
import db from '@/lib/db';
import styles from './login.module.css';

export default function Login() {
  // Fetch all users for the prototype login
  const users = db.prepare('SELECT id, name, role FROM users').all() as { id: number, name: string, role: string }[];
  
  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');
  const admins = users.filter(u => u.role === 'admin');
  const headMasters = users.filter(u => u.role === 'head_master');

  return (
    <div className={styles.main}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>Portal Login</h1>
        <p className={styles.subtitle}>Select your account to access the system.</p>
      </div>

      <div className={styles.loginGrid}>
        <div className="glass-card">
          <h2 className={styles.cardTitle}>Admin</h2>
          <form action={login} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Profile</label>
              <select name="userId" className="form-input" required>
                <option value="">-- Select Admin --</option>
                {admins.map(admin => (
                  <option key={admin.id} value={admin.id}>{admin.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login as Admin</button>
          </form>
        </div>

        <div className="glass-card">
          <h2 className={styles.cardTitle}>Head Master</h2>
          <form action={login} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Profile</label>
              <select name="userId" className="form-input" required>
                <option value="">-- Select Head Master --</option>
                {headMasters.map(hm => (
                  <option key={hm.id} value={hm.id}>{hm.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login as Head Master</button>
          </form>
        </div>

        <div className="glass-card">
          <h2 className={styles.cardTitle}>Teacher</h2>
          <form action={login} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Profile</label>
              <select name="userId" className="form-input" required>
                <option value="">-- Select Teacher --</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login as Teacher</button>
          </form>
        </div>

        <div className="glass-card">
          <h2 className={styles.cardTitle}>Student</h2>
          <form action={login} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Profile</label>
              <select name="userId" className="form-input" required>
                <option value="">-- Select Student --</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>{student.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login as Student</button>
          </form>
        </div>
      </div>
    </div>
  );
}
