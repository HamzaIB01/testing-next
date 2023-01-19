import {
  ChangeEvent,
  SyntheticEvent,
  useState,
  useEffect,
  useCallback,
} from "react";

import PropTypes from "prop-types";
import {
  Box,
  Grid,
  Divider,
  InputAdornment,
  TextField,
  Button,
  Typography,
  Dialog,
  Zoom,
  styled,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  DialogTitle,
  DialogContent,
  Tab,
  Tabs,
  Stack,
  Slide,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import { useSnackbar } from "notistack";
import { Formik } from "formik";
import * as Yup from "yup";
import { DesktopDatePicker } from "@mui/lab";
import { PersonalOrganizationComponent } from "@/components/PersonalComponents/PersonalOrganizationComponents";
import React from "react";
import { useRouter } from "next/router";
import { TableComponent, TableType } from "@/components/TableComponent";
import { reportApi } from "@/actions/report.action";
import { ContentResult } from "@/types/report.type";
import { useFormik } from "formik";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import SimpleBackdrop from "@/components/Backdrop";
import { FilterDataReportSearchData } from "@/components/FilterDataReportSearchData";
import { server } from "@/constants";
// import { getUserTable } from "@/components/TableComponent";

// export enum TableType {
//    SERVICE_REPORT,
//    DOWNLOADED_REPORT,
// }

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

interface Filters {
  role?: string;
  type: TableType;
}

// const applyFilters = (
//   users: Content[],
//   query: string,
//   filters: Filters
// ): Content[] => {
//   return users?.filter((user) => {
//     let matches = true;

//     if (query) {
//       const properties = ["email", "name"];
//       let containsQuery = false;

//       properties.forEach((property) => {
//         if (user[property].toLowerCase().includes(query.toLowerCase())) {
//           containsQuery = true;
//         }
//       });

//       if (filters.role && user.name !== filters.role) {
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
//   users: Content[],
//   page: number,
//   limit: number
// ): Content[] => {
//   return users?.slice(page * limit, page * limit + limit);
// };

const Results = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [reportData, setReportData] = React.useState<ContentResult>();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>("");
  const [keyword, setKeyword] = useState<string>("information-service");
  const [type, setType] = useState<string>("CN_MTWS3");
  const [path, setPath] = useState<string>("");
  const auth = useAuth();
  const [filters, setFilters] = useState<Filters>({
    role: null,
    type: TableType.SERVICE_REPORT,
  });

  // const getReport = useCallback(async (parameter) => {
  //   try {
  //     const reportResult = await reportApi.getExportReportNonWater(parameter);
  //     setReportData(reportResult?.content);
  //   } catch (err) {
  //     setReportData([]);
  //   }
  // }, []);

  const getReport = useCallback(
    async (parameter, limit, offset, keyword, type = "", path = "") => {
      setOpenBackdrop(true);
      try {
        const reportResult = await reportApi.getExportReport(
          parameter,
          limit,
          offset,
          keyword,
          type,
          path
        );
        // console.log("report ", reportResult);
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
    // const fetchRequest = useCallback(() => {
    if (filters.type === 0) {
      setType("CN_MTWS3");
      setKeyword("information-service");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "information-service",
        "CN_MTWS3",
        path
      );
    } else if (filters.type === 1) {
      setKeyword("information-service");
      setType("CN_MTWS1");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "information-service",
        "CN_MTWS1",
        path
      );
    } else {
      setKeyword("api");
      setType("");
      getReport("", limit, String(limit * page + 1 - 1), "api", "", path);
    }
  }, [filters, path, limit, keyword, type]);

  const fetchRequest = useCallback(() => {
    // const fetchRequest = useCallback(() => {
    if (filters.type === 0) {
      setType("CN_MTWS3");
      setKeyword("information-service");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "information-service",
        "CN_MTWS3",
        path
      );
    } else if (filters.type === 1) {
      setKeyword("information-service");
      setType("CN_MTWS1");
      getReport(
        "",
        limit,
        String(limit * page + 1 - 1),
        "information-service",
        "CN_MTWS1",
        path
      );
    } else {
      setKeyword("api");
      setType("");
      getReport("", limit, String(limit * page + 1 - 1), "api", "", path);
    }
  }, [filters, path, limit, keyword, type]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
      // const reportResult = await reportApi.downloadExportReport(
      //   "",
      //   limit,
      //   String(limit * page + 1 - 1),
      //   keyword,
      //   type,
      //   path
      // );

      downloadFile({
        // data: reportResult,
        fileName: `${keyword + format(new Date(), "dd-MM-yyyy hh:mm:ss")}.zip`,
        fileType: "application/zip",
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
  }, [keyword, path, limit, keyword, type]);

  const downloadFile = async ({
    // data,
    fileName,
    fileType,
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
        `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_REPORT_URL}${server.EXPORT_REPORT}?limit=${limit}&offset=${offset}&keyword=${keyword}&action=download&type=${type}${parameter}${path}`,
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
    } catch (error) {
      // alert(error);
      // alert(error);
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
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
    // getReport({
    //   limit: String(limit),
    //   offset: String(limit * page + 1 - 1),
    //   keyword: event.target.value,
    // });
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage - 1);
    getReport(
      "",
      String(limit),
      String(limit * (newPage - 1) + 1 - 1),
      keyword,
      type
    );
  };

  const handlePageChangeTable = (_event: any, newPage: number): void => {
    setPage(newPage);
    getReport(
      "",
      String(limit),
      String(limit * newPage + 1 - 1),
      keyword,
      type
    );
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
    getReport(
      "",
      event.target.value,
      String(limit * page + 1 - 1),
      keyword,
      type
    );
  };

  // const filteredUsers = applyFilters(reportData, query, filters);
  // const paginatedUsers = applyPagination(filteredUsers, page, limit);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleDeleteCompleted = () => {
    setOpenConfirmDelete(false);

    enqueueSnackbar(t("The user account has been removed"), {
      variant: "success",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
      TransitionComponent: Zoom,
    });
  };
  const [filtertabs, setFilterTabs] = useState({
    status: null,
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

  const tabs = [
    {
      value: "finished_file_download_report",
      label: t("รายงานการให้บริการข้อมูล"),
      type: TableType.SERVICE_REPORT,
    },
    {
      value: "downloaded_ready_made_reports",
      label: t("DOWNLOADED_READY_MADE_REPORT"),
      type: TableType.DOWNLOADED_REPORT,
    },
    {
      value: "downloaded_web_service_reports",
      label: t("รายงานการใช้ Web service"),
      type: TableType.WEB_SERVICE_REPORT,
    },
  ];

  const handleCreateUserOpen = () => {
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setOpen(false);
  };

  const [valueFrom, setValueFrom] = React.useState<Date | null>(new Date());

  const [valueTo, setValuTo] = React.useState<Date | null>(new Date());

  const handleChangeDatePickerFrom = (newValue: Date | null) => {
    setValueFrom(newValue);
  };

  const handleChangeDatePickerTo = (newValue: Date | null) => {
    setValuTo(newValue);
  };

  const formik = useFormik({
    initialValues: {
      from: format(new Date(), "yyyy-MM-dd"),
      to: format(new Date(), "yyyy-MM-dd"),
      category_uuid: null,
      interval: [],
      department_uuid: null,
    },
    validationSchema: Yup.object({
      // department_uuid: Yup.string()
      //   .max(255)
      //   .required(t("The first name field is required")),
    }),
    onSubmit: async (values, _helpers): Promise<void> => {
      try {
        var path = `&from=${values.from}&to=${values.to}${values.category_uuid ? `&category_uuid=${values.category_uuid}` : ``
          }${values.department_uuid
            ? `&department_uuid=${values.department_uuid}`
            : ``
          }`;

        values.interval &&
          values.interval.forEach(
            (element) => (path += `&interval_uuid=${element.interval_uuid}`)
          );
        // const reportResult = await reportApi.getExportReportAPI(path);
        // if (filters.type === 0) {
        //   getReport(path, "information-service", "CN_MTWS2");
        // } else if (filters.type === 1) {
        //   getReport(path, "manual-export");
        // } else {
        //   getReport(path, "api");
        // }
      } catch (err) {
        console.error(err);
      }
    },
  });

  const handleTabsChange = (_event: SyntheticEvent, tabsValue: TableType) => {
    let value = null;
    setReportData(null);

    if (tabsValue !== TableType.SERVICE_REPORT) {
      value = tabsValue;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      role: value,
      type: tabsValue,
    }));

    formik.values.department_uuid = null;

    setSelectedUsers([]);
  };

  const onClick = () => {
    formik.resetForm();
    formik.values.category_uuid = null;
    formik.values.department_uuid = null;
    formik.values.interval = [];
  };

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
              value={filters.type || TableType.SERVICE_REPORT}
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
                  // alert(openSearch);
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
      {/* 
      {openSearch && formik.values.interval && (
        <FilterData
          headder={false}
          page={"report"}
          filtersRole={filters.role}
          footer={true}
          formik={formik}
          onClick={() => onClick()}
          // interval={interval}
        />
      )} */}

      {openSearch && formik.values.interval && (
        <FilterDataReportSearchData
          headder={false}
          page={"report"}
          filtersRole={filters.role}
          footer={true}
          formik={formik}
          onClick={(e) => {
            // getReport(
            //   "",
            //   limit,
            //   String(limit * page + 1 - 1),
            //   keyword,
            //   type,
            //   e
            // );
            // setPath("");
            if (e === path) {
              fetchRequest();
            } else {
              setPath(e);
            }

            // console.log("set Path ", e);
            // fetchRequest();
          }}
        // interval={interval}
        />
      )}

      {/* {console.log("pageination ", paginatedUsers)} */}
      {keyword && reportData && (
        <TableComponent
          filters={filters}
          filteredUsers={reportData}
          page={page}
          limit={limit}
          paginatedUsers={reportData}
          handlePageChange={handlePageChange}
          handleLimitChange={handleLimitChange}
          handlePageChangeTable={handlePageChangeTable}
          onClickDownloadReportNonWater={() => downloadReport()}
        />
      )}

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
                          inputFormat="dd MMMM yyyy"
                          value={valueFrom}
                          onChange={handleChangeDatePickerFrom}
                          renderInput={(params) => (
                            <TextField
                              {...params}
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
                          inputFormat="dd MMMM yyyy"
                          value={valueTo}
                          onChange={handleChangeDatePickerTo}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              margin="normal"
                              variant="outlined"
                              fullWidth
                              name="end"
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

Results.propTypes = {
  users: PropTypes.array.isRequired,
};

Results.defaultProps = {
  users: [],
};

export default Results;
