// utils.ts

import shopData from '@/public/kiosk/products/leipzig.json';

// utils.ts
export type FormatPriceProps = {
  amount: number;
  country?: string;
  currency?: string;
  showDecimals?: boolean;
};

export const formatPrice = ({
  amount,
  country = shopData.country,
  currency = shopData.currency,
  showDecimals = true,
}: FormatPriceProps) => {
  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  };

  return new Intl.NumberFormat(country, options).format(amount);
};

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
