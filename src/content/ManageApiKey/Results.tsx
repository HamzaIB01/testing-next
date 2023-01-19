import { FC, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Grid,
  TextField,
  Button,
  styled,
  CardContent,
  Hidden,
  Drawer,
  useTheme,
  Typography,
  CardHeader,
  Divider,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  FormGroup,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import Scrollbar from "src/components/Scrollbar";
import { DesktopDatePicker } from "@mui/lab";
import React from "react";
import { AllApiKeyResult } from "@/types/api_keys.type";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { apiKeyApi } from "@/actions/api.key.action";
import { copyToClipboard } from "@/components/CopyText/CopyText";

const sidebarContent = (
  <Scrollbar>
    <Sidebar />
  </Scrollbar>
);

const DrawerWrapperMobile = styled(Drawer)(
  () => `
      width: 340px;
      flex-shrink: 0;
  
    & > .MuiPaper-root {
          width: 340px;
          z-index: 3;
    }
  `
);

const CardActions = styled(Box)(
  ({ theme }) => `
       background: ${theme.colors.alpha.black[5]};
       padding: 24px;
       display: flex;
       align-items: center;
       justify-content: space-between;
    `
);

const handleEditorDidMount = (_: any, editor: any) => {
  console.log(editor.addCommand, editor);
};

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const [copyText, setcopyText] = useState("");
  const [apiText, setAPIText] = useState("null");
  const [apiKey, setApiKey] = React.useState<AllApiKeyResult>();
  const auth = useAuth();

  const listItem = [
    {
      value: "A01",
      label: "ข้อมูลปริมารน้ำฝน",
      // checkbox: false,
    },
    {
      value: "A02",
      label: "ข้อมูลปริมารน้ำท่า",
      // checkbox: false,
    },
    {
      value: "A03",
      label: "ข้อมูลแหล่งน้ำ",
      // checkbox: false,
    },
    {
      value: "A04",
      label: "ข้อมูลสถานีตรวจวัด",
      // checkbox: false,
    },
    {
      value: "A05",
      label: "ข้อมูลรายบละเอียดแหล่งน้ำ",
      // checkbox: false,
    },
  ];

  const selectTabApi = (value: AllApiKeyResult) => {
    setApiKey(value);
    console.log(value);
  };

  const [isChecked, setIsChecked] = useState(() => listItem.map((_i) => false));

  const isCheckboxChecked = (index, checked) => {
    setIsChecked((isChecked) => {
      return isChecked.map((c, i) => {
        if (i === index) return checked;
        return c;
      });
    });
  };

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mockResponseJSON = {
    code: "string",
    error: "string",
    massage: "string",
    timestamp: "2022-08-04T02:35:25.472Z",
    result: {
      access_token: "string",
    },
  };

  const [value, setValue] = React.useState<Date | null>(new Date());

  const handleChangeDatePicker = (newValue: Date | null) => {
    // console.log("new value ", isNaN(newValue.getTime()));
    if (!isNaN(newValue?.getTime())) {
      (formik.values.expired_date = format(new Date(newValue), "yyyy-MM-dd")),
        setValue(newValue);
    } else {
      var date = new Date(); // Now
      date.setDate(date.getDate() + 30);
      (formik.values.expired_date = format(date, "yyyy-MM-dd")), setValue(null);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      expired_date: format(new Date(), "yyyy-MM-dd"),
      category: [],
    },
    validationSchema: Yup.object({
      // first_name: Yup.string()
      //    .max(255)
      //    .required(t('The first name field is required')),
    }),
    onSubmit: async (values, _helpers): Promise<void> => {
      // console.log("onSubmit", values);
      try {
        const result = await apiKeyApi.createApikey(values);
        console.log("onSubmit", result);
        if (result) {
          setAPIText(result.token);
          setApiKey(result.token);
          // window.location.reload();
        }
        // setAPIText("6");
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={2}>
          <Hidden mdDown>
            <Grid item xs={12} md={3}>
              {apiText && (
                <Sidebar
                  key={apiText}
                  onSelect={(e) => selectTabApi(e)}
                  apiText={apiText}
                />
              )}
            </Grid>
          </Hidden>

          <Grid item xs={12} md={9}>
            <Card sx={{ height: "100%" }}>
              <CardHeader title={t("INFORMATION_FOR_API_KEY")} />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h5" component="div">
                      {t("BASIC_INFORMAION")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {/* {console.log("apiKey", apiKey)} */}

                      {apiKey && (
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <TextField
                                fullWidth
                                id="outlined-adornment-password"
                                variant="outlined"
                                label={t("API_KEY")}
                                // onChange={(e) => setcopyText(e.target.value)}
                                disabled={true}
                                value={apiText === "null" ? "" : apiText}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() => {
                                          copyToClipboard(apiText);
                                          // navigator.clipboard?.writeText(
                                          //   apiText
                                          // );
                                        }}
                                      >
                                        <ContentCopyIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      )}

                      <Grid item xs={12} md={6}>
                        {apiText && (
                          <TextField
                            label={t("PROJECT_NAME")}
                            // value={query}
                            name={"name"}
                            value={apiKey ? apiKey.name : formik.values.name}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            disabled={
                              apiText != "null" || apiKey ? true : false
                            }
                            InputLabelProps={{
                              shrink: true,
                            }}
                            fullWidth
                            margin="normal"
                            variant="outlined"
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <DesktopDatePicker
                          label={t("EXPIRATION_DATE")}
                          inputFormat="dd MMMM yyyy"
                          disabled={apiText != "null" || apiKey ? true : false}
                          // minDate={new Date()}
                          value={apiKey ? apiKey.expired_date : value}
                          onChange={handleChangeDatePicker}
                          // disableFuture={true}
                          disablePast={true}
                          disableHighlightToday={false}
                          // disableMaskedInput={false}
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
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h5" component="div">
                      {t("SCOPE_OF_APPLICATION")}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <FormGroup>
                      {auth?.masterData?.categories?.map((value, index) => (
                        <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              name={"category$[index].uuid"}
                              // value={Category[index]}
                              checked={isChecked[index]}
                              // defaultChecked={apiKey ? }
                              disabled={
                                apiText != "null" || apiKey ? true : false
                              }
                              color="primary"
                              onChange={(event, _values: any | null) => {
                                var repeat = false;
                                formik.values.category.find((val) => {
                                  if (val.uuid === value.category_uuid) {
                                    repeat = true;
                                  }
                                });

                                console.log(repeat, "xxx ");

                                if (repeat) {
                                  formik.values.category =
                                    formik.values.category.filter(
                                      (item, _index) =>
                                        item.uuid !== value.category_uuid
                                    );
                                } else {
                                  formik.values.category.push({
                                    uuid: value.category_uuid,
                                  });
                                }

                                isCheckboxChecked(index, event.target.checked);
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2">
                              {value.category_name?.th ?? "-"}
                            </Typography>
                          }
                        />
                      ))}
                    </FormGroup>
                  </Grid>
                </Grid>
              </CardContent>
              {!apiKey && (
                <CardActions>
                  <Button
                    color="error"
                    variant="contained"
                    // onClick={handleCreateUserClose}
                    onClick={() => setApiKey(null)}
                  >
                    {t("CANCEL")}
                  </Button>
                  <Button
                    type="submit"
                    // disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                  >
                    {t("SAVE")}
                  </Button>
                </CardActions>
              )}
            </Card>
          </Grid>
        </Grid>
      </form>

      <Hidden mdUp>
        <DrawerWrapperMobile
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          {sidebarContent}
        </DrawerWrapperMobile>
      </Hidden>
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
