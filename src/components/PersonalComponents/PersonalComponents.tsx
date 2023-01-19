import {
  Grid,
  Typography,
  Autocomplete,
  TextField as TextFieldMUI,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Field } from "formik";
import { TextField } from "formik-mui";
import { useTranslation } from "react-i18next";
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab";
import { format } from "date-fns";

import { TextMaskLaserCode } from "../Validations/LaserCode.validation";
import { PAGE, server } from "@/constants";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { th } from "date-fns/locale";
import { TextMaskCitizenNumber } from "../Validations/CitizenNumber.validation";

export function PersonalComponent(props: any) {
  const { t }: { t: any } = useTranslation();

  const statusOptions = [
    {
      id: "1",
      name: "บัตรประจำตัวประชาชนไทย",
    },
    {
      id: "3",
      name: "หนังสือเดินทาง",
    },
  ];

  const [citizenNumberType, setCitizenNumberType] = useState(
    props.formik?.people_type ?? {
      id: "1",
      name: "บัตรประจำตัวประชาชนไทย",
    }
  );
  const [firstName, setFirstName] = useState(
    props.getInitial?.first_name ?? "-"
  );
  const [lastName, setLastName] = useState(props.getInitial?.last_name ?? "-");
  const [citizenNumber, setCitizenNumber] = useState(
    props.getInitial?.citizen_number ?? "-"
  );
  const [laserCard, setLaserCode] = useState(
    props.getInitial?.laser_code ?? "-"
  );
  const [birthDate, setBirthDate] = useState(
    props.getInitial?.birth_date ?? "-"
  );

  //   const [filtersIdCard, setFiltersIdCard] = useState(statusOptions[0]);

  // const [value, setValue] = useState<Date | null>(new Date());
  const [value, setValue] = useState<Date | null>(
    props.getInitial?.birth_date
      ? new Date(props.getInitial?.birth_date)
      : new Date()
  );

  var formattedDate = format(new Date(), "yyyy-MM-dd");
  const event = new Date(formattedDate);
  const options: any = {
    // weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // console.log("value", value);

  const handleChange = (newValue: Date | null) => {
    // console.log("newValue", newValue);

    var formattedDate = format(newValue, "yyyy-MM-dd");

    console.log("formattedDate", formattedDate);

    // return event.toLocaleDateString(
    //    localStorage.getItem(server.LANGUAGE) === "th" ? "th" : "en-GB",
    //    options
    // );

    // console.log(
    //   event.toLocaleDateString(
    //     localStorage.getItem(server.LANGUAGE) === "th" ? "th" : "en-GB",
    //     options
    //   )
    // );

    setBirthDate(formattedDate);
    // props.getInitial.birth_date = formattedDate;
    props.formik.setFieldValue("birth_date", formattedDate);
    setValue(newValue);
  };

  return (
    <Grid container spacing={3}>
      {props.title && (
        <Grid item xs={12}>
          <Typography variant="h4" component="h4">
            {props.title}
          </Typography>
        </Grid>
      )}

      <Grid item xs={12}>
        <Grid container spacing={3}>
          {props.hidden && (
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    disablePortal
                    id="people_type"
                    options={statusOptions}
                    getOptionLabel={(option: any) => option.name ?? option}
                    isOptionEqualToValue={(option: any, value: any) =>
                      option?.id === value?.id
                    }
                    value={statusOptions.find(
                      (val) =>
                        val.id === String(props.formik.values.people_type)
                    )}
                    // value={statusOptions.find((val) => val.id === String("1"))}
                    onChange={(_e, value: any | null) => {
                      // props.onChange(value?.id || statusOptions[0].id);
                      if (value?.id === "1") {
                        props.formik.setFieldValue("passport", "");
                      } else {
                        props.formik.setFieldValue("citizen_number", "");
                        props.formik.setFieldValue("laser_code", "");
                      }
                      props.formik.setFieldValue(
                        "people_type",
                        Number(value?.id) || Number(statusOptions[0].id)
                      );
                      setCitizenNumberType(value || statusOptions[0]);
                    }}
                    renderInput={(params) => (
                      <TextFieldMUI
                        {...params}
                        fullWidth
                        name="citizen_number_type"
                        label={t("CITIZEN_NUMBER_TYPE")}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            {/* {props.page === PAGE.REGISTER && (
              <Field
                fullWidth
                name="first_name"
                component={TextField}
                label={t("FIRST_NAME")}
                value={props.formik.values.first_name}
                onChange={(event) => {
                  props.formik.setFieldValue("first_name", event.target.value);
                }}
                onBlur={props.formik.handleBlur}
                // onChange={props.formik.handleChange}
              />
            )} */}

            {props.page === PAGE.REGISTER && (
              <Field
                component={TextField}
                error={Boolean(
                  props.formik.touched.first_name &&
                    props.formik.errors.first_name
                )}
                fullWidth
                helperText={
                  props.formik.touched.first_name &&
                  props.formik.errors.first_name
                }
                label={t("FIRST_NAME")}
                name="first_name"
                onBlur={props.formik.handleBlur}
                onChange={props.formik.handleChange}
                id="first_name"
                value={props.formik.values.first_name}
                multiline
              />
            )}

            {props.page !== PAGE.REGISTER && (
              <Field
                fullWidth
                disabled={props.disableTextfield}
                name="first_name"
                value={firstName}
                component={TextField}
                label={t("FIRST_NAME")}
                onChange={(event) => {
                  setFirstName(event.target.value);
                  props.getInitial.first_name = event.target.value;
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {props.page === PAGE.REGISTER && (
              <Field
                component={TextField}
                error={Boolean(
                  props.formik.touched.last_name &&
                    props.formik.errors.last_name
                )}
                fullWidth
                helperText={
                  props.formik.touched.last_name &&
                  props.formik.errors.last_name
                }
                label={t("LAST_NAME")}
                name="last_name"
                onBlur={props.formik.handleBlur}
                onChange={props.formik.handleChange}
                id="last_name"
                value={props.formik.values.last_name}
                multiline
              />
            )}

            {props.page !== PAGE.REGISTER && (
              <Field
                fullWidth
                disabled={props.disableTextfield}
                name="last_name"
                value={lastName}
                component={TextField}
                label={t("LAST_NAME")}
                onChange={(event) => {
                  setLastName(event.target.value);
                  props.getInitial.last_name = event.target.value;
                }}
              />
            )}
          </Grid>

          {props.hidden && (
            <>
              <Grid item xs={12} md={6}>
                {props.page === PAGE.REGISTER &&
                  (props?.formik.values?.people_type === 1 ? (
                    <Field
                      fullWidth
                      name="citizen_number"
                      component={TextField}
                      label={t("CITIZEN_NUMBER")}
                      value={props.formik.values.citizen_number}
                      error={Boolean(
                        props.formik.touched.citizen_number &&
                          props.formik.errors.citizen_number
                      )}
                      helperText={
                        props.formik.touched.citizen_number &&
                        props.formik.errors.citizen_number
                      }
                      onBlur={props.formik.handleBlur}
                      onChange={props.formik.handleChange}
                      InputProps={{
                        inputComponent: TextMaskCitizenNumber as any,
                      }}
                    />
                  ) : (
                    <Field
                      fullWidth
                      name="passport"
                      component={TextField}
                      label={t("PASSPORT")}
                      error={Boolean(
                        props.formik.touched.passport &&
                          props.formik.errors.passport
                      )}
                      helperText={
                        props.formik.touched.passport &&
                        props.formik.errors.passport
                      }
                      onBlur={props.formik.handleBlur}
                      onChange={props.formik.handleChange}
                      value={props.formik.values.passport}
                    />
                  ))}

                {props.page !== PAGE.REGISTER && (
                  <Field
                    fullWidth
                    name="citizen_number"
                    value={citizenNumber}
                    component={TextField}
                    label={t("CITIZEN_NUMBER")}
                    onChange={(event) => {
                      setCitizenNumber(event.target.value);
                      props.getInitial.citizen_number = event.target.value;
                    }}
                    InputLabelProps={{
                      shrink: citizenNumber && citizenNumber.length > 0,
                    }}
                    InputProps={
                      citizenNumberType.id !== "3" ||
                      (String(props.getInitial.people_type) !== "3" && {
                        inputComponent: TextMaskCitizenNumber as any,
                      })
                    }
                  />
                )}
              </Grid>

              {props.page === PAGE.REGISTER &&
                (props?.formik.values?.people_type === 1 ? (
                  <Grid item xs={12} md={6}>
                    <Field
                      fullWidth
                      name="laser_code"
                      component={TextField}
                      label={t("LASER_CODE")}
                      error={Boolean(
                        props.formik.touched.laser_code &&
                          props.formik.errors.laser_code
                      )}
                      helperText={
                        props.formik.touched.laser_code &&
                        props.formik.errors.laser_code
                      }
                      onBlur={props.formik.handleBlur}
                      onChange={props.formik.handleChange}
                      value={props.formik.values.laser_code}
                      InputProps={{ inputComponent: TextMaskLaserCode as any }}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} md={6}>
                    <Field
                      fullWidth
                      name="nationality"
                      component={TextField}
                      label={t("NATIONALITY")}
                      error={Boolean(
                        props.formik.touched.nationality &&
                          props.formik.errors.nationality
                      )}
                      helperText={
                        props.formik.touched.nationality &&
                        props.formik.errors.nationality
                      }
                      onBlur={props.formik.handleBlur}
                      onChange={props.formik.handleChange}
                      value={props.formik.values.nationality}
                    />
                  </Grid>
                ))}

              {/* {String(props.getInitial.people_type) === "1" &&
                citizenNumberType.id === "1" && ( */}

              {props.page !== PAGE.REGISTER &&
                (props?.getInitial?.people_type === 1 &&
                citizenNumberType.id === "1" ? (
                  <Grid item xs={12} md={6}>
                    <Field
                      fullWidth
                      name="laser_code"
                      value={laserCard}
                      component={TextField}
                      label={t("LASER_CODE")}
                      onChange={(event) => {
                        setLaserCode(event.target.value);
                        props.getInitial.laser_code = event.target.value;
                      }}
                      InputLabelProps={{
                        shrink: laserCard && laserCard.length > 0,
                      }}
                      InputProps={{
                        inputComponent: TextMaskLaserCode as any,
                      }}
                    />
                  </Grid>
                ) : null)}

              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <LocalizationProvider
                      dateAdapter={AdapterDateFns}
                      locale={th}
                    >
                      <DesktopDatePicker
                        label={t("SINCE")}
                        inputFormat="dd MMMM yyyy"
                        value={value}
                        disableMaskedInput={true}
                        onChange={handleChange}
                        maxDate={
                          props.page === PAGE.REGISTER ? new Date() : false
                        }
                        renderInput={(params) => (
                          <Field
                            {...params}
                            fullWidth
                            name="birth_date"
                            // value={birthDate}
                            value={"1997-08-12"}
                            component={TextField}
                            label={t("BIRTHDAY")}
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
