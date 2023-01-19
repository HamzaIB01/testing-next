import { Department, Name, Pagination } from "./user.type";

export interface UserReportResult {
  result?: ContentUserReportResult;
  code: number;
  message: string;
  // description?: string;
  status: string;
  error?: string;
}

export interface ContentUserReportResult {
  pagination: Pagination;
  content: UserReportContent[];
}

export interface UserReportContent {
  create_date: string;
  fullname: string;
  timestamp: string;
  name: string;
  email: string;
  role: string;
  department: Name;
  module: string;
  activity: string;
  value: {
    mini_thaiwater_non_water: {
      non_water: {
        manual_exports: {
          select: [];
          insert: [];
        };
      };
    };
  };
  params: string;
  request: string;
  type: string;
  file_name: string;
  from: string;
  to: string;
  category: Name;
  download_date: string;
  response: string;
  last_date: string;
  lasted_call_api: string;
  year: number;
  month: number;
  count: string;
}

export interface UserReportDormantResult {
  result?: ContentUserReportDormantResult;
  code: number;
  message: string;
  // description?: string;
  status: string;
  error?: string;
}

export interface ContentUserReportDormantResult {
  pagination: Pagination;
  content: UserReportDormantContent[];
}

export interface UserReportDormantContent {
  create_date: string;
  lasted_date: string;
  fullname: string;
  lasted_call_api: string;
  timestamp: string;
  name: string;
  email: string;
  role: string;
  department: Name[];
  module: string;
  activity: string;
  value: {
    mini_thaiwater_non_water: {
      non_water: {
        manual_exports: {
          select: [];
          insert: [];
        };
      };
    };
  };
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
}
