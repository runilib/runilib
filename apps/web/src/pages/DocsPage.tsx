import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DocContent } from "../components/docs/DocContent";
import { STEPWISE_DOCS } from "../data/docs";
import styles from "./DocsPage.module.css";

export function DocsPage() {
  const { lib = "tooltip", page = "introduction" } = useParams<{ lib: string; page: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!page) navigate(`/docs/${lib}/introduction`, { replace: true });
  }, [lib, page, navigate]);

  const allPages = STEPWISE_DOCS.flatMap((s) => s.pages);
  const idx = allPages.findIndex((p) => p.id === page);
  const prev = idx > 0 ? allPages[idx - 1] : null;
  const next = idx < allPages.length - 1 ? allPages[idx + 1] : null;

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.back}>
            ← Home
          </Link>
          <div className={styles.libPill}>
            <span>🪜</span> tooltip
            <span className={styles.version}>v1.0.0</span>
          </div>
        </div>
        <nav className={styles.nav}>
          {STEPWISE_DOCS.map((section) => (
            <div key={section.id} className={styles.navSection}>
              <p className={styles.navSectionTitle}>{section.label}</p>
              {section.pages.map((p) => (
                <Link
                  key={p.id}
                  to={`/docs/${lib}/${p.id}`}
                  className={`${styles.navLink} ${page === p.id ? styles.navLinkActive : ""}`}
                >
                  {p.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <DocContent lib={lib} page={page} />

        {/* Prev / Next */}
        <div className={styles.docNav}>
          {prev ? (
            <Link to={`/docs/${lib}/${prev.id}`} className={styles.navItem}>
              <span className={styles.navItemLabel}>← Previous</span>
              <span className={styles.navItemTitle}>{prev.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to={`/docs/${lib}/${next.id}`}
              className={`${styles.navItem} ${styles.navItemRight}`}
            >
              <span className={styles.navItemLabel}>Next →</span>
              <span className={styles.navItemTitle}>{next.title}</span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </main>
    </div>
  );
}
