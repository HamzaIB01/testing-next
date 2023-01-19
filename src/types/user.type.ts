import { Coordinator } from "./water.type";

export interface UserData {
  role_id: number;
  user_data: User;
  signin_with: string;
  signin_id: string;
}

export interface User {
  first_name: string;
  last_name: string;
  citizen_number: string;
  laser_code: string;
  birth_date: string;
  people_type: number;
  email: string;
  phone_number: string;
  department_id: number;
  // password: string;
  // confirm_password: string;
  // terms: boolean;
  // submit: string;
}

export interface GetAllUserResult {
  result?: UserResult;
  code: number;
  message: string;
  description?: Description;
  // description?: string;
  status: string;
  error?: string;
}

export interface UserResult {
  pagination: Pagination;
  content: Content[];
}

export interface Pagination {
  page: number;
  total_items: number;
  total_pages: number;
}

export interface Content {
  uuid: string;
  login_uuid: string;
  prefix: Prefix;
  first_name: string;
  last_name: string;
  citizen_number: string;
  laser_code: string;
  birth_date: string;
  people_type: number;
  image_path: string;
  phone_number: string;
  ref_id: string;
  email: string;
  flag: Flag;
  operation: Operation;
  role: Role[];
  department: Department;
  nationaloty: Nationality;
  current_role_code: string;
  device: string;
  refresh_token: string;
  access_token: string;
  file: File[];
}

export interface File {
  path: string;
  tag: string;
  type: string;
}

export interface Nationality {
  id: number;
  code: string;
  name: Name;
  flag: Flag;
  operation: Operation;
}

export interface Prefix {
  id: number;
  name: Name;
  flag: Flag;
  operation: Operation;
}

export interface Flag {
  verified_email_flag: boolean;
  verified_email_date: string;
  changed_password_flag: boolean;
  changed_password_date: string;
  used_ad_flag: boolean;
  enable_flag: boolean;
  status_flag: string;
  status_modified_date: string;
  status_modifier_date: string;
  mou_flag: boolean;
}

export interface Operation {
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
}

export interface Role {
  id: number;
  code: string;
  name: Name;
  description: Description;
  ref_id: number;
  flag: Flag;
  operation: Operation;
}

export interface Description {
  th: string;
  en: string;
}

// export interface Department {
//   id: number;
//   code: string;
//   short_name?: Shortname;
//   name: Name;
//   ref_id: number;
//   file: string;
//   color_hex_value: string;
//   uuid: string;
//   ref_uuid: string;
//   flag: Flag;
//   operation: Operation;
//   description?: Description;
//   coordinator: Coordinator;
//   link_type: string;
//   start_date: string;
//   keyword: string;
//   law: string;
//   interval: Interval[];
//   category: SubInterval;
//   department: SubInterval;
// }

export interface RoleResult {
  pagination: Pagination;
  content: Department[];
}

export interface Department {
  id: number;
  code: string;
  short_name?: Shortname;
  name: {
    th: string;
    en: string;
  };
  description: {
    th: string;
    en: string;
  };
  ref_id: number;
  file: string;
  color_hex_value: string;
  uuid: string;
  ref_uuid: string;
  flag: Flag;
  operation: Operation;
  // description?: Description;
  coordinator: Coordinator;
  link_type: string;
  start_date: string;
  keyword: string;
  law: string;
  interval: Interval[];
  category: SubInterval;
  department: SubInterval;
  tag: string;
}

export interface Interval {
  interval: SubInterval;
  permission: SubInterval;
  channel: SubInterval[];
}

export interface SubInterval {
  id: number;
  code: string;
  name: Name;
  short_name: Shortname;
  uuid: string;
  ref_uuid: string;
  measurement: SubInterval;
  category: SubInterval;
  flag: Flag;
  operation: Operation;
  url: string;
}

// export interface Measurement {
//   id: number;
//   code: string;
//   name: Name;
//   uuid: string;
//   category: Category;
//   flag: Flag;
//   operation: Operation;
// }

export interface Name {
  th: string;
  en: string;
}

export interface Shortname {
  th: string;
  en: string;
}
