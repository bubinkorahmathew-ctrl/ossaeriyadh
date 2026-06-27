import Link from 'next/link';
import styles from './Navigation.module.css';
import { BookOpen } from 'lucide-react';

interface NavigationProps {
  userRole?: 'teacher' | 'student' | null;
  userName?: string | null;
}

export default function Navigation({ userRole, userName }: NavigationProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <BookOpen className={styles.logoIcon} />
          <span>EduPortal</span>
        </Link>

        {userRole && (
          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{userName}</span>
              <span className={styles.userRoleBadge}>{userRole}</span>
            </div>
            <Link href="/logout" className={styles.logoutLink}>
              Logout
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
