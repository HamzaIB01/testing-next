import { FC, ChangeEvent, useState, useEffect, useCallback } from "react";
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
  Stack,
  IconButton,
  Tooltip,
  Autocomplete,
  Tab,
  Tabs,
  Slide,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Sidebar from "./Sidebar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import NextLink from "next/link";
import Scrollbar from "src/components/Scrollbar";
import MonacoEditor from "@monaco-editor/react";
import { useAuth } from "@/hooks/useAuth";
import { apiKeyApi } from "@/actions/api.key.action";
import { AllApiKeyResult } from "@/types/api_keys.type";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthURL, waterUrl } from "@/constants";
import { useRouter } from "next/router";
import { copyToClipboard } from "@/components/CopyText/CopyText";
import SimpleBackdrop from "@/components/Backdrop";
import React from "react";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import { http_Request } from "@/mocks/http_request";

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

const TabsWrapper = styled(Tabs)(
  ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.xl}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
    }
    `
);

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const auth = useAuth();
  const [query, setQuery] = useState<string>("");
  const [getAllAPI, setGetAllAPI] = useState<AllApiKeyResult[]>([]);
  const [tab, setTab] = useState<string>("Parameter");
  const [method, setMethod] = useState<string>("GET");
  const [apiKey, setAPIKey] = useState<string>("");
  const router = useRouter();
  const date = format(new Date(), "yyyy-MM-ddTHH:mm:ss");
  const [parameter, setParameter] = useState<string[]>([
    "startDatetime",
    "endDatetime",
    "interval",
    "latest",
  ]);

  const [parameterValue, setParameterValue] = useState<string[]>([
    date.slice(0, 10) + "T" + date.slice(23),
    date.slice(0, 10) + "T" + date.slice(23),
    "C-10",
    "false",
  ]);

  const formik = useFormik({
    initialValues: {
      parameter: ["startDatetime", "endDatetime", "interval", "latest"],
      parameterValue: [
        date.slice(0, 10) + "T" + date.slice(23),
        date.slice(0, 10) + "T" + date.slice(23),
        "C-10",
        "false",
      ],
    },
    onSubmit: async (values, _helpers): Promise<void> => {
      // console.log("path ", props.filtersRole);
    },
  });

  const [bodyJson, setBodyJson] = useState<string[]>([]);
  const [path, setPathData] = useState<string>(
    waterUrl + `/${router.query.list}`
  );
  const [pathUrl, setPath] = useState<string>(`/${router.query.list}`);

  const getApikeys = useCallback(async () => {
    try {
      const apiData = await apiKeyApi.getApikeybyuser(auth.user.uuid);
      setGetAllAPI(apiData ? apiData : []);
    } catch (err) {
      setGetAllAPI([]);
    }
  }, []);

  useEffect(() => {
    getApikeys();
  }, []);

  useEffect(() => {
    var data = path + "?";
    // parameter[index] = e.target.value;
    formik.values?.parameterValue?.map((val: any, index: any) => {
      data += `${formik.values?.parameter[index]}=${val}${
        index < formik.values?.parameterValue?.length - 1 ? "&" : ""
      }`;
    });

    setPath(data);
  }, [formik.values, path]);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    // setQuery(event.target.value);
    // console.log("val query ", event.target.value);

    // formik.setFieldValue(`parameter[${0}]`, "startDatetime1");s

    setPath(event.target.value);
  };

  const version = [
    {
      id: "v1.0",
      name: "v1.0",
    },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const mockJSON = {
    id: 101,
    name: "wittawad paeyor",
    email: "admin@gmail.com",
  };

  const code = JSON.stringify(mockJSON, null, 4);

  const [json, setJson] = useState<string>(JSON.stringify(mockJSON, null, 4));

  const onChange = (newValue: any, e: any) => {
    console.log("element", e);
    console.log("onChange", newValue);
    setJson(newValue);
  };

  const options = {
    readOnly: false,
    minimap: { enabled: false },
  };

  const optionsResponse = {
    readOnly: true,
    minimap: { enabled: false },
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

  const handleSend = async () => {
    if (apiKey.length <= 1) {
      enqueueSnackbar("กรุณาเลือก API key", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        autoHideDuration: 4000,
        TransitionComponent: Slide,
      });
    } else {
      setOpenBackdrop(true);
      try {
        setBodyJson([]);

        if (tab === "Parameter") {
          var data = "";
          parameterValue.map((val: any, index: any) => {
            data += `${parameter[index]}=${val}&`;
          });
        } else {
        }

        const result = await apiKeyApi.getPostmane(
          method,
          tab === "Parameter" ? null : json,
          tab === "Parameter" ? pathUrl : pathUrl,
          apiKey
        );

        // // if (result) {
        setBodyJson(result);
        setOpenBackdrop(false);
        // // }
      } catch (err) {
        // console.log(err);
        // alert(err);
        setBodyJson([err]);
        setOpenBackdrop(false);
        // alert(err);
      }
    }
  };

  const codeResponse = JSON.stringify(mockResponseJSON, null, 4);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2 } }}>
        <Grid item xs={12} md={4} xl={3}>
          <Stack spacing={2} direction="row">
            {/* <Button
              color="primary"
              type="submit"
              size="large"
              variant="contained"
              onClick={handleDrawerToggle}
            >
              <DehazeIcon />
            </Button> */}

            <Autocomplete
              fullWidth
              sx={{ backgroundColor: "white", borderRadius: "10px" }}
              disablePortal
              options={http_Request}
              defaultValue={http_Request[0]}
              getOptionLabel={(option: any) => option.name ?? option}
              onChange={(_e, value: any | null) =>
                value !== null ? setMethod(value?.name) : ""
              }
              isOptionEqualToValue={(option: any, value: any) =>
                option?.name === value?.name
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  // error={Boolean(
                  //    props.formik.touched.users_group &&
                  //    props.formik.errors.users_group
                  // )}
                  // fullWidth
                  name="data_set"
                  // helperText={
                  //    props.formik.touched.users_group &&
                  //    props.formik.errors.users_group
                  // }
                  // onBlur={props.formik.handleBlur}
                  // onChange={props.formik.handleChange}
                  variant="outlined"
                />
              )}
            />
            <Autocomplete
              fullWidth
              sx={{ backgroundColor: "white", borderRadius: "10px" }}
              disablePortal
              id="data_set"
              options={version}
              defaultValue={version[0]}
              disabled={true}
              getOptionLabel={(option: any) => option.name ?? option}
              isOptionEqualToValue={(option: any, value: any) =>
                option.name === value.name
              }
              // onChange={(e, value: any) =>
              // (props.formik.values.users_group =
              //    value?.code || "")
              // }
              //   onChange={(e, value) => {
              //     // console.log(value);
              //     //  alert("e " && value);
              //     console.log(
              //       "e ",
              //       props.formik.values.users_group
              //     );
              //     //  props.formik.setFieldValue(
              //     //    "users_group",
              //     //    value !== null
              //     //      ? value
              //     //      : props.formik.initialValues.value
              //     //  );
              //   }}
              // value={props.formik.values.users_group || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // error={Boolean(
                  //    props.formik.touched.users_group &&
                  //    props.formik.errors.users_group
                  // )}
                  // fullWidth
                  name="data_set"
                  // helperText={
                  //    props.formik.touched.users_group &&
                  //    props.formik.errors.users_group
                  // }
                  // onBlur={props.formik.handleBlur}
                  // onChange={props.formik.handleChange}
                  variant="outlined"
                />
              )}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} md={8} xl={9}>
          <Stack spacing={2} direction="row">
            {path && (
              <TextField
                sx={{ backgroundColor: "white", borderRadius: "10px", m: 0 }}
                onChange={(e: any) => {
                  // handleQueryChange(e);
                  // console.log("val query ", e.target.value);
                }}
                fullWidth
                margin="normal"
                variant="outlined"
                value={pathUrl}
                // defaultValue={pathUrl}
              />
            )}
            <Button
              color="primary"
              size="large"
              type="submit"
              variant="contained"
              sx={{ paddingX: 3 }}
              onClick={() => handleSend()}
            >
              {t("SEND")}
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2 } }}>
        <Grid item xs={12} md={4} xl={3}>
          <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: { xs: 2 } }}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Stack spacing={1} direction="row">
                        {getAllAPI && (
                          <Autocomplete
                            fullWidth
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "10px",
                            }}
                            disablePortal
                            id="data_set"
                            options={getAllAPI}
                            defaultValue={getAllAPI[0]}
                            getOptionLabel={(option: any) =>
                              option?.name ? option?.name : "-"
                            }
                            onChange={(_e: any, value: any | null) => {
                              setAPIKey(value?.token);
                              console.log("select key ", value?.token);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                // error={Boolean(
                                //    props.formik.touched.users_group &&
                                //    props.formik.errors.users_group
                                // )}
                                // fullWidth
                                sx={{ m: 0 }}
                                margin="normal"
                                name="data_set"
                                label={t("API key")}
                                // helperText={
                                //    props.formik.touched.users_group &&
                                //    props.formik.errors.users_group
                                // }
                                // onBlur={props.formik.handleBlur}
                                // onChange={props.formik.handleChange}
                                variant="outlined"
                              />
                            )}
                          />
                        )}

                        <Tooltip title={t("COPY")} arrow>
                          <IconButton
                            color="primary"
                            sx={{ paddingX: 2 }}
                            onClick={() => {
                              copyToClipboard(apiKey);
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <NextLink href={AuthURL.MANAGE_API_KEY}>
                        <Button
                          component="a"
                          size="large"
                          variant="contained"
                          fullWidth
                        >
                          {t("CREATE_NEW_API_KEY")}
                        </Button>
                      </NextLink>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Hidden mdDown>
              <Grid item xs={12} sx={{ height: "663px" }}>
                <Sidebar
                  id={router.query?.id}
                  list={router.query?.list}
                  onClick={(e) => {
                    setPathData(waterUrl + e);
                    // handleSelect(e);
                  }}
                />
              </Grid>
            </Hidden>
          </Grid>
        </Grid>

        <Grid item xs={12} md={8} xl={9}>
          <Box
            display="flex"
            alignItems="center"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent={{ xs: "center", sm: "space-between" }}
            pb={3}
          >
            <TabsWrapper
              onChange={(_e, value) => setTab(value)}
              scrollButtons="auto"
              textColor="secondary"
              value={tab}
              variant="scrollable"
            >
              {["Parameter"] &&
                ["Parameter"].map((val, index) => (
                  <Tab key={index} value={val} label={val} />
                ))}
            </TabsWrapper>
          </Box>

          <Grid container spacing={2}>
            {tab === "Parameter" && (
              <Grid item xs={12}>
                <Card
                  sx={{
                    height: "301px",
                    overflowY: "scroll",
                    padding: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    {parameter &&
                      parameter.map((_val: any, index: any, row: any) => {
                        return (
                          <>
                            <Grid item xs={12} sm={5} md={5}>
                              <TextField
                                fullWidth
                                label={t("Key")}
                                name={`parameter${index}`}
                                value={formik.values.parameter[index]}
                                onChange={async (e) => {
                                  formik.setFieldValue(
                                    `parameter[${index}]`,
                                    e.target.value
                                  );
                                }}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item xs={12} sm={5} md={5}>
                              <TextField
                                fullWidth
                                label={t("Value")}
                                value={formik.values.parameterValue[index]}
                                onChange={(e) => {
                                  formik.setFieldValue(
                                    `parameterValue[${index}]`,
                                    e.target.value
                                  );
                                  parameterValue[index] = e.target.value;
                                }}
                                variant="outlined"
                              />
                            </Grid>

                            <Grid item>
                              {index + 1 === row.length && (
                                <Button
                                  style={{
                                    marginTop: 7,
                                    maxWidth: "30px",
                                    maxHeight: "30px",
                                    minWidth: "30px",
                                    minHeight: "30px",
                                  }}
                                  variant="contained"
                                  onClick={() => {
                                    formik.values.parameter.push(""),
                                      formik.values.parameterValue.push(""),
                                      setParameter([...parameter, ""]),
                                      setParameterValue([
                                        ...parameterValue,
                                        "",
                                      ]);
                                  }}
                                  color="success"
                                  size="small"
                                  sx={{
                                    p: 2,
                                    mr: 2,
                                    borderRadius: "50%",
                                  }}
                                >
                                  <AddIcon />
                                </Button>
                              )}

                              {index + 1 !== row.length && (
                                <Button
                                  color="error"
                                  size="small"
                                  variant="contained"
                                  style={{
                                    marginTop: 7,
                                    maxWidth: "30px",
                                    maxHeight: "30px",
                                    minWidth: "30px",
                                    minHeight: "30px",
                                  }}
                                  sx={{
                                    p: 2,
                                    mr: 2,
                                    borderRadius: "50%",
                                  }}
                                  onClick={() => {
                                    setParameter(
                                      parameter.filter(
                                        (_val, index2) => index2 != index
                                      )
                                    );
                                    setParameterValue(
                                      parameterValue.filter(
                                        (_val, index2) => index2 != index
                                      )
                                    );

                                    formik.setFieldValue(
                                      "parameter",
                                      formik.values.parameter.filter(
                                        (_val, index2) => index2 != index
                                      )
                                    );

                                    formik.setFieldValue(
                                      "parameterValue",
                                      formik.values.parameterValue.filter(
                                        (_val, index2) => index2 != index
                                      )
                                    );

                                    // formik.initialValues.parameter =
                                    //   parameter.filter(
                                    //     (_val, index2) => index2 != index
                                    //   );

                                    // formik.initialValues.parameterValue =
                                    //   parameterValue.filter(
                                    //     (_val, index2) => index2 != index
                                    //   );

                                    // setParameter([
                                    //   ...parameter.slice(0, index),
                                    //   ...parameter.slice(
                                    //     index + 1,
                                    //     parameter.length
                                    //   ),
                                    // ]),
                                    //   setParameterValue([
                                    //     ...parameterValue.slice(0, index),
                                    //     ...parameterValue.slice(
                                    //       index + 1,
                                    //       parameterValue.length
                                    //     ),
                                    //   ]);
                                  }}
                                >
                                  <DeleteIcon />
                                </Button>
                              )}
                            </Grid>
                          </>
                        );
                      })}
                  </Grid>
                </Card>
              </Grid>
            )}
            {/* : (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ paddingX: 0, paddingBottom: "16px" }}>
                    <MonacoEditor
                              height="200px"
                              language="json"
                              value={json}
                              options={options}
                              onChange={onChange}
                            />
                          </CardContent>
                        </Card>
                      </Grid>
                    ) */}

            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ paddingX: 0 }}>
                  <MonacoEditor
                    // theme="vs-dark"
                    height={tab === "Parameter" ? "400px" : "683px"}
                    language="json"
                    value={JSON.stringify(bodyJson, null, 4)}
                    options={optionsResponse}
                    onChange={onChange}
                    // editorDidMount={handleEditorDidMount}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Hidden mdUp>
        <DrawerWrapperMobile
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={mobileOpen}
          onClose={handleDrawerToggle}
        >
          {/* {sidebarContent(handleSelect)} */}
          <Scrollbar>
            <Sidebar></Sidebar>
          </Scrollbar>
        </DrawerWrapperMobile>
      </Hidden>
    </>
  );
};

export default Results;
