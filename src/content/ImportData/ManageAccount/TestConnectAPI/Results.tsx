import {
  FC,
  useState,
  Children,
  ReactElement,
  ChangeEvent,
  useEffect,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Grid,
  styled,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Form, Formik, FormikConfig, FormikValues } from "formik";
import { useRouter } from "next/router";
import { StepIconProps } from "@mui/material/StepIcon";
import { Check } from "@mui/icons-material";
import MonacoEditor from "@monaco-editor/react";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import { TableComponent, TableType } from "@/components/TableComponent";
import HistoryIcon from "@mui/icons-material/History";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { decryptData } from "@/utils/crypto";
import { apiKeyApi } from "@/actions/api.key.action";
import { format } from "date-fns";
import SimpleBackdrop from "@/components/Backdrop";
import React from "react";
import { waterDatasetApi } from "@/actions/water.dataset.action";
import { DatasetImportLogResult } from "@/types/water.type";

const BoxActions = styled(Box)(
  ({ theme }) => `
      background: ${theme.colors.alpha.black[5]}
  `
);

// const AvatarSuccess = styled(Avatar)(
//   ({ theme }) => `
//         background-color: ${theme.colors.success.main};
//         color: ${theme.palette.success.contrastText};
//         width: ${theme.spacing(12)};
//         height: ${theme.spacing(12)};
//         box-shadow: ${theme.colors.shadows.success};
//         margin-left: auto;
//         margin-right: auto;

//         .MuiSvgIcon-root {
//           font-size: ${theme.typography.pxToRem(45)};
//         }
//   `
// );

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 16,
  borderRadius: 50,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    // backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

const AvatarWrapperSuccess = styled(Avatar)(
  ({ theme }) => `
       width: ${theme.spacing(7)};
       height: ${theme.spacing(7)};
       border-radius: ${theme.general.borderRadius};
       background-color: ${theme.colors.success.lighter};
       color:  ${theme.colors.success.main};
       margin-bottom: ${theme.spacing(3)};
 `
);

const AvatarWrapperWarning = styled(Avatar)(
  ({ theme }) => `
       width: ${theme.spacing(7)};
       height: ${theme.spacing(7)};
       border-radius: ${theme.general.borderRadius};
       background-color: ${theme.colors.warning.lighter};
       color:  ${theme.colors.success.main};
       margin-bottom: ${theme.spacing(3)};
 `
);

const AvatarWrapperError = styled(Avatar)(
  ({ theme }) => `
       width: ${theme.spacing(7)};
       height: ${theme.spacing(7)};
       border-radius: ${theme.general.borderRadius};
       background-color: ${theme.colors.error.lighter};
       color:  ${theme.colors.success.main};
       margin-bottom: ${theme.spacing(3)};
 `
);

const AvatarWrapperInfo = styled(Avatar)(
  ({ theme }) => `
       width: ${theme.spacing(7)};
       height: ${theme.spacing(7)};
       border-radius: ${theme.general.borderRadius};
       background-color: ${theme.colors.info.lighter};
       color:  ${theme.colors.success.main};
       margin-bottom: ${theme.spacing(3)};
 `
);

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

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 24,
  height: 24,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    background: theme.colors.primary.main,
  }),
  ...(ownerState.completed && {
    background: theme.colors.success.main,
  }),
}));

// interface ResultsProps {
//   users: User[];
// }

interface Filters {
  role?: string;
  type: TableType;
}

// const applyFilters = (
//   users: User[],
//   query: string,
//   filters: Filters
// ): User[] => {
//   return users.filter((user) => {
//     let matches = true;

//     if (query) {
//       const properties = ["email", "name", "username"];
//       let containsQuery = false;

//       properties.forEach((property) => {
//         if (user[property].toLowerCase().includes(query.toLowerCase())) {
//           containsQuery = true;
//         }
//       });

//       if (filters.role && user.role !== filters.role) {
//         matches = false;
//       }

