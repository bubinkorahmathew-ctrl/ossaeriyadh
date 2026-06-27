import Link from 'next/link';
import styles from './Navigation.module.css';

interface NavigationProps {
  userRole?: 'teacher' | 'student' | 'admin' | 'head_master' | null;
  userName?: string | null;
}

export default function Navigation({ userRole, userName }: NavigationProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="OSSAE Logo" className={styles.logoImage} />
          <div className={styles.logoText}>
            <span className={styles.mainTitle}>OSSAE Riyadh District</span>
            <span className={styles.subTitle}>Thrissur Diocese</span>
          </div>
        </Link>

        {!userRole && (
          <nav className={styles.centerLinks}>
            <Link href="/">Home</Link>
            <Link href="#about">About Us</Link>
            <Link href="#leadership">Leadership</Link>
            <Link href="#announcements">Announcements</Link>
            <Link href="#contact">Contact</Link>
          </nav>
        )}

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
            <Link href="/login" className={styles.teacherBtn}>
              Teacher Login
            </Link>
            <Link href="/login" className={styles.studentBtn}>
              Student Login
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
