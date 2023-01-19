import { Flag, Operation } from "./user.type";

export interface LoginResult {
  result: Member;
  code: number;
  message: string;
  description?: Description;
  status: string;
  error?: string;
}

export interface Member {
  role_id?: number;
  uuid?: string;
  access_token?: string;
  refresh_token?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  email?: string;
  id?: number;
  role_name?: string;
  status?: string;
  image?: string;
}

export interface Description {
  error_code: string;
  message: string;
}

export interface RegisterResult {
  result: string;
  error?: string;
}

export interface CheckRegisterResult {
  result: CheckRegisterStatusResult;
  code: number;
  message: string;
  description?: Description;
  status: string;
  error?: string;
}

export interface CheckRegisterStatusResult {
  uuid: string;
  comment: string;
  flag: Flag;
  operation: Operation;
}
