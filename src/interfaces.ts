export type CountryCode =
    | "nl"
    | "it"
    | "ru"
    | "ch"
    | "se"
    | "no"
    | "mk"
    | "az"
    | "au"
    | "is"
    | "cz"
    | "dk"
    | "cy"
    | "mt"
    | "si"
    | "fr"
    | "al"
    | "rs"
    | "sm"
    | "ee"
    | "gr"
    | "es"
    | "il"
    | "by"
    | "de"
    | "gb";

export type Group = [["receiving", CountryCode], ["giving", CountryCode]];

export interface IDateEntry {
    group: Group;
    value: number;
    valueType: "number";
}
