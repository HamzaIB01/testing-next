// Register Page
export const REGISTER_FETCHING = "REGISTER_FETCHING";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILED = "REGISTER_FAILED";

// Login Page
export const LOGIN_FETCHING = "LOGIN_FETCHING";
export const LOGIN_FAILED = "LOGIN_FAILED";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";

// Logout
export const LOGOUT = "LOGOUT";

// Get user on login
export const USER_UUID_FETCHING = "USER_UUID_FETCHING";
export const USER_UUID_SUCCESS = "USER_UUID_SUCCESS";
export const USER_UUID_FAILED = "USER_UUID_FAILED";

//GETUSERALL
export const GETALLUSER_FETCHING = "GETALLUSER_FETCHING";
export const GETALLUSER_SUCCESS = "GETALLUSER_SUCCESS";
export const GETALLUSER_FAILED = "GETALLUSER_FAILED";

//ROLE
export const ROLE_FETCHING = "ROLE_FETCHING";
export const ROLE_SUCCESS = "ROLE_SUCCESS";
export const ROLE_FAILED = "ROLE_FAILED";

//USER
export const USER_FETCHING = "USER_FETCHING";
export const USER_SUCCESS = "USER_SUCCESS";
export const USER_FAILED = "USER_FAILED";
export const USER_DELETE_FETCHING = "USER_DELETE_FETCHING";
export const USER_DELETE_SUCCESS = "USER_DELETE_SUCCESS";
export const USER_DELETE_FAILED = "USER_DELETE_FAILED";

//CHANGE_PASSWORD
export const CHANGE_PASSWORD_FAILED = "CHANGE_PASSWORD_FAILED";
export const CHANGE_PASSWORD_FETCHING = "CHANGE_PASSWORD_FETCHING";
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";

// Error Code
export const E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
export const E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR =
  "E_PICKER_CANNOT_RUN_CAMERA_ON_SIMULATOR";
export const E_PERMISSION_MISSING = "E_PERMISSION_MISSING";
export const E_PICKER_NO_CAMERA_PERMISSION = "E_PICKER_NO_CAMERA_PERMISSION";
export const E_USER_CANCELLED = "E_USER_CANCELLED";
export const E_UNKNOWN = "E_UNKNOWN";
export const E_DEVELOPER_ERROR = "E_DEVELOPER_ERROR";
export const TIMEOUT_NETWORK = "ECONNABORTED"; // request service timeout
export const NOT_CONNECT_NETWORK = "NOT_CONNECT_NETWORK";

//////////////// Localization Begin ////////////////
export const NETWORK_CONNECTION_MESSAGE =
  "Cannot connect to server, Please try again.";
export const NETWORK_TIMEOUT_MESSAGE =
  "A network timeout has occurred, Please try again.";
export const UPLOAD_PHOTO_FAIL_MESSAGE =
  "An error has occurred. The photo was unable to upload.";

export const apiUrl = `${process.env.NEXT_PUBLIC_REACT_APP_API_URL}`;
export const waterUrl = `${process.env.NEXT_PUBLIC_REACT_APP_API_WATER_URL}`;

export const server = {
  REGISTER_URL: `/auth/register`,
  SIGNIN_URL: `/auth/sign-in`,
  SIGNOUT_URL: `/auth/sign-out`,
  REGISTER_STATUS_URL: `/auth/check-register`,
  REFRESH_TOKEN_URL: `/auth/token`,
  FORGOT_PASSWORD: `/auth/forgot-password`,
  RESET_PASSWORD_URL: `/auth/reset-password`,
  VERIFY_EMAIL_URL: `/auth/verify-email`,

  GET_ALL_USERS_URL: `/users`,
  GET_USERS_PROFILE_URL: `/users`,
  ROLE_URL: `/roles`,
  DEVICE: `/device`,
  IMPORT_PROVIDE_SOURCES: `/import/provide_sources`,
  IMPORT_CONFIG: `/import/config`,
  IMPORT_LOG: `/import_logs`,
  DATASET_IMPORT_CONFIG: `/datasets/import_logs`,
  EXPORT_AUTO_CATEGORIES: `/export/auto/categories`,
  EXPORT_AUTO_FILES: `/export/auto/files`,
  EXPORT_AUTO_DOWNLOAD: `/export/auto/download`,
  EXPORT_MANUAL: `/export/manual`,
  EXPORT_REPORT: `/export/report`,
  USER_REPORT: `/users/report`,
  USER_REPORT_ACTION: `/users/report/action`,
  IMPORT_REPORT: `/import/report`,
  API_KEY: `/api/keys`,
  INTERVAL_BY_CATEGORY_URL: `/interval`,

  ACCESS_TOKEN_KEY: `access_token`,
  REFRESH_TOKEN_KEY: `refresh_token`,
  LOGIN_UUID: `login_uuid`,
  LANGUAGE: `i18nextLng`,
  UUID: `uuid`,
  USER: `user`,
  USERS_URL: `users`,
  FIRST_NAME: `first_name`,
  LAST_NAME: `last_name`,
  PHONE: `phone_number`,
  EMAIL: `email`,
  ROLE_ID: `role_id`,
  ROLE_NAME: `role_name`,
  STATUS: `status`,
  IMAGE: `image`,
  USER_ID: `id`,
};

