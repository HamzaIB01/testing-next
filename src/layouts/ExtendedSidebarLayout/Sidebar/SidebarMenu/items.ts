import type { ReactNode } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import AppsIcon from "@mui/icons-material/Apps";
import PeopleIcon from "@mui/icons-material/People";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import TableChartIcon from "@mui/icons-material/TableChart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import WidgetsIcon from "@mui/icons-material/Widgets";
import CloudIcon from "@mui/icons-material/Cloud";
import { AuthURL, ROLE_SCOPE } from "@/constants";

export interface MenuItem {
  link?: string;
  icon?: ReactNode;
  badge?: string;
  badgeTooltip?: string;

  items?: MenuItem[];
  name: string;
  role?: string;
  show?: boolean;
}

export interface MenuItems {
  items: MenuItem[];
  heading: string;
  role?: string;
  show?: boolean;
}

const menuItems: MenuItems[] = [
  {
    heading: "MASTER_DATA_SYSTEM", // ระบบข้อมูลหลัก
    role: ROLE_SCOPE.MANAGE_ROLE, // "SC_MTWS9",
    items: [
      {
        name: "MANAGE_DATE_MANAGEMENT",
        icon: AppsIcon,
        role: ROLE_SCOPE.MANAGE_ROLE, // "SC_MTWS9",
        items: [
          {
            name: "MANAGE_USER_GROUP_INFORMATION", // จัดการข้อมูลกลุ่มผู้ใช้งาน
            role: ROLE_SCOPE.MANAGE_ROLE, // "SC_MTWS9",
            link: AuthURL.MANAGE_ROLE,
          },
          {
            name: "MANAGE_DEPARTMENTS",
            role: "ROLE_MANAGEMENT",
            link: "#",
          },
          {
            name: "MANAGE_DATA_TYPES",
            role: "ROLE_MANAGEMENT",
            link: "#",
          },
          {
            name: "MANAGE_MEASUREMENT_TYPES",
            role: "ROLE_MANAGEMENT",
            link: "#",
          },
          {
            name: "TIME_MEASUREMENT",
            role: "ROLE_MANAGEMENT",
            link: "#",
          },
          {
            name: "MANAGE_INSPECTION_CONDITIONS",
            role: "ROLE_MANAGEMENT",
            link: "#",
          },
        ],
      },
      {
        name: "MANAGE_USER_INFORMATION", // จัดการข้อมูลข้อมูลผู้ใช้งาน
        icon: PeopleIcon,
        role: ROLE_SCOPE.MANAGE_USER, // "SC_MTWS18",
        link: AuthURL.MANAGE_USER,
      },
      {
        name: "MASTER_DATA_MANAGEMENT_SYSTEM_REPORT",
        icon: TableChartIcon,
        role: ROLE_SCOPE.SHOW_ALL_USER_DEPARTMENT, // "SC_MTWS20",
        link: AuthURL.MANAGE_USER_REPORT,
      },
    ],
  },
  {
    heading: "CONNECTING_AND_IMPORTING_DATA", // จัดการบัญชีข้อมูล
    role: ROLE_SCOPE.MANAGE_PROVIDE_SOURCE, // "SC_MTWS35",
    items: [
      {
        name: "MANAGE_ACCOUNTS",
        icon: ManageAccountsIcon,
        role: ROLE_SCOPE.MANAGE_PROVIDE_SOURCE, // "SC_MTWS35",
        link: AuthURL.MANAGE_ACCOUNT.BASE,
      },
      {
        name: "CONNECT_AND_IMPORT_REPORTS",
        icon: TableChartIcon,
        role: ROLE_SCOPE.VIEW_PROVIDE_SOURCE_REPORT, // "SC_MTWS46",
        link: AuthURL.CONNECT_AND_IMPORT_REPORTS,
      },
    ],
  },
  {
    heading: "IMFORMATION_SERVICE_SYSTEM", // จัดการการให้บริการข้อมูล
    role: ROLE_SCOPE.MANAGE_SEARCH_DATA, // "SC_MTWS59",
    items: [
      {
        name: "INFORMATION_SERVICE",
        icon: CloudIcon,
        role: ROLE_SCOPE.MANAGE_SEARCH_DATA, // "SC_MTWS59",
        link: AuthURL.INFORMATION_SERVICE,
      },
      {
        name: "DATA_SERVICE_TRIAL", // ทดสอบการให้บริการข้อมูล
        icon: CloudIcon,
        role: ROLE_SCOPE.TEST_SANDBOX, // "SC_MTWS71"
        link: AuthURL.SANDBOX,
      },
      {
        name: "IMFORMATION_SERVICE_SYSTEM_REPORT", // ดูรายงานการทดสอบการให้บริการข้อมูล
        icon: TableChartIcon,
        role: ROLE_SCOPE.VIEW_SANDBOX_REPORT, // "SC_MTWS72"
        link: AuthURL.REPORT,
      },
    ],
  },
];

export default menuItems;
