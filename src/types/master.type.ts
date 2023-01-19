import { Flag, Name, Operation, Shortname } from "./user.type";

export interface MasterData {
  categories: MasterDataCategory[];
  intervals: MasterDataInterval[];
  departments: MasterDataDepartments[];
  channels: MasterDataChannels[];
  permissions: MasterDataPermissions[];
  basins: MasterDataBasins[];
  stations: MasterDataStations[];
}

export interface MasterDataCategory {
  category_id: number;
  category_code: string;
  category_short_name: string;
  category_name: Name;
  category_uuid: string;
  category_ref_uuid: string;
  category_create_by: string;
  category_create_date: string;
  category_updated_by: string;
  category_update_date: number;
  category_enable_flag: boolean;
  category_status_flag: string;
  category_status_modified_date: string;
}

export interface MasterDataInterval {
  interval_code: string;
  interval_id: number;
  interval_short_name: string;
  interval_name: Name;
  interval_uuid: string;
  interval_ref_uuid: string;
  interval_create_by: string;
  interval_create_date: string;
  interval_updated_by: string;
  interval_update_date: number;
  interval_enable_flag: boolean;
  interval_status_flag: string;
  interval_status_modified_date: string;
  measurement_uuid: string;
}

export interface MasterDataDepartments {
  id: number;
  code: string;
  short_name: Shortname;
  name: Name;
  uuid: string;
  ref_uuid: string;
  create_by: string;
  create_date: string;
  updated_by: string;
  update_date: number;
  enable_flag: boolean;
  status_flag: string;
  status_modified_date: string;
  flag: Flag;
  operation: Operation;
  measurement_uuid: string;
}

export interface MasterDataChannels {
  permissions_id: number;
  permissions_code: string;
  permissions_short_name: string;
  permissions_name: Name;
  permissions_uuid: string;
  permissions_ref_uuid: string;
  permissions_create_by: string;
  permissions_create_date: string;
  permissions_updated_by: string;
  permissions_update_date: number;
  permissions_enable_flag: boolean;
  permissions_status_flag: string;
  permissions_status_modified_date: string;
}

export interface MasterDataPermissions {
  channels_id: number;
  channels_code: string;
  channels_short_name: string;
  channels_name: Name;
  channels_uuid: string;
  channels_ref_uuid: string;
  channels_create_by: string;
  channels_create_date: string;
  channels_updated_by: string;
  channels_update_date: number;
  channels_enable_flag: boolean;
  channels_status_flag: string;
  channels_status_modified_date: string;
}

export interface MasterDataBasins {
  basin_id: number;
  basin_code: string;
  basin_short_name: string;
  basin_name: Name;
  basin_uuid: string;
  basin_ref_uuid: string;
  basin_create_by: string;
  basin_create_date: string;
  basin_updated_by: string;
  basin_update_date: number;
  basin_enable_flag: boolean;
  basin_status_flag: string;
  basin_status_modified_date: string;
}

export interface MasterDataStations {
  station_id: number;
  station_code: string;
  station_short_name: string;
  station_name: Name;
  station_url: string;
  station_uuid: string;
  station_description: string;
  station_province_code: string;
  station_district_code: string;
  station_sub_district_code: string;
  station_type: string;
  station_latitude: string;
  station_longitude: string;
  station_ref_uuid: string;
  station_create_by: string;
  station_create_date: string;
  station_updated_by: string;
  station_update_date: number;
  station_enable_flag: boolean;
  station_status_flag: string;
  station_status_modified_date: string;
  basin_uuid: string;
  department_uuid: string;
  water_resource_info_uuid: string;
}
