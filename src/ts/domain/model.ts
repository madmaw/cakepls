import type { IntRange } from 'base/types';

export const MinServes = 1;
export const MaxServes = 12;
export type Serves = IntRange<typeof MinServes, typeof MaxServes>;

export const enum CakeBaseType {
  Butter,
  Carrot,
  Chocolate,
  Coffee,
  RedVelvet,
  Sponge,
  White,
}

export const enum ChocolateCakeBaseType {
  Traditional,
  German,
  DevilsFood,
}

export const enum ButterCakeBaseType {
  Yellow,
  Pound,
  Chiffon,
}

export const enum CarrotCakeBaseType {
  Traditional,
  Spice,
  Hummingbird,
}

export const enum WhiteCakeBaseType {
  Traditional,
  Vanilla,
}

export const enum SpongeCakeBaseType {
  Traditional,
  Genoise,
}

export type CakeBase = {
  readonly type: Exclude<
    CakeBaseType,
    | CakeBaseType.Butter
    | CakeBaseType.Carrot
    | CakeBaseType.Chocolate
    | CakeBaseType.Sponge
    | CakeBaseType.White
  >,
} | {
  readonly type: CakeBaseType.Butter,
  readonly subtype: ButterCakeBaseType,
} | {
  readonly type: CakeBaseType.Carrot,
  readonly subtype: CarrotCakeBaseType,
} | {
  readonly type: CakeBaseType.Chocolate,
  readonly subtype: ChocolateCakeBaseType,
} | {
  readonly type: CakeBaseType.Sponge,
  readonly subtype: SpongeCakeBaseType,
} | {
  readonly type: CakeBaseType.White,
  readonly subtype: WhiteCakeBaseType,
};

export const enum IcingType {
  None = 0,
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

export const enum AdditionalIngredientType {
  ChocolateChips,
  Marshmallows,
  Nuts,
}

export type AdditionalIngredient = {
  readonly type: AdditionalIngredientType,
};

export const enum ToppingType {
  CandiedFruit,
  Candy,
}

export type Topping = {
  readonly type: ToppingType,
};

export const enum DecorationType {
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
