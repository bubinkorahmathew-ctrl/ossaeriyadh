import { login } from '@/actions/auth';
import db from '@/lib/db';
import styles from './page.module.css';

export default function Home() {
  // Fetch all users for the prototype login
  const users = db.prepare('SELECT id, name, role FROM users').all() as { id: number, name: string, role: string }[];
  
  const teachers = users.filter(u => u.role === 'teacher');
  const students = users.filter(u => u.role === 'student');

  return (
    <div className={styles.main}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>Welcome to EduPortal</h1>
        <p className={styles.subtitle}>Select an account to log in and access your portal.</p>
      </div>

      <div className={styles.loginGrid}>
        <div className="glass-card">
          <h2 className={styles.cardTitle}>Teacher Login</h2>
          <form action={login} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Profile</label>
              <select name="userId" className="form-input" required>
                <option value="">-- Select Teacher --</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Login as Teacher
            </button>
          </form>
        </div>

        <div className="glass-card">
          <h2 className={styles.cardTitle}>Student Login</h2>
          <form action={login} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Select Profile</label>
              <select name="userId" className="form-input" required>
                <option value="">-- Select Student --</option>
                {students.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Login as Student
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
