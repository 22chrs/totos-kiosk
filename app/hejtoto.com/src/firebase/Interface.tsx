export type Item = {
  // for every cartItem

  timeStampOrder: string; //generate, einmal für den gesamten checkout
  automatenID: string; //uniqe!! -> Automaten ID
  orderStatus: string; // success, machineError, userCanceled, paymentError

  productName: string; // currentProduct.name
  categoryName: string; // currentProduct.category

  choosenSize?: string;
  choosenSugar?: string;
  choosenMug?: string;
  choosenLid?: string;
  choosenMilc?: string;
  calculatedPrice: number;

  displayNumber: string; //displayContext
  discount: number;

  quantity: number;
};

export type Automat = {
  status: string; // online, error, offline
  lastPing: string; //generate, einmal für den gesamten checkout

  lastRefillDate: string;
  reuseableCup300: number;
  reuseableLid: number;
  disposableCup300: number;
  disposableLid: number;
  coffeeBeans: number;
  sugar: number;
  almondMilk?: number;
  freshWater: number;
  wasteWater: number;

  AutomatConstants: AutomatConstants;

  tee?: Record<string, Product>;
  schokoriegel?: Record<string, Product>;
};

// Konstanten Automat
export type AutomatConstants = {
  automatenID: string;

  country: string;
  city: string;
  location: string;
  currency: string;

  reuseableCup300Capacity: number;
  reuseableLidCapacity: number;
  disposableCup300Capacity: number;
  disposableLidCapacity: number;
  coffeeBeansCapacity: number;
  sugarCapacity: number;
  almondMilkCapacity?: number;
  freshWaterCapacity: number;
  wasteWaterCapacity: number;
};

/// PRODUKTE ///

// Tee

export type Product = {
  capacity: number;
  pcs: number;
};

export const refillAutomat = (automat: Automat): Automat => {
  // refill basic elements
  const refillBasicElements = {
    ...automat,
    lastRefillDate: 'updated in function',
    reuseableCup300: automat.AutomatConstants.reuseableCup300Capacity,
    reuseableLid: automat.AutomatConstants.reuseableLidCapacity,
    disposableCup300: automat.AutomatConstants.disposableCup300Capacity,
    disposableLid: automat.AutomatConstants.disposableLidCapacity,
    coffeeBeans: automat.AutomatConstants.coffeeBeansCapacity,
    sugar: automat.AutomatConstants.sugarCapacity,
    almondMilk: automat.AutomatConstants.almondMilkCapacity,
    freshWater: automat.AutomatConstants.freshWaterCapacity,
    wasteWater: automat.AutomatConstants.wasteWaterCapacity,
  };

  // refill 'tee' products
  const refilledTee = Object.fromEntries(
    Object.entries(refillBasicElements.tee || {}).map(([name, product]) => [
      name,
      { ...product, pcs: product.capacity },
    ])
  );

  // refill 'schokoriegel' products
  const refilledSchokoriegel = Object.fromEntries(
    Object.entries(refillBasicElements.schokoriegel || {}).map(
      ([name, product]) => [name, { ...product, pcs: product.capacity }]
    )
  );

  return {
    ...refillBasicElements,
    tee: refilledTee,
    schokoriegel: refilledSchokoriegel,
  };
};

// Konstanten Automat
export const AutomatVariant_1: Automat = {
  status: 'online',
  lastPing: 'never',

  lastRefillDate: 'never',
  reuseableCup300: 0,
  reuseableLid: 0,
  disposableCup300: 0,
  disposableLid: 0,
  coffeeBeans: 0,
  sugar: 0,
  almondMilk: 0,
  freshWater: 0,
  wasteWater: 0,

  AutomatConstants: {
    automatenID: '001',

    country: 'de-DE',
    city: 'Leipzig',
    location: 'Leipzig, Werkstatt',
    currency: 'EUR',

    reuseableCup300Capacity: 100,
    reuseableLidCapacity: 100,
    disposableCup300Capacity: 100,
    disposableLidCapacity: 100,
    coffeeBeansCapacity: 100,
    sugarCapacity: 100,
    almondMilkCapacity: 100,
    freshWaterCapacity: 100,
    wasteWaterCapacity: 100,
  },

  tee: {
    TeeSorte_A: { capacity: 150, pcs: 0 },
    TeeSorte_B: { capacity: 150, pcs: 0 },
    TeeSorte_C: { capacity: 150, pcs: 0 },
  },

  schokoriegel: {
    Schokoriegel_A: { capacity: 300, pcs: 0 },
    Schokoriegel_B: { capacity: 300, pcs: 0 },
  },
};
