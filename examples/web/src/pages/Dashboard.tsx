import { useEffect, useRef} from 'react';
import { TooltipStep, useTooltip,  } from '@runilib/tooltip';
import { STEPS } from '../tourConfig';
import styles from './Dashboard.module.css';

interface Props {
  onGoToSettings: () => void;
  onRestartTour:  () => void;
}

const PROJECTS = [
  { id: 1, name: 'Mobile App',      color: '#f0a500', tasks: 12, done: 8 },
  { id: 2, name: 'Design System',   color: '#5ba8f0', tasks: 7,  done: 5 },
  { id: 3, name: 'API Migration',   color: '#5bbf7a', tasks: 18, done: 6 },
  { id: 4, name: 'Onboarding Flow', color: '#e05a3a', tasks: 5,  done: 5 },
];

const TASKS = [
  { id: 1, title: 'Set up stepwise in mobile app', tag: 'In Progress', priority: 'High',   due: 'Today',    project: 'Mobile App',    progress: 65 },
  { id: 2, title: 'Write unit tests for useForm',  tag: 'In Progress', priority: 'High',   due: 'Tomorrow', project: 'Mobile App',    progress: 40 },
  { id: 3, title: 'Design token audit',            tag: 'Review',      priority: 'Medium', due: 'Mar 22',   project: 'Design System', progress: 90 },
  { id: 4, title: 'Migrate auth endpoints',        tag: 'Backlog',     priority: 'High',   due: 'Mar 25',   project: 'API Migration', progress: 0  },
  { id: 5, title: 'Add dark mode support',         tag: 'Backlog',     priority: 'Low',    due: 'Mar 28',   project: 'Design System', progress: 0  },
  { id: 6, title: 'Deploy v1.0 of stepwise',       tag: 'Done',        priority: 'High',   due: 'Done',     project: 'Mobile App',    progress: 100},
];

const STATS = [
  { label: 'Tasks Done',    value: '24',  sub: '+4 this week',      color: 'var(--green)'  },
  { label: 'In Progress',   value: '8',   sub: '2 due today',       color: 'var(--accent)' },
  { label: 'Overdue',       value: '2',   sub: 'Needs action',      color: 'var(--accent3)'},
  { label: 'Team Velocity', value: '87%', sub: '↑ 12% vs last week',color: 'var(--blue)'   },
];

const tagStyle: Record<string, string> = {
  'In Progress': 'tag-amber',
  'Review':      'tag-blue',
  'Done':        'tag-green',
  'Backlog':     '',
};

const priorityDot: Record<string, string> = {
  High:   '#e05a3a',
  Medium: '#f0a500',
  Low:    '#5bbf7a',
};

