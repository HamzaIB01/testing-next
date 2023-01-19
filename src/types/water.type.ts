import {
  Department,
  Description,
  Flag,
  Name,
  Operation,
  Pagination,
  SubInterval,
} from "./user.type";

export interface AllWaterResult {
  code: string;
  error: string;
  message: string;
  timestamp: string;
  result: WaterResult;
}

export interface ImportConfigResult {
  code: string;
  error: string;
  message: string;
  timestamp: string;
  result: Department;
}

export interface AllWaterResult {
  code: string;
  error: string;
  message: string;
  timestamp: string;
  result: WaterResult;
}

export interface ImportDatasetResult {
  code: string;
  error: string;
  message: string;
  timestamp: string;
  result: DatasetResult;
}

export interface ExportAuto {
  code: string;
  error: string;
  message: string;
  timestamp: string;
  result: ExportAutoResult;
}

export interface ExportAutoResult {
  pagination: Pagination;
  content: Content;
}

export interface Content {
  file: File[];
}

export interface File {
  type: string;
  path: string;
  tag: string;
}

export interface DatasetResult {
  pagination: Pagination;
  content: DatasetContent[];
}

export interface WaterResult {
  pagination: Pagination;
  content: Department[];
}

export interface Coordinator {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  th: string;
  en: string;
}

export interface AllNonWaterResult {
  code: string;
  error: string;
  message: string;
  timestamp: string;
  result: NonWaterResult;
}

export interface NonWaterResult {
  pagination: Pagination;
  content: NonWaterContent[];
}

export interface NonWaterContent {
  name: Name;
  handled_status: string;
  file: File[];
  parameter: Parameter;
  from: string;
  to: string;
  description: string;
  flag: Flag;
  operation: Operation;
  category_name: Name;
}

export interface File {
  type: string;
  path: string;
  tag: string;
}

export interface Parameter {
  category: ParameterUUID;
  interval: ParameterUUID[];
  basin: ParameterUUID[];
  station: ParameterUUID[];
  department: ParameterUUID[];
  province: ProvinceCode[];
  district: ProvinceCode[];
  sub_district: ProvinceCode[];
}

export interface ParameterUUID {
  uuid: string;
}

export interface ProvinceCode {
  code: string;
}

export interface DatasetContent {
  id?: number;
  name?: Name;
  description?: Description;
  protocol?: string;
  host?: string;
  api_key?: string;
  http_request?: string;
  route?: string;
  parameter_type?: string;
  parameter?: {
    latest: string;
    startDatetime: string;
    endDatetime: string;
    interval: string;
  };
  sla_time?: number;
  retry_count?: number;
  crontab?: string;
  uuid?: string;
  interval?: SubInterval;
  flag?: Flag;
  operation?: Operation;
}

export interface Datasets_import_log_Result {
  code: string;
  error: string;
  message: string;
  timestamp: string;
  result: DatasetImportLogResult;
}

export interface DatasetImportLogResult {
  pagination: Pagination;
  content: DatasetImportLogContent;
}

export interface DatasetImportLogContent {
  total: number;
  success: number;
  fail: number;
  rows: Rows[];
}

export interface Rows {
  hii_qc_flag: boolean;
  value: string;
  currents_date: string;
  station_code: string;
  department_code: string;
}
