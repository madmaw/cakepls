import type { IntRange } from 'base/types';

export const MinServes = 1;
export const MaxServes = 12;
export type Serves = IntRange<typeof MinServes, typeof MaxServes>;

export enum CakeBaseType {
  Butter,
  Carrot,
  Chocolate,
  Coffee,
  RedVelvet,
  Sponge,
  White,
}

export enum ChocolateCakeBaseType {
  Traditional,
  German,
  DevilsFood,
}

export enum ButterCakeBaseType {
  Yellow,
  Pound,
  Chiffon,
}

export enum CarrotCakeBaseType {
  Traditional,
  Spice,
  Hummingbird,
}

export enum WhiteCakeBaseType {
  Traditional,
  Vanilla,
}

export enum SpongeCakeBaseType {
  Traditional,
  Genoise,
}

export type CakeBase = {
  readonly type: Exclude<
    CakeBaseType,
    | CakeBaseType.Butter
    | CakeBaseType.Carrot
    | CakeBaseType.Chocolate
    | CakeBaseType.White
    | CakeBaseType.Sponge
  >,
} | {
  readonly type: CakeBaseType.Chocolate,
  readonly subtype: ChocolateCakeBaseType,
} | {
  readonly type: CakeBaseType.Butter,
  readonly subtype: ButterCakeBaseType,
} | {
  readonly type: CakeBaseType.Carrot,
  readonly subtype: CarrotCakeBaseType,
} | {
  readonly type: CakeBaseType.White,
  readonly subtype: WhiteCakeBaseType,
} | {
  readonly type: CakeBaseType.Sponge,
  readonly subtype: SpongeCakeBaseType,
};

export enum IcingType {
  Boiled,
  Butterscotch,
  CreamCheese,
  Fondant,
  Ganache,
  Glaze,
  Royal,
  WhippedCream,
}

export type Icing = {
  readonly type: IcingType,
};

export enum AdditionalIngredientType {
  ChocolateChips,
  Marshmallows,
  Nuts,
}

export type AdditionalIngredient = {
  readonly type: AdditionalIngredientType,
};

export enum ToppingType {
  CandiedFruit,
  Candy,
}

export type Topping = {
  readonly type: ToppingType,
};

export enum DecorationType {
  Candle,
}

export type Decoration = {
  readonly type: DecorationType,
};

export type Cake = {
  readonly serves: Serves,
  readonly base: CakeBase,
  readonly icing: Icing,
  readonly additionalIngredients: readonly AdditionalIngredient[],
  readonly toppings: readonly Topping[],
  readonly decorations: readonly Decoration[],
};
