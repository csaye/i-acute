import Link from 'next/link';
import styles from '../styles/pages/Path.module.scss';

export default function Path() {
  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1>Link not found</h1>
        <Link href="/">
          <a>return to homepage</a>
        </Link>
      </div>
    </div>
  );
}
