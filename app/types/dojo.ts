import { SwissCanton } from "./event";

export interface Dojo {
  id: string;
  name: string;
  website: string;
  instagram: string;
  logo: string;
  address: string;
  zip_code: string;
  kanton: SwissCanton;
  is_womans: boolean;
  is_kids: boolean;
  is_advanced: boolean;
  is_open_mat: boolean;
  trial: string;
  free_guest: boolean;
  extra: string[];
}

// Define colors for different dojo features (similar to event types)
export const DOJO_FEATURE_COLORS = {
  womans: "bg-pink-100 text-pink-800",
  kids: "bg-amber-100 text-amber-500",
  advanced: "bg-blue-100 text-blue-800",
  open_mat: "bg-green-100 text-green-800",
  free_guest: "bg-purple-100 text-purple-800",
};
