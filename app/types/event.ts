export type EventType =
  | "competition"
  | "womens"
  | "kids"
  | "open-mat"
  | "seminar";

export type SwissCanton =
  | "ZH"
  | "BE"
  | "LU"
  | "UR"
  | "SZ"
  | "OW"
  | "NW"
  | "GL"
  | "ZG"
  | "FR"
  | "SO"
  | "BS"
  | "BL"
  | "SH"
  | "AR"
  | "AI"
  | "SG"
  | "GR"
  | "AG"
  | "TG"
  | "TI"
  | "VD"
  | "VS"
  | "NE"
  | "GE"
  | "JU";

export interface Event {
  id: string;
  name: string;
  organizer: string;
  organizerUrl?: string;
  registerUntil: string;
  eventLink: string;
  logoUrl: string;
  canton: string;
  address: string;
  type: EventType;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  competition: "bg-red-100 text-red-800",
  "open-mat": "bg-green-100 text-green-800",
  womens: "bg-pink-100 text-pink-800",
  seminar: "bg-cyan-100 text-cyan-800",
  kids: "bg-amber-100 text-amber-500",
};

export const SWISS_CANTON_NAMES: Record<SwissCanton, string> = {
  ZH: "Zürich",
  BE: "Bern",
  LU: "Luzern",
  UR: "Uri",
  SZ: "Schwyz",
  OW: "Obwalden",
  NW: "Nidwalden",
  GL: "Glarus",
  ZG: "Zug",
  FR: "Fribourg",
  SO: "Solothurn",
  BS: "Basel-Stadt",
  BL: "Basel-Landschaft",
  SH: "Schaffhausen",
  AR: "Appenzell Ausserrhoden",
  AI: "Appenzell Innerrhoden",
  SG: "St. Gallen",
  GR: "Graubünden",
  AG: "Aargau",
  TG: "Thurgau",
  TI: "Ticino",
  VD: "Vaud",
  VS: "Valais",
  NE: "Neuchâtel",
  GE: "Geneva",
  JU: "Jura",
};
