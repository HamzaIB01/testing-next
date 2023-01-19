import {
  Department,
  Description,
  Flag,
  Name,
  Operation,
  Pagination,
  SubInterval,
} from "./user.type";

export interface ApiKeyResult {
  code: string;
  error: string;
  message: string;
  timestamp: string;
  resultAll: AllApiKeyResult[];
  result: AllApiKeyResult;
}

export interface AllApiKeyResult {
  uuid: string;
  name: string;
  expired_date: string;
  token: string;
  flag: Flag;
  operation: Operation;
}
