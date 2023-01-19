import {
  FC,
  ChangeEvent,
  SyntheticEvent,
  useState,
  useCallback,
  useEffect,
} from "react";

import PropTypes from "prop-types";
import {
  Box,
  Grid,
  InputAdornment,
  TextField,
  Button,
  styled,
  Tab,
  Tabs,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
  Slide,
  CircularProgress,
} from "@mui/material";

// import type { User } from "src/models/user";
import { useTranslation } from "react-i18next";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useSnackbar } from "notistack";
import React from "react";
import { FilterData } from "@/components/FilterData";
import { useRouter } from "next/router";
import { TableComponent, TableType } from "@/components/TableComponent";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  ContentWaterReliableReportResult,
  ContentWaterReportResult,
  WaterReportContent,
  WaterReportReliableContent,
} from "@/types/report.water.type";
import { reportWaterApi } from "@/actions/report.water.action";
import SimpleBackdrop, { SimpleSnackbar } from "@/components/Backdrop";
import { FilterDataReportWater } from "@/components/FilterDataReportWater";
import { format } from "date-fns";
import { server } from "@/constants";
import axios from "axios";

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

// interface ResultsProps {
//   users: User[];
// }

interface Filters {
  role?: string;
  type: TableType;
}

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const router = useRouter();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>("");
  const [path, setPath] = useState<string>(
    "&category_uuid=5620a034-ec91-4b8f-9543-841c32fdcdd7&interval_uuid=a71e8a08-0c1d-4ec9-9f14-84f740adbcdb"
  );
  const [filters, setFilters] = useState<Filters>({
    role: "",
    type: TableType.DATA_REPORT_NOT_UPDATE,
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

  // const filteredUsers = applyFilters(users, query, filters);
  // const paginatedUsers = applyPagination(filteredUsers, page, limit);

  const [filtertabs, setFilterTabs] = useState({
    status: null,
  });

  const tabs = [
    {
      value: "data_report_not_update",
      label: t("THE_DATA_REPORT_NOT_UPDATE"),
      type: TableType.DATA_REPORT_NOT_UPDATE,
    },
    {
      value: "data_integrity_report",
      label: t("DATA_INTEGRITY_REPORT"),
      type: TableType.DATA_INTEGRITY_REPORT,
    },
    {
      value: "data_accuracy_report",
      label: t("DATA_ACCURACY_REPORT"),
      type: TableType.DATA_ACCURACY_REPORT,
    },
    {
      value: "report_timeliness_data",
      label: t("REPORT_TIMELINESS_DATA"),
      type: TableType.REPORT_TIMELINESS_DATA,
    },
    {
      value: "data_import_work_history",
      label: t("DATA_IMPORT_WORK_HISTORY"),
      type: TableType.DATA_IMPORT_WORK_HISTORY,
    },
  ];

  const [openSearch, setOpenSearch] = useState(false);

  const [value, setValue] = React.useState<Date | null>(new Date());

  const handleChangeDatePicker = (newValue: Date | null) => {
    setValue(newValue);
  };
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const handleTabsChange = (_event: SyntheticEvent, tabsValue: TableType) => {
    let value = null;

    setReportData(null);
    setReportReliableData(null);
    setPage(0);

    if (tabsValue !== TableType.SERVICE_REPORT) {
      value = tabsValue;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      role: value,
      type: tabsValue,
    }));

    setSelectedUsers([]);
  };

  const [reportData, setReportData] =
    React.useState<ContentWaterReportResult>();
  const [reportReliableData, setReportReliableData] =
    React.useState<ContentWaterReliableReportResult>();
  const [keyword, setKeyword] = useState<string>("out-of-date");
  const [type, setType] = useState<string>("CN_MTWS2");

  const getReport = useCallback(
    async (parameter, limit, offset, keyword, type = "", path = "") => {
      setOpenBackdrop(true);
      try {
        const reportResult = await reportWaterApi.getWaterReport(
          parameter,
          limit,
          offset,
          keyword,
          type,
          path
        );
        setReportData(reportResult);
        setOpenBackdrop(false);
      } catch (err) {
        setReportData(null);
        setOpenBackdrop(false);
      }
    },
    []
  );

  const getReliableReport = useCallback(
    async (parameter, limit, offset, keyword, type = "", path = "") => {
      setOpenBackdrop(true);
      try {
        const reportResult = await reportWaterApi.getWaterReliableReport(
          parameter,
          limit,
          offset,
          keyword,
          type,
          path
        );
        // console.log("dormant ", reportResult);
        setReportReliableData(reportResult);
        setOpenBackdrop(false);
      } catch (err) {
        setReportReliableData(null);
        setOpenBackdrop(false);
      }
    },
    []
  );

  const getWaterReportImportLog = useCallback(
    async (parameter, limit, offset, keyword, type = "", path = "") => {
      setOpenBackdrop(true);
      try {
        const reportResult = await reportWaterApi.getWaterReportImportLog(
          parameter,
          limit,
          offset,
          keyword,
          type,
          path
        );
        // console.log("dormant ", reportResult);
        setReportData(reportResult);
        setOpenBackdrop(false);
      } catch (err) {
        setReportData(null);
        setOpenBackdrop(false);
      }
    },
    []
  );

  useEffect(() => {
    // console.log("filll ", filters);
    if (String(filters.role) === String(10)) {
      setKeyword("import_log");
      setType("CN_MTWS2");
      getWaterReportImportLog(
        "",
        limit,
        String(limit * page + 1 - 1),
        "import_log",
        "",
        path
      ); //user
    } else if (String(filters.role) === String(7)) {
      //role
      setKeyword("consistency");
      setType("");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "consistency",
        "",
        path
      );
    } else if (String(filters.role) === String(8)) {
      setKeyword("reliable");
      setType("");
      getReliableReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "reliable",
        "",
        path
      );
    } else if (String(filters.role) === String(9)) {
      setKeyword("timeliness");
      setType("");
      getReliableReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "timeliness",
        "",
        path
      );
    } else {
      setKeyword("out-of-date");
      setType("");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "out-of-date",
        "",
        path
      ); //user
      // getReport("", "user"); //new user
    }
  }, [filters, page, path, limit]);

  const fetchRequest = useCallback(() => {
    if (String(filters.role) === String(10)) {
      setKeyword("import_log");
      setType("CN_MTWS2");
      getWaterReportImportLog(
        "",
        limit,
        String(limit * page + 1 - 1),
        "import_log",
        "",
        path
      ); //user
    } else if (String(filters.role) === String(7)) {
      //role
      setKeyword("consistency");
      setType("");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "consistency",
        "",
        path
      );
    } else if (String(filters.role) === String(8)) {
      setKeyword("reliable");
      setType("");
      getReliableReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "reliable",
        "",
        path
      );
    } else if (String(filters.role) === String(9)) {
      setKeyword("timeliness");
      setType("");
      getReliableReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "timeliness",
        "",
        path
      );
    } else {
      setKeyword("out-of-date");
      setType("");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "out-of-date",
        "",
        path
      ); //user
      // getReport("", "user"); //new user
    }
  }, [filters, page, path, limit]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const downloadReport = useCallback(async () => {
    // console.log("key ", keyword);
    setOpenBackdrop(true);
    // setOpenSnackbar(true);
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
      // const reportResult = await reportWaterApi.downloadExportReport(
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
      // setOpenSnackbar(false);
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
      // console.log("err ", err);

      // setOpenSnackbar(false);
      // alert(err);
      //   // setReportData(null);
      //   // setOpenBackdrop(false);
    }
  }, [keyword, page, path]);

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
    //   // setOpenSnackbar(false);
    // } catch (error) {
    //   setOpenBackdrop(false);
    //   enqueueSnackbar(error, {
    //     variant: "error",
    //     anchorOrigin: {
    //       vertical: "bottom",
    //       horizontal: "right",
    //     },
    //     autoHideDuration: 5000,
    //     TransitionComponent: Slide,
    //   });
    //   // setOpenSnackbar(false);
    //   // alert(error);
    // }
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`,
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
          // console.log("responsexx ", response);
          // if (response.code === 200) {
          response.blob().then((blob) => {
            setOpenBackdrop(false);
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement("a");
            a.href = url;
            a.download = `${keyword + format(new Date(), "dd-MM-yyyy hh:mm:ss")
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
      // }
    } catch (error) {
      // alert(error);
      // alert(error);
      // setOpenBackdrop(false);
      // setOpenSnackbar(false);
      console.log("error ", error);
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
    //   const access_Token = localStorage.getItem(server.ACCESS_TOKEN_KEY);
    //   const refresh_Token = localStorage.getItem(server.REFRESH_TOKEN_KEY);
    //   const device = localStorage.getItem("device");
    //   const instance = axios.create({
    //     headers: {
    //       Authorization: `Bearer ${access_Token}`,
    //       device: device,
    //     },
    //     baseURL: `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`,
    //     timeout: 0,
    //   });
    //   const result = await instance
    //     .get(
    //       `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download${parameter}${path}`
    //     )
    //     .then((response) => {
    //       response.blob().then((blob) => {
    //         setOpenBackdrop(false);
    //         let url = window.URL.createObjectURL(blob);
    //         let a = document.createElement("a");
    //         a.href = url;
    //         a.download = `${keyword + format(new Date(), "dd-MM-yyyy hh:mm:ss")}`;
    //         a.click();
    //       });
    //     });
  };

  // const search = (path) => {
  //   if (String(filters.role) === String(10)) {
  //     getWaterReportImportLog(
  //       "",
  //       limit,
  //       String(limit * page + 1 - 1),
  //       keyword,
  //       type,
  //       path
  //     ); //user
  //     setPath(path);
  //   } else if (String(filters.role) === String(7)) {
  //     getReport("", limit, String(limit * page + 1 - 1), keyword, type, path);
  //     setPath(path);
  //   } else if (String(filters.role) === String(8)) {
  //     getReliableReport(
  //       "",
  //       limit,
  //       String(limit * page + 1 - 1),
  //       keyword,
  //       type,
  //       path
  //     );
  //     setPath(path);
  //   } else if (String(filters.role) === String(9)) {
  //     getReliableReport(
  //       "",
  //       limit,
  //       String(limit * page + 1 - 1),
  //       keyword,
  //       type,
  //       path
  //     );
  //     setPath(path);
  //   } else {
  //     getReport("", limit, String(limit * page + 1 - 1), keyword, type, path);
  //     setPath(path); //user
  //   }
  // };

  // const filteredUsers = applyFilters(reportData, query, filters);
  // const paginatedUsers = applyPagination(filteredUsers, page, limit);

  // const filteredReliable = applyFiltersReliable(
  //   reportReliableData,
  //   query,
  //   filters
  // );
  // const paginatedReliable = applyPaginationReliable(
  //   filteredReliable,
  //   page,
  //   limit
  // );

  // const snackBar = (open) => {
  //   //<CircularProgress style={{ padding: "10px" }} />;
  //   enqueueSnackbar("กำลังดาวน์โหลดไฟล์ กรุณารอสักครู่", {
  //     variant: "success",
  //     anchorOrigin: {
  //       vertical: "bottom",
  //       horizontal: "right",
  //     },
  //     // autoHideDuration: 1000000,
  //     TransitionComponent: Slide,
  //   });
  // };

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      {SimpleSnackbar(openSnackbar)}
      {/* {openBackdrop &&
        enqueueSnackbar("กำลังดาวน์โหลดไฟล์ กรุณารอสักครู่", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          // autoHideDuration: 1000000,
          TransitionComponent: Slide,
        })} */}
      {/* {openSnackbar && <CircularProgress style={{ padding: "10px" }} />} */}
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
              value={filters.type || TableType.DATA_REPORT_NOT_UPDATE}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab key={tab.value} value={tab.type} label={tab.label} />
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
                  setOpenSearch(!openSearch),
                    openSearch
                      ? setPath(
                        "&category_uuid=5620a034-ec91-4b8f-9543-841c32fdcdd7&interval_uuid=a71e8a08-0c1d-4ec9-9f14-84f740adbcdb"
                      )
                      : setPath(path);
                }}
              >
                {openSearch ? t("CLOSE_ADVANCED_SEARCH") : t("ADVANCED_SEARCH")}
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {openSearch && (
        <FilterDataReportWater
          headder={false}
          page={"connect_import_report"}
          filtersRole={filters.type}
          footer={true}
          // onClick={(e) => search(e)}
          onClick={(e) => {
            if (e === path) {
              fetchRequest();
            } else {
              setPath(e);
            }
          }}
        />
      )}
      {/* {console.log("user ", filteredUsers)} */}
      {keyword && (
        <TableComponent
          filters={filters}
          filteredUsers={
            String(filters.role) === String(8) ||
              String(filters.role) === String(9)
              ? reportReliableData
              : reportData
          }
          page={page}
          limit={limit}
          paginatedUsers={
            String(filters.role) === String(8) ||
              String(filters.role) === String(9)
              ? reportReliableData
              : reportData
          }
          handlePageChange={handlePageChange}
          handleLimitChange={handleLimitChange}
          handlePageChangeTable={handlePageChangeTable}
          onClickDownloadReportWater={() => downloadReport()}
        />
      )}
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
