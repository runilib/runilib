export type FakeCity = {
  id: string;
  label: string;
  value: string;
  country: 'FR' | 'US';
};

export const FAKE_CITIES: FakeCity[] = [
  { id: 'fr-paris', label: 'Paris', value: 'PARIS', country: 'FR' },
  { id: 'fr-paris-1', label: 'Paris 8eme', value: 'PARIS-8eme', country: 'FR' },
  { id: 'fr-paris-2', label: 'Paris 5eme', value: 'PARIS-5eme', country: 'FR' },
  { id: 'fr-lyon', label: 'Lyon', value: 'LYON', country: 'FR' },
  { id: 'fr-marseille', label: 'Marseille', value: 'MARSEILLE', country: 'FR' },
  { id: 'fr-lille', label: 'Lille', value: 'LILLE', country: 'FR' },
  { id: 'fr-bordeaux', label: 'Bordeaux', value: 'BORDEAUX', country: 'FR' },
  { id: 'fr-nantes', label: 'Nantes', value: 'NANTES', country: 'FR' },
  { id: 'fr-toulouse', label: 'Toulouse', value: 'TOULOUSE', country: 'FR' },
  { id: 'fr-nice', label: 'Nice', value: 'NICE', country: 'FR' },

  { id: 'us-new-york', label: 'New York', value: 'NEW_YORK', country: 'US' },
  { id: 'us-los-angeles', label: 'Los Angeles', value: 'LOS_ANGELES', country: 'US' },
  { id: 'us-chicago', label: 'Chicago', value: 'CHICAGO', country: 'US' },
  { id: 'us-houston', label: 'Houston', value: 'HOUSTON', country: 'US' },
  { id: 'us-miami', label: 'Miami', value: 'MIAMI', country: 'US' },
  { id: 'us-seattle', label: 'Seattle', value: 'SEATTLE', country: 'US' },
  { id: 'us-boston', label: 'Boston', value: 'BOSTON', country: 'US' },
  {
    id: 'us-san-francisco',
    label: 'San Francisco',
    value: 'SAN_FRANCISCO',
    country: 'US',
  },
];
