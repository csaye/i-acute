import { useState } from 'react';
import styles from '../styles/pages/Index.module.scss';

export default function Index() {
  const [destination, setDestination] = useState('');
  const [shortUrl, setShortUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <div className={styles.head}>
          <h1>í.is</h1>
          <p>Taking URL shortening to the next level.</p>
        </div>
        <div className={styles.content}>
          {
            loading ?
              <p><i>generating...</i></p> :
              shortUrl ?
                <a
                  href={`https://${shortUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {shortUrl}
                </a> :
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    shortenUrl();
                  }}
                >
                  <input
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    placeholder="http://example.com"
                    required
                  />
                  <button>
                    Shorten
                  </button>
                </form>
          }
        </div>
      </div>
    </div>
  );
}