//       if (!containsQuery) {
//         matches = false;
//       }
//     }

//     Object.keys(filters).forEach((key) => {
//       const value = filters[key];

//       if (value && user[key] !== value) {
//         // matches = false;
//       }
//     });

//     return matches;
//   });
// };

// const applyPagination = (
//   users: User[],
//   page: number,
//   limit: number
// ): User[] => {
//   return users.slice(page * limit, page * limit + limit);
// };

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed } = props;

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }}>
      {completed && <Check sx={{ fontSize: "1.2rem" }} />}
    </ColorlibStepIconRoot>
  );
}

export enum LinkType {
  TEST_CONNECT_API,
  TEST_CONNECT_API_WITH_STANDARD,
}

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const [openAlert, setOpenAlert] = useState(true);
  const router = useRouter();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    role: null,
    type: TableType.TEST_CONNECT_API,
  });
  const [connectData, setConnectData] = useState<any>(
    JSON.parse(decryptData(atob(String(router.query.connectData)))).user
  );
  const dateNow = format(new Date(), "yyyy-MM-ddTHH:mm:ss");
  const startDate = dateNow.slice(0, 10) + "T" + dateNow.slice(23);
  const endDate = dateNow.slice(0, 10) + "T" + dateNow.slice(23);
  const [path, setPath] = useState<string>("");
  // const [path, setPath] = useState<string>(
  //   `${connectData.protocol.toLowerCase()}://${connectData.host}${
  //     connectData.route
  //   }${
  //     connectData.parameter_type === "QUERY"
  //       ? `?latest=${connectData.parameter.latest}&startDatetime=${startDate}&endDatetime=${endDate}&interval=${connectData.parameter.interval}`
  //       : ``
  //   }`
  // );

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage - 1);
  };

  const handlePageChangeTable = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
  };

  // const filteredUsers = applyFilters(users, query, filters);
  // const paginatedUsers = applyPagination(filteredUsers, page, limit);

  // const mockJSON = {
  //   startDatetime: "2022-01-01T09:00:00",
  //   endDatetime: "2022-01-01T09:30:00",
  //   interval: "c-5",
  // };

  const code = JSON.stringify(connectData.parameter, null, 4);

  const onChange = (newValue: any, e: any) => {
    console.log("element", e);
    console.log("onChange", newValue);
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

  const codeResponse = JSON.stringify(connectData.parameter, null, 4);
  // const codeResponse = JSON.stringify(connectData.parameter, null, 4);

  const handResetValue = (editor) => {
    console.log(editor);
  };

  const mockTitle = [
    {
      name: "มีทั้งหมด",
      num: 1000,
      linearProgress: 38,
    },
    {
      name: "ผ่าน QC",
      num: 800,
      linearProgress: 60,
    },
    {
      name: "ไม่ผ่าน QC",
      num: 4500,
      linearProgress: 80,
    },
  ];

  const mockData = {
    pagination: { page: 1, total_items: 1, total_pages: 1 },
    content: [
      {
        import_data: 2.1,
        category: { name: { th: "G09006" } },
        station: { station_code: "1032662" },
        date: "2022-01-01T09:30:30",
        status: "ผ่าน QC",
        dataset: {},
      },
    ],
  };

  const type = 1;

  // useEffect(() => {
  //   // setPath(
  //   //   `${connectData.protocol.toLowerCase()}://${connectData.host}${
  //   //     connectData.route
  //   //   }`
  //   // );
  //   // console.log("path ", `${connectData.protocol.toLowerCase()}://${connectData.host}${connectData.route}` );
  //   console.log("connectdata ", connectData);
  // }, [connectData]);

  const [bodyJson, setBodyJson] = useState<string | null>();
  const [datasets, setDatasets] = useState<DatasetImportLogResult>();
  // const [jobData, setImportJobData] = useState<any[]>(jobsData);

  const getImportLog = useCallback(async (import_log_uuid) => {
    setOpenBackdrop(true);
    try {
      const reportResult = await waterDatasetApi.getImport_log(import_log_uuid);
      setBodyJson(JSON.parse(reportResult));
      setOpenBackdrop(false);
    } catch (err) {
      // setReportData(null);

      try {
        JSON.stringify(JSON.parse(err), null, 2);
      } catch (error) {
        // setBodyJson(err);
        setBodyJson(err);
      }

      setOpenBackdrop(false);
      // alert(err);
    }
  }, []);

  // String(limit * page + 1 - 1),
  // const callDataset = () => {

  // }

  const getDatasetImportLog = useCallback(
    async (import_log_uuid, limit, offset) => {
      setOpenBackdrop(true);
      try {
        const reportResult = await waterDatasetApi.getDatasetImport_log(
          import_log_uuid,
          limit,
          offset
        );
        // console.log("dormant ", reportResult);
        // setReportData(reportResult);
        setDatasets(reportResult);
        setOpenBackdrop(false);
      } catch (err) {
        alert(err);
        // setReportData(null);
        setDatasets(null);
        setOpenBackdrop(false);
        // alert(err);
      }
    },
    []
  );

  useEffect(() => {
    getImportLog(connectData.uuid);
    // getDatasetImportLog(connectData.uuid);
    // console.log("useEffect ", connectData);
    // setBodyJson(["mockResponseJSON"]);
    // fetchRequest();
  }, []);

  useEffect(() => {
    // getImportLog(connectData.uuid);
    getDatasetImportLog(connectData.uuid, limit, limit * page + 1 - 1);
    // console.log("useEffect ", connectData);
    // setBodyJson(["mockResponseJSON"]);
    // fetchRequest();
  }, [limit, page]);

  const handleSend = async () => {
    if (connectData.api_key.length <= 1) {
      alert("ไม่พบ API key");
    } else {
      setOpenBackdrop(true);
      try {
        setBodyJson("");

        // if (tab === "Parameter") {
        //   var data = "";
        //   parameterValue.map((val: any, index: any) => {
        //     data += `${parameter[index]}=${val}&`;
        //   });
        // } else {
        // }

        // const dateNow = format(new Date(), "yyyy-MM-ddTHH:mm:ss");

        // const startDate = dateNow.slice(0, 10) + "T" + dateNow.slice(23);
        // const endDate = dateNow.slice(0, 10) + "T" + dateNow.slice(23);

        const pathUrl = `${path}`;

        const result = await apiKeyApi.getPostmane(
          connectData.http_request,
          null,
          pathUrl,
          connectData.api_key
        );
        setOpenBackdrop(false);

        // console.log("result ", result);
        setBodyJson(result);
      } catch (err) {
        // console.log(err);
        alert(err);
        setBodyJson(err);
        setOpenBackdrop(false);
        // alert(err);
      }
    }
  };

  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const iConBox = (name: string): JSX.Element => {
    {
      if (name === "ผ่าน QC") {
        return (
          <AvatarWrapperSuccess>
            <CheckCircleOutlineIcon />
          </AvatarWrapperSuccess>
        );
      } else if (name === "ไม่ผ่าน QC") {
        return (
          <AvatarWrapperWarning>
            <ErrorOutlineIcon color="warning" />
          </AvatarWrapperWarning>
        );
      } else if (name === "ผิดรูปแบบ") {
        return (
          <AvatarWrapperError>
            <HighlightOffIcon color="error" />
          </AvatarWrapperError>
        );
      } else {
        return (
          <AvatarWrapperInfo>
            <MoveToInboxIcon color="info" />
          </AvatarWrapperInfo>
        );
      }
    }
  };

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <FormikStepper
        initialValues={{
          first_name: "",
          last_name: "",
          terms: true,
          promo: true,
          password: "",
          password_confirm: "",
          email: "",
          phone: "",
          company_name: "",
          company_size: "",
          company_role: "",
        }}
        onSubmit={async (values) => {
          // await sleep(3000);
          console.log(values);
        }}
      >
        <FormikStep
          // validationSchema={Yup.object().shape({})}
          label={t("CONNECTION_TEST")}
        >
          <Grid container spacing={3} pt={3}>
            {/* <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={2} direction="row">
                    {connectData && (
                      <TextField
                        sx={{
                          backgroundColor: "white",
                          borderRadius: "10px",
                          m: 0,
                        }}
                        onChange={(e) => setPath(e.target.value)}
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        defaultValue={path}
                      />
                    )}

                    <Button
                      color="primary"
                      size="large"
                      // type="submit"
                      variant="contained"
                      sx={{ paddingX: 3 }}
                      onClick={handleSend}
                    >
                      {t("SEND")}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid> */}

            {bodyJson && !connectData.flag?.standard_data_flag && (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ paddingX: 0, paddingBottom: "16px" }}>
                    <MonacoEditor
                      // theme="vs-dark"
                      height="420px"
                      language="json"
                      // value={codeResponse}
                      value={JSON.stringify(bodyJson, null, 2)}
                      // value={
                      //   Array.isArray(bodyJson)
                      //     ? JSON.stringify(bodyJson, null, 2)
                      //     : JSON.stringify(JSON.parse(bodyJson), null, 2)
                      // }
                      options={optionsResponse}
                      onChange={onChange}
                    />
                  </CardContent>
                </Card>
              </Grid>
            )}

            {connectData.flag?.standard_data_flag && (
              <>
                <Grid item xs={12}>
                  <Card>
                    <IconButton
                      color="primary"
                      sx={{
                        display: "flex",
                        top: 8,
                        marginRight: 1.5,
                        marginLeft: "auto",
                      }}
                      onClick={(event) => handResetValue(event)}
                    >
                      <HistoryIcon fontSize="small" />
                    </IconButton>

                    <CardContent sx={{ paddingX: 0, paddingBottom: "16px" }}>
                      <MonacoEditor
                        height="200px"
                        language="json"
                        value={code}
                        options={options}
                        onChange={onChange}
                      />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6} mb={4}>
                  <Accordion defaultExpanded>
                    <AccordionSummaryWrapper
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: "#f6f8fb",
                        borderRadius: 0,
                      }}
                    >
                      <Typography variant="h5">{t("RAW_DATA")}</Typography>
                    </AccordionSummaryWrapper>

                    <AccordionDetails
                      sx={{
                        p: 4,
                        pb: 4,
                      }}
                    >
                      <MonacoEditor
                        height="200px"
                        language="json"
                        value={code}
                        options={options}
                        onChange={onChange}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                <Grid item xs={12} md={6} mb={4}>
                  <Accordion defaultExpanded>
                    <AccordionSummaryWrapper
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: "#f6f8fb",
                        borderRadius: 0,
                      }}
                    >
                      <Typography variant="h5">{t("STANDARD_DATA")}</Typography>
                    </AccordionSummaryWrapper>

                    <AccordionDetails
                      sx={{
                        p: 4,
                        pb: 4,
                      }}
                    >
                      <MonacoEditor
                        height="200px"
                        language="json"
                        value={code}
                        options={options}
                        onChange={onChange}
                      />
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </>
            )}
          </Grid>
        </FormikStep>
        <FormikStep label={t("CHECK_INFORMATION")}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
            pt={3}
          >
            {datasets &&
              mockTitle.map((value, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card
                    sx={{
                      p: 3,
                    }}
                  >
                    {iConBox(value?.name)}
                    <Typography
                      variant="h4"
                      sx={{
                        pb: 1,
                      }}
                    >
                      {value.name} {"(" + t("LIST") + ")"}
                    </Typography>
                    <Typography
                      color="text.primary"
                      variant="h2"
                      sx={{
                        pr: 0.5,
                        display: "inline-flex",
                      }}
                    >
                      {index == 0
                        ? datasets.content.total.toLocaleString() ?? "-"
                        : index == 1
                          ? datasets.content.success.toLocaleString() ?? "-"
                          : datasets.content.fail.toLocaleString() ?? "-"}
                    </Typography>
                    {/* {value.num > 3000 && (
                    <Typography
                      color="text.secondary"
                      variant="h4"
                      sx={{
                        pr: 2,
                        display: "inline-flex",
                      }}
                    >
                      /10000
                    </Typography>
                  )} */}

                    <Box pt={3}>
                      <BorderLinearProgress
                        value={
                          index == 0
                            ? Number(100) ?? 0
                            : index == 1
                              ? Number(
                                (datasets.content.success * 100) /
                                datasets.content.total
                              )
                              : Number(
                                (datasets.content.fail * 100) /
                                datasets.content.total
                              )
                        }
                        color="primary"
                        variant="determinate"
                      />
                    </Box>
                  </Card>
                </Grid>
              ))}
            <Grid item xs={12}>
              <TableComponent
                filters={filters}
                filteredUsers={datasets}
                page={page}
                limit={limit}
                paginatedUsers={datasets}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                handlePageChangeTable={handlePageChangeTable}
              // provide_source_uuid={importConfigs?.uuid}
              // onChange={(e) => onChangeDataset(e)}
              />
              {/* <TableComponent
                filters={filters}
                filteredUsers={filteredUsers}
                page={page}
                limit={limit}
                paginatedUsers={paginatedUsers}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                handlePageChangeTable={handlePageChangeTable}
              /> */}
            </Grid>
          </Grid>
        </FormikStep>
        <FormikStep label={t("SAVE_DATA")}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
            pt={3}
          >
            <Grid item xs={12}>
              <TableComponent
                filters={filters}
                // filteredUsers={filteredUsers}
                page={page}
                limit={limit}
                // paginatedUsers={paginatedUsers}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                handlePageChangeTable={handlePageChangeTable}
              />
            </Grid>

            <Grid item xs={12} display={"fleg"} justifyContent={"end"}>
              <Button variant="contained" onClick={() => router.back()}>
                {t("FINISH")}
              </Button>
            </Grid>
          </Grid>
        </FormikStep>
      </FormikStepper>
    </>
  );
};

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  const childrenArray = Children.toArray(
    children
  ) as ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  var currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  function isLastStep() {
    return step === childrenArray.length - 2;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          //  router.back();
          setCompleted(true);
          setStep((s) => s + 1);
        } else {
          // {
          //   alert("FetchData");
          // }
          setStep((s) => s + 1);
          helpers.setTouched({});
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step > index}>
                {step > index ? (
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    {child.props.label}
                  </StepLabel>
                ) : (
                  <StepLabel>{child.props.label}</StepLabel>
                )}
              </Step>
            ))}
          </Stepper>

          {currentChild}
          {!completed ? (
            <BoxActions
              py={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {step === 0 ? (
                <Button
                  variant="contained"
                  color="error"
                  type="button"
                  onClick={() => router.back()}
                >
                  {t("CANCEL")}
                </Button>
              ) : (
                <Button
                  disabled={isSubmitting || step === 0}
                  variant="contained"
                  color="error"
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                >
                  {t("GO_BACK")}
                </Button>
              )}

              {step === 0 && (
                <Button
                  // startIcon={
                  //     isSubmitting ? <CircularProgress size="1rem" /> : null
                  // }
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  {isSubmitting
                    ? t("Submitting")
                    : isLastStep()
                      ? t("SAVE_DATA")
                      : t("CHECK_INFORMATION")}
                </Button>
              )}
            </BoxActions>
          ) : null}
        </Form>
      )}
    </Formik>
  );
}

Results.propTypes = {
  // @ts-ignore
  user: PropTypes.object.isRequired,
};

export default Results;
