import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  CardContent,
  TextField,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/lab";
import { useTranslation } from "next-i18next";
import { format } from "date-fns";

export function DetailMore(props: any) {
  const [toValue, setToValue] = useState<Date | null>(
    new Date(props.getInitial && props.getInitial.to)
  );
  const [fromValue, setFromValue] = useState<Date | null>(
    new Date(props.getInitial && props.getInitial.from)
  );
  const { t }: { t: any } = useTranslation();

  const handleChangeFrom = (newValue: Date | null) => {
    props.getInitial.from = format(newValue, "yyyy-MM-dd");
    setFromValue(newValue);
  };

  const handleChangeTo = (newValue: Date | null) => {
    props.getInitial.to = format(newValue, "yyyy-MM-dd");
    setToValue(newValue);
  };

  return (
    <Card>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          {props.title}
        </Typography>
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
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4}>
                  <DesktopDatePicker
                    label={t("SINCE")}
                    inputFormat="dd MMMM yyyy"
                    value={fromValue}
                    disabled={props.disabled ? props.disabled : false}
                    onChange={(e) => {
                      props.getInitial.from = format(new Date(e), "yyyy-MM-dd");
                      handleChangeFrom(e);
                      if (toValue.getDate() < new Date(e).getDate()) {
                        console.log("too ");
                        (props.getInitial.to = format(
                          new Date(e),
                          "yyyy-MM-dd"
                        )),
                          handleChangeFrom(e);
                        handleChangeTo(e);
                      }
                    }}
                    disableMaskedInput={true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        fullWidth
                        name="start"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                  {fromValue && (
                    <DesktopDatePicker
                      label={t("UP_TO_DATE")}
                      inputFormat="dd MMMM yyyy"
                      value={
                        toValue.getDate() < fromValue.getDate()
                          ? fromValue
                          : toValue
                      }
                      minDate={new Date(fromValue)}
                      // defaultValue={props.getInitial && props.getInitial.description}
                      disabled={props.disabled ? props.disabled : false}
                      onChange={(e) => {
                        (props.getInitial.to = format(
                          new Date(fromValue),
                          "yyyy-MM-dd"
                        )),
                          handleChangeTo(e);
                      }}
                      disableMaskedInput={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
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
              <TextField
                fullWidth
                name="thai_name"
                // onBlur={handleBlur}
                // onChange={handleChange}
                // value={!props.getInitial ? props.submitValue : ""}
                defaultValue={props.getInitial && props.getInitial.description}
                disabled={props.disabled ? props.disabled : false}
                onChange={(e: any) =>
                  (props.getInitial.description = e.target.value)
                }
                label={t("PLEASE_ENTER_THE_PURPOSE_OF_REQUESTING_INFORMATION")}
                variant="outlined"
                rows={8}
                multiline
              />
            </Grid>
          </Grid>
        </Typography>
      </CardContent>
    </Card>
  );
}
