import { Department, Pagination } from "./user.type";

export interface GetRoleResult {
  result?: RoleResult;
  code: number;
  message: string;
  // description?: string;
  status: string;
  error?: string;
}

export interface RoleResult {
  pagination: Pagination;
  content: Department[];
}

export interface GetRoleIdResult {
  result?: Department;
  code: number;
  message: string;
  // description?: string;
  status: string;
  error?: string;
}