export const ROLE_SCOPE = {
  DASHBOARD: "SC_MTWS1",
  DASHBOARD_HII: "SC_MTWS2",
  DASHBOARD_MOU: "SC_MTWS3",
  DASHBOARD_USER: "SC_MTWS4",
  SETTING_SYSTEM: "SC_MTWS5", // การตั้งค่าระบบ
  SETTING: "SC_MTWS6", // ตั้งค่าระบบ
  MANAGE_PROFILE: "SC_MTWS7", // จัดการข้อมูลส่วนตัว
  EDIT_PROFILE: "SC_MTWS8", // แก้ไขข้อมูลส่วนตัว

  MANAGE_ROLE: "SC_MTWS9", // จัดการข้อมูลกลุ่มผู้ใช้งาน
  SHOW_ALL_ROLE: "SC_MTWS10", // แสดงข้อมูลกลุ่มผู้ใช้งานทั้งหมด
  VIEW_ROLE: "SC_MTWS11", // ดูข้อมูลกลุ่มผู้ใช้งาน
  ADD_ROLE: "SC_MTWS12",
  EDIT_ROLE: "SC_MTWS13",
  DELETE_ROLE: "SC_MTWS14",
  OPEN_CLOSE_ROLE: "SC_MTWS15",
  VIEW_ROLE_REPORT: "SC_MTWS16",
  DOWNLOAD_ROLE_REPORT: "SC_MTWS17",

  MANAGE_USER: "SC_MTWS18",
  SHOW_ALL_USER: "SC_MTWS19",
  SHOW_ALL_USER_DEPARTMENT: "SC_MTWS20",
  VIEW_USER: "SC_MTWS21",
  VIEW_USER_DEPARTMENT: "SC_MTWS22",
  ADD_USER: "SC_MTWS23",
  ADD_USER_DEPARTMENT: "SC_MTWS24",
  EDIT_USER: "SC_MTWS25",
  EDIT_USER_DEPARTMENT: "SC_MTWS26",
  DELETE_USER: "SC_MTWS27",
  DELETE_USER_DEPARTMENT: "SC_MTWS28",
  OPEN_CLOSE_USER: "SC_MTWS29",
  OPEN_CLOSE_USER_DEPARTMENT: "SC_MTWS30",
  VIEW_USER_REPORT: "SC_MTWS31",
  VIEW_USER_REPORT_DEPARTMENT: "SC_MTWS32",
  DOWNLOAD_USER_REPORT: "SC_MTWS33",
  DOWNLOAD_USER_REPORT_DEPARTMENT: "SC_MTWS34",

  MANAGE_PROVIDE_SOURCE: "SC_MTWS35", //จัดการบัญชีข้อมูล
  SHOW_ALL_PROVIDE_SOURCE: "SC_MTWS36",
  SHOW_ALL_PROVIDE_SOURCE_DEPARTMENT: "SC_MTWS37",
  VIEW_PROVIDE_SOURCE: "SC_MTWS38",
  VIEW_PROVIDE_SOURCE_DEPARTMENT: "SC_MTWS39",
  ADD_PROVIDE_SOURCE: "SC_MTWS40",
  EDIT_PROVIDE_SOURCE: "SC_MTWS41",
  EDIT_PROVIDE_SOURCE_DEPARTMENT: "SC_MTWS42",
  DELETE_PROVIDE_SOURCE: "SC_MTWS43",
  OPEN_CLOSE_PROVIDE_SOURCE: "SC_MTWS44",
  OPEN_CLOSE_PROVIDE_SOURCE_DEPARTMENT: "SC_MTWS45",
  VIEW_PROVIDE_SOURCE_REPORT: "SC_MTWS46",
  VIEW_PROVIDE_SOURCE_REPORT_DEPARTMENT: "SC_MTWS47",
  DOWNLOAD_PROVIDE_SOURCE_REPORT: "SC_MTWS48",
  DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT: "SC_MTWS49",

  MANAGE_IMPORT_CONFIG: "SC_MTWS50", //จัดการวิธีการนำเข้าข้อมูล
  SHOW_ALL_IMPORT_CONFIG: "SC_MTWS51",
  VIEW_IMPORT_CONFIG: "SC_MTWS52",
  ADD_IMPORT_CONFIG: "SC_MTWS53",
  EDIT_IMPORT_CONFIG: "SC_MTWS54",
  DELETE_IMPORT_CONFIG: "SC_MTWS55",
  OPEN_CLOSE_IMPORT_CONFIG: "SC_MTWS56",
  VIEW_IMPORT_CONFIG_REPORT: "SC_MTWS57", //ดูรายงานวิธีการนำเข้าข้อมูล
  DOWNLOAD_IMPORT_CONFIG_REPORT: "SC_MTWS58",

  MANAGE_SEARCH_DATA: "SC_MTWS59", ///จัดให้บริการข้อมูล
  SHOW_ALL_SEARCH_DATA: "SC_MTWS60", ///แสดงคำขอรับบริการข้อมูลทั้งหมด
  SHOW_SEARCH_DATA: "SC_MTWS61", ///ดูคำขอรับบริการข้อมูล
  ADD_SEARCH_DATA: "SC_MTWS62",
  EDIT_SEARCH_DATA: "SC_MTWS63",
  DELETE_SEARCH_DATA: "SC_MTWS64",
  OPEN_CLOSE_SEARCH_DATA: "SC_MTWS65",
  VIEW_SEARCH_DATA_REPORT: "SC_MTWS66",
  VIEW_SEARCH_DATA_REPORT_DEPARTMENT: "SC_MTWS67",
  DOWNLOAD_SEARCH_DATA_REPORT: "SC_MTWS68",
  DOWNLOAD_SEARCH_DATA_REPORT_DEPARTMENT: "SC_MTWS69",

  TEST_SANDBOX_ฺBASE: "SC_MTWS70",
  TEST_SANDBOX: "SC_MTWS71",
  VIEW_SANDBOX_REPORT: "SC_MTWS72",
  DOWNLOAD_SANDBOX_REPORT: "SC_MTWS73",
};

