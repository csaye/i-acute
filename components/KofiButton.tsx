import styles from '../styles/components/KofiButton.module.scss';

type Props = {
  text?: string,
  color?: string
};

export default function KofiButton(props: Props) {
  const { text, color } = props;

  return (
    <div className={styles.container}>
      <a
        title="Support me on ko-fi.com"
        className={styles.button}
        style={{ backgroundColor: color ?? '#29abe0' }}
        href="https://ko-fi.com/csaye"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.text}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://storage.ko-fi.com/cdn/cup-border.png"
            alt="Ko-fi donations"
            className={styles.image}
          />
          {text ?? 'Buy Me a Coffee'}
        </span>
      </a>
    </div>
  );
}
