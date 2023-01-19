import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  CircularProgress,
  styled,
  DialogTitle,
  Divider,
  Typography,
  Grid,
  Autocomplete,
  TextField,
  IconButton,
  InputAdornment,
  Slide,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useFormik } from "formik";
import * as Yup from "yup";
import { decryptData } from "@/utils/crypto";
import { waterDatasetApi } from "@/actions/water.dataset.action";
import { useRouter } from "next/router";
import { waterApi } from "@/actions/water.action";
import { useAuth } from "@/hooks/useAuth";
import { SubInterval } from "@/types/user.type";
import React from "react";
import { datamock } from "@/content/ImportData/ManageAccount/AddConnection/Results";
import { userApi } from "@/actions/user.action";
import { encryptWithPublicKey } from "@/utils/nodeForge";
import { useSnackbar } from "notistack";
import { ValidateFirstName } from "../Validations/FirstName.validation";
import { ValidateLastName } from "../Validations/LastName.validation";
import {
  TextMaskPhoneNumber,
  ValidatePhoneNumber,
} from "../Validations/PhoneNumber.validation";
import { ValidateEmail } from "../Validations/Email.validation";
import { ValidateDepartment } from "../Validations/Department.validation";
import { ValidateNameThai } from "../Validations/NameThai.validation";
import { ValidateNameEnglish } from "../Validations/NameEnglish.validation";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

export enum DialogType {
  ADD,
  EDIT,
  VIEW,
}

const DialogStyldMUI = styled(Dialog)(
  () => `
  .css-pu1qzu-MuiPaper-root-MuiDialog-paper {
      overflow: visible;
    }
  `
);

const DialogActions = styled(Box)(
  ({ theme }) => `
       background: ${theme.colors.alpha.black[5]}
    `
);