export const AuthURL = {
  SIGN_IN: `/auth/login`,
  REGISTER: `/auth/register`,
  FORGOT_PASSWORD: `/auth/forgot-password`,
  RESET_PASSWORD: `/auth/reset-password`,
  CHECK_REGISTRATION: `/auth/check-registration`,

  DASHBOARD: {
    HOME: `/`,
  },

  SYSTEM_SETTINGS: `/system-settings`,

  PROFILE: `/profile`,

  // MASTER_DATA_SYSTEM: {
  //   MANAGE_DATE_MANAGEMENT: {
  //     MANAGE_USER_GROUP_INFORMATION: `/admin/manage-data-system/manage-user-group-information`,
  //     MANAGE_DEPARTMENTS: `/admin/manage-data-system/manage-departments`,
  //     MANAGE_DATA_TYPES: `/admin/manage-data-system/manage-data-types`,
  //     MANAGE_MEASUREMENT_TYPES: `/admin/manage-data-system/manage-measurement-types`,
  //     TIME_MEASUREMENT: `/admin/manage-data-system/time-measurement`,
  //     MANAGE_INSPECTION_CONDITIONS: `/admin/manage-data-system/manage-inspection-condition`,
  //   },
  //   MANAGE_USER_INFORMATION: `/admin/manage-data-system/manage-user-information`,
  //   MASTER_DATA_MANAGEMENT_SYSTEM_REPORT: `/admin/manage-data-system/master-data-management-system-report`,
  // },

  MANAGE_ROLE: `/management/role`,
  MANAGE_ROLE_SINGLE: `/management/role/single/`,
  MANAGE_ROLE_PERMISSION: `/management/role/permission/`,

  MANAGE_USER: `/management/users`,
  MANAGE_USER_DETAIL: `/management/users/detail/`,
  MANAGE_USER_REPORT: `/management/users/report`,
  MANAGE_USER_REPORT_LITS: `/management/users/report/lits/`,

  MANAGE_ACCOUNT: {
    BASE: `/manage-account`,
    ADD_ACCOUNT: `/manage-account/add-account`,
    EDIT_ACCOUNT: `/manage-account/edit-account`,
    ADD_CONNECTION: `/manage-account/add-connection`,
    EDIT_CONNECTION: `/manage-account/edit-connection`,
    TEST_CONNECT_API: `/manage-account/test-connect-api`,
  },
  CONNECT_AND_IMPORT_REPORTS: `/connect-import-reports`,

  INFORMATION_SERVICE: `/information-service`,
  SANDBOX: `/sandbox`,
  MANAGE_API_KEY: `/manage-api-key`,
  REQUEST_DATA: `/request-data`,
  REPORT: `/report`,
  REPORT_LITS: `/report/lits`,
};

export const PAGE = {
  REGISTER: `register`,
};