export function Dashboard({ onGoToSettings, onRestartTour }: Props) {
  const { start, isRunning } = useTooltip();
  const started = useRef(false);

  useEffect(() => {
    if (!started.current) {
      started.current = true;
      const timer = setTimeout(() => start(), 800);
      return () => clearTimeout(timer);
    }
  }, [start, isRunning]);

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <TooltipStep {...STEPS.SIDEBAR}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>Taskflow</span>
          </div>
          <nav className={styles.nav}>
            <p className={styles.navLabel}>Workspace</p>
            {[
              { icon: '◼', label: 'Dashboard', active: true,  action: undefined },
              { icon: '◻', label: 'My Tasks',  active: false, action: undefined },
              { icon: '◻', label: 'Calendar',  active: false, action: undefined },
              { icon: '⚙', label: 'Settings',  active: false, action: onGoToSettings },
            ].map(item => (
              <button
              type='button'
                key={item.label}
                className={`${styles.navItem} ${item.active ? styles.navActive : ''}`}
                onClick={item.action}
              >
                <span>{item.icon}</span>{item.label}
              </button>
            ))}
            <p className={styles.navLabel} style={{ marginTop: 24 }}>Projects</p>
            {PROJECTS.map(p => (
              <button               type='button'
 key={p.id} className={styles.navItem}>
                <span className={styles.projectDot} style={{ background: p.color }} />
                {p.name}
                <span className={styles.projectCount}>{p.done}/{p.tasks}</span>
              </button>
            ))}
          </nav>
          <div className={styles.sidebarFooter}>
            <div className={styles.avatar}>AK</div>
            <div>
              <p className={styles.avatarName}>AKS</p>
              <p className={styles.avatarRole}>Developer</p>
            </div>
          </div>
        </aside>
      </TooltipStep>

      {/* Main */}
      <main className={styles.main}>
        <TooltipStep {...STEPS.HEADER}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.pageTitle}>Dashboard</h1>
              <p className={styles.pageSubtitle}>Monday, March 17 · 3 tasks due today</p>
            </div>
            <div className={styles.headerRight}>
              <TooltipStep {...STEPS.NOTIFICATIONS} placement="auto">
                <button type='button' className={`btn btn-ghost ${styles.notifBtn}`}>
                  🔔 <span className={styles.notifBadge}>3</span>
                </button>
              </TooltipStep>
              <button               type='button'
 className="btn btn-ghost" style={{ fontSize: 12 }} onClick={onGoToSettings}>
                ⚙ Settings
              </button>
              <button                type='button'
 className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { start(); }} disabled={isRunning}>
                {isRunning ? '▶ Tour running…' : '▶ Restart Tour'}
              </button>
            </div>
          </header>
        </TooltipStep>

        <div className={styles.content}>
          <TooltipStep {...STEPS.STATS} placement="auto">
            <div className={styles.statsRow}>
              {STATS.map(s => (
                <div key={s.label} className={`card ${styles.statCard}`}>
                  <p className={styles.statValue} style={{ color: s.color }}>{s.value}</p>
                  <p className={styles.statLabel}>{s.label}</p>
                  <p className={styles.statSub}>{s.sub}</p>
                </div>
              ))}
            </div>
          </TooltipStep>

          <div className={styles.tasksSection}>
            <div className={styles.tasksSectionHeader}>
              <h2 className={styles.sectionTitle}>Active Tasks</h2>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <TooltipStep {...STEPS.FILTERS} placement="auto">
                  <div className={styles.filters}>
                    {['All', 'In Progress', 'Review', 'Backlog'].map(f => (
                      <button               type='button'
 key={f} className={`${styles.filterBtn} ${f === 'All' ? styles.filterActive : ''}`}>{f}</button>
                    ))}
                  </div>
                </TooltipStep>
                <TooltipStep {...STEPS.NEW_TASK} placement="auto">
                  <button               type='button'
 className="btn btn-primary">+ New Task</button>
                </TooltipStep>
              </div>
            </div>

            <div className={styles.taskList}>
              {TASKS.map((task, i) => (
                <TooltipStep key={task.id} {...STEPS.TASK_CARD} active={i === 0} placement="auto">
                  <div className={`card ${styles.taskCard}`}>
                    <div className={styles.taskTop}>
                      <div className={styles.taskCheck}>
                        {task.tag === 'Done'
                          ? <span style={{ color: 'var(--green)' }}>✓</span>
                          : <span style={{ color: 'var(--muted2)' }}>○</span>}
                      </div>
                      <div className={styles.taskInfo}>
                        <p className={`${styles.taskTitle} ${task.tag === 'Done' ? styles.taskDone : ''}`}>{task.title}</p>
                        <div className={styles.taskMeta}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: priorityDot[task.priority], display: 'inline-block' }} />
                          <span className={styles.metaText}>{task.priority}</span>
                          <span className={styles.metaDot}>·</span>
                          <span className={styles.metaText}>{task.project}</span>
                          <span className={styles.metaDot}>·</span>
                          <span className={`${styles.metaText} ${task.due === 'Today' ? styles.metaToday : ''}`}>
                            {task.due !== 'Done' ? `📅 ${task.due}` : ''}
                          </span>
                        </div>
                      </div>
                      {task.tag && <span className={`tag ${tagStyle[task.tag]}`}>{task.tag}</span>}
                    </div>
                    {task.progress > 0 && task.progress < 100 && (
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${task.progress}%` }} />
                      </div>
                    )}
                  </div>
                </TooltipStep>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
