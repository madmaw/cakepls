import {
  ButterCakeBaseType,
  CakeBaseType,
  IcingType,
} from './model';

export const IcingTypes: Record<IcingType, IcingType> = {
  [IcingType.None]: IcingType.None,
  [IcingType.Boiled]: IcingType.Boiled,
  [IcingType.Butterscotch]: IcingType.Butterscotch,
  [IcingType.CreamCheese]: IcingType.CreamCheese,
  [IcingType.Fondant]: IcingType.Fondant,
  [IcingType.Ganache]: IcingType.Ganache,
  [IcingType.Glaze]: IcingType.Glaze,
  [IcingType.Royal]: IcingType.Royal,
  [IcingType.WhippedCream]: IcingType.WhippedCream,
};

export const CakeBaseTypes: Record<CakeBaseType, CakeBaseType> = {
  [CakeBaseType.Butter]: CakeBaseType.Butter,
  [CakeBaseType.Carrot]: CakeBaseType.Carrot,
  [CakeBaseType.Chocolate]: CakeBaseType.Chocolate,
  [CakeBaseType.Coffee]: CakeBaseType.Coffee,
  [CakeBaseType.RedVelvet]: CakeBaseType.RedVelvet,
  [CakeBaseType.Sponge]: CakeBaseType.Sponge,
  [CakeBaseType.White]: CakeBaseType.White,
};

export const ButterCakeBaseSubtypes: Record<ButterCakeBaseType, ButterCakeBaseType> = {
  [ButterCakeBaseType.Chiffon]: ButterCakeBaseType.Chiffon,
  [ButterCakeBaseType.Pound]: ButterCakeBaseType.Pound,
  [ButterCakeBaseType.Yellow]: ButterCakeBaseType.Yellow,
};
