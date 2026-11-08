export interface ShopLocation {
  id: string;
  name: string;
  shortName: string;
  address: string;
  postcode: string;
  phone: string;
  mapUrl: string;
  hours: {
    monSat: string;
    sun: string;
  };
  badge: string;
}

export interface ServicePreset {
  id: string;
  name: string;
  price: number;
  duration: string;
  popular?: boolean;
}

export interface BrandConfig {
  id: string;
  name: string;
  displayName: string;
  tagline: string;
  established: string;
  logoUrl: string;
  storefrontUrl: string;
  facebookUrl: string;
  subscription: {
    monthlyPrice: number;
    annualPrice: number;
    annualSavings: number;
    currencySymbol: string;
    cooldownHours: number;
  };
  locations: ShopLocation[];
  services: ServicePreset[];
}

export const KINGS_BRAND: BrandConfig = {
  id: 'kings-hastings',
  name: 'Kings Barbers',
  displayName: 'THE KINGS BARBER',
  tagline: "Hastings' Traditional & Modern Grooming Since 2000",
  established: 'EST. 2000',
  logoUrl: '/assets/kings-crest.png',
  storefrontUrl: '/assets/kings-storefront.png',
  facebookUrl: 'https://www.facebook.com/kings.barber.1/?locale=en_GB',
  subscription: {
    monthlyPrice: 25,
    annualPrice: 250,
    annualSavings: 50,
    currencySymbol: '£',
    cooldownHours: 48,
  },
  locations: [
    {
      id: 'queens-road',
      name: 'Kings Barbers — Queens Road',
      shortName: 'Queens Road',
      address: '85 Queens Road, Hastings',
      postcode: 'TN34 1RL',
      phone: '07716 200888',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=85+Queens+Road+Hastings+TN34+1RL',
      hours: {
        monSat: '9:00 AM – 6:00 PM',
        sun: '10:00 AM – 4:00 PM',
      },
      badge: 'Flagship Shop',
    },
    {
      id: 'silverhill',
      name: 'Kings Barbers — Silverhill',
      shortName: 'Silverhill',
      address: '31 Sedlescombe Rd N, St Leonards-on-Sea',
      postcode: 'TN37 7DA',
      phone: '07716 200888',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=31+Sedlescombe+Rd+N+St+Leonards+on+Sea+TN37+7DA',
      hours: {
        monSat: '9:00 AM – 6:00 PM',
        sun: '10:00 AM – 4:00 PM',
      },
      badge: 'St Leonards',
    },
  ],
  services: [
    { id: 'gent-cut', name: "Gentlemen's Cut", price: 15, duration: '25 min' },
    { id: 'skin-fade', name: 'Skin Fade & Style', price: 18, duration: '35 min', popular: true },
    { id: 'cut-beard', name: 'Cut & Beard Sculpt', price: 23, duration: '45 min', popular: true },
    { id: 'kings-full', name: 'The Full Kings Service', price: 28, duration: '55 min' },
    { id: 'beard-trim', name: 'Beard Trim & Hot Towel', price: 10, duration: '15 min' },
    { id: 'kids-oap', name: 'Under 12s / OAP Cut', price: 12, duration: '20 min' },
  ],
};