function DialogMUI(props: any) {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const first_name = ValidateFirstName();
  const last_name = ValidateLastName();
  const phone_number = ValidatePhoneNumber();
  const email = ValidateEmail();
  const department = ValidateDepartment();
  const name_th = ValidateNameThai();
  const name_en = ValidateNameEnglish();

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

  const state = {
    password: "123456789",
    showPassword: false,
  };

  var channel = [];
  var channelDelete = [];
  const [getInterval, setInterval] = React.useState<SubInterval[]>([]);

  const getInterval_provide_source = useCallback(async () => {
    try {
      const provide_source_uuid = await decryptData(
        atob(String(router.query.uuid))
      );

      const intervalData = await waterApi.getIntervalImportConfigurations(
        provide_source_uuid
      );
      const Filter_interval = intervalData.filter((v, i) => {
        return intervalData.map((val) => val.code).indexOf(v.code) == i;
      });
      // setInterval(intervalData ? intervalData : []);
      setInterval(Filter_interval ? Filter_interval : []);
    } catch (err) {
      setInterval([]);
    }
  }, []);

  useEffect(() => {
    // console.log("fuck ", await decryptData(atob(String(router.query.uuid))));
    getInterval_provide_source();
  }, []);

  let validationSchema = {};
  if (props.update === "update_import_config") {
    if (props.code === "DATA_IMPORT_DATA") {
      validationSchema = {
        name: Yup.object({
          ...name_th,
          ...name_en,
        }),
      };
    } else if (props.code === "") {
      validationSchema = {};
    } else if (props.code === "RESPONSIBLE_PERSON_INFORMATION") {
      validationSchema = {
        coordinator: Yup.object({
          ...first_name,
          ...last_name,
          ...email,
          ...phone_number,
        }),
      };
    }
  } else if (props.update === "update_user") {
    if (props.code === "EDIT_USER_PERSONAL_INFORMATION") {
      validationSchema = {
        ...first_name,
        ...last_name,
      };
    } else if (props.code === "EDIT_USER_ORGANIZATION_INFORMATION") {
      validationSchema = {
        ...department,
      };
    } else if (props.code === "EDIT_USER_CONTACT_INFORMATION") {
      validationSchema = {
        ...email,
        ...phone_number,
      };
    }
  } else if (props.update === "update_connection") {
    if (props.code === "EDIT_DATA_IMPORT_DATA") {
      validationSchema = {
        name: Yup.object({
          ...name_th,
          ...name_en,
        }),
      };
    } else if (props.code === "EDIT_RESPONSIBLE_PERSON_INFORMATION") {
      validationSchema = {
        interval_code: Yup.string().required(
          t("PLEASE_SELECT") + t("DURATION")
        ),
        flag: Yup.object({
          standard_data_flag: Yup.string().required(
            t("PLEASE_SELECT") + t("THE_FORMAT_OF_THE_INFORMATION_RECEIVED")
          ),
        }),
        protocol: Yup.string().required(
          t("PLEASE_SELECT") + " " + t("PROTOCOL")
        ),
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
      };
    }
  } else {
    validationSchema = {};
  }

  const initialDataset = {
    name: {
      th: props.data.name?.th ?? "-",
      en: props.data.name?.en ?? "-",
    },
    description: {
      th: props.data.description?.th ?? "-",
      en: props.data.description?.en ?? "-",
    },
    protocol: props.data?.protocol,
    host: props.data?.host,
    api_key: props.data?.api_key,
    http_request: props.data?.http_request,
    route: props.data?.route,
    parameter_type: props.data?.parameter_type,
    parameter: {
      latest: props.data.parameter?.latest,
      startDatetime: props.data.parameter?.startDatetime,
      endDatetime: props.data.parameter?.endDatetime,
      interval: props.data.parameter?.interval,
    },
    sla_time: props.data?.sla_time,
    retry_count: props.data?.retry_count,
    crontab: props.data?.crontab,
    interval_uuid: props.data?.interval?.uuid,
    flag: {
      standard_data_flag: props.data.flag?.standard_data_flag,
    },
  };

  const initialProvide_source = {
    name: {
      th: props.data.name?.th ?? "-",
      en: props.data.name?.en ?? "-",
    },
    description: {
      th: props.data.description?.th ?? "-",
      en: props.data.description?.en ?? "-",
    },
    coordinator: {
      first_name: props.data?.coordinator?.first_name ?? "-",
      last_name: props.data?.coordinator?.last_name ?? "-",
      phone_number: props.data?.coordinator?.phone_number ?? "-",
      email: props.data?.coordinator?.email ?? "-",
    },
    link_type: "Near real-time",
    start_date: "2022-09-06T02:57:46.175Z",
    keyword: "string",
    law: "string",
    interval: {
      inserted: [],
      deleted: [],
      updated: [],
    },
    category_uuid: "5620a034-ec91-4b8f-9543-841c32fdcdd7",
    department_uuid: "91ff1321-2c7c-428b-a2be-53437fa5a4a9",
  };

  const formik = useFormik({
    initialValues: initialProvide_source,
    validationSchema: Yup.object({
      ...validationSchema,
    }),
    onSubmit: async (values) => {
      props.data?.interval.map((val) => {
        updateChannel.map((element) => {
          if (element.interval_uuid === val.interval.uuid) {
            if (val.channel) {
              const xDeleted = val.channel.filter(
                (deleteChanel) =>
                  !element.channel.find((val1) => deleteChanel.uuid === val1)
              );
              const xInserted = element.channel.filter(
                (valInsert) =>
                  !val.channel.some((val1) => val1.uuid === valInsert)
              );
              var deleted = [];
              var inserted = [];
              xDeleted &&
                xDeleted.map((val) => {
                  deleted.push(val.uuid);
                });
              xInserted &&
                xInserted.map((val) => {
                  inserted.push(val);
                });
              values.interval.updated.push({
                interval_uuid: element?.interval_uuid,
                permission_uuid: element?.permission_uuid,
                channel_uuid: {
                  inserted: inserted,
                  deleted: deleted,
                },
              });
            } else {
              var inserted = [];
              var deleted = [];
              element.channel.map((val) => {
                inserted.push(val);
              });

              inserted.length > 0 &&
                values.interval.updated.push({
                  interval_uuid: element?.interval_uuid,
                  permission_uuid: element?.permission_uuid,
                  channel_uuid: {
                    inserted: inserted,
                    deleted: deleted,
                  },
                });
            }
          }
        });
      });

      const res = values.interval.updated.filter((val) =>
        updatePermission.find(
          (val1) => val.interval_uuid === val1.interval_uuid
        )
      );

      const res2 = updatePermission.filter(
        (val) =>
          !values.interval.updated.find(
            (val1) => val.interval_uuid === val1.interval_uuid
          )
      );

      // res &&
      //พบ interval_uuid ที่ตรงกับการแก้ไข ระหว่าง ระดับการเผยแพร่กับ ช่องทางการเผยแพร่ จะทำการ Edit แค่ Permission_uuid
      values.interval.updated.map((val) => {
        updatePermission.map((valUpdate) => {
          if (valUpdate.interval_uuid == val?.interval_uuid) {
            val.permission_uuid = valUpdate?.permission_uuid;
          }
        });
      });

      //ไม่พบ interval_uuid ที่ตรงกับการแก้ไข ระหว่าง ระดับการเผยแพร่กับ ช่องทางการเผยแพร่ จะ push array ลงไปใหม่
      res2 &&
        res2.map((val) => {
          values.interval.updated.push({
            interval_uuid: val?.interval_uuid,
            permission_uuid: val?.permission_uuid,
            channel_uuid: {
              inserted: [],
              deleted: [],
            },
          });
        });

      //ลบ ช่องทางการติดต่อ ในกรณีห้ามเผยแพร่ Permission
      values.interval.updated.map((val) => {
        updatePermission.map((valUpdate) => {
          if (
            valUpdate.interval_uuid == val?.interval_uuid &&
            valUpdate?.permission_uuid ===
              "a60209a5-7cc8-441e-9d2e-4b8307ab83c1"
          ) {
            props.data?.interval.map((valProp) => {
              if (valProp.interval.uuid === valUpdate?.interval_uuid) {
                var getChannel = [];
                valProp.channel.map((valChannel) => {
                  getChannel.push(valChannel.uuid);
                });
                // alert("deflete");
                val.channel_uuid = { deleted: getChannel };
              }
            });
          }
        });
      });

      //ลบ ช่องทางการติดต่อ ในกรณีห้ามเผยแพร่ Channel
      updateChannel.length > 0 &&
        values.interval.updated.map((val) => {
          if (val.permission_uuid === "a60209a5-7cc8-441e-9d2e-4b8307ab83c1") {
            val.channel_uuid = { deleted: [], inserted: [] };
          }
        });

      // values.interval.updated.map((val) => {
      //   updateChannel.map((valUpdate) => {
      //     if (
      //       valUpdate.interval_uuid == val?.interval_uuid &&
      //       valUpdate?.permission_uuid ===
      //         "a60209a5-7cc8-441e-9d2e-4b8307ab83c1"
      //     ) {
      //       props.data?.interval.map((valProp) => {
      //         if (valProp.interval.uuid === valUpdate?.interval_uuid) {
      //           var getChannel = [];
      //           valProp.channel.map((valChannel) => {
      //             getChannel.push(valChannel.uuid);
      //           });
      //           // alert("deflete");
      //           val.channel_uuid = { ins: getChannel };
      //         }
      //       });
      //     }
      //   });
      // });

      if (values.interval.updated.length > 0 || values) {
        try {
          const provide_source_uuid = await decryptData(
            atob(router.query.id as string)
          );

          const update_import_config =
            await waterApi.updateImportConfigurations(
              provide_source_uuid,
              values,
              props.operator && props.operator
            );

          if (update_import_config?.code === 200) {
            enqueueSnackbar(t(`${update_import_config.status}`), {
              variant: "success",
              anchorOrigin: {
                vertical: "top",
                horizontal: "right",
              },
              autoHideDuration: 2000,
              TransitionComponent: Slide,
            });
            handleCloseDialog();
            values.interval.inserted = [];
            values.interval.deleted = [];
            values.interval.updated = [];
            setUpdateChannel([]);
            setUpdatePermission([]);
            props.onChange("updateProvideSource");
          } else {
            enqueueSnackbar(`${update_import_config.description.message}`, {
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
          props.onChange("updateProvideSource");
          handleCloseDialog();
          setUpdateChannel([]);
          setUpdatePermission([]);
          values.interval.inserted = [];
          values.interval.deleted = [];
          values.interval.updated = [];
        }
      } else {
        setUpdateChannel([]);
        setUpdatePermission([]);
        values.interval.inserted = [];
        values.interval.deleted = [];
        values.interval.updated = [];
      }
    },
  });

  const formikDataset = useFormik({
    initialValues: initialDataset,
    validationSchema: Yup.object({
      // ...validationSchema,
    }),
    onSubmit: async (values) => {
      try {
        const provide_source_uuid = await decryptData(
          atob(router.query.id as string)
        );
        const update_import_config =
          await waterDatasetApi.updateDatasetImportConfig(
            provide_source_uuid,
            values
          );

        if (update_import_config?.code === 200) {
          enqueueSnackbar(t(`${update_import_config.status}`), {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 2000,
            TransitionComponent: Slide,
          });
          handleCloseDialog();
          props.onChangeConnect("updateConnections");
        } else {
          enqueueSnackbar(`${update_import_config.description.message}`, {
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

  const formikUpdateUser = useFormik({
    initialValues: {
      first_name: props.data?.first_name ?? "-",
      last_name: props.data?.last_name ?? "-",
      phone_number: props.data?.phone_number ?? "-",
      email: props.data?.email ?? "-",
      department_uuid: props.data?.department_uuid?.uuid ?? "",
    },
    validationSchema: Yup.object({
      ...validationSchema,
    }),
    onSubmit: async (values) => {
      const path = `?operator=${props.params}`;
      const uuid = props.data.uuid;

      let body = {};

      if (props.params === "profile") {
        body = {
          first_name: await encryptWithPublicKey(values.first_name),
          last_name: await encryptWithPublicKey(values.last_name),
        };
      } else if (props.params === "department") {
        body = {
          department_uuid: values.department_uuid,
        };
      } else if (props.params === "contract") {
        body = {
          email: await encryptWithPublicKey(values.email),
          phone_number: await encryptWithPublicKey(
            values.phone_number.split("-").join("")
          ),
        };
      }

      try {
        const result = await userApi.update_user(body, path, uuid);

        if (result?.code === 200) {
          enqueueSnackbar(t(`${result.status}`), {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 2000,
            TransitionComponent: Slide,
          });
          handleCloseDialog();
          props.onChangeUpdateUser("UpdateUser");
        } else {
          enqueueSnackbar(`${result.description.message}`, {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 2000,
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
          autoHideDuration: 2000,
          TransitionComponent: Slide,
        });
      }
    },
  });

  // Boolean(
  //   props.update === "update_import_config"
  //     ? !formik.isValid
  //     : props.update === "update_user"
  //       ? !formikUpdateUser.isValid
  //       : !formikDataset.isValid &&
  //         props.update === "update_import_config"
  //         ? formik.isSubmitting
  //         : props.update === "update_user"
  //           ? formikUpdateUser.isSubmitting
  //           : formikDataset.isSubmitting
  // )}

  console.log("props.update", props.update);

  const headerSubmit = (type: string) => {
    switch (type) {
      case "update_import_config":
        Boolean(!formik.isValid || formik.isSubmitting);
        break;
      case "update_user":
        Boolean(!formikUpdateUser.isValid || formikUpdateUser.isSubmitting);
        break;
      case "update_connection":
        Boolean(!formikDataset.isValid);
        break;

      default:
        break;
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    formik.setFieldValue(
      "coordinator.phone_number",
      props.data?.coordinator?.phone_number
    );
    setUpdateChannel([]);
    setUpdatePermission([]);
    setOpen(false);
  };

  useEffect(() => {
    formikDataset.setFieldValue("name.th", props.data?.name?.th);
    formikDataset.setFieldValue("name.en", props.data?.name?.en);
    formikDataset.setFieldValue("description.th", props.data?.description?.th);
    formikDataset.setFieldValue("description.en", props.data?.description?.en);
    formikDataset.setFieldValue("protocol", props.data?.protocol);
    formikDataset.setFieldValue("host", props.data?.host);
    formikDataset.setFieldValue("api_key", props.data?.api_key);
    formikDataset.setFieldValue("http_request", props.data?.http_request);
    formikDataset.setFieldValue("route", props.data?.route);
    formikDataset.setFieldValue("parameter_type", props.data?.parameter_type);
    formikDataset.setFieldValue(
      "parameter.latest",
      props.data?.parameter?.latest
    );
    formikDataset.setFieldValue(
      "parameter.startDatetime",
      props.data?.parameter?.startDatetime
    );
    formikDataset.setFieldValue(
      "parameter.endDatetime",
      props.data?.parameter?.endDatetime
    );
    formikDataset.setFieldValue(
      "parameter.interval",
      props.data?.parameter?.interval
    );
    formikDataset.setFieldValue("sla_time", props.data?.sla_time);
    formikDataset.setFieldValue("retry_count", props.data?.retry_count);
    formikDataset.setFieldValue("crontab", props.data?.crontab);
    formikDataset.setFieldValue("interval_uuid", props.data?.interval?.uuid);
    formikDataset.setFieldValue(
      "flag.standard_data_flag",
      props.data?.flag?.standard_data_flag
    );

    formik.setFieldValue("description.th", props.data?.description?.th);
    formik.setFieldValue("description.en", props.data?.description?.en);
    formik.setFieldValue(
      "coordinator.first_name",
      props.data?.coordinator?.first_name
    );
    formik.setFieldValue(
      "coordinator.last_name",
      props.data?.coordinator?.last_name
    );
    formik.setFieldValue(
      "coordinator.phone_number",
      props.data?.coordinator?.phone_number
    );
    formik.setFieldValue("coordinator.email", props.data?.coordinator?.email);

    formikUpdateUser.setFieldValue(
      "first_name",
      decryptData(props.data?.first_name)
    );
    formikUpdateUser.setFieldValue(
      "last_name",
      decryptData(props.data?.last_name)
    );
    formikUpdateUser.setFieldValue(
      "phone_number",
      decryptData(props.data?.phone_number)
    );
    formikUpdateUser.setFieldValue("email", decryptData(props.data?.email));
    formikUpdateUser.setFieldValue(
      "department_uuid",
      props.data?.department_uuid?.uuid
    );
  }, [props]);

  const [intervals, setIntervals] = useState<SubInterval[]>([]);
  const [defaultIntervals, setDefaultsIntervals] = useState<SubInterval[]>([]);

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
    getIntervals(props.data.category?.uuid, "");
  }, [props.data?.category]);

  const [updateChannel, setUpdateChannel] = React.useState<any[]>([]);
  const [updatePermission, setUpdatePermission] = React.useState<any[]>([]);

  return (
    <>
      {props.formik && (
        <>
          {props.type === DialogType.EDIT && (
            <Button
              variant="text"
              startIcon={<EditIcon />}
              onClick={handleOpenDialog}
            >
              {t("EDIT")}
            </Button>
          )}

          <DialogStyldMUI
            fullWidth
            maxWidth={props.maxWidth}
            open={open}
            onClose={handleCloseDialog}
          >
            <DialogTitle sx={{ p: 3 }}>
              <Typography variant="h4">{props.title}</Typography>
            </DialogTitle>
            <Divider />
            <form
              onSubmit={
                props.update === "update_import_config"
                  ? formik.handleSubmit
                  : props.update === "update_user"
                  ? formikUpdateUser.handleSubmit
                  : formikDataset.handleSubmit
              }
            >
              <DialogContent sx={{ p: 3 }}>
                {props.code === "DATA_IMPORT_DATA" && (
                  <Grid container spacing={3} pb={2}>
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            disablePortal
                            options={auth.masterData?.departments}
                            getOptionLabel={(option: any) =>
                              option.name?.th ? option.name?.th : "-"
                            }
                            isOptionEqualToValue={(option: any, value: any) =>
                              option?.code === value?.code
                            }
                            onChange={(_e, value: any | null) =>
                              (formik.values.department_uuid = value?.uuid)
                            }
                            defaultValue={
                              props.data?.department && props.data?.department
                            }
                            disabled={true}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // error={Boolean(
                                //    props.formik.touched.users_group &&
                                //    props.formik.errors.users_group
                                // )}
                                fullWidth
                                name="department"
                                // helperText={props.formik.touched.agency && props.formik.errors.agency}
                                label={t("DEPARTMENT")}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            disabled={true}
                            disablePortal
                            options={auth.masterData?.categories}
                            getOptionLabel={(option: any) =>
                              option.category_name?.th
                                ? option.category_name?.th
                                : "-"
                            }
                            isOptionEqualToValue={(option: any, value: any) =>
                              option?.code === value?.code
                            }
                            onChange={(_e, value: any | null) =>
                              // if (value !== null) {
                              {
                                if (value) {
                                  getIntervals(formik.values.category_uuid, "");
                                } else {
                                  setIntervals([]);
                                }

                                formik.values.category_uuid =
                                  value?.category_uuid;
                              }
                            }
                            defaultValue={
                              props.data?.category &&
                              auth.masterData?.categories.find(
                                (val) =>
                                  val.category_code ===
                                  props.data?.category?.code
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // error={Boolean(
                                //    props.formik.touched.users_group &&
                                //    props.formik.errors.users_group
                                // )}
                                fullWidth
                                name="data_type"
                                // helperText={props.formik.touched.data_type && props.formik.errors.data_type}
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

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          {/* <Autocomplete
                            multiple
                            limitTags={2}
                            id="multiple-limit-tags"
                            options={top100Films}
                            getOptionLabel={(option) => option.title}
                            defaultValue={
                              // [top100Films[13], top100Films[12], top100Films[11]]

                              top100Films.map((item) => {
                                retu select.id
                              })
                            }
                            renderInput={(params) => (
                              <TextField {...params} label="limitTags" placeholder="Favorites" />
                            )}
                            sx={{ width: "500px" }}
                          /> */}
                          {/* {console.log("ee ", intervals)}
                          {console.log("ee props ", props.data?.interval)} */}
                          <Autocomplete
                            multiple
                            limitTags={2}
                            options={intervals}
                            isOptionEqualToValue={(option: any, value: any) =>
                              option?.uuid === value?.interval?.uuid
                            }
                            getOptionLabel={(option: any) =>
                              // console.log("getOptionLabel", option?.interval)

                              option?.interval?.code
                                ? option?.interval?.code
                                : option?.code
                                ? option?.code
                                : "-"
                            }
                            defaultValue={
                              props.data?.interval?.length &&
                              props.data?.interval
                              // props.data?.interval.filter((v, i) => {
                              //   props.data?.interval
                              //     .map((val) => val.code)
                              //     .indexOf(v.code) == i;
                              // })
                              // props.data?.interval.map((value) => {
                              //   // console.log("value ----", value?.interval?.id);

                              //   intervals.find((val) => {
                              //     // console.log("val", val.id)
                              //     val.id === value?.interval?.id
                              //     // console.log("valssss", val.id === value?.interval?.id)
                              //   })
                              // })
                            }
                            // defaultValue={[top100Films[13], top100Films[12], top100Films[11]]}

                            onChange={(_e, value: any | null) => {
                              // console.log("cal ", value);
                              formik.values.interval.inserted = [];
                              var check = formik.values.interval.deleted;
                              formik.values.interval.deleted = [];
                              var deleted = false;

                              props.data?.interval &&
                                props.data?.interval.some((val) => {
                                  if (
                                    !value.some(
                                      (data) =>
                                        data.interval?.uuid ===
                                          val.interval?.uuid ||
                                        data.uuid === val.interval?.uuid
                                    )
                                  ) {
                                    formik.values.interval.deleted.push({
                                      interval_uuid: val.interval.uuid,
                                    });
                                    deleted = true;
                                  }
                                });

                              // console.log("check", check);

                              !deleted &&
                                value.map((val) => {
                                  if (
                                    !props.data?.interval.some(
                                      (data) =>
                                        data.interval?.uuid === val.uuid ||
                                        data.interval?.uuid ===
                                          val.interval?.uuid
                                    )
                                  ) {
                                    val.uuid &&
                                      formik.values.interval.inserted.push({
                                        interval_uuid: val.uuid,
                                      });
                                  }
                                });

                              // props.data?.interval &&
                              //   props.data?.interval.some((val) => {
                              //     if (
                              //       !value.some(
                              //         (data) =>
                              //           data.interval?.uuid ===
                              //             val.interval?.uuid ||
                              //           data.interval_uuid ===
                              //             val.interval?.uuid
                              //       )
                              //     ) {
                              //       formik.values.interval.deleted.push({
                              //         interval_uuid: val.interval.uuid,
                              //       });
                              //     }
                              //   });

                              // value.find((val) => {
                              //   if (
                              //     !check.some(
                              //       (data) =>
                              //         data.interval_uuid === val.interval_uuid
                              //     )
                              //   ) {
                              //     if (val.interval_uuid) {
                              //       formik.values.interval.inserted.push(
                              //         val.uuid
                              //       );
                              //     }
                              //   }
                              // });
                            }}
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
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            disablePortal
                            id="data_import_status"
                            options={link}
                            getOptionLabel={(option: any) =>
                              option.label ? option.label : "-"
                            }
                            // isOptionEqualToValue={(option, value) => option === value}
                            isOptionEqualToValue={() => false}
                            // onChange={(e, value: any) =>
                            // (props.formik.values.users_group =
                            //    value?.code || "")
                            // }
                            // defaultValue={props.data}
                            onChange={(_e, value: any | null) =>
                              (formik.values.link_type = value?.code)
                            }
                            defaultValue={
                              props.data?.link_type &&
                              link.find(
                                (val) => val.code === props.data?.link_type
                              )
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
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            error={Boolean(
                              formik.touched.name?.th && formik.errors.name?.th
                            )}
                            fullWidth
                            helperText={
                              formik.touched.name?.th && formik.errors.name?.th
                            }
                            label={t("THAI_NAME")}
                            name="name.th"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            defaultValue={props.data?.name?.th ?? "-"}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            error={Boolean(
                              formik.touched.name?.en && formik.errors.name?.en
                            )}
                            fullWidth
                            helperText={
                              formik.touched.name?.en && formik.errors.name?.en
                            }
                            label={t("ENGLISH_NAME")}
                            name="name.en"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            defaultValue={props.data?.name?.en ?? "-"}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={t("THAI_DETAILS")}
                            name="description.th"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            defaultValue={props.data?.description?.th ?? "-"}
                            variant="outlined"
                            rows={5}
                            multiline
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label={t("ENGLISH_DETAILS")}
                            name="description.en"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            defaultValue={props.data?.description?.en ?? "-"}
                            variant="outlined"
                            rows={5}
                            multiline
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {props.code === "PUBLICATION_INFORMATION" && (
                  <Grid
                    container
                    spacing={3}
                    sx={
                      props.data?.interval?.length > 5
                        ? { overflowY: "scroll", height: 480 }
                        : null
                    }
                  >
                    {props.data?.interval &&
                      props.data?.interval?.map((data, index) => (
                        <Grid item xs={12}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                              <TextField
                                fullWidth
                                label={t("DURATION")}
                                name="duration_option"
                                disabled={true}
                                defaultValue={data?.interval?.code ?? "-"}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Autocomplete
                                disablePortal
                                disableClearable
                                id="secret_class"
                                options={auth?.masterData?.permissions}
                                getOptionLabel={(option: any) =>
                                  option.permission_name?.th
                                    ? option.permission_name?.th
                                    : option.permission?.name?.th
                                    ? option.permission?.name?.th
                                    : option.name?.th
                                    ? option.name?.th
                                    : "-"
                                }
                                isOptionEqualToValue={(option, value) =>
                                  option?.permission_uuid === value?.uuid
                                }
                                defaultValue={data.permission}
                                onChange={(_e: any, value: any | null) => {
                                  var indexUpdate = -1;

                                  var permission = [];

                                  // console.log("value permission ", value);
                                  // console.log("data permission ", data);

                                  let ids = [...updatePermission];
                                  let indexArray = ids.findIndex(
                                    (val) =>
                                      val.interval_uuid === data.interval?.uuid
                                  );

                                  // let indexArrayDuplicateOriginal =
                                  //   ids.findIndex(
                                  //     (val) =>
                                  //       val.interval_uuid ===
                                  //       data.interval?.uuid
                                  //   );

                                  if (
                                    value.permission_uuid ===
                                    data.permission?.uuid
                                  ) {
                                    // alert("Duplicate");

                                    let indexDuplicate = ids.findIndex(
                                      (val) =>
                                        val.interval_uuid ===
                                        data.interval?.uuid
                                    );

                                    setUpdatePermission([
                                      ...updatePermission.slice(
                                        0,
                                        indexDuplicate
                                      ),
                                      ...updatePermission.slice(
                                        indexDuplicate + 1
                                      ),
                                    ]);
                                  } else {
                                    if (indexArray >= 0) {
                                      ids[indexArray] = {
                                        interval_uuid: data.interval?.uuid,
                                        permission_uuid: value?.permission_uuid,
                                      };
                                      setUpdatePermission(ids);
                                    } else {
                                      setUpdatePermission((prev) => [
                                        ...prev,
                                        {
                                          interval_uuid: data.interval?.uuid,
                                          permission_uuid:
                                            value?.permission_uuid,
                                        },
                                      ]);
                                    }
                                  }

                                  // if (indexArray >= 0) {
                                  //   updatePermission[index] = {
                                  //     interval_uuid: data.interval?.uuid,
                                  //     permission_uuid: value?.permission_uuid,
                                  //   };
                                  // }

                                  // else {

                                  // }

                                  // const res1 = data.filter(
                                  //   (deleteChanel) =>
                                  //     !element.channel.find((val1) => deleteChanel.uuid === val1)
                                  // );

                                  // let ids = [...updatePermission];
                                  // let indexArray = ids.findIndex(
                                  //   (val) =>
                                  //     val.interval_uuid ===
                                  //     data.interval?.uuid
                                  // );

                                  // if (indexArray >= 0) {
                                  //   updatePermission[indexArray] = [];
                                  // }

                                  // setUpdateChannel((prev) => [
                                  //   ...prev,
                                  //   {
                                  //     interval_uuid: data.interval?.uuid,
                                  //     permission_uuid:
                                  //       data.permission?.uuid,
                                  //     channel: channel,
                                  //   },
                                  // ]);

                                  // setUpdatePermission

                                  // formik.values.interval.updated.filter(
                                  //   (val, index) => {
                                  //     if (
                                  //       val.interval_uuid === data.interval.uuid
                                  //     ) {
                                  //       indexUpdate = index;
                                  //     }
                                  //   }
                                  // );

                                  // if (
                                  //   formik.values.interval.updated.some(
                                  //     (val) =>
                                  //       val.interval_uuid === data.interval.uuid
                                  //   )
                                  // ) {
                                  //   formik.values.interval.updated[
                                  //     indexUpdate
                                  //   ].permission_uuid = value?.permission_uuid;
                                  // } else {
                                  //   formik.values.interval.updated.push({
                                  //     interval_uuid: data.interval?.uuid,
                                  //     permission_uuid: value?.permission_uuid,
                                  //     channel_uuid: [], //{deleted: data.chennel?.filter((val) => val.uuid)},
                                  //   });
                                  // }
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    // error={Boolean(
                                    //    props.formik.touched.users_group &&
                                    //    props.formik.errors.users_group
                                    // )}
                                    fullWidth
                                    name="secret_class"
                                    // helperText={
                                    //    props.formik.touched.users_group &&
                                    //    props.formik.errors.users_group
                                    // }

                                    label={t("ระดับการเผยแพร่")}
                                    onBlur={formik.handleBlur}
                                    onChange={formik.handleChange}
                                    variant="outlined"
                                  />
                                )}
                              />
                            </Grid>

                            {/* {formik.values.interval &&
                              formik.values?.interval?.updated &&
                              formik.values.interval.updated.find(
                                (val) =>
                                  val.interval_uuid === data.interval.uuid
                              )?.permission_uuid !==
                                "a60209a5-7cc8-441e-9d2e-4b8307ab83c1" && ( */}
                            {(updatePermission.some(
                              (val) => val.interval_uuid === data.interval.uuid
                            )
                              ? updatePermission.find(
                                  (val) =>
                                    val.interval_uuid === data.interval.uuid
                                )?.permission_uuid
                              : data?.permission?.uuid) !==
                              "a60209a5-7cc8-441e-9d2e-4b8307ab83c1" && (
                              <Grid item xs={12} sm={6} md={4}>
                                <Autocomplete
                                  multiple
                                  disablePortal
                                  limitTags={2}
                                  options={auth.masterData?.channels}
                                  getOptionLabel={(option: any) =>
                                    option.channel_name?.th
                                      ? option.channel_name?.th
                                      : option.channel?.name?.th
                                      ? option.channel?.name?.th
                                      : option.name?.th
                                      ? option.name?.th
                                      : "-"
                                  }
                                  onChange={(_e: any, value: any | null) => {
                                    channel = [];
                                    channelDelete = [];
                                    value.map((val) => {
                                      channel.push(
                                        val.channel_uuid
                                          ? val.channel_uuid
                                          : val.uuid
                                      );
                                    });

                                    // if (
                                    //   updateChannel.some(
                                    //     (val) =>
                                    //       val.interval_uuid ===
                                    //       data.interval?.uuid
                                    //   )
                                    // ) {
                                    //   setUpdateChannel([]);
                                    // }

                                    let ids = [...updateChannel];
                                    let indexArray = ids.findIndex(
                                      (val) =>
                                        val.interval_uuid ===
                                        data.interval?.uuid
                                    );

                                    if (indexArray >= 0) {
                                      updateChannel[indexArray] = [];
                                    }

                                    setUpdateChannel((prev) => [
                                      ...prev,
                                      {
                                        interval_uuid: data.interval?.uuid,
                                        permission_uuid: data.permission?.uuid,
                                        channel: channel,
                                      },
                                    ]);

                                    // if (
                                    //   formik.values.interval.updated.some(
                                    //     (val) =>
                                    //       val.interval_uuid ===
                                    //       data.interval?.uuid
                                    //   )
                                    // ) {
                                    //   formik.values.interval.updated = [
                                    //     ...formik.values.interval.updated.slice(
                                    //       0,
                                    //       index
                                    //     ),
                                    //     ...formik.values.interval.updated.slice(
                                    //       index + 1
                                    //     ),
                                    //   ];
                                    // }

                                    ///Deleted
                                    // data.channel.map((element) => {
                                    //   value.map((val) => {
                                    //     if (
                                    //       value.some(
                                    //         (val) =>
                                    //           val.channel_uuid ===
                                    //           element.uuid
                                    //       )
                                    //     ) {
                                    //       passCheck = true;
                                    //       // channelDelete.push(
                                    //       //   val.channel_uuid
                                    //       // );
                                    //     }
                                    //   });
                                    // });

                                    // if (
                                    //   data.channel.some(
                                    //     (element) =>
                                    //       element.uuid ===
                                    //       value[value.length - 1]
                                    //         ?.channel_uuid
                                    //   )
                                    // ) {
                                    //   passCheck = true;
                                    // }
                                    // var check =
                                    //   formik.values.interval.updated.filter(
                                    //     (val) =>
                                    //       val.interval_uuid ===
                                    //       data.interval.uuid
                                    //   );
                                    //////////////////////
                                    // const res1 = data.channel?.filter(
                                    //   (element) =>
                                    //     !value.find(
                                    //       (val) =>
                                    //         element.uuid !== val.channel_uuid
                                    //     )
                                    // );

                                    // ///inSerted
                                    // if (res1.length <= 0) {
                                    //   //Clear formik
                                    //   value?.map((val) => {
                                    //     if (val.channel_uuid) {
                                    //       channel.push(val.channel_uuid);
                                    //     }
                                    //   });
                                    // } else {
                                    //   res1?.map((val) => {
                                    //     channelDelete.push(val.uuid);
                                    //   });
                                    // }

                                    // formik.values.interval.updated.map(
                                    //   (val, index) => {
                                    //     if (
                                    //       val.interval_uuid ===
                                    //       data.interval?.uuid
                                    //     ) {
                                    //       passCheck = true;
                                    //       index = index;
                                    //     }
                                    //   }
                                    // );

                                    // if (passCheck) {
                                    //   formik.values.interval.updated?.length >
                                    //     0 ??
                                    //     (formik.values.interval.updated[
                                    //       index
                                    //     ].channel_uuid = {
                                    //       inserted: channel,
                                    //       deleted: channelDelete,
                                    //     });
                                    // } else {
                                    //   formik.values.interval.updated.push({
                                    //     interval_uuid: data.interval.uuid,
                                    //     permission_uuid: data.permission.uuid,
                                    //     channel_uuid: {
                                    //       inserted: channel,
                                    //       deleted: channelDelete,
                                    //     },
                                    //   });
                                    // }

                                    // if (
                                    //   formik.values.interval.updated.some(
                                    //     (val) => {
                                    //       val.interval_uuid ===
                                    //         data.interval?.uuid;
                                    //     }
                                    //   )
                                    // ) {
                                    //   formik.values.interval.updated.some(
                                    //     (val) => {
                                    //       if (
                                    //         val.interval_uuid ===
                                    //         data.interval?.uuid
                                    //       ) {
                                    //         val.channel_uuid = {
                                    //           inserted: channel,
                                    //           deleted: channelDelete,
                                    //         };
                                    //       }
                                    //     }
                                    //   );
                                    // } else {
                                    //   formik.values.interval.updated.push({
                                    //     interval_uuid: data.interval.uuid,
                                    //     permission_uuid: data.permission.uuid,
                                    //     channel_uuid: {
                                    //       inserted: channel,
                                    //       deleted: channelDelete,
                                    //     },
                                    //   });
                                    // }

                                    console.log(
                                      "val finished ",
                                      formik.values.interval.updated
                                    );

                                    // getUpdate();

                                    // var indexUpdate = -1;
                                    // var check =
                                    //   formik.values.interval.updated.filter(
                                    //     (val) =>
                                    //       val.interval_uuid ===
                                    //       data.interval.uuid
                                    //   );

                                    // formik.values.interval.updated.filter(
                                    //   (val, index) => {
                                    //     if (
                                    //       val.interval_uuid ===
                                    //       data.interval.uuid
                                    //     ) {
                                    //       // check = val;
                                    //       indexUpdate = index;
                                    //       val.channel_uuid.inserted = [];
                                    //       val.channel_uuid.deleted = [];
                                    //     }
                                    //   }
                                    // );

                                    // channel = [];
                                    // channelDelete = [];

                                    // data.channel.map((data) => {
                                    //   if (
                                    //     !value.some(
                                    //       (val) => val.uuid === data.uuid
                                    //     )
                                    //   ) {
                                    //     channelDelete.push(data.uuid);
                                    //   }
                                    // });

                                    // value.find((val) => {
                                    //   if (
                                    //     !check.some((data) =>
                                    //       data.channel_uuid.deleted.includes(
                                    //         val.channel_uuid
                                    //       )
                                    //     )
                                    //   ) {
                                    //     if (val.channel_uuid) {
                                    //       channel.push(val.channel_uuid);
                                    //     }
                                    //   }
                                    // });
                                    // if (
                                    //   data.channel?.some(
                                    //     (val) =>
                                    //       val.uuid !==
                                    //       value[value.length - 1]
                                    //         ?.channel_uuid
                                    //   )
                                    // ) {
                                    //   if (check.length <= 0) {
                                    //     console.log("push");
                                    //     formik.values.interval.updated.push({
                                    //       interval_uuid: data.interval.uuid,
                                    //       permission_uuid:
                                    //         data.permission.uuid,
                                    //       channel_uuid: {
                                    //         inserted: channel,
                                    //         deleted: channelDelete,
                                    //       },
                                    //     });
                                    //   } else {
                                    //     (formik.values.interval.updated[
                                    //       indexUpdate
                                    //     ].channel_uuid.inserted = channel),
                                    //       (formik.values.interval.updated[
                                    //         indexUpdate
                                    //       ].channel_uuid.deleted = channelDelete);
                                    //   }
                                    // } else {
                                    //   console.log("pop");
                                    //   // value.pop();
                                    // }
                                  }}
                                  isOptionEqualToValue={(option, value) =>
                                    option?.channel_uuid === value?.uuid ||
                                    option?.channel_uuid === value?.channel_uuid
                                  }
                                  defaultValue={data?.channel ?? []}
                                  // defaultValue={
                                  //   formik.values?.interval?.updated?.some(
                                  //     (val) =>
                                  //       val?.interval_uuid ===
                                  //       data?.interval.uuid
                                  //   )
                                  //     ? formik.values?.interval?.updated?.find(
                                  //         (val) =>
                                  //           val?.interval_uuid ===
                                  //           data?.interval.uuid
                                  //       )?.channel_uuid
                                  //     : data?.channel ?? []
                                  // }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      fullWidth
                                      variant="outlined"
                                      label={t("ช่องทางการให้บริการข้อมูล")}
                                    />
                                  )}
                                />
                              </Grid>
                            )}
                            {/* )} */}
                          </Grid>
                        </Grid>
                      ))}
                  </Grid>
                )}

                {props.code === "RESPONSIBLE_PERSON_INFORMATION" && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            error={Boolean(
                              formik.touched.coordinator?.first_name &&
                                formik.errors.coordinator?.first_name
                            )}
                            fullWidth
                            helperText={
                              formik.touched.coordinator?.first_name &&
                              formik.errors.coordinator?.first_name
                            }
                            label={t("FIRST_NAME")}
                            name="coordinator.first_name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            defaultValue={props.data?.coordinator?.first_name}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            error={Boolean(
                              formik.touched.coordinator?.last_name &&
                                formik.errors.coordinator?.last_name
                            )}
                            fullWidth
                            helperText={
                              formik.touched.coordinator?.last_name &&
                              formik.errors.coordinator?.last_name
                            }
                            label={t("LAST_NAME")}
                            name="coordinator.last_name"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            defaultValue={props.data?.coordinator?.last_name}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            error={Boolean(
                              formik.touched.coordinator?.email &&
                                formik.errors.coordinator?.email
                            )}
                            fullWidth
                            helperText={
                              formik.touched.coordinator?.email &&
                              formik.errors.coordinator?.email
                            }
                            label={t("EMAIL")}
                            name="coordinator.email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            defaultValue={props.data?.coordinator?.email}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            error={Boolean(
                              formik.touched.coordinator?.phone_number &&
                                formik.errors.coordinator?.phone_number
                            )}
                            fullWidth
                            helperText={
                              formik.touched.coordinator?.phone_number &&
                              formik.errors.coordinator?.phone_number
                            }
                            label={t("PHONE_NUMBER")}
                            name="coordinator.phone_number"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            variant="outlined"
                            // defaultValue={props.data?.coordinator?.phone_number}
                            value={formik.values.coordinator?.phone_number}
                            // InputLabelProps={{
                            //   shrink:
                            //     formik.values.coordinator?.phone_number &&
                            //     formik.values.coordinator?.phone_number.length >
                            //     0,
                            // }}
                            InputProps={{
                              inputComponent: TextMaskPhoneNumber as any,
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {props.data && props.code === "EDIT_DATA_IMPORT_DATA" && (
                  <Grid container spacing={3} pb={2}>
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Autocomplete
                            limitTags={2}
                            options={getInterval}
                            getOptionLabel={(option: any) =>
                              option.code ? option.code : "-"
                            }
                            value={getInterval.find(
                              (val) =>
                                val.uuid ===
                                  formikDataset.values.interval_uuid ||
                                val.code ===
                                  formikDataset.values.parameter.interval
                            )}
                            onChange={(e, value: any | null) =>
                              formikDataset.setFieldValue(
                                "interval_uuid",
                                value?.uuid
                              )
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onChange={formikDataset.handleChange}
                                onBlur={formikDataset.handleBlur}
                                fullWidth
                                name="department_uuid"
                                variant="outlined"
                                label={t("DURATION")}
                              />
                            )}
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            error={Boolean(
                              formikDataset.touched.name?.th &&
                                formikDataset.errors.name?.th
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.name?.th &&
                              formikDataset.errors.name?.th
                            }
                            label={t("THAI_NAME")}
                            name="name.th"
                            onBlur={formikDataset.handleBlur}
                            onChange={formikDataset.handleChange}
                            value={formikDataset?.values?.name?.th}
                            // defaultValue={props.data?.name?.th ?? "-"}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            error={Boolean(
                              formikDataset.touched.name?.en &&
                                formikDataset.errors.name?.en
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.name?.en &&
                              formikDataset.errors.name?.en
                            }
                            label={t("ENGLISH_NAME")}
                            name="name.en"
                            onBlur={formikDataset.handleBlur}
                            onChange={formikDataset.handleChange}
                            value={formikDataset.values.name?.en}
                            // defaultValue={props.data?.name?.en}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            error={Boolean(
                              formikDataset.touched.description?.th &&
                                formikDataset.errors.description?.th
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.description?.th &&
                              formikDataset.errors.description?.th
                            }
                            label={t("THAI_DETAILS")}
                            name="description.th"
                            onBlur={formikDataset.handleBlur}
                            onChange={formikDataset.handleChange}
                            value={formikDataset.values.description?.th}
                            // defaultValue={props.data?.description?.th}
                            variant="outlined"
                            rows={5}
                            multiline
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            error={Boolean(
                              formikDataset.touched.description?.en &&
                                formikDataset.errors.description?.en
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.description?.en &&
                              formikDataset.errors.description?.en
                            }
                            label={t("ENGLISH_DETAILS")}
                            name="description.en"
                            onBlur={formikDataset.handleBlur}
                            onChange={formikDataset.handleChange}
                            value={formikDataset.values.description?.en}
                            // defaultValue={props.data?.description?.en}
                            variant="outlined"
                            rows={5}
                            multiline
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {props.code === "EDIT_RESPONSIBLE_PERSON_INFORMATION" && (
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Autocomplete
                            disablePortal
                            id="flag.standard_data_flag"
                            options={datamock.dataset}
                            getOptionLabel={(option: any) =>
                              option.name ? option.name : "-"
                            }
                            onChange={(_e, value: any | null) =>
                              formikDataset.setFieldValue(
                                "flag.standard_data_flag",
                                value?.code
                              )
                            }
                            value={datamock.dataset.find(
                              (val) =>
                                val.code ===
                                formikDataset.values.flag?.standard_data_flag
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(
                                  formikDataset.touched.flag
                                    ?.standard_data_flag &&
                                    formikDataset.errors.flag
                                      ?.standard_data_flag
                                )}
                                fullWidth
                                helperText={
                                  formikDataset.touched.flag
                                    ?.standard_data_flag &&
                                  formikDataset.errors.flag?.standard_data_flag
                                }
                                onChange={formikDataset.handleChange}
                                onBlur={formikDataset.handleBlur}
                                name="flag.standard_data_flag"
                                label={t(
                                  "THE_FORMAT_OF_THE_INFORMATION_RECEIVED"
                                )}
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
                            getOptionLabel={(option: any) =>
                              option.name ?? option
                            }
                            onChange={(e, value: any | null) => {
                              formikDataset.setFieldValue(
                                "protocol",
                                value?.name
                              );
                            }}
                            //  isOptionEqualToValue={() => false}
                            value={formikDataset.values.protocol}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(
                                  formikDataset.touched.protocol &&
                                    formikDataset.errors.protocol
                                )}
                                fullWidth
                                helperText={
                                  formikDataset.touched.protocol &&
                                  formikDataset.errors.protocol
                                }
                                onChange={formikDataset.handleChange}
                                onBlur={formikDataset.handleBlur}
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
                              formikDataset.touched.host &&
                                formikDataset.errors.host
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.host &&
                              formikDataset.errors.host
                            }
                            name="host"
                            value={formikDataset.values.host}
                            onChange={formikDataset.handleChange}
                            onBlur={formikDataset.handleBlur}
                            label={t("HOST")}
                            variant="outlined"
                          />
                        </Grid>

                        {/* {httpGet && ( */}
                        <Grid item xs={12} sm={6} md={4}>
                          <Autocomplete
                            disablePortal
                            id="http_request"
                            options={datamock.httpRequest}
                            getOptionLabel={(option: any) =>
                              option.name ?? option
                            }
                            // isOptionEqualToValue={() => false}
                            onChange={(e, value: any | null) =>
                              formikDataset.setFieldValue(
                                "http_request",
                                value?.name
                              )
                            }
                            value={formikDataset.values.http_request}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(
                                  formikDataset.touched.http_request &&
                                    formikDataset.errors.http_request
                                )}
                                fullWidth
                                helperText={
                                  formikDataset.touched.http_request &&
                                  formikDataset.errors.http_request
                                }
                                name="http_request"
                                label={t("HTTP_REQUEST")}
                                onChange={formikDataset.handleChange}
                                onBlur={formikDataset.handleBlur}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                        {/* )} */}
                      </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} md={4}>
                          <Autocomplete
                            disablePortal
                            id="authentication"
                            options={datamock.authentication}
                            getOptionLabel={(option: any) =>
                              option.name ?? option
                            }
                            //  isOptionEqualToValue={() => false}
                            // onChange={(e, value: any | null) =>
                            //   formikDataset.setFieldValue("authentication", value?.name)
                            // }
                            value={datamock.authentication[0]}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                fullWidth
                                sx={{ m: 0 }}
                                margin="normal"
                                name="authentication"
                                label={t("HOW_TO_AUTHENTICATION")}
                                // onChange={formikDataset.handleChange}
                                // onBlur={formikDataset.handleBlur}
                                variant="outlined"
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={Boolean(
                              formikDataset.touched.api_key &&
                                formikDataset.errors.api_key
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.api_key &&
                              formikDataset.errors.api_key
                            }
                            name="api_key"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            label={t("API_KEY")}
                            value={formikDataset.values.api_key}
                            InputLabelProps={{
                              shrink: state.password.length > 0,
                            }}
                            onChange={formikDataset.handleChange}
                            onBlur={formikDataset.handleBlur}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={() =>
                                      setShowPassword(!showPassword)
                                    }
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
                              formikDataset.touched.crontab &&
                                formikDataset.errors.crontab
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.crontab &&
                              formikDataset.errors.crontab
                            }
                            name="crontab"
                            label={t("CRON_TAB")}
                            value={formikDataset.values.crontab}
                            onChange={formikDataset.handleChange}
                            onBlur={formikDataset.handleBlur}
                            variant="outlined"
                            InputProps={{
                              readOnly: true,
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={Boolean(
                              formikDataset.touched.sla_time &&
                                formikDataset.errors.sla_time
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.sla_time &&
                              formikDataset.errors.sla_time
                            }
                            name="sla_time"
                            label={t("SLA_TIME_MINUTES")}
                            value={formikDataset.values.sla_time}
                            onChange={formikDataset.handleChange}
                            onBlur={formikDataset.handleBlur}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                          <TextField
                            error={Boolean(
                              formikDataset.touched.retry_count &&
                                formikDataset.errors.retry_count
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.retry_count &&
                              formikDataset.errors.retry_count
                            }
                            name="retry_count"
                            label={t("MAXIMUM_CONNECTIONS_TIMES")}
                            value={formikDataset.values.retry_count}
                            onChange={formikDataset.handleChange}
                            onBlur={formikDataset.handleBlur}
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
                              formikDataset.touched.route &&
                                formikDataset.errors.route
                            )}
                            fullWidth
                            helperText={
                              formikDataset.touched.route &&
                              formikDataset.errors.route
                            }
                            name="route"
                            label={t("ROUTE")}
                            value={formikDataset.values.route}
                            onChange={formikDataset.handleChange}
                            onBlur={formikDataset.handleBlur}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {props.code === "EDIT_USER_PERSONAL_INFORMATION" && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        error={Boolean(
                          formikUpdateUser.touched.first_name &&
                            formikUpdateUser.errors.first_name
                        )}
                        fullWidth
                        helperText={
                          formikUpdateUser.touched.first_name &&
                          formikUpdateUser.errors.first_name
                        }
                        label={t("FIRST_NAME")}
                        name="first_name"
                        onBlur={formikUpdateUser.handleBlur}
                        onChange={formikUpdateUser.handleChange}
                        value={formikUpdateUser.values?.first_name ?? "-"}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        error={Boolean(
                          formikUpdateUser.touched.last_name &&
                            formikUpdateUser.errors.last_name
                        )}
                        fullWidth
                        helperText={
                          formikUpdateUser.touched.last_name &&
                          formikUpdateUser.errors.last_name
                        }
                        label={t("LAST_NAME")}
                        name="last_name"
                        onBlur={formikUpdateUser.handleBlur}
                        onChange={formikUpdateUser.handleChange}
                        value={formikUpdateUser.values?.last_name ?? "-"}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                )}

                {props.code === "EDIT_USER_ORGANIZATION_INFORMATION" && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        disablePortal
                        options={auth.masterData?.departments}
                        getOptionLabel={(option: any) =>
                          option.name?.th ? option.name?.th : "-"
                        }
                        isOptionEqualToValue={(option: any, value: any) =>
                          option?.code === value?.code
                        }
                        onChange={(_e, value: any | null) =>
                          (formikUpdateUser.values.department_uuid =
                            value?.uuid)
                        }
                        defaultValue={props.data.department_uuid}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={Boolean(
                              formikUpdateUser.touched.department_uuid &&
                                formikUpdateUser.errors.department_uuid
                            )}
                            fullWidth
                            name="department_uuid"
                            helperText={
                              formikUpdateUser.touched.department_uuid &&
                              formikUpdateUser.errors.department_uuid
                            }
                            label={t("DEPARTMENT")}
                            onBlur={formikUpdateUser.handleBlur}
                            onChange={formikUpdateUser.handleChange}
                            variant="outlined"
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                )}

                {props.code === "EDIT_USER_CONTACT_INFORMATION" && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        error={Boolean(
                          formikUpdateUser.touched.email &&
                            formikUpdateUser.errors.email
                        )}
                        fullWidth
                        helperText={
                          formikUpdateUser.touched.email &&
                          formikUpdateUser.errors.email
                        }
                        label={t("EMAIL")}
                        name="email"
                        onBlur={formikUpdateUser.handleBlur}
                        onChange={formikUpdateUser.handleChange}
                        value={formikUpdateUser.values?.email ?? "-"}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        error={Boolean(
                          formikUpdateUser.touched.phone_number &&
                            formikUpdateUser.errors.phone_number
                        )}
                        fullWidth
                        helperText={
                          formikUpdateUser.touched.phone_number &&
                          formikUpdateUser.errors.phone_number
                        }
                        label={t("PHONE_NUMBER")}
                        name="phone_number"
                        onBlur={formikUpdateUser.handleBlur}
                        onChange={formikUpdateUser.handleChange}
                        value={formikUpdateUser.values?.phone_number ?? "-"}
                        variant="outlined"
                        InputLabelProps={{
                          shrink:
                            formikUpdateUser.values?.phone_number &&
                            formikUpdateUser.values?.phone_number.length > 0,
                        }}
                        InputProps={{
                          inputComponent: TextMaskPhoneNumber as any,
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
              </DialogContent>

              <DialogActions
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleCloseDialog}
                >
                  {t("CANCEL")}
                </Button>

                <Button
                  type="submit"
                  color="success"
                  startIcon={
                    props.update === "update_import_config" ? (
                      formik.isSubmitting ? (
                        <CircularProgress size="1rem" />
                      ) : null
                    ) : props.update === "update_user" ? (
                      formikUpdateUser.isSubmitting ? (
                        <CircularProgress size="1rem" />
                      ) : null
                    ) : formikDataset.isSubmitting ? (
                      <CircularProgress size="1rem" />
                    ) : null
                  }
                  // disabled={() => headerSubmit(props.update)
                  disabled={Boolean(
                    props.update === "update_import_config"
                      ? !formik.isValid
                      : props.update === "update_user"
                      ? !formikUpdateUser.isValid
                      : !formikDataset.isValid &&
                        props.update === "update_import_config"
                      ? formik.isSubmitting
                      : props.update === "update_user"
                      ? formikUpdateUser.isSubmitting
                      : formikDataset.isSubmitting
                  )}
                  variant="contained"
                >
                  {t("SAVE")}
                </Button>
              </DialogActions>
            </form>
          </DialogStyldMUI>
        </>
      )}
    </>
  );
}

export default DialogMUI;
