import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import styles from '../styles/pages/Index.module.scss';

export default function Index() {
  const [destination, setDestination] = useState('');
  const [shortUrl, setShortUrl] = useState<string>();
  const [loading, setLoading] = useState(false);

  const db = getFirestore();

  // returns a random doc path
  function getRandomPath() {
    const chars = 'ijlîïíīįìIÎÏÍĪĮÌ';
    let path = '';
    for (let i = 0; i < 4; i++) {
      // add a random char to the path
      const index = Math.floor(Math.random() * chars.length);
      path += chars[index];
    }
    return path;
  }

  // creates a new shortened url
  async function shortenUrl() {
    // start loading
    setLoading(true);
    let err = true;
    let path;
    do {
      // get random doc path
      path = getRandomPath();
      const pathDocRef = doc(db, 'paths', path);
      const created = new Date().getTime();
      try {
        // try creating doc
        await setDoc(pathDocRef, { destination, created });
        err = false;
      } catch (e: any) {
        if (e.code !== 'permission-denied') throw e;
      }
    } while (err); // continue while doc path taken
    // set url
    setShortUrl(`í.is/${path}`);
    setLoading(false);
  }

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
              <CircularProgress sx={{ color: '#2196f3' }} /> :
              source ?
                <div className={styles.result}>
                  <p>
                    <span style={{ color: 'red' }}>{destination}</span>
                    {' '}→{' '}
                    <a
                      href={`https://${source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'green' }}
                    >
                      {source}
                    </a>
                  </p>
                  <p>URL length decreased by <b>{reduction}%</b>.</p>
                  <button
                    className="blueButton"
                    onClick={copyToClipboard}
                  >
                    {clipboardText}
                  </button>
                  <p
                    className={styles.reset}
                    onClick={reset}
                  >
                    shorten another →
                  </p>
                </div> :
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
