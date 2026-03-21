import { Link } from "react-router-dom";
import type { Library } from "../../data/libraries";
import styles from "./LibCard.module.css";

export function LibCard({ lib }: { lib: Library }) {
  const ok = lib.status === "stable" || lib.status === "beta";
  const card = (
    <div className={`${styles.card} ${!ok ? styles.dim : ""}`}>
      <div className={styles.header}>
        <div className={styles.icon} style={{ "--c": lib.color } as React.CSSProperties}>
          {lib.icon}
        </div>
        <div className={styles.badges}>
          {lib.status === "stable" && (
            <span className={`${styles.b} ${styles.stable}`}>v{lib.version}</span>
          )}
          {lib.status === "coming-soon" && (
            <span className={`${styles.b} ${styles.soon}`}>Soon</span>
          )}
          {ok && <span className={`${styles.b} ${styles.web}`}>React</span>}
          {ok && <span className={`${styles.b} ${styles.native}`}>Native</span>}
        </div>
      </div>
      <h3 className={styles.name}>{lib.name}</h3>
      <p className={styles.desc}>{lib.tagline}</p>
      <div className={styles.footer}>
        <code className={styles.npm}>npm i {lib.npm}</code>
        {lib.version && <span className={styles.version}>v{lib.version}</span>}
      </div>
    </div>
  );
  return ok ? (
    <Link to={`/docs/${lib.slug}/introduction`} className={styles.link}>
      {card}
    </Link>
  ) : (
    <div className={styles.link}>{card}</div>
  );
}
