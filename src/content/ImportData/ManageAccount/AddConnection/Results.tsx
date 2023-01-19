import { FC, useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  Divider,
  TextField,
  Button,
  Typography,
  styled,
  Autocomplete,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Slide,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useFormik } from "formik";
import * as Yup from "yup";
import { waterApi } from "@/actions/water.action";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { waterDatasetApi } from "@/actions/water.dataset.action";
import { decryptData } from "@/utils/crypto";
import { SubInterval } from "@/types/user.type";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { th } from "date-fns/locale";
import { format } from "date-fns";
import { ValidateNameThai } from "@/components/Validations/NameThai.validation";
import { ValidateNameEnglish } from "@/components/Validations/NameEnglish.validation";

const AccordionSummaryWrapper = styled(AccordionSummary)(
  () => `
       &.Mui-expanded {
         min-height: 48px;
       }
 
       .MuiAccordionSummary-content.Mui-expanded {
         margin: 12px 0;
       }
   `
);

export const datamock = {
  dataset: [
    {
      id: 0,
      name: "ชุดข้อมูลมาตรฐาน",
      code: true,
    },
    {
      id: 1,
      name: "ชุดข้อมูลไม่มาตรฐาน",
      code: false,
    },
  ],
  protocal: [
    {
      id: 0,
      name: "HTTPS",
      code: "protocal01",
    },
    {
      id: 1,
      name: "HTTP",
      code: "protocal02",
    },
  ],
  httpRequest: [
    {
      id: 0,
      name: "GET",
      code: "httpRequest01",
    },
    {
      id: 1,
      name: "POST",
      code: "httpRequest01",
    },
    {
      id: 2,
      name: "PUT",
      code: "httpRequest01",
    },
    {
      id: 3,
      name: "PATCH",
      code: "httpRequest01",
    },
    {
      id: 4,
      name: "DELETE",
      code: "httpRequest01",
    },
  ],
  authentication: [
    {
      id: 0,
      name: "API key",
      code: "auth01",
    },
  ],
};

export enum UserTableType {
  SERVICE_REPORT,
  DOWNLOADED_REPORT,
}

// interface ResultsProps {
//   users: User[];
// }

