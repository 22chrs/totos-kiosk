export type Automat = {
  status: string; // online, error, offline
  lastPing: string; //generate, einmal für den gesamten checkout
  error: string; // error message
  lastRefillDate: string;
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

// Konstanten Automat
export const AutomatVariant_1 = (automatenID: string): Automat => {
  return {
    status: 'online',
    lastPing: 'never',
    error: 'never connected',
    lastRefillDate: 'never',

    AutomatConstants: {
      automatenID: automatenID, // const automatenID = shopData.automatenID;
      country: 'de-DE',
      city: 'Leipzig',
      location: 'Leipzig, Werkstatt',
      currency: 'EUR',
    },

    Verpackungen: {
      disposableCup: {
        displayName: 'Einwegbecher',
        capacity: 400,
        current: 0,
        size: '300 ml',
        unit: 'Stück',
      },
      disposableLid: {
        displayName: 'Einwegdeckel',
        capacity: 400,
        current: 0,
        unit: 'Stück',
      },
      reusableCup: {
        displayName: 'Mehrwegbecher (300ml)',
        capacity: 400,
        current: 0,
        size: '300 ml',
        unit: 'Stück',
      },
      reusableLid: {
        displayName: 'Mehrwegdeckel',
        capacity: 400,
        current: 0,
        unit: 'Stück',
      },
    },

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

    Tee: {
      TeeSorte_A: {
        displayName: 'TeeSorte A',
        capacity: 150,
        current: 0,
        unit: 'Stück',
      },
      TeeSorte_B: {
        displayName: 'TeeSorte B',
        capacity: 150,
        current: 0,
        unit: 'Stück',
      },
      TeeSorte_C: {
        displayName: 'TeeSorte C',
        capacity: 150,
        current: 0,
        unit: 'Stück',
      },
    },

    Schokoriegel: {
      Schokoriegel_A: {
        displayName: 'Schokoriegel A',
        capacity: 300,
        current: 0,
        unit: 'Stück',
      },
      Schokoriegel_B: {
        displayName: 'Schokoriegel B',
        capacity: 300,
        current: 0,
        unit: 'Stück',
      },
    },
  };
};
