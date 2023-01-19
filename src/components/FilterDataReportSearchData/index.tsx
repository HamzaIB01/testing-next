import { server } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { DesktopDatePicker } from "@mui/lab";
import {
  Box,
  Button,
  Typography,
  Card,
  Grid,
  Divider,
  CardContent,
  styled,
  Autocomplete,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TableType } from "@/components/TableComponent";
import { format } from "date-fns";
import * as Yup from "yup";
import { useFormik } from "formik";
import { roleApi } from "@/actions/role.action";
import { useRefMounted } from "@/hooks/useRefMounted";
import { Department, SubInterval } from "@/types/user.type";
import { waterApi } from "@/actions/water.action";

const BoxActions = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]}
    `
);

export const AutocompleteCategoriesMUI = (props: any) => {
  const { t }: { t: any } = useTranslation();
  const masterData = useAuth().masterData;

  return (
    <Autocomplete
      disablePortal
      options={masterData.categories}
      isOptionEqualToValue={(option: any, value: any) =>
        option?.category_code === value?.category_code
      }
      getOptionLabel={(option: any) =>
        (localStorage.getItem(server.LANGUAGE) === "th"
          ? option.category_name?.th
          : option.category_name?.en) ?? option
      }
      onChange={(_e, value: any | null) => {
        props.formik?.setFieldValue("category_uuid", value?.category_uuid);
        props.getIntervals(value?.category_uuid);
      }}
      value={
        masterData.categories.find(
          (val) => val.category_uuid === props.formik?.values?.category_uuid
        ) ?? null
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          name="data_set"
          label={t("DATA_SET")}
          variant="outlined"
          onBlur={props.formik.handleBlur}
          onChange={props.formik.handleChange}
        />
      )}
    />
  );
};

export const AutocompleteDepartmentsMUI = (props: any) => {
  const { t }: { t: any } = useTranslation();
  const masterData = useAuth().masterData;

  return (
    <Autocomplete
      disablePortal
      options={masterData.departments}
      isOptionEqualToValue={(option: any, value: any) =>
        option.code === value.code
      }
      getOptionLabel={(option: any) =>
        (localStorage.getItem(server.LANGUAGE) === "th"
          ? option.name?.th
          : option.name?.en) ?? option
      }
      onChange={(_e, value: any | null) =>
        props.formik?.setFieldValue("department_uuid", value?.uuid)
      }
      value={
        masterData.departments.find(
          (val) => val.uuid === props.formik?.values?.department_uuid
        ) ?? null
      }
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          name="departments_id"
          label={t("AGENCY")}
          variant="outlined"
          onBlur={props.formik?.handleBlur}
          onChange={props.formik?.handleChange}
        />
      )}
    />
  );
};

export const AutocompleteIntervalsMUI = (props: any) => {
  const { t }: { t: any } = useTranslation();
  const masterData = useAuth().masterData;
  // var getInterval = [];
  // props.intervals.map((val) => {
  //   props.formik?.values?.interval?.map((element) => {
  //     if (val.uuid === element) {
  //       getInterval.push(val);
  //     }
  //   });
  // });
  // console.log("val f ", props.formik);
  return (
    <Autocomplete
      multiple
      limitTags={2}
      options={props.intervals ?? []}
      isOptionEqualToValue={(option: any, value: any) =>
        option.code === value.code
      }
      getOptionLabel={(option: any) => (option.code ? option.code : "-")}
      onChange={(_e, value: any | null) => {
        props.formik.values.interval = [];
        value.map((val: any | null) => {
          // console.log("val ", val);
          props.formik?.values?.interval?.push(val?.uuid);
          props.formikInterval();
          //   props.formik?.setFieldValue("data_set", value?.code ?? "")}
        });
      }}
      value={props.getInterval}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          variant="outlined"
          name={"duration"}
          label={t("DURATION")}
          onBlur={props.formik?.handleBlur}
          onChange={props.formik?.handleChange}
        />
      )}
    />
  );
};

export function FilterDataReportSearchData(props: any) {
  const { t }: { t: any } = useTranslation();
  const masterData = useAuth().masterData;

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

  const top100Films = [
    {
      id: 1,
      code: "Empty Role",
      description: { th: null, en: null },
      flag: {
        enable_flag: true,
        status_flag: "ACTIVE",
        status_modifier_date: null,
      },
      name: { th: "ว่าง", name_en: "Empty Role" },
      operation: {
        created_by: "Mini Thaiwater System",
        created_date: "2022-08-03T04:28:25.684Z",
        updated_by: null,
        updated_date: null,
      },
      ref_id: null,
    },
    {
      id: 2,
      code: "Admin",
      description: { th: null, en: null },
      flag: {
        enable_flag: true,
        status_flag: "ACTIVE",
        status_modifier_date: null,
      },
      name: { th: "แอดมิน", name_en: "Admin" },
      operation: {
        created_by: "Mini Thaiwater System",
        created_date: "2022-08-03T04:28:25.684Z",
        updated_by: null,
        updated_date: null,
      },
      ref_id: null,
    },
  ];

  const [value, setValue] = React.useState<Date | null>(new Date());
  const [_reset, setReset] = React.useState<string>("");
  const [valueFrom, setValueFrom] = React.useState<Date | null>(new Date());
  const [valueTo, setValuTo] = React.useState<Date | null>(new Date());
  const [intervals, setIntervals] = useState<SubInterval[]>([]);
  const [category, setCategory] = useState<string>("");
  const [dataInterval, setDataInterval] = useState<SubInterval[]>([]);
  const [selectInterval, setSelectInterval] = useState<any[]>([]);

  const handleChangeDatePickerFrom = (newValue: Date | null) => {
    setValueFrom(newValue);
    props.formik.values.from = format(newValue, "yyyy-MM-dd");
  };

  const handleChangeDatePickerTo = (newValue: Date | null) => {
    setValuTo(newValue);
    props.formik.values.to = format(newValue, "yyyy-MM-dd");
  };

  const handleChangeDatePicker = (newValue: Date | null) => {
    setValue(newValue);
  };

  const isMountedRef = useRefMounted();
  const [roles, setRoles] = useState<Department[]>([]);
  const [tabs, setTabs] = useState<Department[]>([]);
  const [search, setSearch] = useState("ALL");

  const getRoles = useCallback(async () => {
    const tab = (await roleApi.get_all_Role("", "", "", "")).content;
    const role = (await roleApi.get_all_Role("", "", "", "ALL")).content.sort(
      (a: any, b: any) => (a.id > b.id ? 1 : -1)
    );

    setTabs(tab);
    setRoles(role);
  }, [isMountedRef]);

  useEffect(() => {
    if (props.filtersRole === 1) {
      formik.values.department_uuid = "";
    }
    // getRoles();
  }, [props.filtersRole]);

  useEffect(() => {
    const fetchData = async () => {
      const role = (
        await roleApi.get_all_Role("", "", "", search)
      )?.content.sort((a, b) => (a.id > b.id ? 1 : -1));
      setRoles(role);
    };

    // fetchData();
  }, [search]);

  const getIntervals = useCallback(async (category_uuid, department_uuid) => {
    try {
      const interval_result = await waterApi.getIntervalsByCategory(
        category_uuid,
        department_uuid
      );

      const Filter_interval = interval_result.filter((v, i) => {
        return interval_result.map((val) => val.code).indexOf(v.code) == i;
      });
      // console.log("xx ", Filter_interval);

      // setIntervals(interval_result);
      setIntervals(Filter_interval);
    } catch (err) {
      setIntervals([]);
    }
  }, []);

  //   useEffect(() => {
  //     // if (
  //     //   formik.values.category_uuid?.length > 1 &&
  //     //   formik.values.department_uuid?.length > 1
  //     // ) {
  //     //   getIntervals(formik.values.category_uuid, formik.values.department_uuid);
  //     // }
  //     // else if (formik.values.department_uuid?.length > 1) {
  //     //   getIntervals("", formik.values.department_uuid);
  //     // }
  //     setDataInterval([]);
  //     props.getInitial?.parameter?.interval?.map((val) =>
  //       intervals.filter((object) => {
  //         if (object.uuid === val.uuid) {
  //           setDataInterval((current) => [...current, object]);
  //         }
  //       })
  //     );

  //     if (category?.length > 1) {
  //       getIntervals(category, "");
  //     } else {
  //       setIntervals([]);
  //       if (props.getInitial) {
  //         props.getInitial.parameter.interval = [];
  //       }
  //     }
  //   }, [category]);

  //   useEffect(() => {
  //     if (selectInterval.length > 0) {
  //       setDataInterval([]);
  //       props.getInitial.parameter?.interval?.map((val) =>
  //         intervals.filter((object) => {
  //           if (object.uuid === val.uuid) {
  //             setDataInterval((current) => [...current, object]);
  //           }
  //         })
  //       );
  //     } else {
  //       setDataInterval([]);
  //     }
  //   }, [selectInterval, category?.length]);
  // console.log("props filter ", props);
  const formik = useFormik({
    initialValues: {
      from: format(new Date(), "yyyy-MM-dd"),
      to: format(new Date(), "yyyy-MM-dd"),
      category_uuid: null,
      interval: [],
      department_uuid: null,
      type: null,
    },
    validationSchema: Yup.object({
      // department_uuid: Yup.string()
      //   .max(255)
      //   .required(t("The first name field is required")),
    }),
    onSubmit: async (values, _helpers): Promise<void> => {
      // console.log("path ", props.filtersRole);
      try {
        var path = `&from=${values.from}&to=${values.to}${
          values.category_uuid ? `&category_uuid=${values.category_uuid}` : ``
        }${
          props.filtersRole !== 1 && values.department_uuid
            ? `&department_uuid=${values.department_uuid}`
            : ``
        }${
          props.filtersRole === null && values.type
            ? `&type=${values.type}`
            : ``
        }`;

        values.interval &&
          values.interval.forEach(
            (element) => (path += `&interval_uuid=${element}`)
          );
        props.onClick(path);
        console.log("path ", path);
      } catch (err) {
        console.error(err);
      }
    },
  });

  const [getInterval, setGetInterval] = useState<any[]>([]);
  useEffect(() => {
    // var getInterval = [];
    // console.log("yy");
    setGetInterval([]);
    intervals.map((val) => {
      formik?.values?.interval?.map((element) => {
        if (val.uuid === element) {
          setGetInterval((current) => [...current, val]);
        }
      });
    });
  }, [formik?.values?.interval]);

  const getFormikinterval = useCallback(async () => {
    setGetInterval([]);
    intervals.map((val) => {
      formik?.values?.interval?.map((element) => {
        if (val.uuid === element) {
          setGetInterval((current) => [...current, val]);
        }
      });
    });
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card sx={{ marginBottom: 3 }}>
        {props.header && (
          <>
            <Box p={3}>
              <Typography variant="h4" gutterBottom>
                {props.title}
              </Typography>
            </Box>
            <Divider />
          </>
        )}

        <CardContent
          sx={{
            p: 4,
          }}
        >
          <Typography variant="subtitle2">
            <Grid container spacing={3}>
              {props.page === "report" && (
                <>
                  <Grid item xs={12}>
                    <Grid container spacing={0}>
                      <Grid
                        item
                        xs={2}
                        textAlign={{ sm: "right" }}
                        sx={{ margin: "auto" }}
                      >
                        <Box pr={3}>
                          <b>{t("FILTER_BY_DURATION")}</b>
                        </Box>
                      </Grid>

                      <Grid item xs={10}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4} md={4}>
                            <DesktopDatePicker
                              label={t("SINCE")}
                              inputFormat="dd-MMMM-yyyy"
                              value={valueFrom}
                              onChange={(e) => {
                                formik.values.from = format(e, "yyyy-MM-dd");
                                handleChangeDatePickerFrom(e);
                              }}
                              disableMaskedInput={true}
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
                          <Grid item xs={12} sm={4} md={4}>
                            <DesktopDatePicker
                              label={t("UP_TO_DATE")}
                              inputFormat="dd-MMMM-yyyy"
                              value={valueTo}
                              onChange={(e) => {
                                formik.values.to = format(e, "yyyy-MM-dd");
                                handleChangeDatePickerTo(e);
                              }}
                              disableMaskedInput={true}
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
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={0}>
                      <Grid
                        item
                        xs={2}
                        textAlign={{ sm: "right" }}
                        sx={{ margin: "auto" }}
                      >
                        <Box pr={3}>
                          <b>{t("FILTER_BY_DATA_SET")}</b>
                        </Box>
                      </Grid>

                      <Grid item xs={10}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4} md={4}>
                            <AutocompleteCategoriesMUI
                              formik={formik}
                              getIntervals={(e) => getIntervals(e, "")}
                            />
                          </Grid>

                          <Grid item xs={12} sm={4} md={4}>
                            {getInterval && intervals && (
                              <AutocompleteIntervalsMUI
                                formik={formik}
                                intervals={intervals}
                                getInterval={getInterval}
                                formikInterval={(e) => getFormikinterval()}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {props.filtersRole !== 1 && (
                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid
                          item
                          xs={2}
                          textAlign={{ sm: "right" }}
                          sx={{ margin: "auto" }}
                        >
                          <Box pr={3}>
                            <b>{t("FILTER_BY_DEPARTMENT")}</b>
                          </Box>
                        </Grid>

                        <Grid item xs={10}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={4}>
                              <AutocompleteDepartmentsMUI formik={formik} />
                            </Grid>

                            {/* <Grid item xs={12} sm={4} md={4}>
                              <Autocomplete
                                disablePortal
                                options={masterData.channels}
                                isOptionEqualToValue={(
                                  option: any,
                                  value: any
                                ) => option.channel_code === value.channel_code}
                                getOptionLabel={(option: any) =>
                                  (localStorage.getItem(server.LANGUAGE) ===
                                  "th"
                                    ? option.channel_name?.th
                                    : option.channel_name?.en) ?? option
                                }
                                onChange={(_e, value: any | null) =>
                                  formik?.setFieldValue(
                                    "type",
                                    value?.channel_code
                                  )
                                }
                                defaultValue={
                                  masterData.channels.find(
                                    (val: any) =>
                                      val?.channel_code === "CN_MTWS2"
                                  ) ?? null
                                }
                                // value={
                                //   masterData.channels.find(
                                //     (val: any) =>
                                //       val?.channel_code === formik?.values?.type
                                //   ) ?? null
                                // }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    name="departments_id"
                                    label={t("Channel")}
                                    variant="outlined"
                                    onBlur={props.formik?.handleBlur}
                                    onChange={props.formik?.handleChange}
                                  />
                                )}
                              />
                            </Grid> */}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Typography>
        </CardContent>

        {props.footer && (
          <Grid item xs={12}>
            <BoxActions
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                color="error"
                variant="contained"
                onClick={() => {
                  console.log("setReset");
                  formik.resetForm();
                  // props?.onClick() && props.onClick(), setReset("");

                  // (props.formik.initialValues.parameter.category.uuid = null);
                }}
              >
                {t("CLEAR")}
              </Button>

              <Button type="submit" variant="contained">
                {t("SEARCH_FOR_INFORMATION")}
              </Button>
            </BoxActions>
          </Grid>
        )}
      </Card>
    </form>
  );
}
