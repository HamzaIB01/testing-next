import {
  FC,
  ChangeEvent,
  SyntheticEvent,
  useState,
  // ReactElement,
  // Ref,
  // forwardRef,
  useEffect,
  useCallback,
} from "react";

// import PropTypes from "prop-types";
import {
  Box,
  Card,
  Grid,
  Slide,
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Typography,
  Dialog,
  // Zoom,
  styled,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  DialogTitle,
  DialogContent,
  Stack,
  Switch,
  Tab,
  Tabs,
  Avatar,
  useTheme,
  Backdrop,
  CircularProgress,
} from "@mui/material";

// import { TransitionProps } from "@mui/material/transitions";
// import type { User } from "src/models/user";
import { useTranslation } from "react-i18next";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useSnackbar } from "notistack";
import Label from "@/components/Label";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { DesktopDatePicker } from "@mui/lab";
import { PersonalOrganizationComponent } from "@/components/PersonalComponents/PersonalOrganizationComponents";
import React from "react";
import { FilterData } from "@/components/FilterData";
import { useRouter } from "next/router";
import Link from "src/components/Link";
import { ApexOptions } from "apexcharts";
import { Chart } from "@/components/Chart";
import { useRefMounted } from "@/hooks/useRefMounted";
import { reportUserApi } from "@/actions/report.user.action";
import {
  ContentUserReportDormantResult,
  ContentUserReportResult,
  UserReportContent,
  UserReportDormantContent,
} from "@/types/report.user";
import { format } from "date-fns";
import SimpleBackdrop from "@/components/Backdrop";
import { FilterDataReportWater } from "@/components/FilterDataReportWater";
import { FilterDataReportUser } from "@/components/FilterDataReportUser";
import { useAuth } from "@/hooks/useAuth";
import { ConvertDateTimeFormat } from "@/components/FormatConvertDateTime";
import { server } from "@/constants";

const DialogActions = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]}
     `
);

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
         border-radius: ${theme.general.borderRadius};
         padding: ${theme.spacing(2)};
         background: ${theme.colors.alpha.black[5]};
         border: 1px dashed ${theme.colors.alpha.black[30]};
         outline: none;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         transition: ${theme.transitions.create(["border", "background"])};
         min-height: 320px;
     
         &:hover {
           background: ${theme.colors.alpha.white[50]};
           border-color: ${theme.colors.primary.main};
         }
     `
);

const TabsWrapper = styled(Tabs)(
  ({ theme }) => `
     @media (max-width: ${theme.breakpoints.values.md}px) {
       .MuiTabs-scrollableX {
         overflow-x: auto !important;
       }
 
       .MuiTabs-indicator {
           box-shadow: none;
       }
     }
     `
);

const AntSwitch = styled(Switch)(({ theme }) => ({
  "& .css-hqp9x7-MuiSwitch-thumb": {
    border: "1px solid " + "rgb(87 202 34 / 20%)",
    boxShadow: "0 2px 4px 0 rgb(87 202 34 / 20%)",
    backgroundColor: theme.palette.success.main,
  },
}));

// interface ResultsProps {
//   users: User[];
// }

interface Filters {
  role?: string;
}

// const Transition = forwardRef(function Transition(
//   props: TransitionProps & { children: ReactElement<any, any> },
//   ref: Ref<unknown>
// ) {
//   return <Slide direction="down" ref={ref} {...props} />;
// });

// const applyFilters = (
//   users: UserReportContent[],
//   query: string,
//   filters: Filters
// ): UserReportContent[] => {
//   return users?.filter((user) => {
//     let matches = true;

//     if (query) {
//       const properties = ["email"];
//       let containsQuery = false;

//       properties.forEach((property) => {
//         if (user[property].toLowerCase().includes(query.toLowerCase())) {
//           containsQuery = true;
//         }
//       });

//       if (filters.role && user.role !== filters.role) {
//         matches = false;
//       }

//       if (!containsQuery) {
//         matches = false;
//       }
//     }

//     Object.keys(filters).forEach((key) => {
//       const value = filters[key];

//       if (value && user[key] !== value) {
//         // matches = false;
//       }
//     });

//     return matches;
//   });
// };

// const applyPagination = (
//   users: UserReportContent[],
//   page: number,
//   limit: number
// ): UserReportContent[] => {
//   return users?.slice(page * limit, page * limit + limit);
// };

// const applyFiltersDormant = (
//   users: UserReportDormantContent[],
//   query: string,
//   filters: Filters
// ): UserReportDormantContent[] => {
//   return users?.filter((user) => {
//     // console.log("userx ", user);
//     let matches = true;

//     if (query) {
//       const properties = ["email"];
//       let containsQuery = false;

//       properties.forEach((property) => {
//         if (user[property].toLowerCase().includes(query.toLowerCase())) {
//           containsQuery = true;
//         }
//       });

//       if (filters.role && user.role !== filters.role) {
//         matches = false;
//       }

//       if (!containsQuery) {
//         matches = false;
//       }
//     }

//     Object.keys(filters).forEach((key) => {
//       const value = filters[key];

//       if (value && user[key] !== value) {
//         // matches = false;
//       }
//     });

//     return matches;
//   });
// };

