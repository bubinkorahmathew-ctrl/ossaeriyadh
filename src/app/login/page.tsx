import { login } from '@/actions/auth';
import styles from './login.module.css';

export default function Login() {
  return (
    <div className={styles.main}>
      <div className={styles.heroSection}>
        <h1 className={styles.title}>Portal Login</h1>
        <p className={styles.subtitle}>Enter your credentials to access the system.</p>
      </div>

      <div className={styles.loginContainer}>
        <div className="glass-card">
          <h2 className={styles.cardTitle}>Sign In</h2>
          <form action={login} className={styles.form}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username"
                name="username" 
                className="form-input" 
                placeholder="e.g., teacher"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password"
                name="password" 
                className="form-input" 
                placeholder="Enter password"
                required 
              />
            </div>
            
            {/* Display error message if any (could be passed via URL query params) */}
            
            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Login
            </button>
          </form>
          
          <div className={styles.demoCredentials}>
            <p><strong>Demo Credentials:</strong></p>
            <ul>
              <li>Teacher: <code>teacher</code> / <code>teacher</code></li>
              <li>Head Master: <code>headmaster</code> / <code>headmaster</code></li>
              <li>Student: <code>student</code> / <code>student</code></li>
              <li>Admin: <code>admin</code> / <code>admin</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
