import { CountryCode } from "./interfaces";

export const isoCodeToName: { [code in CountryCode]: string } = {
  nl: "Netherlands",
  it: "Italy",
  ru: "Russia",
  ch: "Switzerland",
  se: "Sweden",
  no: "Norway",
  mk: "North Macedonia",
  az: "Azerbaijan",
  au: "Australia",
  is: "Iceland",
  cz: "Czech Republic",
  dk: "Denmark",
  cy: "Cyprus",
  mt: "Malta",
  si: "Slovenia",
  fr: "France",
  al: "Albania",
  rs: "Serbia",
  sm: "San Marino",
  ee: "Estonia",
  gr: "Greece",
  es: "Spain",
  il: "Israel",
  by: "Belarus",
  de: "Germany",
  gb: "United Kingdom"
};

export const countriesList: Array<{ name: string; isoCode: CountryCode }> = [
  {
    isoCode: "nl",
    name: "Netherlands"
  },
  {
    isoCode: "it",
    name: "Italy"
  },
  {
    isoCode: "ru",
    name: "Russia"
  },
  {
    isoCode: "ch",
    name: "Switzerland"
  },
  {
    isoCode: "se",
    name: "Sweden"
  },
  {
    isoCode: "no",
    name: "Norway"
  },
  {
    isoCode: "mk",
    name: "North Macedonia"
  },
  {
    isoCode: "az",
    name: "Azerbaijan"
  },
  {
    isoCode: "au",
    name: "Australia"
  },
  {
    isoCode: "is",
    name: "Iceland"
  },
  {
    isoCode: "cz",
    name: "Czech Republic"
  },
  {
    isoCode: "dk",
    name: "Denmark"
  },
  {
    isoCode: "cy",
    name: "Cyprus"
  },
  {
    isoCode: "mt",
    name: "Malta"
  },
  {
    isoCode: "si",
    name: "Slovenia"
  },
  {
    isoCode: "fr",
    name: "France"
  },
  {
    isoCode: "al",
    name: "Albania"
  },
  {
    isoCode: "rs",
    name: "Serbia"
  },
  {
    isoCode: "sm",
    name: "San Marino"
  },
  {
    isoCode: "ee",
    name: "Estonia"
  },
  {
    isoCode: "gr",
    name: "Greece"
  },
  {
    isoCode: "es",
    name: "Spain"
  },
  {
    isoCode: "il",
    name: "Israel"
  },
  {
    isoCode: "by",
    name: "Belarus"
  },
  {
    isoCode: "de",
    name: "Germany"
  },
  {
    isoCode: "gb",
    name: "United Kingdom"
  }
];
