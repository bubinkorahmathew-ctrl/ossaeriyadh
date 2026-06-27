import Link from 'next/link';
import styles from './Navigation.module.css';

interface NavigationProps {
  userRole?: 'teacher' | 'student' | null;
  userName?: string | null;
}

export default function Navigation({ userRole, userName }: NavigationProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="OSSAE Logo" className={styles.logoImage} />
          <span>OSSAE RIYADH DISTRICT Edu PORTAL</span>
        </Link>

        {userRole ? (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRoleBadge}>{userRole}</span>
            </div>
            <Link href="/logout" className={styles.logoutLink}>
              Logout
            </Link>
          </div>
        ) : (
          <div className={styles.userSection}>
            <Link href="/login" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
