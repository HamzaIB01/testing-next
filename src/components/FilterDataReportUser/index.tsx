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
import { nonWaterApi } from "@/actions/nonwater.action";

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
  //   var getInterval = [];
  //   props.intervals.map((val) => {
  //     props.formik?.values?.interval?.map((element) => {
  //       if (val.uuid === element) {
  //         getInterval.push(val);
  //       }
  //     });
  //   });

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
          console.log("val ", val);
          props.formik?.values?.interval?.push(val?.uuid);
          //   props.formik?.setFieldValue("data_set", value?.code ?? "")}
        });
      }}
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

export function FilterDataReportUser(props: any) {
  const { t }: { t: any } = useTranslation();
  const masterData = useAuth().masterData;

  const [value, setValue] = React.useState<Date | null>(new Date());
  const [_reset, setReset] = React.useState<string>("");
  const [valueFrom, setValueFrom] = React.useState<Date | null>(new Date());
  const [valueTo, setValuTo] = React.useState<Date | null>(new Date());
  const [intervals, setIntervals] = useState<SubInterval[]>([]);
  const [category, setCategory] = useState<string>("");
  const [dataInterval, setDataInterval] = useState<SubInterval[]>([]);
  const [selectInterval, setSelectInterval] = useState<any[]>([]);
  const [sub_scope, setSub_Scope] = useState<any[]>([]);

  const handleChangeDatePickerFrom = (newValue: Date | null) => {
    setValueFrom(newValue);
    formik.values.from = format(newValue, "yyyy-MM-dd");
  };

  const handleChangeDatePickerTo = (newValue: Date | null) => {
    setValuTo(newValue);
    formik.values.to = format(newValue, "yyyy-MM-dd");
  };

  const handleChangeDatePicker = (newValue: Date | null) => {
    setValue(newValue);
  };

  const isMountedRef = useRefMounted();
  const [roles, setRoles] = useState<Department[]>([]);
  const [tabs, setTabs] = useState<Department[]>([]);
  const [search, setSearch] = useState("ALL");

  const inactive = [
    {
      id: 1,
      code: "3",
      label: "3 เดือน",
    },
    {
      id: 2,
      code: "6",
      label: "6 เดือน",
    },
    {
      id: 3,
      code: "12",
      label: "12 เดือน",
    },
  ];

  //   const getRoles = useCallback(async () => {
  //     const tab = (await roleApi.get_all_Role("", "", "", "")).content;
  //     const role = (await roleApi.get_all_Role("", "", "", "ALL")).content.sort(
  //       (a: any, b: any) => (a.id > b.id ? 1 : -1)
  //     );

  //     setTabs(tab);
  //     setRoles(role);
  //   }, [isMountedRef]);

  const getRoles = useCallback(async () => {
    const role = await roleApi.get_all_Role("", "", "", "ALL");
    console.log("getrole ", role);
    setRoles(role.content);
  }, []);

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    setSub_Scope([]);
    auth.scope.map((val) => {
      // sub_scope.push(val);
      setSub_Scope((current) => [...current, val]);

      val?.sub_scopes?.map((element) => {
        // sub_scope.push(element);
        setSub_Scope((current) => [...current, element]);
      });
    });
    console.log("scopexx ", sub_scope);
  }, [
    props.filtersRole.role === props.tab.two ||
      props.filtersRole.role === null ||
      props.filtersRole.role === "",
  ]);

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
      console.log("xx ", Filter_interval);

      // setIntervals(interval_result);
      setIntervals(Filter_interval);
    } catch (err) {
      setIntervals([]);
    }
  }, []);

  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      from: format(new Date(), "yyyy-MM-dd"),
      to: format(new Date(), "yyyy-MM-dd"),
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      department_uuid: null,
      scope_code: null,
      inactive: null,
    },
    validationSchema: Yup.object({
      // department_uuid: Yup.string()
      //   .max(255)
      //   .required(t("The first name field is required")),
    }),
    onSubmit: async (values, _helpers): Promise<void> => {
      //   console.log("path ", values);
      //Subscriber คือ tab 3
      try {
        var path = `${
          props.filtersRole.role === "subscriber" && values.from
            ? `&from=${values.from}`
            : ``
        }${
          props.filtersRole.role === "subscriber" && values.to
            ? `&to=${values.to}`
            : ``
        }${
          props.filtersRole.role !== "subscriber" && values.first_name
            ? `&first_name=${values.first_name}`
            : ``
        }${
          props.filtersRole.role !== "subscriber" && values.last_name
            ? `&last_name=${values.last_name}`
            : ``
        }${
          props.filtersRole.role !== "subscriber" && values.email
            ? `&email=${values.email}`
            : ``
        }${
          values.department_uuid
            ? `&department_uuid=${values.department_uuid}`
            : ``
        }${
          props.filtersRole.role !== "subscriber" && values.role
            ? `&role=${values.role}`
            : ``
        }${
          (props.filtersRole.role === null ||
            props.filtersRole.role === "" ||
            props.filtersRole.role === "all") &&
          values.scope_code
            ? `&scope_code=${values.scope_code}`
            : ``
        }${
          props.filtersRole.role === props.tab.two && values.inactive
            ? `&inactive_time=${values.inactive}`
            : ``
        }`;

        //   values.interval &&
        //     values.interval.forEach(
        //       (element) => (path += `&interval_uuid=${element}`)
        //     );
        props.onClick(path);
        // console.log("path ", path);
      } catch (err) {
        console.error(err);
      }
    },
  });

  const [activities, setActivities] = useState<any[]>([]);

  const getActivities = useCallback(async () => {
    try {
      const activities = await nonWaterApi.getActivity();
      setActivities(activities?.content ?? []);
      console.log("getactivities ", activities);
    } catch (error) {
      setActivities([]);
    }

    // setRoles(role.content);
  }, []);

  useEffect(() => {
    getActivities();
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
                              onChange={handleChangeDatePickerFrom}
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
                              onChange={handleChangeDatePickerTo}
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
                            {intervals && (
                              <AutocompleteIntervalsMUI
                                formik={formik}
                                intervals={intervals}
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
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </>
              )}

              {props.page === "user_report" && (
                <>
                  {props.filtersRole.role === props.tab.three ? (
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
                                inputFormat="dd MMMM yyyy"
                                value={valueFrom}
                                onChange={handleChangeDatePickerFrom}
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
                                inputFormat="dd MMMM yyyy"
                                value={valueTo}
                                onChange={handleChangeDatePickerTo}
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
                  ) : (
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
                              <b>{t("กรองตามผู้ใช้งาน")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <TextField
                                  error={Boolean(
                                    formik.touched.first_name &&
                                      formik.errors.first_name
                                  )}
                                  fullWidth
                                  margin="normal"
                                  helperText={
                                    formik.touched.first_name &&
                                    formik.errors.first_name
                                  }
                                  label={t("FIRST_NAME")}
                                  name="first_name"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.first_name}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs={12} sm={4} md={4}>
                                <TextField
                                  error={Boolean(
                                    formik.touched.last_name &&
                                      formik.errors.last_name
                                  )}
                                  fullWidth
                                  margin="normal"
                                  helperText={
                                    formik.touched.last_name &&
                                    formik.errors.last_name
                                  }
                                  label={t("LAST_NAME")}
                                  name="last_name"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  value={formik.values.last_name}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs={12} sm={4} md={4}>
                                <TextField
                                  error={Boolean(
                                    formik.touched.email && formik.errors.email
                                  )}
                                  fullWidth
                                  margin="normal"
                                  helperText={
                                    formik.touched.email && formik.errors.email
                                  }
                                  label={t("EMAIL")}
                                  name="email"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
                                  type="email"
                                  value={formik.values.email}
                                  variant="outlined"
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
                              <b>{t("กรองตามการใช้งาน")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  disablePortal
                                  options={roles}
                                  isOptionEqualToValue={(
                                    option: any,
                                    value: any
                                  ) => option.code === value.code}
                                  getOptionLabel={(option: any) =>
                                    (localStorage.getItem(server.LANGUAGE) ===
                                    "th"
                                      ? option.name?.th
                                      : option.name?.en) ?? option
                                  }
                                  // options={masterData.departments}
                                  // isOptionEqualToValue={(option: any, value: any) =>
                                  //   option.code === value.code
                                  // }
                                  // getOptionLabel={(option: any) =>
                                  //   option.name?.th ? option.name?.th : "-"
                                  // }
                                  onChange={(_e, value: any | null) => {
                                    // props.props.formik.values.department_uuid = value?.uuid;
                                    // console.log("val ", value);
                                    formik.setFieldValue("role", value?.code);
                                  }}
                                  // value={
                                  //   masterData.departments?.find(
                                  //     (val) => val.uuid === props.props.formik.values.department_uuid
                                  //   ) ?? null
                                  // }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      // error={Boolean(
                                      //    props.formik.touched.users_group &&
                                      //    props.formik.errors.users_group
                                      // )}
                                      fullWidth
                                      name="users_group"
                                      // helperText={
                                      //    props.formik.touched.users_group &&
                                      //    props.formik.errors.users_group
                                      // }
                                      label={t("USER_GROUP")}
                                      // onBlur={props.props.formik.handleBlur}
                                      // onChange={props.props.formik.handleChange}
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Grid>
                              {/* {console.log("ath sc ", auth.scope)} */}
                              {sub_scope &&
                                (props.filtersRole.role === null ||
                                  props.filtersRole.role === "") && (
                                  <Grid item xs={12} sm={4} md={4}>
                                    <Autocomplete
                                      disablePortal
                                      options={sub_scope ?? []}
                                      getOptionLabel={(option: any) =>
                                        option.name?.th ? option.name?.th : "-"
                                      }
                                      // onChange={props.formik.setFieldValue}
                                      // isOptionEqualToValue={(option, value) =>
                                      //   option.value === value?.value
                                      // }
                                      onChange={(_e, value: any | null) => {
                                        // console.log(value);
                                        // console.log("type ", value);
                                        formik.setFieldValue(
                                          "scope_code",
                                          value?.code
                                        );
                                      }}
                                      value={sub_scope.find(
                                        (val) =>
                                          val.code === formik.values.scope_code
                                      )}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          error={Boolean(
                                            props.formik.touched.agency &&
                                              props.formik.errors.agency
                                          )}
                                          fullWidth
                                          name="agency"
                                          helperText={
                                            props.formik.touched.agency &&
                                            props.formik.errors.agency
                                          }
                                          label={
                                            props.filtersRole.role === null ||
                                            props.filtersRole.role === ""
                                              ? t("สิทธิ์การใช้งาน")
                                              : t("ระยะเวลา Inactive")
                                          }
                                          onBlur={props.formik.handleBlur}
                                          onChange={props.formik.handleChange}
                                          variant="outlined"
                                        />
                                      )}
                                    />
                                  </Grid>
                                )}

                              {props.filtersRole.role === props.tab.two && (
                                <Grid item xs={12} sm={4} md={4}>
                                  <Autocomplete
                                    disablePortal
                                    options={inactive ?? []}
                                    getOptionLabel={(option: any) =>
                                      option?.label ? option?.label : "-"
                                    }
                                    // onChange={props.formik.setFieldValue}
                                    // isOptionEqualToValue={(option, value) =>
                                    //   option.value === value?.value
                                    // }
                                    onChange={(_e, value: any | null) => {
                                      // console.log(value);
                                      // console.log("type ", value);
                                      formik.setFieldValue(
                                        "inactive",
                                        value?.code
                                      );
                                    }}
                                    // value={props.formik.values.agency}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        error={Boolean(
                                          props.formik.touched.agency &&
                                            props.formik.errors.agency
                                        )}
                                        fullWidth
                                        name="agency"
                                        helperText={
                                          props.formik.touched.agency &&
                                          props.formik.errors.agency
                                        }
                                        label={t("ระยะเวลา Inactive")}
                                        onBlur={props.formik.handleBlur}
                                        onChange={props.formik.handleChange}
                                        variant="outlined"
                                      />
                                    )}
                                  />
                                </Grid>
                              )}

                              {/* {props.filtersRole.role === props.tab.two && (
                                <Grid item xs={12} sm={4} md={4}>
                                  <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={top100Films}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        label={t("ระยะเวลาที่ไม่เคลื่อนไหว")}
                                      />
                                    )}
                                  />
                                </Grid>
                              )} */}
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
                              <b>{t("FILTER_BY_DEPARTMENT")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteDepartmentsMUI formik={formik} />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
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
