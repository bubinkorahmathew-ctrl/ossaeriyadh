import Link from 'next/link';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div className={styles.main}>
      {/* 2. Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Nurturing Faith. Empowering Minds. Embracing Technology.</h1>
          <p className={styles.subtitle}>
            Welcome to the official Smart Portal of the Orthodox Syrian Sunday School Association of the East (OSSAE) – Riyadh Region. Streamlining spiritual education for our teachers, students, and parents under the prayerful guidance of the Thrissur Diocese.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/login" className={styles.btnPrimary}>
              Access Teacher Portal
            </Link>
            <Link href="/login" className={styles.btnSecondary}>
              Access Student Portal
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
      </section>

      {/* 3. The Pillars of Our Mission */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>The Pillars of Our Mission</h2>
        <div className={styles.pillarsGrid}>
          <div className={`glass-card ${styles.pillarCard}`}>
            <div className={styles.pillarIcon}>🛐</div>
            <h3>Devotion to God</h3>
            <p>Cultivating a deep, personal relationship with our Lord through structured, scriptural learning.</p>
          </div>
          <div className={`glass-card ${styles.pillarCard}`}>
            <div className={styles.pillarIcon}>⛪</div>
            <h3>Love for the Church</h3>
            <p>Rooting our children in the rich traditions, liturgy, and heritage of the Malankara Orthodox Syrian Church.</p>
          </div>
          <div className={`glass-card ${styles.pillarCard}`}>
            <div className={styles.pillarIcon}>🤝</div>
            <h3>Readiness to Serve</h3>
            <p>Equipping the next generation to step out into the world as compassionate, active servant-leaders.</p>
          </div>
        </div>
      </section>

      {/* 4. Honorable Leadership */}
      <section className={styles.section} id="leadership">
        <h2 className={styles.sectionTitle}>Honorable Leadership</h2>
        <blockquote className={styles.quote}>
          "Remember your leaders, those who spoke to you the word of God." — Hebrews 13:7
        </blockquote>
        <div className={styles.leadershipGrid}>
          <div className={`glass-card ${styles.leaderCard}`}>
            <h3>H.G. Dr. Yohanon Mar Militios</h3>
            <p>Metropolitan & Sunday School President</p>
          </div>
          <div className={`glass-card ${styles.leaderCard}`}>
            <h3>Rev. Fr. Joseph Chamavila</h3>
            <p>Riyadh District President</p>
          </div>
          <div className={`glass-card ${styles.leaderCard}`}>
            <h3>Mr. Jinu Philip</h3>
            <p>District Inspector</p>
          </div>
          <div className={`glass-card ${styles.leaderCard}`}>
            <h3>Mr. Nixon Abraham</h3>
            <p>District Secretary</p>
          </div>
        </div>
      </section>

      {/* 5. One Smart Portal. Two Tailored Experiences. */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>One Smart Portal. Two Tailored Experiences.</h2>
        <div className={styles.featuresGrid}>
          <div className={`glass-card ${styles.featureCard}`}>
            <h3>👩‍🏫 For Our Teachers</h3>
            <p className={styles.featureSub}>Empowering educators with digital tools to minimize administrative tasks and maximize spiritual impact.</p>
            <ul className={styles.featureList}>
              <li><strong>Smart Attendance:</strong> Record weekly attendance in just a few clicks.</li>
              <li><strong>Mark Entry System:</strong> Input internal marks and central exam scores seamlessly.</li>
              <li><strong>Circulars & Broadcasts:</strong> Send direct notices and lesson updates to your specific classes.</li>
            </ul>
            <Link href="/login" className={styles.featureLink}>Enter Teacher Dashboard →</Link>
          </div>
          <div className={`glass-card ${styles.featureCard}`}>
            <h3>👨‍🎓 For Our Students & Parents</h3>
            <p className={styles.featureSub}>Keeping families connected to the curriculum, progress, and community events.</p>
            <ul className={styles.featureList}>
              <li><strong>Progress Trackers:</strong> Easily view academic results, exam schedules, and performance history.</li>
              <li><strong>Digital Resource Library:</strong> Download Sunday School lessons, text materials, and interactive media.</li>
              <li><strong>Attendance Logs:</strong> Stay updated on attendance records throughout the academic year.</li>
            </ul>
            <Link href="/login" className={styles.featureLink}>Enter Student Dashboard →</Link>
          </div>
        </div>
      </section>

      {/* 6. Latest Announcements & Events */}
      <section className={styles.section} id="announcements">
        <h2 className={styles.sectionTitle}>Staying Connected in the Riyadh Region</h2>
        <div className={styles.announcementsList}>
          <div className={`glass-card ${styles.announcementItem}`}>
            <span className={styles.dateBadge}>NEW</span>
            <p>Registration open for the upcoming Academic Year Central Exams.</p>
          </div>
          <div className={`glass-card ${styles.announcementItem}`}>
            <span className={styles.dateBadge}>UPDATE</span>
            <p>Diocese-level talent competitions and Orthodox vacation school updates.</p>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className={styles.footer} id="contact">
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <h4>About OSSAE</h4>
            <p><strong>OSSAE Riyadh District.</strong> A wing of the Orthodox Syrian Sunday School Association of the East, operating under the Thrissur Diocese.</p>
          </div>
          <div className={styles.footerCol}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="http://ossae.org" target="_blank" rel="noopener noreferrer">Central OSSAE Website</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Help Desk Support</a></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>Contact Us</h4>
            <p>Riyadh, Kingdom of Saudi Arabia</p>
            <p>Support Email: <a href="mailto:support@ossaeriyadh.org">support@ossaeriyadh.org</a></p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 OSSAE Riyadh District. All Rights Reserved. Powered by <a href="http://www.sparkwings.co.in" target="_blank" rel="noopener noreferrer">sparkwingsinnovations</a></p>
        </div>
      </footer>
    </div>
  );
}
