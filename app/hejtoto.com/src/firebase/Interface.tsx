export type Item = {
  // for every cartItem

  timeStamp: string; //generate, einmal für den gesamten checkout
  automatenID: string; //uniqe!! -> Automaten ID
  orderStatus: string; // success, machineError, userCanceled, paymentError

  name: string; // currentProduct.name
  category: string; // currentProduct.category

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

  tee?: Tee[]; // An array of 'Tee' products
  schokoriegel?: Schokoriegel[]; // An array of 'Schokoriegel' products
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

export type Tee = {
  name: string;
  capacity: number;
  pcs: number;
};

export const TeeSorte_A: Tee = {
  name: 'TeeSorte_A',
  capacity: 150,
  pcs: 0,
};

export const TeeSorte_B: Tee = {
  name: 'TeeSorte_C',
  capacity: 150,
  pcs: 0,
};

export const TeeSorte_C: Tee = {
  name: 'TeeSorte_A',
  capacity: 150,
  pcs: 0,
};

// Schokoriegel

export type Schokoriegel = {
  name: string;
  capacity: number;
  pcs: number;
};

export const Schokoriegel_A: Schokoriegel = {
  name: 'Schokoriegel_A',
  capacity: 300,
  pcs: 0,
};

export const Schokoriegel_B: Schokoriegel = {
  name: 'Schokoriegel_B',
  capacity: 300,
  pcs: 0,
};

// Konstanten Automat

export const AutomatVariant_1: Automat = {
  status: 'online',
  lastPing: 'never',

  lastRefillDate: 'never',
  reuseableCup300: 100,
  reuseableLid: 100,
  disposableCup300: 100,
  disposableLid: 100,
  coffeeBeans: 100,
  sugar: 100,
  almondMilk: 100,
  freshWater: 100,
  wasteWater: 100,

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

  tee: [TeeSorte_A, TeeSorte_B, TeeSorte_C],
  schokoriegel: [Schokoriegel_A, Schokoriegel_B],
};
