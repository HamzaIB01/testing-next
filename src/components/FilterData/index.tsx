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
        option.category_code === value.category_code
      }
      getOptionLabel={(option: any) =>
        (localStorage.getItem(server.LANGUAGE) === "th"
          ? option.category_name?.th
          : option.category_name?.en) ?? option
      }
      onChange={(_e, value: any | null) =>
        props.formik.setFieldValue("data_set", value?.category_name?.th ?? "")
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
        props.formik?.setFieldValue("departments_id", value?.name?.th ?? "")
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

  return (
    <Autocomplete
      multiple
      limitTags={2}
      options={masterData.intervals}
      isOptionEqualToValue={(option: any, value: any) =>
        option.interval_code === value.interval_code
      }
      getOptionLabel={(option: any) =>
        (localStorage.getItem(server.LANGUAGE) === "th"
          ? option.interval_name?.th
          : option.interval_name?.en) ?? option
      }
      onChange={(_e, value: any | null) =>
        props.formik?.setFieldValue("data_set", value?.code ?? "")
      }
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

export function FilterData(props: any) {
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
    // formik.values.from = format(newValue, "yyyy-MM-dd");
    formik?.setFieldValue("from", format(newValue, "yyyy-MM-dd"));
  };

  const handleChangeDatePickerTo = (newValue: Date | null) => {
    setValuTo(newValue);
    // props.formik.values.to = format(newValue, "yyyy-MM-dd");
    formik?.setFieldValue("to", format(newValue, "yyyy-MM-dd"));
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
    // getRoles();
  }, [getRoles]);

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

      // setIntervals(interval_result);
      setIntervals(Filter_interval);
    } catch (err) {
      setIntervals([]);
    }
  }, []);

  useEffect(() => {
    // if (
    //   formik.values.category_uuid?.length > 1 &&
    //   formik.values.department_uuid?.length > 1
    // ) {
    //   getIntervals(formik.values.category_uuid, formik.values.department_uuid);
    // }
    // else if (formik.values.department_uuid?.length > 1) {
    //   getIntervals("", formik.values.department_uuid);
    // }
    setDataInterval([]);
    props.getInitial?.parameter?.interval?.map((val) =>
      intervals.filter((object) => {
        if (object.uuid === val.uuid) {
          setDataInterval((current) => [...current, object]);
        }
      })
    );

    if (category?.length > 1) {
      getIntervals(category, "");
    } else {
      setIntervals([]);
      if (props.getInitial) {
        props.getInitial.parameter.interval = [];
      }
    }
  }, [category]);

  useEffect(() => {
    if (selectInterval.length > 0) {
      setDataInterval([]);
      props.getInitial.parameter?.interval?.map((val) =>
        intervals.filter((object) => {
          if (object.uuid === val.uuid) {
            setDataInterval((current) => [...current, object]);
          }
        })
      );
    } else {
      setDataInterval([]);
    }
  }, [selectInterval, category?.length]);

  const formik = useFormik({
    initialValues: {
      name_account: "",
      status: "",
      data_set: "",
      duration: [],
      departments_id: "",
    },
    validationSchema: Yup.object({
      // thai_name: Yup.string()
      //   .max(255)
      //   .required(t("The thai name field is required")),
    }),
    onSubmit: async (values) => {
      console.log("submit", values);
    },
  });

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
              {props.page === "search" && (
                <>
                  {console.log("props ", props)}
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
                            <Autocomplete
                              options={masterData.categories}
                              getOptionLabel={(option: any) =>
                                option.category_name?.th
                                  ? option.category_name?.th
                                  : ""
                              }
                              disabled={props.disabled ? props.disabled : false}
                              // disabled={props.disabled ? props.disabled : false}
                              //  isOptionEqualToValue={() => false}
                              defaultValue={
                                !props.getInitial && props.submitValue
                                  ? masterData.categories.find(
                                      (val) =>
                                        val.category_uuid ===
                                        props.submitValue.category.uuid
                                    )
                                  : ""
                              }
                              onChange={(_e, value: any | null) => {
                                setCategory(value?.category_uuid);
                                if (
                                  props.formik &&
                                  props.formik.initialValues
                                ) {
                                  props.formik.initialValues.parameter.category.uuid =
                                    value?.category_uuid;
                                }

                                if (props.submitValue) {
                                  props.submitValue.category.uuid =
                                    value?.category_uuid;
                                }

                                if (
                                  props.getInitial &&
                                  props.getInitial.parameter
                                ) {
                                  props.getInitial.parameter.category.uuid =
                                    value?.category_uuid;
                                }
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  name="user_uuid"
                                  label={t("DATA_SET")}
                                  variant="outlined"
                                />
                              )}
                            />
                          </Grid>

                          {/* {console.log(
                            "props interval ",
                            props.submitValue.interval
                          )} */}

                          {props.filtersRole === "request-file" ||
                            (props.filtersRole === "subscriber" && (
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  multiple
                                  limitTags={2}
                                  // options={
                                  //   !props.getInitial && props.submitValue
                                  //     ? masterData.categories
                                  //     : intervals
                                  // }
                                  options={
                                    props.interval_category
                                      ? props.interval_category
                                      : intervals
                                  }
                                  getOptionLabel={(option: any) =>
                                    option.interval_code
                                      ? option.interval_code
                                      : option.code
                                      ? option.code
                                      : "-"
                                  }
                                  // value={!props.getInitial && props.submitValue.category}
                                  noOptionsText={"กรุณาเลือกประเภทข้อมูล"}
                                  // defaultValue={
                                  //   !props.getInitial && props.submitValue
                                  //     ? props.submitValue.interval
                                  //     : []
                                  // }
                                  value={
                                    !props.getInitial && props.submitValue
                                      ? props.submitValue.interval
                                      : dataInterval
                                  }
                                  // value={props.getInitial.parameter.interval.map((val) => return intervals.filter((object) => if (object.uuid === val.uuid){ object }  ))}
                                  onChange={(_e, value: any | null) => {
                                    setSelectInterval(value ? value : []);
                                    if (props.submitValue) {
                                      props.submitValue.interval = value;
                                    }

                                    if (props.getInitial) {
                                      if (value.length > 0) {
                                        props.getInitial.parameter.interval =
                                          [];
                                        value.map((data: any, _index: any) => {
                                          props.getInitial.parameter.interval.push(
                                            {
                                              uuid: data?.uuid,
                                            }
                                          );
                                        });
                                      } else {
                                        props.getInitial.parameter.interval =
                                          [];
                                      }
                                    }
                                  }}
                                  disabled={
                                    props.disabled ? props.disabled : false
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      variant="outlined"
                                      label={t("DURATION")}
                                    />
                                  )}
                                />
                              </Grid>
                            ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {props.filtersRole === "subscriber" && (
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
                              <b>{t("FILTER_BY_BASIN")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  multiple
                                  limitTags={1}
                                  options={masterData.basins}
                                  getOptionLabel={(option: any) =>
                                    option.basin_name?.th
                                      ? option.basin_name?.th
                                      : "-"
                                  }
                                  disabled={
                                    props.disabled ? props.disabled : false
                                  }
                                  defaultValue={
                                    !props.getInitial &&
                                    props.submitValue &&
                                    props.submitValue.basin?.length > 0
                                      ? props.submitValue.basin
                                      : []
                                  }
                                  onChange={(_e, value: any | null) => {
                                    if (props.submitValue) {
                                      props.submitValue.basin = value;
                                    }

                                    if (props.getInitial) {
                                      if (value.length > 0) {
                                        props.getInitial.parameter.basin = [];
                                        value.map((data: any) => {
                                          props.getInitial.parameter.basin.push(
                                            {
                                              uuid: data.basin_uuid,
                                            }
                                          );
                                        });
                                      } else {
                                        props.getInitial.parameter.basin = [];
                                      }
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      variant="outlined"
                                      label={t("RIVER_BASIN")}
                                      // placeholder={t('เลือกแท็ก...')}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  //   disablePortal
                                  multiple
                                  limitTags={1}
                                  id="station"
                                  options={masterData.stations}
                                  getOptionLabel={(option: any) =>
                                    option.station_code
                                      ? option.station_code
                                      : "-"
                                  }
                                  //   isOptionEqualToValue={() => false}
                                  disabled={
                                    props.disabled ? props.disabled : false
                                  }
                                  defaultValue={
                                    !props.getInitial &&
                                    props.submitValue &&
                                    props.submitValue.station?.length > 0
                                      ? props.submitValue.station
                                      : []
                                  }
                                  onChange={(_e, value: any | null) => {
                                    if (props.submitValue) {
                                      props.submitValue.station = value;
                                    }
                                    if (props.getInitial) {
                                      if (value.length > 0) {
                                        props.getInitial.parameter.station = [];
                                        value.map((data: any) => {
                                          props.getInitial.parameter.station.push(
                                            {
                                              uuid: data.station_uuid,
                                            }
                                          );
                                        });
                                      } else {
                                        props.getInitial.parameter.station = [];
                                      }
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      // name="data_set"
                                      label={t("สถานี")}
                                      variant="outlined"
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
                              <b>{t("FILTER_BY_AREA")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  //   disablePortal
                                  multiple
                                  limitTags={1}
                                  //   id="data_set"
                                  options={masterDataMockup.province}
                                  getOptionLabel={(option: any) =>
                                    option.name ?? option
                                  }
                                  disabled={
                                    props.disabled ? props.disabled : false
                                  }
                                  defaultValue={
                                    !props.getInitial &&
                                    props.submitValue &&
                                    props.submitValue.province?.length > 0
                                      ? props.submitValue.province
                                      : []
                                  }
                                  onChange={(_e, value: any | null) => {
                                    if (props.submitValue) {
                                      props.submitValue.province = value;
                                    }
                                    if (props.getInitial) {
                                      if (value.length > 0) {
                                        props.getInitial.parameter.province =
                                          [];
                                        value.map((data: any, _index: any) => {
                                          props.getInitial.parameter.province.push(
                                            {
                                              code: data.code,
                                            }
                                          );
                                        });
                                      } else {
                                        props.getInitial.parameter.province =
                                          [];
                                      }
                                    }
                                  }}
                                  isOptionEqualToValue={() => false}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      // name="data_set"
                                      label={t("จังหวัด")}
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  //   disablePortal
                                  multiple
                                  limitTags={1}
                                  //   id="data_set"
                                  options={masterDataMockup.district}
                                  getOptionLabel={(option: any) =>
                                    option.name ?? option
                                  }
                                  disabled={
                                    props.disabled ? props.disabled : false
                                  }
                                  defaultValue={
                                    !props.getInitial &&
                                    props.submitValue &&
                                    props.submitValue.district?.length > 0
                                      ? props.submitValue.district
                                      : []
                                  }
                                  onChange={(_e, value: any | null) => {
                                    if (props.submitValue) {
                                      props.submitValue.district = value;
                                    }
                                    if (props.getInitial) {
                                      if (value.length > 0) {
                                        props.getInitial.parameter.district =
                                          [];
                                        value.map((data: any, _index: any) => {
                                          props.getInitial.parameter.district.push(
                                            {
                                              code: data.code,
                                            }
                                          );
                                        });
                                      } else {
                                        props.getInitial.parameter.district =
                                          [];
                                      }
                                    }
                                  }}
                                  isOptionEqualToValue={() => false}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      // name="data_set"
                                      label={t("อำเภอ")}
                                      variant="outlined"
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  //   disablePortal
                                  multiple
                                  limitTags={1}
                                  //   id="data_set"
                                  options={masterDataMockup.sub_district}
                                  getOptionLabel={(option: any) =>
                                    option.name ?? option
                                  }
                                  disabled={
                                    props.disabled ? props.disabled : false
                                  }
                                  defaultValue={
                                    !props.getInitial &&
                                    props.submitValue &&
                                    props.submitValue.sub_district?.length > 0
                                      ? props.submitValue.sub_district
                                      : []
                                  }
                                  onChange={(_e, value: any | null) => {
                                    if (props.submitValue) {
                                      props.submitValue.sub_district = value;
                                    }
                                    if (props.getInitial) {
                                      if (value.length > 0) {
                                        props.getInitial.parameter.sub_district =
                                          [];
                                        value.map((data: any, _index: any) => {
                                          props.getInitial.parameter.sub_district.push(
                                            {
                                              code: data.code,
                                            }
                                          );
                                        });
                                      } else {
                                        props.getInitial.parameter.sub_district =
                                          [];
                                      }
                                    }
                                  }}
                                  isOptionEqualToValue={() => false}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      // name="data_set"
                                      label={t("ตำบล")}
                                      variant="outlined"
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
                              <b>{t("FILTER_BY_DEPARTMENT")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                {props.agency && (
                                  <Autocomplete
                                    multiple
                                    limitTags={1}
                                    options={masterData.departments}
                                    getOptionLabel={(option: any) =>
                                      option.name?.th ? option.name?.th : "-"
                                    }
                                    disabled={
                                      props.disabled ? props.disabled : false
                                    }
                                    defaultValue={
                                      !props.getInitial &&
                                      props.submitValue &&
                                      props.submitValue.department?.length > 0
                                        ? props.submitValue.department
                                        : []
                                    }
                                    onChange={(_e, value) => {
                                      // value={props.formik.values.first_name}
                                      if (props.submitValue) {
                                        props.submitValue.department = value;
                                      }
                                      if (props.getInitial) {
                                        if (value.length > 0) {
                                          props.getInitial.parameter.department =
                                            [];
                                          value.map(
                                            (data: any, _index: any) => {
                                              props.getInitial.parameter.department.push(
                                                {
                                                  uuid: data.uuid,
                                                }
                                              );
                                            }
                                          );
                                        } else {
                                          props.getInitial.parameter.department =
                                            [];
                                        }
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        label={t("AGENCY")}
                                      />
                                    )}
                                  />
                                )}

                                {props.agencyTab && (
                                  // <FormControl fullWidth variant="outlined">
                                  //   <InputLabel>{t("AGENCY")}</InputLabel>
                                  //   <Select
                                  //     value={filtertabs.status}
                                  //     disabled={
                                  //       props.disabled ? props.disabled : false
                                  //     }
                                  //     onChange={(selectedOption) => {
                                  //       let e = {
                                  //         target: {
                                  //           name: `id_card_type`,
                                  //           value: selectedOption.target.value,
                                  //         },
                                  //       };
                                  //       // props.onChange(e);
                                  //       setFilterTabs({ status: e.target.value });
                                  //     }}
                                  //     label={t("AGENCY")}
                                  //   >
                                  //     {statusTabs.map((statusTabs) => (
                                  //       <MenuItem
                                  //         key={statusTabs.value}
                                  //         value={statusTabs.value}
                                  //       >
                                  //         {statusTabs.label}
                                  //       </MenuItem>
                                  //     ))}
                                  //   </Select>
                                  // </FormControl>
                                  <Autocomplete
                                    multiple
                                    limitTags={1}
                                    options={masterData.departments}
                                    getOptionLabel={(option: any) =>
                                      option.name?.th ? option.name?.th : "-"
                                    }
                                    disabled={
                                      props.disabled ? props.disabled : false
                                    }
                                    defaultValue={
                                      !props.getInitial &&
                                      props.submitValue &&
                                      props.submitValue.department?.length > 0
                                        ? props.submitValue.department
                                        : []
                                    }
                                    onChange={(_e, value) => {
                                      // value={props.formik.values.first_name}
                                      if (props.submitValue) {
                                        props.submitValue.department = value;
                                      }
                                      if (props.getInitial) {
                                        if (value.length > 0) {
                                          props.getInitial.parameter.department =
                                            [];
                                          value.map(
                                            (data: any, _index: any) => {
                                              props.getInitial.parameter.department.push(
                                                {
                                                  uuid: data.uuid,
                                                }
                                              );
                                            }
                                          );
                                        } else {
                                          props.getInitial.parameter.department =
                                            [];
                                        }
                                      }
                                    }}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        fullWidth
                                        variant="outlined"
                                        label={t("AGENCY")}
                                      />
                                    )}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              )}

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
                          <Grid item xs={12} sm={4} md={4}>
                            <DesktopDatePicker
                              label={t("UP_TO_DATE")}
                              inputFormat="dd-MMMM-yyyy"
                              value={valueTo}
                              onChange={handleChangeDatePickerTo}
                              disableMaskedInput={true}
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
                            <AutocompleteCategoriesMUI formik={formik} />
                          </Grid>

                          <Grid item xs={12} sm={4} md={4}>
                            <AutocompleteIntervalsMUI props={props} />
                            {/* <Autocomplete
                                          multiple
                                          limitTags={2}
                                          options={jobsTags}
                                          getOptionLabel={(option) => option.title}
                                          defaultValue={[
                                             jobsTags[0],
                                             jobsTags[1],
                                             jobsTags[2],
                                             jobsTags[3],
                                          ]}
                                          disabled={props.disabled ? props.disabled : false}
                                          renderInput={(params) => (
                                             <TextField
                                                {...params}
                                                fullWidth
                                                variant="outlined"
                                                label={t("DURATION")}
                                             // placeholder={t('เลือกแท็ก...')}
                                             />
                                          )}
                                       /> */}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* {console.log(props.filtersRole)} */}

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
                              <AutocompleteDepartmentsMUI props={props} />
                              {/* <Autocomplete
                                          multiple
                                          limitTags={2}
                                          options={jobsTags}
                                          getOptionLabel={(option) => option.title}
                                          defaultValue={[
                                             jobsTags[0],
                                             jobsTags[1],
                                             jobsTags[2],
                                             jobsTags[3],
                                          ]}
                                          disabled={props.disabled ? props.disabled : false}
                                          renderInput={(params) => (
                                             <TextField
                                                {...params}
                                                fullWidth
                                                variant="outlined"
                                                label={t("DURATION")}
                                             // placeholder={t('เลือกแท็ก...')}
                                             />
                                          )}
                                       /> */}
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
                                value={value}
                                onChange={handleChangeDatePicker}
                                disableMaskedInput={true}
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
                            <Grid item xs={12} sm={4} md={4}>
                              <DesktopDatePicker
                                label={t("UP_TO_DATE")}
                                inputFormat="dd MMMM yyyy"
                                value={value}
                                onChange={handleChangeDatePicker}
                                disableMaskedInput={true}
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
                                    props.formik.touched.first_name &&
                                      props.formik.errors.first_name
                                  )}
                                  fullWidth
                                  margin="normal"
                                  helperText={
                                    props.formik.touched.first_name &&
                                    props.formik.errors.first_name
                                  }
                                  label={t("FIRST_NAME")}
                                  name="first_name"
                                  onBlur={props.formik.handleBlur}
                                  onChange={props.formik.handleChange}
                                  value={props.formik.values.first_name}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs={12} sm={4} md={4}>
                                <TextField
                                  error={Boolean(
                                    props.formik.touched.last_name &&
                                      props.formik.errors.last_name
                                  )}
                                  fullWidth
                                  margin="normal"
                                  helperText={
                                    props.formik.touched.last_name &&
                                    props.formik.errors.last_name
                                  }
                                  label={t("LAST_NAME")}
                                  name="last_name"
                                  onBlur={props.formik.handleBlur}
                                  onChange={props.formik.handleChange}
                                  value={props.formik.values.last_name}
                                  variant="outlined"
                                />
                              </Grid>
                              <Grid item xs={12} sm={4} md={4}>
                                <TextField
                                  error={Boolean(
                                    props.formik.touched.email &&
                                      props.formik.errors.email
                                  )}
                                  fullWidth
                                  margin="normal"
                                  helperText={
                                    props.formik.touched.email &&
                                    props.formik.errors.email
                                  }
                                  label={t("EMAIL")}
                                  name="email"
                                  onBlur={props.formik.handleBlur}
                                  onChange={props.formik.handleChange}
                                  type="email"
                                  value={props.formik.values.email}
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
                                  // onChange={(_e, value: any | null) => {
                                  //   props.props.formik.values.department_uuid = value?.uuid;
                                  // }}
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

                              {props.filtersRole.role === props.tab.one && (
                                <Grid item xs={12} sm={4} md={4}>
                                  <Autocomplete
                                    disablePortal
                                    options={masterData.departments}
                                    getOptionLabel={(option) =>
                                      option.label ?? option
                                    }
                                    // onChange={props.formik.setFieldValue}
                                    isOptionEqualToValue={(option, value) =>
                                      option.value === value?.value
                                    }
                                    onChange={(_e, value) => {
                                      // console.log(value);
                                      props.formik.setFieldValue(
                                        "agency",
                                        value !== null
                                          ? value
                                          : props.formik.initialValues.value
                                      );
                                    }}
                                    value={props.formik.values.agency}
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
                                        label={t("สถานะการตรวจสอบ")}
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
                              )}
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
                                <AutocompleteDepartmentsMUI />
                                {/* <Autocomplete
                                    disablePortal
                                    options={top99Films}
                                    getOptionLabel={(option) =>
                                      option.label ?? option
                                    }
                                    // onChange={props.formik.setFieldValue}
                                    isOptionEqualToValue={(option, value) =>
                                      option.value === value?.value
                                    }
                                    onChange={(_e, value) => {
                                      // console.log(value);
                                      props.formik.setFieldValue(
                                        "agency",
                                        value !== null
                                          ? value
                                          : props.formik.initialValues.value
                                      );
                                    }}
                                    value={props.formik.values.agency}
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
                                        label={t("AGENCY")}
                                        onBlur={props.formik.handleBlur}
                                        onChange={props.formik.handleChange}
                                        variant="outlined"
                                      />
                                    )}
                                  /> */}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </>
              )}

              {props.page === "manage-account" && (
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
                          <b>{t("FILL_IN_INFORMATION")}</b>
                        </Box>
                      </Grid>

                      <Grid item xs={10}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4} md={4}>
                            <TextField
                              fullWidth
                              label={t("ชื่อบัญชีนำเข้าข้อมูล")}
                              variant="outlined"
                              name="name_account"
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4} md={4}>
                            <Autocomplete
                              disablePortal
                              options={top100Films}
                              getOptionLabel={(option: any) =>
                                option.code ?? option
                              }
                              isOptionEqualToValue={(option: any, value: any) =>
                                option.code === value.code
                              }
                              onChange={(_e, value: any | null) =>
                                formik.setFieldValue(
                                  "status",
                                  value?.code ?? ""
                                )
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  label={t("สถานะ")}
                                  variant="outlined"
                                  name="status"
                                  onBlur={formik.handleBlur}
                                  onChange={formik.handleChange}
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
                            <AutocompleteCategoriesMUI formik={formik} />
                          </Grid>

                          <Grid item xs={12} sm={4} md={4}>
                            <AutocompleteIntervalsMUI formik={formik} />
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

              {props.page === "connect_import_report" && (
                <>
                  {props.filtersRole === TableType.DATA_REPORT_NOT_UPDATE && (
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
                              <b>{t("FILTER_BY_DATA_SET")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteCategoriesMUI />
                              </Grid>

                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteIntervalsMUI />
                                {/* <Autocomplete
                                    multiple
                                    limitTags={2}
                                    options={masterData.intervals}
                                    getOptionLabel={(option: any) =>
                                        (localStorage.getItem(server.LANGUAGE) === "th"
                                          ? option?.interval_name?.name_th
                                          : option?.interval_name?.name_en)
                                        ?? option
                                    }
                                    // defaultValue={[]}
                                    disabled={props.disabled ? props.disabled : false}
                                    renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          fullWidth
                                          variant="outlined"
                                          label={t("DURATION")}
                                        />
                                    )}
                                  /> */}
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
                              <b>{t("FILTER_BY_DEPARTMENT")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteDepartmentsMUI />
                                {/* <Autocomplete
                                                disablePortal
                                                options={masterData.departments}
                                                isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                                                getOptionLabel={(option: any) =>
                                                   (localStorage.getItem(server.LANGUAGE) === "th"
                                                      ? option.short_name?.th
                                                      : option.short_name?.th)
                                                   ?? option
                                                }
                                                //   onChange={props.formik.setFieldValue}
                                                //   isOptionEqualToValue={(option, value) =>
                                                //     option?.code ===
                                                //     props.formik.values.users_group
                                                //   }
                                                // value={props.formik.values.users_group || ""}
                                                renderInput={(params) => (
                                                   <TextField
                                                      {...params}
                                                      // error={Boolean(
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // )}
                                                      fullWidth
                                                      name="departments_id"
                                                      // helperText={
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // }
                                                      label={t("AGENCY")}
                                                      // onBlur={props.formik.handleBlur}
                                                      // onChange={props.formik.handleChange}
                                                      variant="outlined"
                                                   />
                                                )}
                                             /> */}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {props.filtersRole === TableType.DATA_INTEGRITY_REPORT && (
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
                              <b>{t("FILTER_BY_DATA_SET")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteCategoriesMUI />

                                {/* <Autocomplete
                                                disablePortal
                                                options={masterData.categories}
                                                isOptionEqualToValue={(option: any, value: any) => option.category_code === value.category_code}
                                                getOptionLabel={(option: any) =>
                                                   (localStorage.getItem(server.LANGUAGE) === "th"
                                                      ? option.category_name?.name_th
                                                      : option.category_name?.name_en)
                                                   ?? option
                                                }
                                                //   onChange={props.formik.setFieldValue}
                                                //   isOptionEqualToValue={(option, value) =>
                                                //     option?.code ===
                                                //     props.formik.values.users_group
                                                //   }
                                                // value={props.formik.values.users_group || ""}
                                                renderInput={(params) => (
                                                   <TextField
                                                      {...params}
                                                      // error={Boolean(
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // )}
                                                      fullWidth
                                                      // margin="normal"
                                                      name="data_set"
                                                      // helperText={
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // }
                                                      label={t("DATA_SET")}
                                                      // onBlur={props.formik.handleBlur}
                                                      // onChange={props.formik.handleChange}
                                                      variant="outlined"
                                                   />
                                                )}
                                             /> */}
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
                              <b>{t("FILTER_BY_DEPARTMENT")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteDepartmentsMUI />
                                {/* <Autocomplete
                                                disablePortal
                                                options={masterData.departments}
                                                isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                                                getOptionLabel={(option: any) =>
                                                   (localStorage.getItem(server.LANGUAGE) === "th"
                                                      ? option.short_name?.th
                                                      : option.short_name?.th)
                                                   ?? option
                                                }
                                                //   onChange={props.formik.setFieldValue}
                                                //   isOptionEqualToValue={(option, value) =>
                                                //     option?.code ===
                                                //     props.formik.values.users_group
                                                //   }
                                                // value={props.formik.values.users_group || ""}
                                                renderInput={(params) => (
                                                   <TextField
                                                      {...params}
                                                      // error={Boolean(
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // )}
                                                      fullWidth
                                                      name="departments_id"
                                                      // helperText={
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // }
                                                      label={t("AGENCY")}
                                                      // onBlur={props.formik.handleBlur}
                                                      // onChange={props.formik.handleChange}
                                                      variant="outlined"
                                                   />
                                                )}
                                             /> */}
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
                              <b>{t("FILTER_BY_DURATION")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <DesktopDatePicker
                                  label={t("SINCE")}
                                  inputFormat="dd MMMM yyyy"
                                  value={value}
                                  onChange={handleChangeDatePicker}
                                  disableMaskedInput={true}
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
                              <Grid item xs={12} sm={4} md={4}>
                                <DesktopDatePicker
                                  label={t("UP_TO_DATE")}
                                  inputFormat="dd MMMM yyyy"
                                  value={value}
                                  onChange={handleChangeDatePicker}
                                  disableMaskedInput={true}
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
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {props.filtersRole === TableType.DATA_ACCURACY_REPORT && (
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
                              <b>{t("FILTER_BY_DATA_SET")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteCategoriesMUI />

                                {/* <Autocomplete
                                  disablePortal
                                  options={masterData.categories}
                                  isOptionEqualToValue={(
                                    option: any,
                                    value: any
                                  ) =>
                                    option.category_code === value.category_code
                                  }
                                  getOptionLabel={(option: any) =>
                                    option.category_name?.th
                                      ? option.category_name?.name
                                      : "-"
                                  }
                                  //   onChange={props.formik.setFieldValue}
                                  //   isOptionEqualToValue={(option, value) =>
                                  //     option?.code ===
                                  //     props.formik.values.users_group
                                  //   }
                                  // value={props.formik.values.users_group || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      // error={Boolean(
                                      //    props.formik.touched.users_group &&
                                      //    props.formik.errors.users_group
                                      // )}
                                      fullWidth
                                      // margin="normal"
                                      name="data_set"
                                      // helperText={
                                      //    props.formik.touched.users_group &&
                                      //    props.formik.errors.users_group
                                      // }
                                      label={t("DATA_SET")}
                                      // onBlur={props.formik.handleBlur}
                                      // onChange={props.formik.handleChange}
                                      variant="outlined"
                                    />
                                  )}
                                /> */}
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
                              <b>{t("FILTER_BY_DEPARTMENT")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteDepartmentsMUI />
                                {/* <Autocomplete
                                                disablePortal
                                                options={masterData.departments}
                                                isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                                                getOptionLabel={(option: any) =>
                                                   (localStorage.getItem(server.LANGUAGE) === "th"
                                                      ? option.short_name?.th
                                                      : option.short_name?.th)
                                                   ?? option
                                                }
                                                //   onChange={props.formik.setFieldValue}
                                                //   isOptionEqualToValue={(option, value) =>
                                                //     option?.code ===
                                                //     props.formik.values.users_group
                                                //   }
                                                // value={props.formik.values.users_group || ""}
                                                renderInput={(params) => (
                                                   <TextField
                                                      {...params}
                                                      // error={Boolean(
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // )}
                                                      fullWidth
                                                      name="departments_id"
                                                      // helperText={
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // }
                                                      label={t("AGENCY")}
                                                      // onBlur={props.formik.handleBlur}
                                                      // onChange={props.formik.handleChange}
                                                      variant="outlined"
                                                   />
                                                )}
                                             /> */}
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
                              <b>{t("FILTER_BY_DURATION")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <DesktopDatePicker
                                  label={t("SINCE")}
                                  inputFormat="dd MMMM yyyy"
                                  value={value}
                                  onChange={handleChangeDatePicker}
                                  disableMaskedInput={true}
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
                              <Grid item xs={12} sm={4} md={4}>
                                <DesktopDatePicker
                                  label={t("UP_TO_DATE")}
                                  inputFormat="dd MMMM yyyy"
                                  value={value}
                                  onChange={handleChangeDatePicker}
                                  disableMaskedInput={true}
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
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {props.filtersRole === TableType.REPORT_TIMELINESS_DATA && (
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
                              <b>{t("FILTER_BY_DATA_SET")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  disablePortal
                                  options={masterData.categories}
                                  isOptionEqualToValue={(
                                    option: any,
                                    value: any
                                  ) =>
                                    option.category_code === value.category_code
                                  }
                                  getOptionLabel={(option: any) =>
                                    option.category_name?.th
                                      ? option.category_name?.th
                                      : "-"
                                  }
                                  //   onChange={props.formik.setFieldValue}
                                  //   isOptionEqualToValue={(option, value) =>
                                  //     option?.code ===
                                  //     props.formik.values.users_group
                                  //   }
                                  // value={props.formik.values.users_group || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      // error={Boolean(
                                      //    props.formik.touched.users_group &&
                                      //    props.formik.errors.users_group
                                      // )}
                                      fullWidth
                                      // margin="normal"
                                      name="data_set"
                                      // helperText={
                                      //    props.formik.touched.users_group &&
                                      //    props.formik.errors.users_group
                                      // }
                                      label={t("DATA_SET")}
                                      // onBlur={props.formik.handleBlur}
                                      // onChange={props.formik.handleChange}
                                      variant="outlined"
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
                              <b>{t("FILTER_BY_DEPARTMENT")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteDepartmentsMUI />
                                {/* <Autocomplete
                                                disablePortal
                                                options={masterData.departments}
                                                isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                                                getOptionLabel={(option: any) =>
                                                   (localStorage.getItem(server.LANGUAGE) === "th"
                                                      ? option.short_name?.th
                                                      : option.short_name?.th)
                                                   ?? option
                                                }
                                                //   onChange={props.formik.setFieldValue}
                                                //   isOptionEqualToValue={(option, value) =>
                                                //     option?.code ===
                                                //     props.formik.values.users_group
                                                //   }
                                                // value={props.formik.values.users_group || ""}
                                                renderInput={(params) => (
                                                   <TextField
                                                      {...params}
                                                      // error={Boolean(
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // )}
                                                      fullWidth
                                                      name="departments_id"
                                                      // helperText={
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // }
                                                      label={t("AGENCY")}
                                                      // onBlur={props.formik.handleBlur}
                                                      // onChange={props.formik.handleChange}
                                                      variant="outlined"
                                                   />
                                                )}
                                             /> */}
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
                              <b>{t("FILTER_BY_DURATION")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <DesktopDatePicker
                                  label={t("SINCE")}
                                  inputFormat="dd MMMM yyyy"
                                  value={value}
                                  onChange={handleChangeDatePicker}
                                  disableMaskedInput={true}
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
                              <Grid item xs={12} sm={4} md={4}>
                                <DesktopDatePicker
                                  label={t("UP_TO_DATE")}
                                  inputFormat="dd MMMM yyyy"
                                  value={value}
                                  onChange={handleChangeDatePicker}
                                  disableMaskedInput={true}
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
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </>
                  )}

                  {props.filtersRole === TableType.DATA_IMPORT_WORK_HISTORY && (
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
                              <b>{t("FILTER_BY_DATA_SET")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <Autocomplete
                                  disablePortal
                                  options={masterData.categories}
                                  isOptionEqualToValue={(
                                    option: any,
                                    value: any
                                  ) =>
                                    option.category_code === value.category_code
                                  }
                                  getOptionLabel={(option: any) =>
                                    option.category_name?.th
                                      ? option.category_name?.th
                                      : "-"
                                  }
                                  //   onChange={props.formik.setFieldValue}
                                  //   isOptionEqualToValue={(option, value) =>
                                  //     option?.code ===
                                  //     props.formik.values.users_group
                                  //   }
                                  // value={props.formik.values.users_group || ""}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      // error={Boolean(
                                      //    props.formik.touched.users_group &&
                                      //    props.formik.errors.users_group
                                      // )}
                                      fullWidth
                                      // margin="normal"
                                      name="data_set"
                                      // helperText={
                                      //    props.formik.touched.users_group &&
                                      //    props.formik.errors.users_group
                                      // }
                                      label={t("DATA_SET")}
                                      // onBlur={props.formik.handleBlur}
                                      // onChange={props.formik.handleChange}
                                      variant="outlined"
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
                              <b>{t("FILTER_BY_DEPARTMENT")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <AutocompleteDepartmentsMUI />
                                {/* <Autocomplete
                                                disablePortal
                                                options={masterData.departments}
                                                isOptionEqualToValue={(option: any, value: any) => option.code === value.code}
                                                getOptionLabel={(option: any) =>
                                                   (localStorage.getItem(server.LANGUAGE) === "th"
                                                      ? option.short_name?.th
                                                      : option.short_name?.th)
                                                   ?? option
                                                }
                                                //   onChange={props.formik.setFieldValue}
                                                //   isOptionEqualToValue={(option, value) =>
                                                //     option?.code ===
                                                //     props.formik.values.users_group
                                                //   }
                                                // value={props.formik.values.users_group || ""}
                                                renderInput={(params) => (
                                                   <TextField
                                                      {...params}
                                                      // error={Boolean(
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // )}
                                                      fullWidth
                                                      name="departments_id"
                                                      // helperText={
                                                      //    props.formik.touched.users_group &&
                                                      //    props.formik.errors.users_group
                                                      // }
                                                      label={t("AGENCY")}
                                                      // onBlur={props.formik.handleBlur}
                                                      // onChange={props.formik.handleChange}
                                                      variant="outlined"
                                                   />
                                                )}
                                             /> */}
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
                              <b>{t("FILTER_BY_DURATION")}</b>
                            </Box>
                          </Grid>

                          <Grid item xs={10}>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={4} md={4}>
                                <DesktopDatePicker
                                  label={t("SINCE")}
                                  inputFormat="dd MMMM yyyy"
                                  value={value}
                                  onChange={handleChangeDatePicker}
                                  disableMaskedInput={true}
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
                              <Grid item xs={12} sm={4} md={4}>
                                <DesktopDatePicker
                                  label={t("UP_TO_DATE")}
                                  inputFormat="dd MMMM yyyy"
                                  value={value}
                                  onChange={handleChangeDatePicker}
                                  disableMaskedInput={true}
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
