import { Inter } from "@next/font/google";
import Link from "next/link";
import { GetStaticProps, NextPage } from "next";

import styles from "../styles/Home.module.css";
import { Flight } from "../types";
import api from "../api";

const inter = Inter({ subsets: ["latin"] });

const Home: NextPage<Props> = ({ origins }) => {
  return (
    <div className={styles.grid}>
      {origins.map((origin, idx) => (
        <Link key={idx} className={styles.card} href={`/${encodeURI(origin)}`}>
          <h2>{origin} &rarr;</h2>
        </Link>
      ))}
    </div>
  );
};

export default Home;

type Props = {
  origins: Flight["origin"][];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const origins = await api.origin.list();

  return {
    props: {
      origins,
    },
  };
};
