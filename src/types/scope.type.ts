import { Description, Flag, Name, Operation, Shortname } from "./user.type";

export interface GetScopeResult {
  result?: ScopeResult[];
  code: number;
  message: string;
  // description?: string;
  status: string;
  error?: string;
}

export interface ScopeResult {
  id: number;
  code: string;
  short_name?: Shortname;
  name: Name;
  ref_id: number;
  file: String;
  color_hex_value: String;

  flag: Flag;
  operation: Operation;
  description?: Description;
  sub_scopes?: ScopeResult[];
}
