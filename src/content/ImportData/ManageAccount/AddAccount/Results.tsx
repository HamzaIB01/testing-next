import { FC, useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  CardContent,
  CircularProgress,
  TextField,
  Autocomplete,
  Button,
  Slide,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import React from "react";
import { format } from "date-fns";
import { ValidateNameThai } from "@/components/Validations/NameThai.validation";
import { ValidateNameEnglish } from "@/components/Validations/NameEnglish.validation";
import { useAuth } from "@/hooks/useAuth";
import { ValidateFirstName } from "@/components/Validations/FirstName.validation";
import { ValidateLastName } from "@/components/Validations/LastName.validation";
import { ValidateEmail } from "@/components/Validations/Email.validation";
import {
  TextMaskPhoneNumber,
  ValidatePhoneNumber,
} from "@/components/Validations/PhoneNumber.validation";
import { useRouter } from "next/router";
import { waterApi } from "@/actions/water.action";
import { useSnackbar } from "notistack";
import { SubInterval } from "@/types/user.type";
import { ValidateCategory } from "@/components/Validations/Category.validation";
import { ValidateDepartment } from "@/components/Validations/Department.validation";

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const [secretClass, setSecretClass] = useState([]);
  const [addDuration, setAddDuration] = useState<string[]>([]);
  const router = useRouter();
  const auth = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [intervals, setIntervals] = useState<SubInterval[]>([]);
  const [defaultIntervals, setDefaultsIntervals] = useState<SubInterval[]>([]);
  const [getFormik, setGetFormik] = useState<any[]>([]);
  const [dataSetNull, setDataSetNull] = useState<boolean>(false);
  const [noPublish, setNoPublish] = useState("");

  const link: any = [
    {
      id: 1,
      label: "Near real-time",
      code: "NEAR_Real_Time",
    },
    {
      id: 2,
      label: "Non real-time",
      code: "Non_Real_Time",
    },
  ];

  const [value, setValue] = React.useState<Date | null>(new Date());

  const handleChangeDatePicker = (newValue: Date | null) => {
    if (!isNaN(newValue?.getTime())) {
      setValue(newValue);
      formik.setFieldValue(
        "start_date",
        format(new Date(newValue), "yyyy-MM-dd")
      );
    } else {
      var date = new Date(); // Now
      date.setDate(date.getDate() + 30);
      formik.setFieldValue("start_date", format(date, "yyyy-MM-dd"));
      setValue(null);
    }
  };

  const department = ValidateDepartment();
  const category = ValidateCategory();
  const name_th = ValidateNameThai();
  const name_en = ValidateNameEnglish();
  const first_name = ValidateFirstName();
  const last_name = ValidateLastName();
  const email = ValidateEmail();
  const phone_number = ValidatePhoneNumber();

  const formik = useFormik({
    initialValues: {
      name: {
        th: "",
        en: "",
      },
      description: {
        th: "",
        en: "",
      },
      coordinator: {
        first_name: "",
        last_name: "",
        phone_number: "",
        email: "",
      },
      link_type: "",
      start_date: format(new Date(), "yyyy-MM-dd"),
      keyword: "",
      law: "",
      category_uuid: "",
      department_uuid: "",
      interval: [
        {
          interval_uuid: "",
          permission_uuid: "",
          channel_uuid: [],
        },
      ],
    },
    validationSchema: Yup.object({
      ...department,
      ...category,

      // interval: Yup.array().of(
      //   Yup.object().shape({
      //     interval_uuid: Yup.string().required("Interval uuid required"),
      //     permission_uuid: Yup.string().required("Permission uuid required"),
      //     channel_uuid: Yup.array().of(
      //       Yup.string().required("Channel uuid required"),
      //     ),
      //   })
      // ),

      name: Yup.object({
        ...name_th,
        ...name_en,
      }),
      coordinator: Yup.object({
        ...first_name,
        ...last_name,
        ...email,
        ...phone_number,
      }),
    }),
    onSubmit: async (values): Promise<void> => {
      if (getFormik.length > 0) {
        formik.values.interval = getFormik;
      } else {
        setGetFormik(formik.values.interval);
      }

      var x = [];
      var x2 = [];

      if (getFormik.length > 0) {
      } else {
        defaultIntervals.filter((val) => {
          values.interval.map((data) => {
            if (data.interval_uuid === val.uuid) {
              x.push(val);
              x2.push(data);
            }
          });
        });

        defaultIntervals.filter((val) => {
          x.map((data, index) => {
            if (data.code === val.code && data.uuid !== val.uuid) {
              {
                formik.values.interval.push({
                  interval_uuid: val.uuid,
                  permission_uuid: x2[index].permission_uuid,
                  channel_uuid: x2[index].channel_uuid,
                });
              }
            }
          });
        });
      }

      try {
        const result = await waterApi.createImportConfig(values);

        if (result.code === 200) {
          enqueueSnackbar(t(`${result.status}`), {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 2000,
            TransitionComponent: Slide,
          });
          router.back();
        } else {
          enqueueSnackbar(t(`${result.status}`), {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 4000,
            TransitionComponent: Slide,
          });
        }
      } catch (error) {
        enqueueSnackbar(t(`${error.response.data.description.message}`), {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 5000,
          TransitionComponent: Slide,
        });
      }
    },
  });

  const getIntervals = useCallback(async (category_uuid, department_uuid) => {
    try {
      const interval_result = await waterApi.getIntervalsByCategory(
        category_uuid,
        department_uuid
      );

      const Filter_interval = interval_result.filter((v, i) => {
        return interval_result.map((val) => val.code).indexOf(v.code) == i;
      });

      setDefaultsIntervals(interval_result);
      setIntervals(Filter_interval);
    } catch (err) {
      setDefaultsIntervals([]);
      setIntervals([]);
    }
  }, []);



  useEffect(() => {
    if (formik.values.category_uuid?.length > 1) {
      setAddDuration([]);
      formik.setFieldValue("interval", []);
      formik.values.interval = [];
      getIntervals(formik.values.category_uuid, "");
    } else {
      setDefaultsIntervals([]);
      setIntervals([]);
    }
  }, [formik.values.category_uuid, formik.values.department_uuid]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4">
                    {t("ACCOUNT_INFORMATION")}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3} pb={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                          disablePortal
                          options={auth.masterData.departments}
                          getOptionLabel={(option: any) =>
                            option.name?.th ? option.name?.th : "-"
                          }
                          isOptionEqualToValue={(option: any, value: any) =>
                            option.code === value.code
                          }
                          onChange={(_e, value: any | null) =>
                            formik.setFieldValue("department_uuid", value?.uuid)
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(
                                formik.touched.department_uuid &&
                                formik.errors.department_uuid
                              )}
                              fullWidth
                              name="department_uuid"
                              helperText={
                                formik.touched.department_uuid ? (
                                  formik.errors.department_uuid
                                ) : formik.values.department_uuid === "" ? (
                                  <span
                                    style={{ margin: "0px" }}
                                  >
                                    * {t("PLEASE_SELECT") + t("DEPARTMENT")}
                                  </span>
                                ) : null
                              }
                              FormHelperTextProps={{
                                className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                              }}
                              label={t("DEPARTMENT")}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <Autocomplete
                          disablePortal
                          options={auth.masterData.categories}
                          getOptionLabel={(option: any) =>
                            option.category_name?.th
                              ? option.category_name?.th
                              : "-"
                          }
                          isOptionEqualToValue={(option: any, value: any) =>
                            option.category_code === value.category_code
                          }
                          onChange={(_e, value: any | null) => {
                            formik.setFieldValue("category_uuid", value?.category_uuid);

                            if (value === null) {
                              setDataSetNull(true);
                              setAddDuration([]);
                            } else {
                              setDataSetNull(false);

                            }

                          }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              error={Boolean(
                                formik.touched.category_uuid &&
                                formik.errors.category_uuid
                              )}
                              fullWidth
                              name="category_uuid"
                              helperText={
                                formik.touched.category_uuid ? (
                                  formik.errors.category_uuid
                                ) : formik.values.category_uuid === "" ? (
                                  <span
                                    style={{ margin: "0px" }}
                                  >
                                    * {t("PLEASE_SELECT") + t("DATA_TYPE")}
                                  </span>
                                ) : null
                              }
                              FormHelperTextProps={{
                                className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                              }}
                              label={t("DATA_TYPE")}
                              onBlur={formik.handleBlur}
                              onChange={formik.handleChange}
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  {formik.values.interval && intervals && (
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Autocomplete
                            multiple
                            limitTags={2}
                            options={intervals}
                            getOptionLabel={(option: any) =>
                              option.interval_code
                                ? option.interval_code
                                : option.code
                                  ? option.code
                                  : "-"
                            }
                            isOptionEqualToValue={(option: any, value: any) =>
                              option.code === value.code
                            }
                            value={
                              !dataSetNull ? addDuration : []
                              // intervals.filter((val) =>
                              // formik.values.interval.find(
                              //   (el) => val.uuid === el?.interval_uuid
                              // ))
                            }
                            onChange={(_e, value: any, _index: any) => {

                              console.log("value===", value);
                              // formik.values.secret_class = value?.code || "",
                              setAddDuration(value);

                              formik.initialValues.interval = [];
                              formik.setFieldValue(`interval`, value ? value : []);

                              secretClass.length = value.length;
                              value.map((data: any, index: any) => {
                                if (
                                  !formik.values.interval.some(
                                    (val) => val?.interval_uuid === data.uuid
                                  )
                                ) {
                                  formik.setFieldValue(
                                    `interval[${index}].interval_uuid`,
                                    data.uuid
                                    // data.interval_uuid
                                  );
                                  formik.setFieldValue(
                                    `interval[${index}].permission_uuid`,
                                    ""
                                  );
                                  formik.setFieldValue(
                                    `interval[${index}].channel_uuid`,
                                    []
                                  );
                                }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(
                                  formik.touched.interval &&
                                  formik.errors.interval
                                )}
                                fullWidth
                                name="interval"
                                helperText={
                                  formik.touched.interval &&
                                  formik.errors.interval

                                  // formik.touched.interval ? (
                                  //   formik.errors.interval
                                  // ) : formik.values.interval === "" ? (
                                  //   <span
                                  //     style={{ margin: "0px" }}
                                  //   >
                                  //     * {t("PLEASE_SELECT") + t("DURATION")}
                                  //   </span>
                                  // ) : null
                                }
                                FormHelperTextProps={{
                                  className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                                }}
                                label={t("DURATION")}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Autocomplete
                            disablePortal
                            id="link_type"
                            options={link}
                            getOptionLabel={(option: any) =>
                              option.label ?? option
                            }
                            isOptionEqualToValue={(option: any, value: any) =>
                              option.name === value.name
                            }
                            onChange={(_e, value: any | null) =>
                              //   formik.values.agency = value[]. || ""
                              formik.setFieldValue("link_type", value?.code)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // error={Boolean(
                                //    props.formik.touched.users_group &&
                                //    props.formik.errors.users_group
                                // )}
                                fullWidth
                                name="data_import_status"
                                // helperText={
                                //    props.formik.touched.users_group &&
                                //    props.formik.errors.users_group
                                // }
                                label={t("DATA_IMPORT_STATUS")}
                                // onBlur={props.formik.handleBlur}
                                // onChange={props.formik.handleChange}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <DesktopDatePicker
                            label={t("SINCE")}
                            inputFormat="dd MMMM yyyy"
                            value={value}
                            disableMaskedInput={true}
                            onChange={handleChangeDatePicker}
                            renderInput={({ inputProps, ...params }) => (
                              <TextField
                                {...params}
                                inputProps={{
                                  ...inputProps,
                                  // readOnly: true,
                                }}
                                error={Boolean(
                                  formik.touched.start_date &&
                                  formik.errors.start_date
                                )}
                                fullWidth
                                name="start_date"
                                helperText={
                                  formik.touched.start_date &&
                                  formik.errors.start_date
                                }
                                variant="outlined"
                              // disabled={true}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.name?.th && formik.errors.name?.th
                          )}
                          fullWidth
                          helperText={
                            formik.touched.name?.th ? (
                              formik.errors.name?.th
                            ) : formik.values.name.th === "" ? (
                              <span
                                style={{ margin: "0px" }}
                              >
                                * {t("PLEASE_ENTER") + t("THAI_NAME")}
                              </span>
                            ) : null
                          }
                          FormHelperTextProps={{
                            className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                          }}
                          label={t("THAI_NAME")}
                          name="name.th"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.name.th}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.name?.en && formik.errors.name?.en
                          )}
                          fullWidth
                          helperText={
                            formik.touched.name?.en ? (
                              formik.errors.name?.en
                            ) : formik.values.name.en === "" ? (
                              <span
                                style={{ margin: "0px" }}
                              >
                                * {t("PLEASE_ENTER") + t("ENGLISH_NAME")}
                              </span>
                            ) : null
                          }
                          FormHelperTextProps={{
                            className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                          }}
                          label={t("ENGLISH_NAME")}
                          name="name.en"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.name?.en}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.description?.th &&
                            formik.errors.description?.th
                          )}
                          fullWidth
                          helperText={
                            formik.touched.description?.th &&
                            formik.errors.description?.th
                          }
                          label={t("THAI_DETAILS")}
                          name="description.th"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.description?.th}
                          variant="outlined"
                          rows={5}
                          multiline
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.description?.en &&
                            formik.errors.description?.en
                          )}
                          fullWidth
                          helperText={
                            formik.touched.description?.en &&
                            formik.errors.description?.en
                          }
                          label={t("ENGLISH_DETAILS")}
                          name="description.en"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.description?.en}
                          variant="outlined"
                          rows={5}
                          multiline
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4">
                    {t("PUBLICATION_INFORMATION")}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <CardContent
                sx={{
                  p: 4,
                }}
              >
                <Grid container spacing={3}>
                  {addDuration.map((data: any, index: any) => (
                    <Grid item xs={12} key={index}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            fullWidth
                            label={t("DURATION")}
                            name="duration_option"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={
                              data?.interval_code
                                ? data?.interval_code
                                : data?.code
                                  ? data?.code
                                  : "-"
                            }
                            variant="outlined"
                            disabled
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <Autocomplete
                            disablePortal
                            options={auth.masterData?.permissions}
                            getOptionLabel={(option: any) =>
                              option.permission_name?.th ?? option
                            }
                            isOptionEqualToValue={(option: any, value: any) =>
                              option.permission_code === value.permission_code
                            }
                            onChange={(_e, value: any | null) => {

                              setNoPublish(value?.permission_code);

                              if (
                                value?.permission_uuid ===
                                "a60209a5-7cc8-441e-9d2e-4b8307ab83c1"
                              ) {
                                formik.values.interval[index].channel_uuid = [];
                              }

                              formik.setFieldValue(
                                `interval[${index}].permission_uuid`,
                                value?.permission_uuid
                              );

                              formik.values.interval[index].permission_uuid = value?.permission_uuid;
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                name="data_type"
                                // helperText={
                                //   formik.touched.interval?.permission_uuid &&
                                //   formik.errors.interval?.permission_uuid
                                // }
                                label={t("ระดับการเผยแพร่")}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>

                        {formik.values.interval[index]?.permission_uuid !==
                          "a60209a5-7cc8-441e-9d2e-4b8307ab83c1" && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Autocomplete
                                multiple
                                disablePortal
                                options={auth.masterData?.channels}
                                getOptionLabel={(option: any) =>
                                  option.channel_name?.th ?? option
                                }
                                isOptionEqualToValue={(option: any, value: any) =>
                                  option.channel_code === value.channel_code
                                }
                                onChange={(_e, value: any | null) => {
                                  // formik.setFieldValue(
                                  //   `interval[${index}].channel_uuid`,
                                  //   value?.channel_uuid
                                  // );
                                  formik.values.interval[index].channel_uuid = [];
                                  value?.map((val) => {
                                    formik.values.interval[
                                      index
                                    ].channel_uuid?.push(val?.channel_uuid);
                                  });
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    fullWidth
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    variant="outlined"
                                    label={t("ช่องทางการให้บริการข้อมูล")}
                                  />
                                )}
                              />
                            </Grid>
                          )}
                        {/* )} */}
                        {/* ))} */}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4">
                    {t("RESPONSIBLE_PERSON_INFORMATION")}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <CardContent
                sx={{
                  p: 4,
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.coordinator?.first_name &&
                            formik.errors.coordinator?.first_name
                          )}
                          fullWidth
                          helperText={
                            formik.touched.coordinator?.first_name ? (
                              formik.errors.coordinator?.first_name
                            ) : formik.values.coordinator?.first_name === "" ? (
                              <span
                                style={{ margin: "0px" }}
                              >
                                * {t("PLEASE_ENTER") + t("FIRST_NAME")}
                              </span>
                            ) : null
                          }
                          FormHelperTextProps={{
                            className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                          }}
                          label={t("FIRST_NAME")}
                          name="coordinator.first_name"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.coordinator?.first_name}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.coordinator?.last_name &&
                            formik.errors.coordinator?.last_name
                          )}
                          fullWidth
                          helperText={
                            formik.touched.coordinator?.last_name ? (
                              formik.errors.coordinator?.last_name
                            ) : formik.values.coordinator?.last_name === "" ? (
                              <span
                                style={{ margin: "0px" }}
                              >
                                * {t("PLEASE_ENTER") + t("LAST_NAME")}
                              </span>
                            ) : null
                          }
                          FormHelperTextProps={{
                            className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                          }}
                          label={t("LAST_NAME")}
                          name="coordinator.last_name"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.coordinator?.last_name}
                          variant="outlined"
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.coordinator?.email &&
                            formik.errors.coordinator?.email
                          )}
                          fullWidth
                          helperText={
                            formik.touched.coordinator?.email ? (
                              formik.errors.coordinator?.email
                            ) : formik.values.coordinator?.email === "" ? (
                              <span
                                style={{ margin: "0px" }}
                              >
                                * {t("PLEASE_ENTER") + t("EMAIL")}
                              </span>
                            ) : null
                          }
                          FormHelperTextProps={{
                            className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                          }}
                          label={t("EMAIL")}
                          name="coordinator.email"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.coordinator?.email}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.coordinator?.phone_number &&
                            formik.errors.coordinator?.phone_number
                          )}
                          fullWidth
                          helperText={
                            formik.touched.coordinator?.phone_number ? (
                              formik.errors.coordinator?.phone_number
                            ) : formik.values.coordinator?.phone_number === "" ? (
                              <span
                                style={{ margin: "0px" }}
                              >
                                * {t("PLEASE_ENTER") + t("PHONE_NUMBER")}
                              </span>
                            ) : null
                          }
                          FormHelperTextProps={{
                            className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                          }}
                          label={t("PHONE_NUMBER")}
                          name="coordinator.phone_number"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          value={formik.values.coordinator?.phone_number}
                          variant="outlined"
                          InputLabelProps={{
                            shrink:
                              formik.values.coordinator?.phone_number &&
                              formik.values.coordinator?.phone_number.length >
                              0,
                          }}
                          InputProps={{
                            inputComponent: TextMaskPhoneNumber as any,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                color="error"
                variant="contained"
                onClick={() => router.back()}
              >
                {t("CANCEL")}
              </Button>
              <Button
                type="submit"
                startIcon={
                  formik.isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={Boolean(!formik.isValid || formik.isSubmitting)}
                variant="contained"
              >
                {t("SAVE")}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default Results;
