import { ParsedUrlQuery } from "querystring";

import React from "react";
import { GetStaticProps } from "next";

import styles from "../styles/Home.module.css";
import { Flight, Trip } from "../types";
import api from "../api";

type Props = {
  trips: Trip[];
};

type Params = ParsedUrlQuery & {
  origin: Flight["origin"];
};

export default function OriginPage({ trips }: Props) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Destino</th>
          <th>Dias</th>
          <th>Precio</th>
        </tr>
      </thead>
      <tbody>
        {trips.map((t) => (
          <tr key={t.id}>
            <td>{t.destination.destination}</td>
            <td>{t.days}</td>
            <td>
              {t.price.toLocaleString("es-UY", {
                style: "currency",
                currency: "UYU",
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const getStaticPaths = async () => {
  const origins = await api.origin.list();
  const paths = origins.map((o) => ({ params: { origin: o } }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
  const trips = await api.trips.list(params!.origin);

  const orderedTrips = trips.sort((a, b) => a.ratio - b.ratio);

  return {
    props: {
      trips: orderedTrips.slice(0, 100),
    },
  };
};
