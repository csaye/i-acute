import { CircularProgress } from '@mui/material';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import KofiButton from '../components/KofiButton';
import styles from '../styles/pages/Index.module.scss';

export default function Index() {
  const [destination, setDestination] = useState('');
  const [source, setSource] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [clipboardText, setClipboardText] = useState('Copy to clipboard');
  const [reduction, setReduction] = useState<number>();

  const destinationRef = useRef<HTMLParagraphElement>(null);
  const sourceRef = useRef<HTMLParagraphElement>(null);

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
    setSource(`í.is/${path}`);
    setLoading(false);
  }

  // copies current short url to clipboard
  async function copyToClipboard() {
    await navigator.clipboard.writeText(`https://${source}`);
    setClipboardText('Copied');
    setTimeout(() => setClipboardText('Copy to clipboard'), 2000);
  }

  // resets state to default
  function reset() {
    setDestination('');
    setSource(undefined);
  }

  // calculate text widths
  useEffect(() => {
    if (!destinationRef.current || !sourceRef.current) return;
    // get source width
    const sourceWidth = sourceRef.current.clientWidth;
    if (!sourceWidth) return;
    // get destination width
    const destinationWidth = destinationRef.current.clientWidth;
    if (!destinationWidth) return;
    // calculate width reduction
    const difference = 1 - (sourceWidth / destinationWidth);
    setReduction(Math.round(difference * 100));
  }, [destination, source]);

  return (
    <div className={styles.container}>
      <p className={styles.about}>
        <a
          href="https://www.coop.codes/i-acute"
          target="_blank"
          rel="noopener noreferrer"
        >
          About í.is
        </a>
      </p>
      <div className={styles.kofiButton}>
        <KofiButton />
      </div>
      <p className={styles.measure} ref={destinationRef}>
        {destination}
      </p>
      <p className={styles.measure} ref={sourceRef}>
        {source}
      </p>
      <div className={styles.center}>
        <div className={styles.head}>
          <h1>í.is</h1>
          {
            (!source && !loading) &&
            <>
              <p>A literal URL shortener.</p>
              <p>Shorten URLs by length <b>and</b> width.</p>
              <div className={styles.examples}>
                <span style={{ color: 'red' }}>✘ bit.ly/3c5Op1H</span>
                <span style={{ color: 'green' }}><b>✓</b> í.is/ÏIįÎ</span>
              </div>
            </>
          }
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
                    placeholder="example.com"
                    required
                  />
                  <button className="blueButton">
                    Shorten
                  </button>
                </form>
          }
        </div>
      </div>
    </div>
  );
}
