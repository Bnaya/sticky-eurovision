// export type CountryCode =
//   | "nl"
//   | "it"
//   | "ru"
//   | "ch"
//   | "se"
//   | "no"
//   | "mk"
//   | "az"
//   | "au"
//   | "is"
//   | "cz"
//   | "dk"
//   | "cy"
//   | "mt"
//   | "si"
//   | "fr"
//   | "al"
//   | "rs"
//   | "sm"
//   | "ee"
//   | "gr"
//   | "es"
//   | "il"
//   | "by"
//   | "de"
//   | "gb";

export type CountryCode = string;

export type Group = [["receiving", CountryCode], ["giving", CountryCode]];

export interface IDateEntry {
  group: Group;
  value: number;
  valueType: "number";
}

/**
 * [x, y, columnsCount, rowsCount]
 */
export type IPointTuple = [number, number, number, number];

export interface IPointObject {
  x: number;
  y: number;
  columnsCount: number;
  rowsCount: number;
}

export interface IPointObjectInGlobalSpace extends IPointObject {
  space: "global";
}

export interface IPointObjectInDataSpace extends IPointObject {
  space: "data";
}
