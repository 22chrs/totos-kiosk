export type TelemetrieProduct = {
  // for every cartItem
  //product: Product;
  productName: string; // currentProduct.name
  productCategory: string; // currentProduct.category

  choosenSize?: string;
  choosenSugar?: string;
  choosenMug?: string;
  choosenLid?: string;
  choosenMilc?: string;
  quantity: number;
  calculatedPrice: number;
  orderStatus: string; // success, machineError, userCanceled, paymentError
  displayNumber: string; //displayContext
  discount: number;

  timeStamp: string; //generate, einmal für den gesamten checkout
  location: string; //uniqe!! -> Automaten ID
};

export const AutomatLeipzig = {
  automatenID: '001',
  reuseableCup300Capacity: 300,
  reuseableLidCapacity: 300,
  disposableCup300Capacity: 300,
  disposableLidCapacity: 300,
  coffeeBeansCapacity: 1000,
  sugarCapacity: 500,
  almondMilkCapacity: 200,
  frischWasserCapacity: 5000,
  abWassserCapacity: 5000,
  productTea1Capacity: 200,
  productTea2Capacity: 200,
  productTea3Capacity: 200,
  productSnack1Capacity: 100,
  productSnack2Capacity: 100,
  productSnack3Capacity: 100,
};

export type AutomatenDatenEvents = {
  automatenID: string;
  status: string; // online, error, offline
  lastPing: string; //generate, einmal für den gesamten checkout
};

export type AutomatenDatenLevels = {
  automatenID: string;
  lastUpdate: string; //generate, einmal für den gesamten checkout

  country: string;
  city: string;
  location: string;
  currency: string;

  // ReCup
  reuseableCup300: number;
  reuseableCup300Capacity: number;
  reuseableLid: number;
  reuseableLidCapacity: number;

  // Einwegbecher
  disposableCup300: number;
  disposableCup300Capacity: number;
  disposableLid: number;
  disposableLidCapacity: number;

  // Kaffeebohnen
  coffeeBeans: number;
  coffeeBeansCapacity: number;

  // Zucker
  sugar: number;
  sugarCapacity: number;

  // Milch
  almondMilk?: number;
  almondMilkCapacity?: number;

  // Wasser
  frischWasser: number;
  frischWasserCapacity: number;
  abWassser: number;
  abWassserCapacity: number;

  // Tee
  productTea1?: number;
  productTea1Capacity?: number;
  productTea2?: number;
  productTea2Capacity?: number;
  productTea3?: number;
  productTea3Capacity?: number;

  // Snacks
  productSnack1?: number;
  productSnack1Capacity?: number;
  productSnack2?: number;
  productSnack2Capacity?: number;
  productSnack3?: number;
  productSnack3Capacity?: number;
};
