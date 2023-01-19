import { Department, Name, Pagination } from "./user.type";

export interface WaterReportResult {
  result?: ContentWaterReportResult;
  code: number;
  message: string;
  // description?: string;
  status: string;
  error?: string;
}

export interface ContentWaterReportResult {
  pagination: Pagination;
  content: WaterReportContent[];
}

export interface WaterReportContent {
  category: string;
  value: string;
  date: string;
  interval: Name;
  create_date: string;
  fullname: string;
  timestamp: string;
  name: string;
  email: string;
  role: string;
  department: Name;
  module: string;
  activity: string;
  params: string;
  request: string;
  type: string;
  file_name: string;
  from: string;
  to: string;
  download_date: string;
  response: string;
  last_date: string;
  lasted_call_api: string;
  year: number;
  month: number;
  count: string;
  created_by: string;
  created_date: string;
  http_code: string;
  http_request: string;
  log_parameter: string;
  log_response: string;
  log_route: string;
  uuid: string;
}

export interface WaterReliableReportResult {
  result?: ContentWaterReliableReportResult;
  code: number;
  message: string;
  // description?: string;
  status: string;
  error?: string;
}

export interface ContentWaterReliableReportResult {
  pagination: Pagination;
  content: WaterReportReliableContent[];
}

export interface WaterReportReliableContent {
  category: Name;
  value: number;
  date: string;
  interval: any;
  create_date: string;
  fullname: string;
  timestamp: string;
  name: string;
  email: string;
  role: string;
  department: Name;
  import_name: Name;
  missing: string;
  success: string;
  total: string;
  import_file: string;
  time_start: string;
  time_end: string;
  time_totle: string;
  module: string;
  activity: string;
  params: string;
  request: string;
  type: string;
  file_name: string;
  from: string;
  to: string;
  download_date: string;
  response: string;
  last_date: string;
  lasted_call_api: string;
  year: number;
  month: number;
  count: string;
  stations: Name;
}
