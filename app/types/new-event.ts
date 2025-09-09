export type NewEventType =
  | "competition"
  | "womens"
  | "kids"
  | "open-mat"
  | "seminar"
  | "camp";

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

export interface NewEvent {
  id?: number;
  name: string;
  event_img?: string;
  organizer_dojo?: number;
  organizer: string;
  registeruntil: string;
  eventlink: string;
  canton: string;
  address: string;
  type: NewEventType;
  startdate: string;
  enddate: string;
  starttime: string;
  endtime: string;
  organizerurl?: string;
  guest_link?: string;
  guest_name?: string;
  created_at?: string;
}

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
