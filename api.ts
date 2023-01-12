import DATA from "./db/data.json";
import { Flight, Trip } from "./types";

// a and b are javascript Date objects
function dateDiffInDays(a: Date, b: Date) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

const api = {
  trips: {
    list: async (origin: Flight["origin"]): Promise<Trip[]> => {
      const [origins, destinations] = DATA.filter(
        (flight: Flight) => new Date(flight.date) > new Date(),
      ).reduce<[Flight[], Flight[]]>(
        ([origins, destinations], flight: Flight) => {
          if (flight.origin == origin) {
            origins.push(flight);
          }
          if (flight.destination == origin) {
            destinations.push(flight);
          }

          return [origins, destinations];
        },
        [[], []],
      );

      const trips: Trip[] = [];

      for (let o of origins) {
        for (let d of destinations) {
          const oDate = new Date(o.date);
          const dDate = new Date(d.date);
          const days = dateDiffInDays(oDate, dDate);
          const price = Math.ceil(o.price + d.price);

          if (dDate > oDate) {
            trips.push({
              id: String(Date.now()),
              origin: o,
              destination: d,
              availability: Math.min(o.availability, d.availability),
              price,
              days,
              ratio: price / days,
            });
          }
        }
      }

      console.log(trips);

      return trips;
    },
  },
  origin: {
    list: async (): Promise<Flight["origin"][]> => {
      const origins = new Set<Flight["origin"]>();

      for (let flight of DATA) {
        origins.add(flight.origin);
      }

      return Array.from(origins);
    },
  },
};

export default api;
