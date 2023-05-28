// utils.ts

import shopData from '@/public/kiosk/products/leipzig.json';

// utils.ts
export type FormatPriceProps = {
  amount: number;
  country?: string;
  currency?: string;
};

export const formatPrice = ({
  amount,
  country = shopData.country,
  currency = shopData.currency,
}: FormatPriceProps) =>
  new Intl.NumberFormat(country, { style: 'currency', currency }).format(
    amount
  );

export function handleUmlauts(str) {
  var map = {
    ä: 'ae',
    ö: 'oe',
    ü: 'ue',
    Ä: 'Ae',
    Ö: 'Oe',
    Ü: 'Ue',
    ß: 'ss',
  };

  return str.replace(/[äöüÄÖÜß]/g, function (key) {
    return map[key];
  });
}