// interface Filters {
//   role?: string;
//   type: UserTableType;
// }
// getAllImportDataset

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const type = 2;
  const [httpGet, setHttpGet] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [getInterval, setInterval] = React.useState<SubInterval[]>([]);
  // const [valueStart, setValueStart] = useState<Date | null>(new Date());
  // const [valueEnd, setValueEnd] = useState<Date | null>(new Date());
  // const date = format(new Date(), "yyyy-MM-ddTHH:mm:ss");

  // const handleChangeStart = (newValue: Date | null) => {
  //   setValueStart(newValue);
  //   const date = format(newValue, "yyyy-MM-ddTHH:mm:ss");
  //   formik.values.parameter.startDatetime =
  //     date.slice(0, 10) + "T" + date.slice(23);
  // };

  // const handleChangeEnd = (newValue: Date | null) => {
  //   setValueEnd(newValue);
  //   // formik.values.parameter.endDatetime = new Date(newValue)
  //   //   .toISOString()
  //   //   .split(".")[0];
  //   const date = format(newValue, "yyyy-MM-ddTHH:mm:ss");
  //   formik.values.parameter.endDatetime =
  //     date.slice(0, 10) + "T" + date.slice(23);
  // };


  const getInterval_provide_source = useCallback(async () => {
    try {
      const provide_source_uuid = await decryptData(
        atob(router.query.id as string)
      );
      const intervalData = await waterApi.getIntervalImportConfigurations(
        provide_source_uuid
      );
      const Filter_interval = intervalData.filter((v, i) => {
        return intervalData.map((val) => val.code).indexOf(v.code) == i;
      });
      setInterval(Filter_interval ? Filter_interval : []);
    } catch (err) {
      setInterval([]);
    }
  }, []);

  useEffect(() => {
    getInterval_provide_source();
  }, []);

  const state = {
    password: "123456789",
    showPassword: false,
  };

  const name_th = ValidateNameThai();
  const name_en = ValidateNameEnglish();
  // const category = ValidateCategory();
  // const first_name = ValidateFirstName();
  // const last_name = ValidateLastName();
  // const email = ValidateEmail();
  // const phone_number = ValidatePhoneNumber();

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
      protocol: "",
      host: "",
      api_key: "",
      http_request: "",
      route: "",
      parameter_type: "QUERY",
      parameter: {
        latest: "false",
        startDatetime: "${startDate}",
        endDatetime: "${endDate}",
        interval: "",
      },
      sla_time: 0,
      retry_count: 0,
      crontab: "",
      interval_uuid: "",
      interval_code: "",
      flag: {
        standard_data_flag: "",
      },
    },
    validationSchema: Yup.object({
      name: Yup.object({
        ...name_th,
        ...name_en,
      }),
      interval_code: Yup.string().required(t("PLEASE_SELECT") + t("DURATION")),
      flag: Yup.object({
        standard_data_flag: Yup.string().required(
          t("PLEASE_SELECT") + t("THE_FORMAT_OF_THE_INFORMATION_RECEIVED")
        ),
      }),
      protocol: Yup.string().required(t("PLEASE_SELECT") + " " + t("PROTOCOL")),
      host: Yup.string().required(t("PLEASE_ENTER") + " " + t("HOST")),
      http_request: Yup.string().required(
        t("PLEASE_SELECT") + " " + t("HTTP_REQUEST")
      ),
      api_key: Yup.string().required(t("PLEASE_ENTER") + " " + t("API_KEY")),
      crontab: Yup.string().required(t("PLEASE_ENTER") + " " + t("CRON_TAB")),
      sla_time: Yup.string().required(
        t("PLEASE_ENTER") + " " + t("SLA_TIME_MINUTES")
      ),
      retry_count: Yup.string().required(
        t("PLEASE_ENTER") + " " + t("MAXIMUM_CONNECTIONS_TIMES")
      ),
      route: Yup.string().required(t("PLEASE_ENTER") + " " + t("ROUTE")),
    }),
    onSubmit: async (values, _helpers): Promise<void> => {
      console.log("onSubmits ", values);

      try {
        const provide_source_uuid = await decryptData(
          atob(router.query.id as string)
        );
        const result = await waterDatasetApi.createDataset(
          values,
          provide_source_uuid
        );

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
          enqueueSnackbar(`${result.description.message}`, {
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
        enqueueSnackbar(`${error.response.data.description.message}`, {
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

  const cronTab = (code: any) => {
    switch (code) {
      case "C-5":
        formik.setFieldValue("crontab", "*/5 * * * *");
        break;
      case "C-10":
        formik.setFieldValue("crontab", "*/10 * * * *");
        break;
      case "C-15":
        formik.setFieldValue("crontab", "*/15 * * * *");
        break;
      case "C-60":
        formik.setFieldValue("crontab", "*/60 * * * *");
        break;
      case "C-180":
        formik.setFieldValue("crontab", "*/180 * * * *");
        break;
      case "C-1440":
        formik.setFieldValue("crontab", "*/1440 * * *"); // ปริมาณน้ำสะสม 1440 นาที
        break;
      case "P-Daily":
        formik.setFieldValue("crontab", "0 0 * * *");
        break;
      case "P-Mounthly":
        formik.setFieldValue("crontab", "0 0 1 * *");
        break;
      case "P-Yarely":
        formik.setFieldValue("crontab", "59 23 31 12 *"); // ปริมาณน้ำสะสมรายปี
        break;
      case "F-60":
        formik.setFieldValue("crontab", "0 * * * *"); // ปริมาณน้ำฝนคาดการณ์รายชั่วโมง
        break;
      case "F-Daily":
        formik.setFieldValue("crontab", "0 0 * * *");
        break;
      default:
        formik.setFieldValue("crontab", "");
    }
  };

  const information_connect = (type = 2): JSX.Element => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                disablePortal
                options={datamock.dataset}
                getOptionLabel={(option: any) =>
                  option.name ? option.name : "-"
                }
                onChange={(_e, value: any | null) =>
                  formik.setFieldValue("flag.standard_data_flag", value?.code)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(
                      formik.touched.flag?.standard_data_flag &&
                      formik.errors.flag?.standard_data_flag
                    )}
                    fullWidth
                    helperText={
                      formik.touched.flag?.standard_data_flag &&
                      formik.errors.flag?.standard_data_flag
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="flag.standard_data_flag"
                    label={t("THE_FORMAT_OF_THE_INFORMATION_RECEIVED")}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                disablePortal
                options={datamock.protocal}
                getOptionLabel={(option: any) => option.name ?? option}
                onChange={(_e, value: any | null) => {
                  setHttpGet(value?.id == 0 || value?.id == 1);
                  formik.setFieldValue("protocol", value?.name);
                }}
                //  isOptionEqualToValue={() => false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(
                      formik.touched.protocol &&
                      formik.errors.protocol
                    )}
                    fullWidth
                    helperText={
                      formik.touched.protocol &&
                      formik.errors.protocol
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="protocol"
                    label={t("PROTOCOL")}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                error={Boolean(
                  formik.touched.host &&
                  formik.errors.host)
                }
                fullWidth
                helperText={
                  formik.touched.host &&
                  formik.errors.host
                }
                name="host"
                value={formik.values.host}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label={t("HOST")}
                variant="outlined"
              />
            </Grid>
            {httpGet && (
              <Grid item xs={12} sm={6} md={4}>
                <Autocomplete
                  disablePortal
                  options={datamock.httpRequest}
                  getOptionLabel={(option: any) => option.name ?? option}
                  // isOptionEqualToValue={() => false}
                  onChange={(_e, value: any | null) =>
                    formik.setFieldValue("http_request", value?.name)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(
                        formik.touched.http_request &&
                        formik.errors.http_request
                      )}
                      fullWidth
                      helperText={
                        formik.touched.http_request &&
                        formik.errors.http_request
                      }
                      name="http_request"
                      label={t("HTTP_REQUEST")}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Autocomplete
                disablePortal
                options={datamock.authentication}
                getOptionLabel={(option: any) => option.name ?? option}
                //  isOptionEqualToValue={() => false}
                onChange={(_e, value: any | null) =>
                  formik.setFieldValue("authentication", value?.name)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // error={Boolean(
                    //   formik.touched.authentication &&
                    //   formik.errors.authentication
                    // )}
                    fullWidth
                    // helperText={
                    //   formik.touched.authentication &&
                    //   formik.errors.authentication
                    // }
                    name="authentication"
                    label={t("HOW_TO_AUTHENTICATION")}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                error={Boolean(formik.touched.api_key && formik.errors.api_key)}
                fullWidth
                helperText={formik.touched.api_key && formik.errors.api_key}
                name="api_key"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                label={t("API_KEY")}
                value={formik.values.api_key}
                InputLabelProps={{ shrink: state.password.length > 0 }}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                error={Boolean(
                  formik.touched.crontab &&
                  formik.errors.crontab
                )}
                fullWidth
                helperText={
                  formik.touched.crontab &&
                  formik.errors.crontab
                }
                name="crontab"
                label={t("CRON_TAB")}
                value={formik.values.crontab}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="outlined"
                // disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                error={Boolean(
                  formik.touched.sla_time &&
                  formik.errors.sla_time
                )}
                fullWidth
                helperText={
                  formik.touched.sla_time &&
                  formik.errors.sla_time
                }
                name="sla_time"
                label={t("SLA_TIME_MINUTES")}
                value={formik.values.sla_time}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                error={Boolean(
                  formik.touched.retry_count &&
                  formik.errors.retry_count
                )}
                fullWidth
                helperText={
                  formik.touched.retry_count &&
                  formik.errors.retry_count
                }
                name="retry_count"
                label={t("MAXIMUM_CONNECTIONS_TIMES")}
                value={formik.values.retry_count}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>

        {type === 2 && (
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  error={Boolean(
                    formik.touched.route &&
                    formik.errors.route
                  )}
                  fullWidth
                  helperText={
                    formik.touched.route &&
                    formik.errors.route
                  }
                  name="route"
                  label={t("ROUTE")}
                  value={formik.values.route}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
    );
  };

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
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
                <Typography variant="h4" gutterBottom>
                  {t("BASIC_INFORMATION")}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent
              sx={{
                p: 4,
              }}
            >
              <Typography variant="subtitle2">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          error={Boolean(
                            formik.touched.name?.th &&
                            formik.errors.name?.th
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
                          name="name.th"
                          label={t("THAI_NAME")}
                          value={formik.values.name.th}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
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
                          name="name.en"
                          label={t("ENGLISH_NAME")}
                          value={formik.values.name.en}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          variant="outlined"
                        />
                      </Grid>
                      {getInterval && (
                        <Grid item xs={12} sm={6} md={4}>
                          <Autocomplete
                            disablePortal
                            options={getInterval}
                            getOptionLabel={(option: any) =>
                              option?.code ? option?.code : "-"
                            }
                            isOptionEqualToValue={(option: any, value: any) =>
                              option?.code === value?.code
                            }
                            onChange={(_e, value: any | null) => {
                              formik.setFieldValue(
                                "interval_uuid",
                                value?.uuid
                              );
                              formik.setFieldValue(
                                "interval_code",
                                value?.code
                              );
                              formik.setFieldValue(
                                "parameter.interval",
                                value?.code
                              );
                              cronTab(value?.code);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(
                                  formik.touched.interval_code &&
                                  formik.errors.interval_code
                                )}
                                fullWidth
                                helperText={
                                  formik.touched.interval_code ? (
                                    formik.errors.interval_code
                                  ) : formik.values.interval_code === "" ? (
                                    <span
                                      style={{ margin: "0px" }}
                                    >
                                      * {t("PLEASE_SELECT") + t("DURATION")}
                                    </span>
                                  ) : null
                                }
                                FormHelperTextProps={{
                                  className: "Mui-error css-74zzzz-MuiFormHelperText-root"
                                }}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                name="interval_code"
                                label={t("DURATION")}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                      )}
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          name="description.th"
                          label={t("THAI_DETAILS")}
                          variant="outlined"
                          value={formik.values.description.th}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          rows={5}
                          multiline
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4}>
                        <TextField
                          fullWidth
                          name="description.en"
                          label={t("ENGLISH_DETAILS")}
                          value={formik.values.description.en}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          variant="outlined"
                          rows={5}
                          multiline
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ paddingBottom: 4 }}>
            <Box
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {t("CONNECTION_INFORMATION")}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent
              sx={{
                p: 4,
              }}
            >
              <Typography variant="subtitle2">
                {information_connect(type)}
              </Typography>
            </CardContent>

            {type === 2 && (
              <Accordion defaultExpanded>
                <AccordionSummaryWrapper
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: "#f6f8fb",
                    borderRadius: 0,
                  }}
                >
                  <Typography variant="h5">{t("VARIABLE")}</Typography>
                </AccordionSummaryWrapper>

                <AccordionDetails
                  sx={{
                    p: 4,
                    pb: 0,
                  }}
                >
                  <Typography variant="subtitle2">
                    <Grid container spacing={3}>
                      {/* <Grid item xs={12}>
                        <Button type="button" variant="contained">
                          {t("Paramerter")}
                        </Button>
                      </Grid> */}

                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              name="data_set"
                              value={"latest"}
                              label={t("Key")}
                              disabled={true}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              name="value"
                              value={"false"}
                              label={t("value")}
                              disabled={true}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              name="data_set"
                              label={t("Key")}
                              value={"startDatetime"}
                              disabled={true}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              name="value"
                              value={"${startDate}"}
                              label={t("value")}
                              disabled={true}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              name="data_set"
                              label={t("Key")}
                              value={"endDatetime"}
                              disabled={true}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              name="endDate"
                              value={"${endDate}"}
                              label={t("value")}
                              disabled={true}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              name="data_set"
                              label={t("Key")}
                              value={"interval"}
                              disabled={true}
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <TextField
                              fullWidth
                              name="data_set"
                              label={t("Value")}
                              value={formik.values?.parameter?.interval}
                              variant="outlined"
                              disabled={true}
                              InputLabelProps={{
                                shrink: formik.values.parameter?.interval
                                  ?.length
                                  ? true
                                  : false,
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )}
          </Card>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
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
            disabled={Boolean(!formik.isValid || formik.isSubmitting)}
            variant="contained"
          >
            {t("SAVE")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Results;
