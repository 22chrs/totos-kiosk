import shopData from '@/public/kiosk/products/leipzig.json';
const teeCategory = shopData.categories.find(
  (category) => category.name === 'Tee'
);

export type Automat = {
  status: string; // online, error, offline
  lastPing: string; //generate, einmal für den gesamten checkout
  error: string; // error message
  lastRefillDate: string;
  lastOrderDate: string;
  lastValidOrder?: string;

  AutomatConstants: AutomatConstants;

  Wasser: Record<string, ProductCategory>;
  Verpackungen: Record<string, ProductCategory>;
  Kaffee: Record<string, ProductCategory>;
  Milch?: Record<string, ProductCategory>;
  Additive?: Record<string, ProductCategory>;
  Tee?: Record<string, ProductCategory>;
  Schokoriegel?: Record<string, ProductCategory>;
};

// Konstanten Automat
export type AutomatConstants = {
  automatenID: string;
  country: string;
  city: string;
  location: string;
  currency: string;
};

/// PRODUKTE ///

// Tee

export type ProductCategory = {
  displayName: string;
  capacity: number;
  current: number;
  unit: string;
  size?: string;
};

export const refillAutomat = (automat: Automat): Automat => {
  // refill basic elements
  const refillBasicElements = {
    ...automat,
    lastRefillDate: 'updated in function',
  };

  function refillProducts(
    productName: keyof Automat
  ): Record<string, ProductCategory> {
    return Object.fromEntries(
      Object.entries(refillBasicElements[productName] || {}).map(
        ([name, productCategory]) => [
          name,
          {
            ...(productCategory as ProductCategory),
            current: (productCategory as ProductCategory).capacity,
          },
        ]
      )
    );
  }

  return {
    ...refillBasicElements,
    Verpackungen: refillProducts('Verpackungen'),
    Tee: refillProducts('Tee'),
    Schokoriegel: refillProducts('Schokoriegel'),
    Wasser: refillProducts('Wasser'),
    Additive: refillProducts('Additive'),
    Milch: refillProducts('Milch'),
    Kaffee: refillProducts('Kaffee'),
  };
};

function getAutomatConstantsFromJson(data: any): AutomatConstants {
  return {
    automatenID: data.automatenID,
    country: data.country,
    city: data.location.split(',')[0].trim(),
    location: data.location,
    currency: data.currency,
  };
}

function getProductCategoryFromJson(
  product: string
): Record<string, Record<string, ProductCategory>> {
  const productCategory = shopData.categories.find(
    (category) => category.name === product
  );

  if (!productCategory) {
    return {};
  }

  return {
    [product]: Object.fromEntries(
      productCategory.products.map((product) => [
        `${product.id}`,
        {
          displayName: product.name,
          capacity: product.capacity, // use capacity from JSON
          current: 0, // replace with actual data if available
          unit: productCategory.unit, // replace with actual data if available
        },
      ])
    ),
  };
}

function getVerpackungenFromJson(data: any): Record<string, ProductCategory> {
  const stockData = data.stock[0];
  const verpackungen: Record<string, ProductCategory> = {};

  // Map mugs
  const mugTypes = ['disposableMugs', 'reusableMugs'];
  mugTypes.forEach((mugType) => {
    stockData[mugType].forEach((mug: any) => {
      verpackungen[`${mugType}_${mug.size.replace(' ', '')}`] = {
        displayName: mug.displayName,
        capacity: mug.capacity,
        current: 0,
        unit: 'Stück',
        size: mug.size,
      };
    });
  });

  // Map lids
  const lidTypes = ['disposableLids', 'reusableLids'];
  lidTypes.forEach((lidType) => {
    stockData[lidType].forEach((lid: any) => {
      verpackungen[`${lidType}_${lid.size}`] = {
        displayName: lid.displayName,
        capacity: lid.capacity,
        current: 0,
        unit: 'Stück',
        size: lid.size,
      };
    });
  });

  return verpackungen;
}

// Konstanten Automat
export const AutomatVariant_1 = (): Automat => {
  return {
    status: 'online',
    lastPing: 'never',
    error: 'never connected',
    lastRefillDate: 'never',
    lastOrderDate: 'never',

    AutomatConstants: getAutomatConstantsFromJson(shopData),
    Verpackungen: getVerpackungenFromJson(shopData),
    ...getProductCategoryFromJson('Tee'),
    ...getProductCategoryFromJson('Schokoriegel'),

    Additive: getVerpackungenFromJson(shopData),

    Kaffee: {
      Bohnen: {
        displayName: 'Kaffeebohnen',
        capacity: 100,
        current: 0,
        unit: 'Kilogramm',
      },
      Trester: {
        displayName: 'Kaffee Trester',
        capacity: 100,
        current: 0,
        unit: 'Kilogramm',
      },
    },

    Wasser: {
      Frischwasser: {
        displayName: 'Frischwasser',
        capacity: 100,
        current: 0,
        unit: 'Liter',
      },
      Abwasser: {
        displayName: 'Abwasser',
        capacity: 100,
        current: 0,
        unit: 'Liter',
      },
    },

    Milch: {
      Mandelmilch: {
        displayName: 'Mandelmilch',
        capacity: 100,
        current: 0,
        unit: 'Liter',
      },
    },

    Additive: {
      Zucker: {
        displayName: 'Zucker',
        capacity: 2000,
        current: 0,
        unit: 'Gramm',
      },
    },
  };
};
