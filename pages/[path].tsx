import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { NextApiRequest } from 'next';
import Link from 'next/link';
import styles from '../styles/pages/Path.module.scss';

export async function getServerSideProps(props: NextApiRequest) {
  // get path from router
  const path = props.query.path;
  if (!path || typeof path !== 'string') return { props: {} };

  // get path doc from firebase
  const db = getFirestore();
  const pathDocRef = doc(db, 'paths', path);
  const pathDoc = await getDoc(pathDocRef);

  // get destination url
  const destination = pathDoc.data()?.destination as string;
  if (!destination || typeof destination !== 'string') return { props: {} };
  const url =
    (destination.startsWith('http://') || destination.startsWith('https://')) ?
      destination : `http://${destination}`;

  // return destination redirect
  return {
    redirect: {
      destination: url,
      permanent: false
    }
  };
}

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
