import { useMemo } from 'react';
import countries from '../data/countries.json';

export default function useCountries() {
  const list = countries;

  const byCode = useMemo(() => {
    return list.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }, [list]);

  return {
    countries: list,
    byCode,
  };
}
