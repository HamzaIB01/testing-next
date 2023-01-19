import { Department, Name, Pagination } from "./user.type";

export interface ReportResult {
  result?: ContentResult;
  code: number;
  message: string;
  // description?: string;
  status: string;
  error?: string;
}

export interface ContentResult {
  content: Content[];
}

export interface Content {
  create_date: string;
  fullname: string;
  name: string;
  email: string;
  department: string;
  count: string;
  params: string;
  request: string;
  type: string;
  file_name: string;
  from: string;
  to: string;
  category: Name;
  download_date: string;
  response: string;
  role: string;
  last_date: string;
  lasted_call_api: string;
}
