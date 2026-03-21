import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>⚡</div>UniKit
          </Link>
          <p className={styles.copy}>© 2026 · MIT License · Built by gonextstep.io</p>
        </div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <p className={styles.colTitle}>Libraries</p>
            <Link to="/libs/tooltip">tooltip</Link>
            <span className={styles.soon}>formura</span>
            <span className={styles.soon}>toastly</span>
          </div>
          <div className={styles.col}>
            <p className={styles.colTitle}>Docs</p>
            <Link to="/docs/tooltip/introduction">Getting Started</Link>
            <Link to="/docs/tooltip/provider">API Reference</Link>
            <Link to="/docs/tooltip/animations">Animations</Link>
          </div>
          <div className={styles.col}>
            <p className={styles.colTitle}>Links</p>
            <a href="https://github.com/your-org/unikit" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/tooltip" target="_blank" rel="noreferrer">
              npm
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
