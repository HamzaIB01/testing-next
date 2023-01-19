import {
  FC,
  ChangeEvent,
  SyntheticEvent,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

import PropTypes from "prop-types";
import {
  Box,
  Card,
  Grid,
  Divider,
  Tooltip,
  IconButton,
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
  styled,
  Pagination,
  Autocomplete,
  DialogTitle,
  DialogContent,
  Stack,
  Tab,
  Tabs,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
// import { useSnackbar } from "notistack";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import Label from "@/components/Label";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { DesktopDatePicker } from "@mui/lab";
import { PersonalOrganizationComponent } from "@/components/PersonalComponents/PersonalOrganizationComponents";
import React from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { FilterData } from "@/components/FilterData";
import { useRouter } from "next/router";
import { encryptData } from "@/utils/crypto";
import { TabbarContext } from "@/contexts/TabbarContext";
import { nonWaterApi } from "@/actions/nonwater.action";
import { useAuth } from "@/hooks/useAuth";
import { NonWaterContent } from "@/types/water.type";
import { Department, SubInterval } from "@/types/user.type";
import { format } from "date-fns";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { AuthURL, ROLE_SCOPE, server } from "@/constants";
import { waterApi } from "@/actions/water.action";
import SimpleBackdrop from "@/components/Backdrop";

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
}

const applyFilters = (
  users: NonWaterContent[],
  query: string,
  _filters: Filters
): NonWaterContent[] => {
  return users.filter((user: any) => {
    let matches = true;

    let filter_user = {
      name_th: user.name?.th,
      name_en: user.name?.en,
    };

    if (query) {
      let properties = [];

      if (localStorage.getItem(server.LANGUAGE) === "th") {
        properties = ["name_th"];
      } else if (localStorage.getItem(server.LANGUAGE) === "en") {
        properties = ["name_en"];
      }

      let containsQuery = false;

      properties.forEach((property) => {
        if (
          filter_user[property]?.toLowerCase().includes(query.toLowerCase())
        ) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = (
  users: NonWaterContent[],
  page: number,
  limit: number
): NonWaterContent[] => {
  return users.slice(page * limit, page * limit + limit);
};

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  // const { enqueueSnackbar } = useSnackbar();
  // const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  // const [indexPath, setIndexPath] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const { changeTab, tabNumber } = useContext(TabbarContext);
  const [manualExport, setManualExport] = useState<any>([]);
  // const [autoExportCategory, setAutoExportCategory] = useState<any>([]);
  const [autoExport, setAutoExport] = useState<any>([]);
  const auth = useAuth();
  const [filters, setFilters] = useState<Filters>({
    role: null,
  });
  const filteredUsers = applyFilters(manualExport, query, filters);
  const paginatedUsers = applyPagination(filteredUsers, page, limit);
  // const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [intervals, setIntervals] = useState<any[]>([]);
  const [basins, setBasins] = useState<any[]>([]);
  // const [department, setDepartment] = useState<any[]>([]);
  const [district, setDistrict] = useState<any[]>([]);
  const [province, setProvince] = useState<any[]>([]);
  const [stations, setStations] = useState<any[]>([]);
  const [sub_district, setSub_district] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [categories, setCategories] = useState<Department[]>([]);
  const [getAutoFile, setGetAutoFile] = useState<any[]>([]);
  const [allInterval, setAllInterval] = useState<any[]>([]);
  const [selectedUuid, setSelectedUuid] = useState<string>("");
  const router = useRouter();

  const [intervalsData, setIntervalsData] = useState<SubInterval[]>([]);
  const [defaultIntervals, setDefaultsIntervals] = useState<SubInterval[]>([]);
  const [category_uuid, setCategory_uuid] = useState<string>("");
  // const [selectedUuid, setSelectedUuid] = useState<string>("");
  const masterDataMockup: any = {
    basin: [
      {
        uuid: "1d8ed9ad-f033-4951-a1d5-ebb230a7c566",
        name: "ลุ่มน้ำเจ้าพระยา",
      },
    ],
    station: [
      {
        uuid: "d4e3641c-9863-4745-9238-51bb051ecbca",
        name: "สถานีเจ้าพระยา",
      },
    ],
    province: [
      {
        code: "MSK001",
        name: "มหาสารคาม",
      },
    ],
    district: [
      {
        code: "M001",
        name: "เมือง",
      },
    ],
    sub_district: [
      {
        code: "TL001",
        name: "ตลาด",
      },
    ],
  };

  // const [defaultValue, setDefaultValue] = React.useState<string | null>("");
  const [valueFrom, setValueFrom] = React.useState<Date | null>(new Date());

  const getIntervals = useCallback(async (category_uuid, department_uuid) => {
    try {
      const interval_result = await waterApi.getIntervalsByCategory(
        category_uuid,
        department_uuid
      );

      const Filter_interval = interval_result.filter((v, i) => {
        return interval_result.map((val) => val.code).indexOf(v.code) == i;
      });

      // console.log("interval ", Filter_interval);
      setDefaultsIntervals(interval_result);
      setIntervalsData(Filter_interval);
    } catch (err) {
      setDefaultsIntervals([]);
      setIntervalsData([]);
    }
  }, []);

  useEffect(() => {
    if (category_uuid.length > 1) {
      getIntervals(category_uuid, "");
    } else {
      setDefaultsIntervals([]);
      setIntervalsData([]);
    }
  }, [category_uuid]);

  // useEffect(() => {
  //   getIntervals(selectedUuid, "");
  // }, [selectedUuid]);

  const getExportManual = useCallback(async () => {
    setOpenBackdrop(true);
    try {
      // const manualData = await nonWaterApi.getManual(
      //   "ea35e995-4580-4c8c-85f4-1b8c9b62ffd4"
      // );
      const manualData = await nonWaterApi.getManualAll(auth.user.uuid);
      setOpenBackdrop(false);
      setManualExport(manualData?.content ?? []);
    } catch (err) {
      setOpenBackdrop(false);
      setManualExport([]);
    }
  }, []);

  const getCategory = useCallback(async () => {
    setOpenBackdrop(true);
    try {
      const categoriesData = await nonWaterApi.getAutoCategories(
        auth.user.uuid
      );

      // console.log("categoriesData?.content ", categoriesData?.content);
      // var getCategoryAuto = [];

      // auth.masterData.categories.map((val) => {
      //   categoriesData?.content.map((element) => {
      //     if (element.uuid !== val.category_uuid) {
      //       getCategoryAuto.push(val);
      //     }
      //   });
      // });

      // console.log("whyy ", getCategoryAuto);
      setManualExport(auth.masterData.categories ?? []);
      // setAutoExportCategory(auth.masterData.categories ?? []);
      // setManualExport(categoriesData?.content ?? []);
      setAutoExport(categoriesData?.content ?? []);
      setOpenBackdrop(false);
    } catch (err) {
      setOpenBackdrop(false);
      setManualExport([]);
    }
  }, []);

  useEffect(() => {
    if (tabNumber === "request-file") {
      getExportManual();
    } else {
      getCategory();
    }
  }, [tabNumber]);

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      role: tabNumber,
    }));
  }, []);

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

  const handleSelect = async (step: number, index: number) => {
    let jsonValue = null;
    if (step === 3) {
      // console.log("select ", paginatedUsers[index]);
      paginatedUsers[index].parameter?.basin?.filter((data) => {
        auth.masterData.basins.map((val) => {
          if (val.basin_uuid === data.uuid) {
            basins.push(val);
          }
        });
        // basins.push(
        //   auth.masterData.basins.filter((val) => val.basin_uuid === data.uuid)
        // );
      }),
        paginatedUsers[index].parameter?.station?.filter((data) => {
          auth.masterData.stations.map((val) => {
            if (val.station_uuid === data.uuid) {
              stations.push(val);
            }
          });
        }),
        // paginatedUsers[index].parameter?.department?.map((data_department) =>
        //   departments.push(
        //     auth.masterData.departments.filter(
        //       (val) => val.uuid === data_department.uuid
        //     )
        //   )
        // );
        paginatedUsers[index].parameter?.department?.filter(
          (data_department) => {
            auth.masterData.departments.map((val) => {
              if (val.uuid === data_department.uuid) {
                departments.push(val);
              }
            });
          }
        ),
        // paginatedUsers[index].parameter?.province?.map((data) =>
        //   province.push(
        //     masterDataMockup.province.filter((val) => val.code === data?.code)
        //   )
        // );

        paginatedUsers[index].parameter?.province?.filter((data) => {
          masterDataMockup.province.map((val) => {
            if (val.code === data?.code) {
              province.push(val);
            }
          });
        }),
        paginatedUsers[index].parameter?.district?.map(
          (data) =>
            masterDataMockup.district.map((val) => {
              if (val.code === data?.code) {
                district.push(val);
              }
            })
          // district.push(
          //   masterDataMockup.district.filter((val) => val.code === data?.code)
          // )
        );

      paginatedUsers[index].parameter?.sub_district?.map(
        (data) =>
          masterDataMockup.sub_district.map((val) => {
            if (val.code === data?.code) {
              sub_district.push(val);
            }
          })
        // sub_district.push(
        //   masterDataMockup.sub_district.filter((val) => val.code === data.code)
        // )
      );

      try {
        const interval_result = await waterApi.getIntervalsByCategory(
          paginatedUsers[index].parameter.category.uuid,
          ""
        );

        const Filter_interval = interval_result.filter((v, i) => {
          return interval_result.map((val) => val.code).indexOf(v.code) == i;
        });

        paginatedUsers[index].parameter?.interval?.filter((data) => {
          Filter_interval.map((val) => {
            if (val.uuid === data.uuid) {
              intervals.push(val);
            }
          });
        }),
          console.log("interval ", Filter_interval);
        allInterval.push(Filter_interval);
      } catch (err) {}

      jsonValue = {
        // category: auth.masterData.categories.find((val) =>
        //   val.category_uuid.includes(
        //     paginatedUsers[index].parameter.category.uuid
        //   )
        // ).category_name.th,
        category: paginatedUsers[index].parameter.category,
        interval_category: allInterval[0],
        interval: intervals,
        file: paginatedUsers[index].file,
        basin: basins,
        station: stations,
        province: province,
        district: district,
        sub_district: sub_district,
        department: departments,
        from: paginatedUsers[index].from,
        to: paginatedUsers[index].to,
        description: paginatedUsers[index].description,
      };
    }

    if (index < 0) {
      router.push({
        pathname: AuthURL.REQUEST_DATA + `/` + 1,
        query: {
          step: encryptData(step),
          data: encryptData(JSON.stringify(jsonValue)),
        },
      });
    } else {
      router.push({
        pathname: AuthURL.REQUEST_DATA + `/` + index,
        query: {
          step: encryptData(step),
          data: encryptData(JSON.stringify(jsonValue)),
        },
      });
    }
  };

  // const handleDeleteCompleted = () => {
  //   setOpenConfirmDelete(false);

  //   enqueueSnackbar(t("The user account has been removed"), {
  //     variant: "success",
  //     anchorOrigin: {
  //       vertical: "top",
  //       horizontal: "right",
  //     },
  //     TransitionComponent: Zoom,
  //   });
  // };

  const tabs = [
    {
      value: "download-finished-file",
      label: t("DOWNLOAD_FINISHED_FILE"),
    },
    {
      value: "web-service",
      label: t("WEB_SERVICE"),
    },
    {
      value: "request-file",
      label: t("REQUEST_FILE"),
    },
  ];

  const [valueTo, setValueTo] = React.useState<Date | null>(new Date());

  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  const handleCreateUserOpen = (user: any) => {
    getIntervals(user.category_uuid, "");
    setSelectedUuid(user.category_uuid);
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setGetAutoFile([]);
    setIntervalsData([]);
    setValueTo(new Date());
    setValueFrom(new Date());
    setOpen(false);
  };

  const handleChangeDateFromPicker = (newValue: Date | null) => {
    setValueFrom(newValue);
  };

  const handleChangeDateToPicker = (newValue: Date | null) => {
    setValueTo(newValue);
  };

  const handleTabsChange = (_event: SyntheticEvent, tabsValue: string) => {
    let value = null;

    if (tabsValue !== "download-finished-file") {
      value = tabsValue;
    }
    setManualExport([]);
    changeTab(value);

    setFilters((prevFilters) => ({
      ...prevFilters,
      role: value,
    }));

    // setSelectedUsers([]);
  };

  // function interval_by_category_uuid(data) {
  //   // const getIntervals = useCallback(async (data.category.uuid, "department_uuid") => {
  //   var interval_name = [];

  //   const setDynamicComponent = useCallback(async () => {
  //     try {
  //       const interval_result = await waterApi.getIntervalsByCategory(
  //         data.category.uuid,
  //         ""
  //       );

  //       const Filter_interval = interval_result.filter((v, i) => {
  //         return interval_result.map((val) => val.code).indexOf(v.code) == i;
  //       });

  //       // console.log("interval ", Filter_interval);

  //       Filter_interval?.map((val) =>
  //         data.interval?.map((element) => {
  //           if (val.uuid === element.uuid) {
  //             interval_name.push(val.name);
  //             // console.log("val name ", val.name);
  //           }
  //         })
  //       );
  //     } catch (err) {
  //       // setDefaultsIntervals([]);
  //       // setIntervalsData([]);
  //     }
  //   }, []);

  //   useEffect(() => {
  //     // https://stackoverflow.com/a/57847874/433570
  //     setDynamicComponent();
  //   }, []);

  //   return interval_name?.map((val) => {
  //     <Label color="success">
  //       {val}
  //       <CheckCircleOutlineIcon
  //         sx={{
  //           fontSize: "15px",
  //           marginLeft: "4px",
  //         }}
  //       />
  //     </Label>;
  //   });
  // }

  const formik = useFormik({
    initialValues: {
      parameter: {
        category: {
          uuid: "",
        },
      },
      from: "2022-09-06T09:30:00.426Z",
      to: "2022-09-06T09:30:00.426Z",
    },
    validationSchema: Yup.object({
      // first_name: Yup.string()
      //    .max(255)
      //    .required(t('The first name field is required')),
    }),
    onSubmit: async (values, _helpers): Promise<void> => {
      try {
        if (
          values.parameter.category.uuid != "" &&
          values.parameter.category.uuid != null
        ) {
          const data = auth.masterData?.categories?.filter((val) => {
            return val.category_uuid == values.parameter.category.uuid;
          });
          // console.log("onSubmit", data);
          setManualExport(data);
        } else {
          // resetForm();
          setManualExport(auth?.masterData?.categories);
        }
      } catch (err) {
        console.error(err);
      }
    },
    onReset: async (values): Promise<void> => {
      values.parameter.category.uuid = null;
      // formik.values.parameter.category.uuid = null
      console.log("value ", values);
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
              value={tabNumber || "download-finished-file"}
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
            {filters.role === "request-file" && (
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
            )}

            {filters.role === "request-file" && (
              <Box sx={{ pt: { xs: 0, sm: 2 }, paddingBottom: 0 }}>
                <Button
                  color={openSearch ? "error" : "primary"}
                  sx={{ whiteSpace: "nowrap" }}
                  size="large"
                  type="submit"
                  variant="contained"
                  onClick={() => setOpenSearch(!openSearch)}
                >
                  {openSearch
                    ? t("CLOSE_ADVANCED_SEARCH")
                    : t("ADVANCED_SEARCH")}
                </Button>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>

      {filters.role === "request-file" && (
        <>
          {openSearch && categories && (
            <FilterData
              headder={false}
              page={"search"}
              filtersRole={filters.role}
              contentTextField={false}
              footer={true}
              agencyTab={true}
              formik={formik}
              getCategory={categories}
              onClick={(_e) => {
                setManualExport(auth?.masterData?.categories);
              }}
            />
          )}
        </>
      )}

      <Card>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
            {filters.role === null && (
              <Typography
                variant="h4"
                gutterBottom
                component="div"
                marginY={"auto"}
              >
                {t("DOWNLOAD_FINISHED_FILE")}
              </Typography>
            )}

            {filters.role === "web-service" && (
              <Typography
                variant="h4"
                gutterBottom
                component="div"
                marginY={"auto"}
              >
                {t("WEB_SERVICE")}
              </Typography>
            )}

            {filters.role === "request-file" && (
              <Stack spacing={2} direction="row">
                <Typography
                  variant="h4"
                  gutterBottom
                  component="div"
                  marginY={"auto"}
                >
                  {t("REQUEST_INFORMATION_ON_FILE")}
                </Typography>

                {FunctionPermission(ROLE_SCOPE.ADD_SEARCH_DATA) && (
                  <Button
                    sx={{ mt: { xs: 1, sm: 0.5 } }}
                    variant="contained"
                    startIcon={<ControlPointIcon fontSize="small" />}
                    onClick={() => handleSelect(0, -1)}
                  >
                    {t("ADD_REQUEST_INFORMATION")}
                  </Button>
                )}
              </Stack>
            )}

            <TablePagination
              component="div"
              count={filteredUsers.length}
              onPageChange={handlePageChangeTable}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              labelRowsPerPage={null}
              rowsPerPageOptions={[
                { label: `${t("SHOW")} ${5} ${t("PER_PAGE_LIST")}`, value: 5 },
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

        {paginatedUsers.length === 0 ||
        !FunctionPermission(ROLE_SCOPE.SHOW_ALL_SEARCH_DATA) ? (
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
                tabs.find((val) => val?.value === filters.role)?.label ??
                tabs[0].label
              }`}
            </Typography>
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
                    <TableCell>{t("DATA_SET_NAME")}</TableCell>
                    {filters.role === "request-file" && (
                      <>
                        <TableCell>{t("AGENCY")}</TableCell>
                        <TableCell>{t("DURATION")}</TableCell>
                      </>
                    )}
                    <TableCell style={{ width: 160 }} align="center">
                      {filters.role !== "web-service"
                        ? t("DOWNLOAD")
                        : t("TEST_API")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers &&
                    paginatedUsers.map((user: any, index: any) => {
                      return (
                        <TableRow key={index}>
                          <TableCell align="center">
                            <Typography fontWeight="bold">
                              {limit * page + 1 + index}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              {filters.role === "download-finished-file" ||
                              filters.role === null ||
                              filters.role === "web-service" ? (
                                <Typography>
                                  {user?.name?.th
                                    ? user?.name?.th
                                    : user?.category_name?.th
                                    ? user?.category_name?.th
                                    : "-"}
                                </Typography>
                              ) : (
                                <Typography>
                                  {auth.masterData.categories.find((cate) =>
                                    cate.category_uuid.includes(
                                      user.parameter?.category?.uuid
                                    )
                                  )?.category_name?.th || "-"}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>

                          {filters.role === "request-file" && (
                            <>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>
                                    {auth.masterData?.departments.find(
                                      (depart) =>
                                        depart?.uuid?.includes(
                                          user?.parameter?.department.find(
                                            (user_depart) => user_depart?.uuid
                                          )?.uuid
                                        )
                                    )?.name?.th || "-"}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Grid container spacing={1}>
                                  <Grid item key={index}>
                                    <Label color="success">
                                      {auth.masterData?.intervals.find(
                                        (interval) =>
                                          interval?.interval_uuid.includes(
                                            user?.parameter?.interval.find(
                                              (user_interval) =>
                                                user_interval.uuid
                                            )?.uuid
                                          )
                                      )?.interval_name?.th || "-"}
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
                            </>
                          )}
                          {/* 
                          {console.log("user", user)
                          } */}

                          <TableCell align="center">
                            {(filters.role === null ||
                              filters.role === "download-finished-file") &&
                            autoExport.some(
                              (val) => val?.uuid === user?.category_uuid
                            ) ? (
                              <Typography noWrap>
                                <Tooltip title={t("FINISHED_DATA")} arrow>
                                  <IconButton
                                    onClick={() => handleCreateUserOpen(user)}
                                    color="primary"
                                  >
                                    <CloudDownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                            ) : filters.role === "web-service" &&
                              autoExport.some(
                                (val) => val.uuid === user.category_uuid
                              ) ? (
                              <Tooltip title={t("API")} arrow>
                                <Button
                                  component="a"
                                  color="primary"
                                  variant="text"
                                  sx={{ letterSpacing: 1, fontSize: 10 }}
                                  onClick={() =>
                                    router.push({
                                      pathname: `${AuthURL.SANDBOX}`,
                                      query: {
                                        // user: user?.uuid,
                                        id: user?.category_id,
                                        list: user?.category_short_name,
                                      },
                                    })
                                  }
                                >
                                  {t("<API>")}
                                </Button>
                              </Tooltip>
                            ) : filters.role === "request-file" &&
                              FunctionPermission(
                                ROLE_SCOPE.SHOW_SEARCH_DATA
                              ) ? (
                              <Typography noWrap>
                                <Tooltip
                                  title={
                                    user && user.file?.length > 0
                                      ? t("ดาวน์โหลด")
                                      : t("กำลังดำเนินการ")
                                  }
                                  arrow
                                >
                                  <IconButton color="primary">
                                    {user && user.file?.length > 0 ? (
                                      <CloudDownloadIcon
                                        fontSize="small"
                                        onClick={() => handleSelect(3, index)}
                                      />
                                    ) : (
                                      <AutorenewIcon fontSize="small" />
                                    )}
                                  </IconButton>
                                </Tooltip>
                              </Typography>
                            ) : null}
                          </TableCell>
                        </TableRow>
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
                count={Math.ceil(filteredUsers.length / limit)}
                page={page + 1}
                defaultPage={0}
              />
            </Box>
          </>
        )}
      </Card>

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateUserClose}
      >
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4">{t("FINISHED_DATA")}</Typography>
        </DialogTitle>
        <Divider />

        <Formik
          initialValues={{
            category_uuid: selectedUuid,
            interval_uuid: [""],
            from: format(new Date(), "yyyy-MM-dd"),
            to: format(new Date(), "yyyy-MM-dd"),
            stringInterval: "",
          }}
          validationSchema={Yup.object().shape({})}
          onSubmit={async (values) => {
            values.stringInterval = "";
            values.interval_uuid.forEach(
              (element, index) =>
                (values.stringInterval +=
                  index > 0 ? `,${element}` : `${element}`)
            );

            try {
              const getFile = await nonWaterApi.getAutoFiles(values);
              setGetAutoFile(getFile?.content?.file);
            } catch (error) {
              setGetAutoFile([]);
              alert(error);
            }
          }}
        >
          {({ handleSubmit, values }) => (
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
                        <Autocomplete
                          disablePortal
                          options={auth?.masterData?.categories}
                          getOptionLabel={(option: any) =>
                            option.category_name?.th
                              ? option.category_name?.th
                              : "-"
                          }
                          isOptionEqualToValue={(option: any, value: any) =>
                            option?.category_code === value?.category_code
                          }
                          defaultValue={auth?.masterData?.categories.find(
                            (value, _index) =>
                              value.category_uuid === selectedUuid
                          )}
                          onChange={(_e, value: any | null) => {
                            setCategory_uuid(value?.category_uuid ?? "");
                            values.category_uuid = value?.category_uuid ?? "";
                          }}
                          disabled={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // error={Boolean(
                              //    props.formik.touched.users_group &&
                              //    props.formik.errors.users_group
                              // )}
                              fullWidth
                              name="category_uuid"
                              // helperText={
                              //    props.formik.touched.users_group &&
                              //    props.formik.errors.users_group
                              // }
                              label={t("DATA_SET")}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Autocomplete
                          multiple
                          limitTags={2}
                          id="interval_uuid"
                          options={intervalsData}
                          noOptionsText={"กรุณาเลือกประเภทข้อมูล"}
                          getOptionLabel={(option: any) =>
                            option.code ? option?.code : "-"
                          }
                          onChange={(_e, value: any | null) => {
                            values.interval_uuid = [];
                            value.map((val, index) => {
                              values.interval_uuid.push(),
                                (values.interval_uuid[index] = val?.uuid);
                            });
                          }}
                          // defaultValue={[jobsTags[0]]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              variant="outlined"
                              label={t("DURATION")}
                              name="interval_uuid"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DesktopDatePicker
                          label={t("SINCE")}
                          inputFormat="dd MMMM yyyy"
                          value={valueFrom}
                          onChange={(e) => {
                            if (!isNaN(e?.getTime())) {
                              values.from = format(new Date(e), "yyyy-MM-dd");
                              handleChangeDateFromPicker(e);
                            }

                            if (valueTo.getDate() < new Date(e).getDate()) {
                              values.to = format(new Date(e), "yyyy-MM-dd");
                              handleChangeDateFromPicker(e);
                              handleChangeDateToPicker(e);
                            }
                          }}
                          disableMaskedInput={true}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              name="intervald"
                              margin="normal"
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        {valueFrom && (
                          <DesktopDatePicker
                            label={t("UP_TO_DATE")}
                            inputFormat="dd MMMM yyyy"
                            value={
                              valueTo.getDate() < valueFrom.getDate()
                                ? valueFrom
                                : valueTo
                            }
                            minDate={new Date(valueFrom)}
                            onChange={(e) => {
                              if (!isNaN(e?.getTime())) {
                                values.to = format(new Date(e), "yyyy-MM-dd");
                                handleChangeDateToPicker(e);
                              }
                            }}
                            disableMaskedInput={true}
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
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    {getAutoFile && (
                      <PersonalOrganizationComponent
                        title={t("ORGANIZATION_INFORMATION")}
                        document={true}
                        downloadAll={true}
                        download={true}
                        //  defaultData={initialValues.detail}
                        // getInitial={initialValues}
                        // onChange={(e: any) =>
                        //     (initialValues.organization = e.target.value)
                        // }
                        BoxUploadWrapper={BoxUploadWrapper}
                        getAutoFile={getAutoFile}
                      />
                    )}
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
                  // disabled={Boolean(errors.submit) || isSubmitting}
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
