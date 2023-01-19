import { AuthURL, ROLE_SCOPE } from "@/constants";

export interface LinkItems {
  link: string;
  role: string;
  name?: string;
  sub_scopes?: LinkItems[];
}

const urlItems: LinkItems[] = [
  {
    link: "/",
    role: "SC_MTWS1",
    name: "แผนควบคุม", // ยังไม่ได้ map
    sub_scopes: [
      {
        link: "#",
        role: "SC_MTWS2",
        name: "แผงควบคุมสำหรับผู้ดูแลระบบของ สสน.", // ยังไม่ได้ map
      },
      {
        link: "#",
        role: "SC_MTWS3",
        name: "แผงควบคุมสำหรับผู้ดูแลระบบของหน่วยงาน MOU", // ยังไม่ได้ map
      },
      {
        link: "#",
        role: "SC_MTWS4",
        name: "แผงควบคุมสำหรับผู้ใช้งาน", // ยังไม่ได้ map
      },
    ],
  },
  {
    link: AuthURL.PROFILE,
    role: ROLE_SCOPE.SETTING_SYSTEM, // "SC_MTWS5",
    name: "การตั้งค่าระบบ",
    sub_scopes: [
      {
        link: "#",
        role: "SC_MTWS6",
        name: "ตั้งค่าระบบ",
      },
    ],
  },
  {
    link: AuthURL.PROFILE,
    role: ROLE_SCOPE.MANAGE_PROFILE, // "SC_MTWS7",
    name: "จัดการข้อมูลส่วนตัว",
    sub_scopes: [
      {
        link: "#",
        role: "SC_MTWS8",
        name: "แก้ไขข้อมูลส่วนตัว",
      },
    ],
  },
  {
    link: AuthURL.MANAGE_ROLE,
    role: ROLE_SCOPE.MANAGE_ROLE, // "SC_MTWS9",
    name: "จัดการข้อมูลกลุ่มผู้ใช้งาน",
    sub_scopes: [
      {
        link: "#",
        role: "SC_MTWS10",
        name: "แสดงข้อมูลกลุ่มผู้ใช้งานทั้งหมด",
      },
      {
        link: AuthURL.MANAGE_ROLE_SINGLE + `[userId]`,
        role: ROLE_SCOPE.VIEW_ROLE, // "SC_MTWS11",
        name: "ดูข้อมูลกลุ่มผู้ใช้งาน",
      },
      {
        link: "#",
        role: "SC_MTWS12",
        name: "เพิ่มข้อมูลกลุ่มผู้ใช้งาน",
      },
      {
        link: "#",
        role: "SC_MTWS13",
        name: "แก้ไขข้อมูลกลุ่มผู้ใช้งาน",
      },
      {
        link: "#",
        role: "SC_MTWS14",
        name: "ลบข้อมูลกลุ่มผู้ใช้งาน",
      },
      {
        link: AuthURL.MANAGE_ROLE_PERMISSION + `[userId]`,
        role: ROLE_SCOPE.OPEN_CLOSE_ROLE, // "SC_MTWS15",
        name: "เปิด/ปิดข้อมูลกลุ่มผู้ใช้งาน",
      },
      {
        // function: true
        link: "#",
        role: "SC_MTWS16",
        name: "ดูรายงานข้อมูลกลุ่มผู้ใช้งาน", // ยังไม่ได้ map
      },
      {
        link: "#",
        role: "SC_MTWS17",
        name: "ดาวน์โหลดรายงานข้อมูลกลุ่มผู้ใช้งาน", // ยังไม่ได้ map
      },
    ],
  },
  {
    link: AuthURL.MANAGE_USER,
    role: ROLE_SCOPE.MANAGE_USER, // "SC_MTWS18",
    name: "จัดการข้อมูลข้อมูลผู้ใช้งาน",
    sub_scopes: [
      {
        link: "#",
        role: "SC_MTWS19",
        name: "แสดงข้อมูลผู้ใช้งานทั้งหมด",
      },
      {
        link: "#",
        role: "SC_MTWS20",
        name: "แสดงข้อมูลผู้ใช้งานภายในหน่วยงานทั้งหมด",
      },
      {
        link: "#",
        role: "SC_MTWS21",
        name: "ดูข้อมูลผู้ใช้งาน", // ยังไม่ได้ map
      },
      {
        link: "#",
        role: "SC_MTWS22", // ยังไม่ได้ map
        name: "ดูข้อมูลผู้ใช้งานภายในหน่วยงาน",
      },
      {
        link: "#",
        role: "SC_MTWS23",
        name: "เพิ่มข้อมูลผู้ใช้งาน",
      },
      {
        link: "#",
        role: "SC_MTWS24",
        name: "เพิ่มข้อมูลผู้ใช้งานภายในหน่วยงาน",
      },
      {
        link: AuthURL.MANAGE_USER_DETAIL + `[userId]`,
        role: ROLE_SCOPE.EDIT_USER, // "SC_MTWS25",
        name: "แก้ไขข้อมูลผู้ใช้งาน",
      },
      {
        link: "#",
        role: "SC_MTWS26",
        name: "แก้ไขข้อมูลผู้ใช้งานภายในหน่วยงาน",
      },
      {
        link: "#",
        role: "SC_MTWS27",
        name: "ลบข้อมูลผู้ใช้งาน",
      },
      {
        link: "#",
        role: "SC_MTWS28",
        name: "ลบข้อมูลผู้ใช้งานภายในหน่วยงาน",
      },
      {
        link: "#",
        role: "SC_MTWS29", // ยังไม่ได้ map
        name: "เปิด/ปิดข้อมูลผู้ใช้งาน",
      },
      {
        link: "#",
        role: "SC_MTWS30", // ยังไม่ได้ map
        name: "เปิด/ปิดข้อมูลผู้ใช้งานภายในหน่วยงาน",
      },
      {
        link: AuthURL.MANAGE_USER_REPORT,
        role: ROLE_SCOPE.VIEW_USER_REPORT, // "SC_MTWS31", // ยังไม่ได้ map
        name: "ดูรายงานข้อมูลผู้ใช้งาน",
      },
      {
        link: AuthURL.MANAGE_USER_REPORT_LITS + `[litsId]`,
        role: ROLE_SCOPE.VIEW_USER_REPORT_DEPARTMENT, // "SC_MTWS32", // ยังไม่ได้ map
        name: "ดูรายงานข้อมูลผู้ใช้งานภายในหน่วยงาน",
      },
      {
        link: "#",
        role: "SC_MTWS33", // ยังไม่ได้ map
        name: "ดาวน์โหลดรายงานข้อมูลผู้ใช้งาน",
      },
      {
        link: "#",
        role: "SC_MTWS34", // ยังไม่ได้ map
        name: "ดาวน์โหลดรายงานข้อมูลผู้ใช้งานภายในหน่วยงาน",
      },
    ],
  },
  {
    link: AuthURL.MANAGE_ACCOUNT.BASE,
    role: ROLE_SCOPE.MANAGE_PROVIDE_SOURCE, // "SC_MTWS35",
    name: "จัดการบัญชีข้อมูล",
    sub_scopes: [
      {
        link: "#",
        role: "SC_MTWS36",
        name: "แสดงบัญชีข้อมูลทั้งหมด",
      },
      {
        link: "#",
        role: "SC_MTWS37",
        name: "แสดงบัญชีข้อมูลภายในหน่วยงานทั้งหมด",
      },
      {
        link: AuthURL.MANAGE_ACCOUNT.EDIT_ACCOUNT,
        role: ROLE_SCOPE.VIEW_PROVIDE_SOURCE, // "SC_MTWS38", // ยังไม่ได้ map
        name: "ดูบัญชีข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS39", // ยังไม่ได้ map
        name: "ดูบัญชีข้อมูลภายในหน่วยงาน",
      },
      {
        link: AuthURL.MANAGE_ACCOUNT.ADD_ACCOUNT,
        role: ROLE_SCOPE.ADD_PROVIDE_SOURCE, // "SC_MTWS40",
        name: "เพิ่มบัญชีข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS41",
        name: "แก้ไขบัญชีข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS42",
        name: "แก้ไขบัญชีข้อมูลภายในหน่วยงาน",
      },
      {
        link: "#",
        role: "SC_MTWS43",
        name: "ลบบัญชีข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS44", // ยังไม่ได้ map
        name: "เปิด/ปิดบัญชีข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS45", // ยังไม่ได้ map
        name: "เปิด/ปิดบัญชีข้อมูลภายในหน่วยงาน",
      },
      {
        link: AuthURL.CONNECT_AND_IMPORT_REPORTS,
        role: ROLE_SCOPE.VIEW_PROVIDE_SOURCE_REPORT, // "SC_MTWS46",
        name: "ดูรายงานบัญชีข้อมูล",
      },
      {
        link: AuthURL.CONNECT_AND_IMPORT_REPORTS + `/lits/[litsId]`,
        role: ROLE_SCOPE.VIEW_PROVIDE_SOURCE_REPORT_DEPARTMENT, // "SC_MTWS47", // ยังไม่ได้ map
        name: "ดูรายงานบัญชีข้อมูลภายในหน่วยงาน",
      },
      {
        link: "#",
        role: "SC_MTWS48",
        name: "ดาวน์โหลดรายงานบัญชีข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS49",
        name: "ดาวน์โหลดรายงานบัญชีข้อมูลภายในหน่วยงาน",
      },
    ],
  },
  {
    link: AuthURL.MANAGE_ACCOUNT.EDIT_ACCOUNT,
    role: ROLE_SCOPE.MANAGE_IMPORT_CONFIG, // "SC_MTWS50",
    name: "จัดการวิธีการนำเข้าข้อมูล",
    sub_scopes: [
      {
        link: "#",
        role: "SC_MTWS51",
        name: "แสดงวิธีการนำเข้าข้อมูลทั้งหมด",
      },
      {
        link: AuthURL.MANAGE_ACCOUNT.EDIT_CONNECTION,
        role: ROLE_SCOPE.VIEW_IMPORT_CONFIG, // "SC_MTWS52", // ยังไม่ได้ map
        name: "ดูวิธีการนำเข้าข้อมูล",
      },
      {
        link: AuthURL.MANAGE_ACCOUNT.ADD_CONNECTION,
        role: ROLE_SCOPE.ADD_IMPORT_CONFIG, // "SC_MTWS53",
        name: "เพิ่มวิธีการนำเข้าข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS54",
        name: "แก้ไขวิธีการนำเข้าข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS55",
        name: "ลบวิธีการนำเข้าข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS56",
        name: "เปิด/ปิดวิธีการนำเข้าข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS57", // ยังไม่ได้ map
        name: "ดูรายงานวิธีการนำเข้าข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS58", // ยังไม่ได้ map
        name: "ดาวน์โหลดรายงานวิธีการนำเข้าข้อมูล",
      },
    ],
  },
  {
    link: AuthURL.INFORMATION_SERVICE,
    role: ROLE_SCOPE.MANAGE_SEARCH_DATA, // "SC_MTWS59",
    name: "จัดการการให้บริการข้อมูล",
    sub_scopes: [
      {
        link: "#",
        role: "SC_MTWS60",
        name: "แสดงคำขอรับบริการข้อมูลทั้งหมด",
      },
      {
        link: "#",
        role: "SC_MTWS61",
        name: "ดูคำขอรับบริการข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS62",
        name: "เพิ่มคำขอรับบริการข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS63", // ยังไม่ได้ map ไม่มีใน ui
        name: "แก้ไขคำขอรับบริการข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS64", // ยังไม่ได้ map ไม่มีใน ui
        name: "ลบคำขอรับบริการข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS65", // ยังไม่ได้ map
        name: "เปิด/ปิดการให้บริการข้อมูล",
      },
      {
        link: AuthURL.REPORT,
        role: ROLE_SCOPE.VIEW_SEARCH_DATA_REPORT, //"SC_MTWS66", // ยังไม่ได้ map
        name: "ดูรายงานการให้บริการข้อมูล",
      },
      {
        link: AuthURL.REPORT_LITS + `/[litsId]`,
        role: ROLE_SCOPE.VIEW_SEARCH_DATA_REPORT_DEPARTMENT, // "SC_MTWS67", // ยังไม่ได้ map
        name: "ดูรายงานการให้บริการข้อมูลภายในหน่วยงาน",
      },
      {
        link: AuthURL.REQUEST_DATA + `/[userId]`,
        role: ROLE_SCOPE.DOWNLOAD_SEARCH_DATA_REPORT, // "SC_MTWS68", // ยังไม่ได้ map
        name: "ดาวน์โหลดรายงานการให้บริการข้อมูล",
      },
      {
        link: "#",
        role: "SC_MTWS69", // ยังไม่ได้ map
        name: "ดาวน์โหลดรายงานการให้บริการข้อมูลภายในหน่วยงาน",
      },
      {
        link: AuthURL.SANDBOX,
        role: ROLE_SCOPE.TEST_SANDBOX_ฺBASE, // "SC_MTWS70", // ยังไม่ได้ map
        name: "ทดสอบการให้บริการข้อมูล",
      },
      {
        link: AuthURL.MANAGE_API_KEY,
        role: ROLE_SCOPE.TEST_SANDBOX, // "SC_MTWS71", // ยังไม่ได้ map
        name: "ทดสอบการให้บริการข้อมูล",
        // sub_scope: "SC_MTWS70";
      },
      {
        link: "#",
        role: "SC_MTWS72", // ยังไม่ได้ map
        name: "ดูรายงานการทดสอบการให้บริการข้อมูล",
        // sub_scope: "SC_MTWS70";
      },
      {
        link: "#",
        role: "SC_MTWS73", // ยังไม่ได้ map
        name: "ดาวน์โหลดรายงานการทดสอบการให้บริการข้อมูล",
        // sub_scope: "SC_MTWS70";
      },
    ],
  },
];

export default urlItems;
