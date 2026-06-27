import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className={styles.main}>
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>OSSAE RIYADH DISTRICT<br/>Edu PORTAL</h1>
          <p className={styles.subtitle}>
            A centralized platform for teachers and students to share, access, and manage educational resources with ease.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/login" className="btn-primary">
              Access Portal
            </Link>
          </div>
        </div>
        <div className={styles.heroGraphic}>
          <div className={styles.floatingCard1}>
            <div className={styles.cardHeader}></div>
            <div className={styles.cardBody}></div>
          </div>
          <div className={styles.floatingCard2}>
            <div className={styles.cardHeader}></div>
            <div className={styles.cardBody}></div>
            <div className={styles.cardBody}></div>
          </div>
        </div>
      </div>

      <div className={styles.featuresSection}>
        <div className="glass-card">
          <h3>For Teachers</h3>
          <p>Seamlessly upload and organize class materials, assignments, and lesson plans for all your assigned courses.</p>
        </div>
        <div className="glass-card">
          <h3>For Students</h3>
          <p>Instantly access and download all necessary documents for your enrolled classes in one unified dashboard.</p>
        </div>
        <div className="glass-card">
          <h3>Secure & Fast</h3>
          <p>Built with modern web technologies to ensure your educational resources are always available securely and quickly.</p>
        </div>
      </div>
    </div>
  );
}