// const applyPaginationDormant = (
//   users: UserReportDormantContent[],
//   page: number,
//   limit: number
// ): UserReportDormantContent[] => {
//   return users?.slice(page * limit, page * limit + limit);
// };

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 58,
      height: 58,
      mr: 1,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
};

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const router = useRouter();
  const theme = useTheme();
  {
    console.log("auth ", useAuth());
  }

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    role: "",
  });

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage - 1);
  };

  const handlePageChangeTable = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
  };

  const [filtersIdCard, setFiltersIdCard] = useState({
    status: "all",
  });

  const [filtertabs, setFilterTabs] = useState({
    status: "all",
  });

  const statusTabs = [
    {
      value: "all",
      label: t("สถานีวัด 1"),
    },
    {
      value: "Administrator-HII",
      label: t("สถานีวัด 2"),
    },
    {
      value: "User-HII",
      label: t("สถานีวัด 3"),
    },
  ];

  const jobsTags: any = [
    { title: "สะสม 5 นาที" },
    { title: "สะสม 1 ชม." },
    { title: "สะสม 2 ชม." },
    { title: "สะสม 3 ชม." },
  ];

  const group: any = [
    {
      id: 1,
      label: "เจ้าหน้าที่ สสน.",
      checkbox: false,
    },
  ];

  const group1: any = [
    {
      id: 1,
      label: "ตรวจสอบแล้ว",
      checkbox: false,
    },
  ];

  const tab: any = {
    all: "all",
    one: "admin",
    two: "customer",
    three: "subscriber",
  };

  const tabs = [
    {
      id: 1,
      value: tab.all,
      label: t("USER_REPORT"),
    },
    // {
    //   id: 2,
    //   value: tab.one,
    //   label: t("รายงานบัญชีผู้ใช้ที่ครบกำหนดตรวจสอบ"),
    // },
    {
      id: 3,
      value: tab.two,
      label: t("รายงานบัญชีผู้ใช้ที่ไม่เคลื่อนไหว"),
    },
    {
      id: 4,
      value: tab.three,
      label: t("รายงานบัญชีผู้ใช้ใหม่"),
    },
  ];

  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const handleCreateUserOpen = () => {
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState<Date | null>(new Date());

  const handleChangeDatePicker = (newValue: Date | null) => {
    setValue(newValue);
  };

  const handleTabsChange = (_event: SyntheticEvent, tabsValue: unknown) => {
    let value = null;

    setReportDormantData(null);
    setReportData(null);
    setPath("");

    if (tabsValue !== tab.all) {
      value = tabsValue;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      role: value,
    }));

    setSelectedUsers([]);
  };

  const [chartOptions, setChartOption] = React.useState<ApexOptions>({
    stroke: {
      curve: "smooth",
      width: [0, 5],
    },
    theme: {
      mode: theme.palette.mode,
    },
    chart: {
      background: "transparent",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    markers: {
      hover: {
        sizeOffset: 2,
      },
      shape: "circle",
      size: 6,
      strokeWidth: 3,
      strokeOpacity: 1,
      strokeColors: theme.colors.alpha.white[100],
      colors: [theme.colors.error.main],
    },
    colors: [theme.colors.primary.main, theme.colors.error.main],
    fill: {
      opacity: 1,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        columnWidth: "50%",
      },
    },
    labels: [],
    dataLabels: {
      enabled: false,
    },
    grid: {
      // strokeDashArray: 5,
      // borderColor: theme.palette.divider
      show: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    yaxis: {
      show: false,
      tickAmount: 6,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
  });

  // const data = {
  //   visitors: "23,584",
  //   conversion: "7.23%",
  // };

  const [reportData, setReportData] = React.useState<ContentUserReportResult>();
  const [reportDormantData, setReportDormantData] =
    React.useState<ContentUserReportDormantResult>();
  // const [count, setCount] = useState([]);
  var count = [];
  // var month = [];
  const [chartData, setChartData] = useState([]);
  const [data, setData] = useState({
    visitors: "23,584",
    conversion: "7.23%",
  });

  const convertMonth = (monthNumber: any) => {
    // console.log("month number ", monthNumber);
    switch (monthNumber) {
      case 1 || "1":
        return "มกราคม";
      case 2 || "2":
        return "กุมภาพันธ์";
      case 3 || "3":
        return "มีนาคม";
      case 4 || "4":
        return "เมษายน";
      case 5 || "5":
        return "พฤษภาคม";
      case 6 || "6":
        return "มิถุนายน";
      case 7 || "7":
        return "กรกฏาคม";
      case 8 || "8":
        return "สิงหาคม";
      case 9 || "9":
        return "กันยายน";
      case 10 || "10":
        return "ตุลาคม";
      case 11 || "11":
        return "พฤศจิกายน";
      case 12 || "12":
        return "ธันวาคม";
      default:
        return "ธันวาคม";
    }
  };

  const [keyword, setKeyword] = useState<string>("user");
  const [type, setType] = useState<string>("");
  const [updateGraph, setUpdateGraph] = useState<string>("");
  const [month, setMonth] = useState<string[]>([]);

  const getReport = useCallback(
    async (parameter, limit, offset, keyword, type = "", path = "") => {
      setOpenBackdrop(true);
      try {
        const reportResult = await reportUserApi.getUserReport(
          parameter,
          limit,
          offset,
          keyword,
          type,
          path
        );
        // console.log("xxxxxx ", keyword);
        // if (filters.role === "subscriber") {
        // = useState(false);
        // setCount([]);
        if (keyword == "new_user") {
          count = [];
          // month = [];
          var count_newuser = 0;
          setMonth([]);
          reportResult?.content.reverse().map((val: any | null) => {
            console.log("month ", val);
            count.push(Number(val?.count_total));
            month.push(`${convertMonth(val?.month)}  ${val?.year}`);
            count_newuser += val?.count_total;
          });
          // chartOptions.labels = month;
          setData({
            visitors: String(count_newuser),
            conversion: "7.23%",
          });
          setChartOption({
            stroke: {
              curve: "smooth",
              width: [0, 5],
            },
            theme: {
              mode: theme.palette.mode,
            },
            chart: {
              background: "transparent",
              toolbar: {
                show: false,
              },
              zoom: {
                enabled: false,
              },
            },
            markers: {
              hover: {
                sizeOffset: 2,
              },
              shape: "circle",
              size: 6,
              strokeWidth: 3,
              strokeOpacity: 1,
              strokeColors: theme.colors.alpha.white[100],
              colors: [theme.colors.error.main],
            },
            colors: [theme.colors.primary.main, theme.colors.error.main],
            fill: {
              opacity: 1,
            },
            plotOptions: {
              bar: {
                horizontal: false,
                borderRadius: 8,
                columnWidth: "50%",
              },
            },
            labels: month,
            dataLabels: {
              enabled: false,
            },
            grid: {
              // strokeDashArray: 5,
              // borderColor: theme.palette.divider
              show: false,
            },
            legend: {
              show: false,
            },
            xaxis: {
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                style: {
                  colors: theme.palette.text.secondary,
                },
              },
            },
            yaxis: {
              show: false,
              tickAmount: 6,
              axisBorder: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                style: {
                  colors: theme.palette.text.secondary,
                },
              },
            },
          });
          setChartData([
            {
              name: "Visitors",
              type: "column",
              data: count,
            },
          ]);
        }
        // } else {
        setReportData(reportResult);
        setOpenBackdrop(false);
        // }
      } catch (err) {
        setOpenBackdrop(false);
        setReportData(null);
      }
    },
    []
  );

  const getDormantReport = useCallback(
    async (parameter, limit, offset, keyword, type = "", path = "") => {
      setOpenBackdrop(true);
      try {
        const reportResult = await reportUserApi.getDormantReport(
          parameter,
          limit,
          offset,
          keyword,
          type,
          path
        );
        console.log("dormant ", reportResult);
        setReportDormantData(reportResult);
        setOpenBackdrop(false);
      } catch (err) {
        setOpenBackdrop(false);
        setReportDormantData(null);
      }
    },
    []
  );

  useEffect(() => {
    // console.log("fill;l ", filters);
    setOpenBackdrop(true);
    if (filters.role === "subscriber") {
      //
      setKeyword("new_user");
      getReport("", limit, String(limit * page + 1 - 1), "new_user", "", path); //user
    }
    // else if (filters.role === "admin") {
    //   //role
    //   setKeyword("investigation");
    //   getReport(
    //     "",
    //     limit,
    //     String(limit * page + 1 - 1),
    //     "investigation",
    //     "",
    //     path
    //   );
    // }
    else if (filters.role === "customer") {
      setKeyword("dormant_account");
      getDormantReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "dormant_account",
        "",
        path
      );
    } else {
      setKeyword("user_role_scope");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "user_role_scope",
        "",
        path
      ); //new user
    }
  }, [filters.role, page, path, limit]);

  const fetchRequest = useCallback(() => {
    // console.log("fill;l ", filters);
    setOpenBackdrop(true);
    if (filters.role === "subscriber") {
      //
      setKeyword("new_user");
      getReport("", limit, String(limit * page + 1 - 1), "new_user", "", path); //user
    }
    // else if (filters.role === "admin") {
    //   //role
    //   setKeyword("investigation");
    //   getReport(
    //     "",
    //     limit,
    //     String(limit * page + 1 - 1),
    //     "investigation",
    //     "",
    //     path
    //   );
    // }
    else if (filters.role === "customer") {
      setKeyword("dormant_account");
      getDormantReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "dormant_account",
        "",
        path
      );
    } else {
      setKeyword("user_role_scope");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "user_role_scope",
        "",
        path
      ); //new user
    }
  }, [filters.role, page, path, limit]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const { enqueueSnackbar } = useSnackbar();

  const downloadReport = useCallback(async () => {
    // console.log("key ", keyword);
    setOpenBackdrop(true);

    enqueueSnackbar("กำลังทำดาวน์โหลดไฟล์ กรุณารอสักครู่", {
      variant: "success",
      anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
      },
      autoHideDuration: 5000,
      TransitionComponent: Slide,
    });

    await sleep(5000);

    try {
      // alert("Download Report");
      // const reportResult = await reportUserApi.downloadExportReport(
      //   "",
      //   limit,
      //   String(limit * page + 1 - 1),
      //   keyword,
      //   type,
      //   path
      // );

      downloadFile({
        // data: reportResult,
        // fileName: `${keyword + format(new Date(), "dd-MM-yyyy hh:mm:ss")}.csv`,
        // fileType: "text/csv",
        parameter: "",
        limit: limit,
        offset: String(limit * page + 1 - 1),
        keyword: keyword,
        type: type,
        path: path,
      });
      // setReportData(reportResult);
      // setOpenBackdrop(false);
    } catch (err) {
      setOpenBackdrop(false);
      // alert(err);
      enqueueSnackbar(
        "เกิดข้อผิดพลาดในการเชื่อมต่อ ลองใหม่อีกครั้ง " + err.message,
        {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          autoHideDuration: 10000,
          TransitionComponent: Slide,
        }
      );
      //   // setReportData(null);
      //   // setOpenBackdrop(false);
    }
  }, [keyword]);

  const downloadFile = async ({
    // data,
    // fileName,
    // fileType,
    parameter,
    limit,
    offset,
    keyword,
    type,
    path,
  }) => {
    // Create a blob with the data we want to download as a file
    // try {
    //   const blob = new Blob([data], { type: fileType });
    //   // Create an anchor element and dispatch a click event on it
    //   // to trigger a download
    //   const a = document.createElement("a");
    //   a.download = fileName;
    //   a.href = window.URL.createObjectURL(blob);
    //   const clickEvt = new MouseEvent("click", {
    //     view: window,
    //     bubbles: true,
    //     cancelable: true,
    //   });
    //   a.dispatchEvent(clickEvt);
    //   a.remove();
    //   setOpenBackdrop(false);
    //   enqueueSnackbar("ดาวน์โหลดสำเร็จ", {
    //     variant: "success",
    //     anchorOrigin: {
    //       vertical: "bottom",
    //       horizontal: "right",
    //     },
    //     autoHideDuration: 5000,
    //     TransitionComponent: Slide,
    //   });
    // } catch (error) {
    //   setOpenBackdrop(false);
    //   // alert(error);
    //   enqueueSnackbar(error, {
    //     variant: "error",
    //     anchorOrigin: {
    //       vertical: "bottom",
    //       horizontal: "right",
    //     },
    //     autoHideDuration: 5000,
    //     TransitionComponent: Slide,
    //   });
    // }

    try {
      // const uuid = localStorage.getItem(server.UUID);
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.USER_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`,
        {
          headers: {
            method: "GET",
            device: localStorage.getItem("device"),
            access_token: localStorage.getItem("refresh_token"),
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem(
            //   server.REFRESH_TOKEN_KEY
            // )}`,
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            Accept: "application/json",
          },
        }
      )
        // .then((result) => result.json())
        .then((response) => {
          // console.log("res ", response);
          // if (response.code === 200) {
          response.blob().then((blob) => {
            setOpenBackdrop(false);
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = `${
              keyword + format(new Date(), "dd-MM-yyyy hh:mm:ss")
            }`;
            a.click();
          });
          // } else {
          //   setOpenBackdrop(false);
          //   enqueueSnackbar(response.description.message, {
          //     variant: "error",
          //     anchorOrigin: {
          //       vertical: "bottom",
          //       horizontal: "right",
          //     },
          //     autoHideDuration: 5000,
          //     TransitionComponent: Slide,
          //   });
          // }
        });
    } catch (error) {
      // alert(error);
      // alert(error);
      console.log("erruser ", error);
      setOpenBackdrop(false);
      enqueueSnackbar("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        autoHideDuration: 5000,
        TransitionComponent: Slide,
      });
    }
  };

  // const filteredUsers = applyFilters(reportData, query, filters);
  // const paginatedUsers = applyPagination(filteredUsers, page, limit);

  // const filteredDormant = applyFiltersDormant(
  //   reportDormantData,
  //   query,
  //   filters
  // );
  // const paginatedDormant = applyPaginationDormant(filteredDormant, page, limit);

  const formik = useFormik({
    initialValues: {
      first_name: "wittawad",
      last_name: "paeyor",
      email: "admin@gmail.com",
      users_group: "",
      agency: { label: "Swift", value: "Swift" },
      submit: null,
    },
    validationSchema: Yup.object({
      // first_name: Yup.string()
      //    .max(255)
      //    .required(t('The first name field is required')),
      // last_name: Yup.string()
      //    .max(255)
      //    .required(t('The last name field is required')),
      // email: Yup.string()
      //    .email(t('The email provided should be a valid email address'))
      //    .max(255)
      //    .required(t('The email field is required')),
      // users_group: Yup.string()
      //    .max(255)
      //    .required(t('The users group field is required')),
      // agency: Yup.string()
      //    .max(255)
      //    .required(t('The agency field is required')),
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        console.log("onSubmit", values);
        //    await register(values.email, values.name, values.password);

        //    if (isMountedRef()) {
        //       const backTo =
        //          (router.query.backTo as string) || '/dashboards/reports';
        //       router.push(backTo);
        //    }
      } catch (err) {
        console.error(err);

        if (isMountedRef()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{ mb: { xs: 2, sm: 0, md: 2 } }}
      >
        <Grid item xs={12}>
          <Box
            display="flex"
            alignItems="center"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
          >
            <TabsWrapper
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="secondary"
              value={filters.role || tab.all}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} value={tab.value} label={tab.label} />
              ))}
            </TabsWrapper>
          </Box>
        </Grid>

        <Grid item md={12} sm={8} xs={12}>
          <Stack spacing={2} direction="row">
            <TextField
              sx={{ backgroundColor: "white", borderRadius: "10px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchTwoToneIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
              onChange={handleQueryChange}
              placeholder={t("SEARCH")}
              value={query}
              // size="small"
              fullWidth
              margin="normal"
              variant="outlined"
            />

            <Box sx={{ pt: { xs: 0, sm: 2 }, paddingBottom: 0 }}>
              <Button
                color={openSearch ? "error" : "primary"}
                // fullWidth
                sx={{ whiteSpace: "nowrap" }}
                size="large"
                type="submit"
                variant="contained"
                onClick={() => {
                  setOpenSearch(!openSearch);
                  openSearch ? setPath("") : setPath(path);
                }}
              >
                {openSearch ? t("CLOSE_ADVANCED_SEARCH") : t("ADVANCED_SEARCH")}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {keyword && openSearch && (
        // <FilterData
        //   page={"user_report"}
        //   tab={tab}
        //   formik={formik}
        //   filtersRole={filters}
        //   footer={true}
        // />
        <FilterDataReportUser
          page={"user_report"}
          tab={tab}
          formik={formik}
          filtersRole={filters}
          footer={true}
          onClick={(e) => {
            if (e === path) {
              fetchRequest();
            } else {
              setPath(e);
            }
            // console.log("clicl path ", e);
            // setPath(e);
            // filters.role === "customer"
            //   ? getDormantReport(
            //       "",
            //       limit,
            //       String(limit * page + 1 - 1),
            //       keyword,
            //       type,
            //       e
            //     )
            //   : getReport(
            //       "",
            //       limit,
            //       String(limit * page + 1 - 1),
            //       keyword,
            //       type,
            //       e
            //     );
          }}
        />
      )}
      {console.log("update ", chartOptions)}
      <Card>
        {chartOptions && chartData && filters.role !== tab.three && (
          <>
            <Grid container spacing={2} p={2}>
              <Grid
                item
                xs={12}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Stack spacing={2} direction="row" alignItems={"center"}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    component="div"
                    marginY={"auto"}
                  >
                    {filters.role === tab.one
                      ? t("รายงานบัญชีผู้ใช้ที่ครบกำหนดตรวจสอบ")
                      : filters.role === tab.two
                      ? t("รายงานบัญชีผู้ใช้ที่ไม่เคลื่อนไหว")
                      : filters.role === tab.three
                      ? t("รายงานบัญชีผู้ใช้ใหม่")
                      : t("USER_REPORT")}
                  </Typography>

                  {filters.role !== tab.three && (
                    <Typography variant="body2">
                      <Button
                        onClick={(e) => {
                          downloadReport();
                        }}
                      >
                        <b>{t("DOWNLOAD_REPORT")}</b>
                      </Button>
                    </Typography>
                  )}
                </Stack>

                {filters.role === "report_file" && (
                  <Typography
                    variant="h4"
                    gutterBottom
                    component="div"
                    marginY={"auto"}
                  >
                    <Button
                      onClick={(e) => {
                        downloadReport();
                      }}
                    >
                      <b>{t("DOWNLOAD_REPORT")}</b>
                    </Button>
                  </Typography>
                )}

                <TablePagination
                  component="div"
                  count={
                    filters.role === "customer"
                      ? reportDormantData?.pagination?.total_items ?? 0
                      : reportData?.pagination?.total_items ?? 0
                  }
                  onPageChange={handlePageChangeTable}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  labelRowsPerPage={null}
                  rowsPerPageOptions={[
                    {
                      label: `${t("SHOW")} ${5} ${t("PER_PAGE_LIST")}`,
                      value: 5,
                    },
                    {
                      label: `${t("SHOW")} ${10} ${t("PER_PAGE_LIST")}`,
                      value: 10,
                    },
                    {
                      label: `${t("SHOW")} ${15} ${t("PER_PAGE_LIST")}`,
                      value: 15,
                    },
                  ]}
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}–${to} ${t("OF")} ${
                      count !== -1 ? count : `${t("MORE_THAN")} ${to}`
                    }`
                  }
                />
              </Grid>
            </Grid>

            <Divider />
          </>
        )}
        {/* {chartData && console.log("user ", chartData)} */}
        {filters.role === "customer" ? (
          reportDormantData && reportDormantData?.content?.length === 0 ? (
            <>
              <Typography
                sx={{
                  py: 10,
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                {`ไม่พบข้อมูล${
                  tab.find((val) => val?.value === filters.role)?.label ??
                  tab[0].label
                }`}
              </Typography>
            </>
          ) : (
            <>
              {filters.role === tab.three ? (
                <>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                      }}
                    >
                      {chartData && (
                        <Chart
                          options={chartOptions}
                          series={chartData}
                          type="line"
                          height={550}
                        />
                      )}
                      <Box
                        sx={{
                          px: { lg: 4 },
                          pt: 3,
                          pb: 2,
                          height: "100%",
                          flex: 1,
                          textAlign: "center",
                        }}
                      >
                        <Grid spacing={3} container>
                          <Grid item md={4}>
                            <Typography variant="caption" gutterBottom>
                              {t("จำนวนผู้ใช้ใหม่")}
                            </Typography>
                            <Typography variant="h3">
                              {data.visitors}
                            </Typography>
                          </Grid>
                          <Grid item md={4}>
                            <Typography variant="caption" gutterBottom>
                              {t("เพิ่มขึ้น")}
                            </Typography>
                            <Typography variant="h3">
                              {data.conversion}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </Card>
                </>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: 160 }} align="center">
                            {t("NO.")}
                          </TableCell>
                          <TableCell>{t("FULL_NAME")}</TableCell>
                          <TableCell>{t("AGENCY")}</TableCell>
                          <TableCell>{t("USER_GROUP")}</TableCell>

                          {filters.role === tab.two ? null : filters.role ===
                            tab.three ? null : (
                            <TableCell>{t("วันที่เข้าใช้งานล่าสุด")}</TableCell>
                          )}

                          {filters.role === tab.one && (
                            <>
                              <TableCell>{t("วันที่ตรวจสอบล่าสุด")}</TableCell>
                              <TableCell>{t("สถานะการตรวจสอบ")}</TableCell>
                            </>
                          )}

                          {filters.role === tab.two && (
                            <>
                              <TableCell>
                                {t("ระยะเวลาที่ไม่เคลื่อนไหว")}
                              </TableCell>
                              <TableCell>{t("ปิดสิทธิ์การใช้งาน")}</TableCell>
                            </>
                          )}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filters.role === "customer" &&
                          reportDormantData &&
                          reportDormantData.content?.map((user, index) => {
                            return (
                              // <NextLink href={"/admin/report/single/1"}>
                              <TableRow hover key={index}>
                                <TableCell align="center">
                                  <Typography fontWeight="bold">
                                    {limit * page + 1 + index}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  {/* <Box display="flex" alignItems="center">
                                             <Typography>{user.email}</Typography>
                                          </Box> */}
                                  <Box display="flex" alignItems="center">
                                    {/* <Avatar
                                  {...stringAvatar(`${user.name}`)}
                                  src={`${
                                    user.image_path ? user.image_path : null
                                  }`}
                                /> */}
                                    <Box>
                                      <Typography fontWeight="bold">
                                        <Stack direction="row" spacing={1}>
                                          <Typography>
                                            <b>{user?.fullname ?? "-"}</b>
                                          </Typography>
                                          {/* <Typography>
                                                         <b>{user.name}</b>
                                                      </Typography> */}
                                        </Stack>
                                      </Typography>
                                      {/* <Typography noWrap variant="subtitle2">
                                      {user.email}
                                    </Typography> */}
                                    </Box>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    {user.department.map((val) => {
                                      return (
                                        <Typography>
                                          {val?.th ?? "-"}
                                        </Typography>
                                      );
                                    })}
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Grid container spacing={1}>
                                    <Grid item key={index}>
                                      <Label color="success">
                                        {user?.role ?? "-"}
                                        <CheckCircleOutlineIcon
                                          sx={{
                                            fontSize: "15px",
                                            marginLeft: "4px",
                                          }}
                                        />
                                      </Label>
                                    </Grid>
                                  </Grid>
                                </TableCell>

                                {filters.role ===
                                tab.two ? null : filters.role ===
                                  tab.three ? null : (
                                  <TableCell>
                                    <Box display="flex" alignItems="center">
                                      <Typography>
                                        15 กรกฏาคม 2565 เวลา 08:30 น.
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                )}

                                {filters.role === tab.one && (
                                  <>
                                    <TableCell>
                                      <Box display="flex" alignItems="center">
                                        <Typography>
                                          31 กรกฏาคม 2565 เวลา 08:30 น.
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Grid container spacing={1}>
                                        {group1
                                          .slice(
                                            0,
                                            Math.floor(
                                              Math.random() * (5 - 1 + 1)
                                            ) + 1
                                          )
                                          .map((value, index) => {
                                            return (
                                              <Grid item key={index}>
                                                {console.log(index)}
                                                <Label color="success">
                                                  {value.label}
                                                  <CheckCircleOutlineIcon
                                                    sx={{
                                                      fontSize: "15px",
                                                      marginLeft: "4px",
                                                    }}
                                                  />
                                                </Label>
                                              </Grid>
                                            );
                                          })}
                                      </Grid>
                                    </TableCell>
                                  </>
                                )}

                                {filters.role === tab.two && (
                                  <>
                                    <TableCell>
                                      <Grid container spacing={1}>
                                        <Grid item key={index}>
                                          <Label color="success">
                                            {/* {user?.lasted_date ?? "-"} */}
                                            {user?.lasted_date ? (
                                              <ConvertDateTimeFormat
                                                date={user?.lasted_date}
                                              />
                                            ) : (
                                              "-"
                                            )}
                                            <CheckCircleOutlineIcon
                                              sx={{
                                                fontSize: "15px",
                                                marginLeft: "4px",
                                              }}
                                            />
                                          </Label>
                                        </Grid>
                                        {/* {group1
                                        .slice(
                                          0,
                                          Math.floor(
                                            Math.random() * (5 - 1 + 1)
                                          ) + 1
                                        )
                                        .map((value, index) => {
                                          return (
                                            <Grid item key={index}>
                                              {console.log(index)}
                                              <Label color="success">
                                                {value.label}
                                                <CheckCircleOutlineIcon
                                                  sx={{
                                                    fontSize: "15px",
                                                    marginLeft: "4px",
                                                  }}
                                                />
                                              </Label>
                                            </Grid>
                                          );
                                        })} */}
                                      </Grid>
                                    </TableCell>
                                  </>
                                )}

                                {filters.role === tab.two && (
                                  <TableCell>
                                    <AntSwitch color="success" />
                                  </TableCell>
                                )}
                              </TableRow>
                              // </NextLink>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box p={3} display="flex" justifyContent="center">
                    <Pagination
                      shape="rounded"
                      size="large"
                      color="primary"
                      onChange={handlePageChange}
                      count={reportDormantData?.pagination.total_pages}
                      page={page + 1}
                      defaultPage={0}
                    />
                  </Box>
                </>
              )}
            </>
          )
        ) : reportData && reportData?.content?.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10,
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {`ไม่พบข้อมูล${
                tab.find((val) => val?.value === filters.role)?.label ??
                tab[0].label
              }`}
            </Typography>
          </>
        ) : (
          <>
            {filters.role === tab.three ? (
              <>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                    }}
                  >
                    {chartOptions && chartData && (
                      <Chart
                        options={chartOptions}
                        series={chartData}
                        type="line"
                        height={550}
                      />
                    )}
                    <Box
                      sx={{
                        px: { lg: 4 },
                        pt: 3,
                        pb: 2,
                        height: "100%",
                        flex: 1,
                        textAlign: "center",
                      }}
                    >
                      <Grid spacing={3} container>
                        <Grid item md={4}>
                          <Typography variant="caption" gutterBottom>
                            {t("จำนวนผู้ใช้ใหม่")}
                          </Typography>
                          <Typography variant="h3">{data.visitors}</Typography>
                        </Grid>
                        <Grid item md={4}>
                          <Typography variant="caption" gutterBottom>
                            {t("เพิ่มขึ้น")}
                          </Typography>
                          <Typography variant="h3">
                            {data.conversion}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Card>
              </>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ width: 160 }} align="center">
                          {t("NO.")}
                        </TableCell>
                        <TableCell>{t("FULL_NAME")}</TableCell>
                        <TableCell>{t("AGENCY")}</TableCell>
                        <TableCell>{t("USER_GROUP")}</TableCell>

                        {filters.role === tab.two ? null : filters.role ===
                          tab.three ? null : (
                          <TableCell>{t("วันที่เข้าใช้งานล่าสุด")}</TableCell>
                        )}

                        {filters.role === tab.one && (
                          <>
                            <TableCell>{t("วันที่ตรวจสอบล่าสุด")}</TableCell>
                            {/* <TableCell>{t("สถานะการตรวจสอบ")}</TableCell> */}
                          </>
                        )}

                        {filters.role === tab.two && (
                          <>
                            <TableCell>
                              {t("ระยะเวลาที่ไม่เคลื่อนไหว")}
                            </TableCell>
                            <TableCell>{t("ปิดสิทธิ์การใช้งาน")}</TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData &&
                        reportData?.content?.map((user, index) => {
                          return (
                            // <NextLink href={"/admin/report/single/1"}>
                            <TableRow hover key={index}>
                              <TableCell align="center">
                                <Typography fontWeight="bold">
                                  {limit * page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {/* <Box display="flex" alignItems="center">
                                             <Typography>{user.email}</Typography>
                                          </Box> */}
                                <Box display="flex" alignItems="center">
                                  {/* <Avatar
                                  {...stringAvatar(`${user.name}`)}
                                  src={`${
                                    user.image_path ? user.image_path : null
                                  }`}
                                /> */}
                                  <Box>
                                    <Typography fontWeight="bold">
                                      <Stack direction="row" spacing={1}>
                                        <Typography>
                                          <b>{user?.fullname ?? "-"}</b>
                                        </Typography>
                                        {/* <Typography>
                                                         <b>{user.name}</b>
                                                      </Typography> */}
                                      </Stack>
                                    </Typography>
                                    {/* <Typography noWrap variant="subtitle2">
                                      {user.email}
                                    </Typography> */}
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>
                                    {" "}
                                    {user.department?.th ?? "-"}
                                  </Typography>

                                  {/* {user.department.map((val) => {
                                    return (
                                      <Typography>{val?.th ?? "-"}</Typography>
                                    );
                                  })} */}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Grid container spacing={1}>
                                  <Grid item key={index}>
                                    <Label color="success">
                                      {user?.role ?? "-"}
                                      <CheckCircleOutlineIcon
                                        sx={{
                                          fontSize: "15px",
                                          marginLeft: "4px",
                                        }}
                                      />
                                    </Label>
                                  </Grid>
                                </Grid>
                              </TableCell>

                              {!filters.role && (
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Typography>
                                      {user?.timestamp ? (
                                        <ConvertDateTimeFormat
                                          date={user?.timestamp}
                                        />
                                      ) : (
                                        "-"
                                      )}
                                      {/* {user?.timestamp
                                        ? format(
                                            new Date(user?.timestamp),
                                            "dd MMMM yyyy"
                                          )
                                        : "-"} */}
                                    </Typography>
                                  </Box>
                                </TableCell>
                              )}

                              {filters.role === tab.one && (
                                <>
                                  <TableCell>
                                    <Box display="flex" alignItems="center">
                                      <Typography>
                                        31 กรกฏาคม 2565 เวลา 08:30 น.
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box display="flex" alignItems="center">
                                      <Typography>
                                        31 กรกฏาคม 2565 เวลา 08:30 น.
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  {/* <TableCell>
                                    <Grid container spacing={1}>
                                      {group1
                                        .slice(
                                          0,
                                          Math.floor(
                                            Math.random() * (5 - 1 + 1)
                                          ) + 1
                                        )
                                        .map((value, index) => {
                                          return (
                                            <Grid item key={index}>
                                              {console.log(index)}
                                              <Label color="success">
                                                {value.label}
                                                <CheckCircleOutlineIcon
                                                  sx={{
                                                    fontSize: "15px",
                                                    marginLeft: "4px",
                                                  }}
                                                />
                                              </Label>
                                            </Grid>
                                          );
                                        })}
                                    </Grid>
                                  </TableCell> */}
                                </>
                              )}

                              {filters.role === tab.two && (
                                <>
                                  <TableCell>
                                    <Grid container spacing={1}>
                                      <Grid item key={index}>
                                        <Label color="success">
                                          {/* {user?.lasted_date ?? "-"} */}
                                          <CheckCircleOutlineIcon
                                            sx={{
                                              fontSize: "15px",
                                              marginLeft: "4px",
                                            }}
                                          />
                                        </Label>
                                      </Grid>
                                      {/* {group1
                                        .slice(
                                          0,
                                          Math.floor(
                                            Math.random() * (5 - 1 + 1)
                                          ) + 1
                                        )
                                        .map((value, index) => {
                                          return (
                                            <Grid item key={index}>
                                              {console.log(index)}
                                              <Label color="success">
                                                {value.label}
                                                <CheckCircleOutlineIcon
                                                  sx={{
                                                    fontSize: "15px",
                                                    marginLeft: "4px",
                                                  }}
                                                />
                                              </Label>
                                            </Grid>
                                          );
                                        })} */}
                                    </Grid>
                                  </TableCell>
                                </>
                              )}

                              {filters.role === tab.two && (
                                <TableCell>
                                  <AntSwitch color="success" />
                                </TableCell>
                              )}
                            </TableRow>
                            // </NextLink>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box p={3} display="flex" justifyContent="center">
                  <Pagination
                    shape="rounded"
                    size="large"
                    color="primary"
                    onChange={handlePageChange}
                    count={reportData?.pagination?.total_pages ?? 0}
                    page={page + 1}
                    defaultPage={0}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </Card>

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateUserClose}
      >
        <DialogTitle
          sx={{
            p: 3,
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t("FINISHED_DATA")}
          </Typography>
        </DialogTitle>
        <Divider />
        <Formik
          initialValues={{
            thai_name: "",
            english_name: "",
            sub_user_group: "",
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            thai_name: Yup.string()
              .max(255)
              .required(t("The first name field is required")),
            english_name: Yup.string()
              .max(255)
              .required(t("The last name field is required")),
            sub_user_group: Yup.string()
              .max(255)
              .required(t("The last name field is required")),
          })}
          onSubmit={async (values) => {
            console.log(values);
          }}
        >
          {({ errors, handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                sx={{
                  p: 3,
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" component="h4">
                      {t("FILTER")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel>{t("AGENCY")}</InputLabel>
                          <Select
                            value={filtertabs.status}
                            onChange={(selectedOption) => {
                              let e = {
                                target: {
                                  name: `id_card_type`,
                                  value: selectedOption.target.value,
                                },
                              };
                              // props.onChange(e);
                              setFilterTabs({ status: e.target.value });
                            }}
                            label={t("AGENCY")}
                          >
                            {statusTabs.map((statusTabs) => (
                              <MenuItem
                                key={statusTabs.value}
                                value={statusTabs.value}
                              >
                                {statusTabs.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Autocomplete
                          multiple
                          limitTags={1}
                          options={jobsTags}
                          getOptionLabel={(option) => option.title}
                          defaultValue={[jobsTags[0]]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              variant="outlined"
                              label={t("DURATION")}
                              // placeholder={t('เลือกแท็ก...')}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DesktopDatePicker
                          label="ตั้งแต่วันที่"
                          inputFormat="dd-MM-yyyy"
                          value={value}
                          onChange={handleChangeDatePicker}
                          renderInput={({ inputProps, ...params }) => (
                            <TextField
                              // InputProps={{
                              //   readOnly: true,
                              // }}
                              {...params}
                              inputProps={{
                                ...inputProps,
                                readOnly: true,
                              }}
                              disabled={true}
                              margin="normal"
                              variant="outlined"
                              fullWidth
                              name="start"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DesktopDatePicker
                          label={t("UP_TO_DATE")}
                          inputFormat="dd-MM-yyyy"
                          value={value}
                          onChange={handleChangeDatePicker}
                          renderInput={({ inputProps, ...params }) => (
                            <TextField
                              // InputProps={{
                              //   readOnly: true,
                              // }}
                              {...params}
                              inputProps={{
                                ...inputProps,
                                readOnly: true,
                              }}
                              disabled={true}
                              margin="normal"
                              variant="outlined"
                              fullWidth
                              name="start"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <PersonalOrganizationComponent
                      title={t("ORGANIZATION_INFORMATION")}
                      document={true}
                      downloadAll={true}
                      //  defaultData={initialValues.detail}
                      // getInitial={initialValues}
                      // onChange={(e: any) =>
                      //     (initialValues.organization = e.target.value)
                      // }
                      BoxUploadWrapper={BoxUploadWrapper}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleCreateUserClose}
                >
                  {t("CLOSE")}
                </Button>
                <Button
                  type="submit"
                  disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                >
                  {t("AGREE")}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
};

// Results.propTypes = {
//   users: PropTypes.array.isRequired,
// };

// Results.defaultProps = {
//   users: [],
// };

export default Results;
