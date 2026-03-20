import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          UniKit
        </Link>
        <ul className={styles.links}>
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? styles.active : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/docs/tooltip/introduction"
              className={({ isActive }) => (isActive ? styles.active : "")}
            >
              Docs
            </NavLink>
          </li>
          <li>
            <a href="/#libraries">Libraries</a>
          </li>
          <li>
            <a href="/#why">Why UniKit</a>
          </li>
        </ul>
        <div className={styles.cta}>
          <a
            href="https://github.com/your-org/unikit"
            target="_blank"
            rel="noreferrer"
            className={styles.githubBtn}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
        <button className={styles.burger} onClick={() => setOpen(!open)} aria-label="Menu">
          <span />
          <span />
          <span />
        </button>
      </div>
      {open && (
        <div className={styles.mobileMenu} onClick={() => setOpen(false)}>
          <Link to="/">Home</Link>
          <Link to="/docs/tooltip/introduction">Docs</Link>
          <a href="https://github.com/your-org/unikit" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}
