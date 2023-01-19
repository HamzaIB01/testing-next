import { useState, Children, useEffect, useCallback } from "react";
import {
  Typography,
  Container,
  Button,
  Card,
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Avatar,
  styled,
  TextField,
  Slide,
} from "@mui/material";
import type { ReactElement } from "react";
import BaseLayout from "src/layouts/BaseLayout";
import {
  Form,
  Formik,
  FormikConfig,
  FormikValues,
} from "formik";
import CloseIcon from "@mui/icons-material/Close";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Guest } from "src/components/Guest";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import Logo from "src/components/LogoSign";
import { useRouter } from "next/router";
import { PersonalOrganizationComponent } from "@/components/PersonalComponents/PersonalOrganizationComponents";
import { StepIconProps } from "@mui/material/StepIcon";
import { Check } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { AuthURL } from "@/constants";
import { decryptData } from "@/utils/crypto";
import { uploadFileApi } from "@/actions/uploadFile.action";
import React from "react";
import SimpleBackdrop from "@/components/Backdrop";
import { useSnackbar } from "notistack";

const MainContent = styled(Box)(
  () => `
    height: 100%;
    overflow: auto;
    flex: 1;
`
);

const BoxActions = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]}
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.success};
      margin-left: auto;
      margin-right: auto;

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.error};
      margin-left: auto;
      margin-right: auto;

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);
const AvatarWarning = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.main};
      color: ${theme.palette.warning.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.warning};
      margin-left: auto;
      margin-right: auto;

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
      border-radius: ${theme.general.borderRadius};
      padding: ${theme.spacing(2)};
      background: ${theme.colors.alpha.black[5]};
      border: 1px dashed ${theme.colors.alpha.black[30]};
      outline: none;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: ${theme.transitions.create(["border", "background"])};
      min-height: 320px;
  
      &:hover {
        background: ${theme.colors.alpha.white[50]};
        border-color: ${theme.colors.primary.main};
      }
  `
);

const sleep = (time: number) => new Promise((acc) => setTimeout(acc, time));

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

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed } = props;

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }}>
      {completed && <Check sx={{ fontSize: "1.2rem" }} />}
    </ColorlibStepIconRoot>
  );
}

function Register() {
  const { t }: { t: any } = useTranslation();
  // const [openAlert, setOpenAlert] = useState(true);
  var inputFile = [];
  // const [filtersIdCard, setFiltersIdCard] = useState({
  //   status: 1,
  // });
  // const [filters, setFilters] = useState({
  //   status: 1,
  // });
  const router = useRouter();
  const [status, setStatus] = useState("PENDING");
  const [comments, setComments] = useState("");
  const [uuid, setUUID] = useState("");

  const initialValues = {
    file: [],
    detail: status,
    user_uuid: uuid,
    setBackdrops: false,
  };

  useEffect(() => {
    setOpenBackdrop(initialValues.setBackdrops);
  }, [initialValues.setBackdrops]);

  const valueStatus = useCallback(async () => {
    try {
      const value = await decryptData(router.query.value as string);
      setStatus(JSON.parse(value).flag.status_flag);
      setUUID(JSON.parse(value).uuid);
      setComments(JSON.parse(value).comment);
    } catch (err) {
      setStatus("");
    }
  }, []);

  useEffect(() => {
    valueStatus();
  }, []);

  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Head>
        <title>{t("CHECK_A_REGISTATION")}</title>
      </Head>
      <MainContent>
        <Container
          sx={{
            my: 4,
          }}
          maxWidth="md"
        >
          <Logo />
          <Card
            sx={{
              mt: 3,
              pt: 4,
            }}
          >
            <Box sx={{ display: "flex" }} px={4}>
              <Avatar
                sx={{
                  width: 68,
                  height: 68,
                  mb: 2,
                  mr: 3,
                }}
                src=""
              />
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1,
                  }}
                >
                  {t("CHECK_A_REGISTATION")}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3,
                  }}
                >
                  {t("REQUEST_CREATE_NEW_USER")}
                </Typography>
              </Box>
            </Box>
            <FormikStepper
              enableReinitialize
              initialValues={initialValues}
              onSubmit={async (_values) => {
                await sleep(3000);
              }}
            >
              <FormikStep
                label={t("SEND_REQUEST_CREATE_NEW_USER")}
                onChange={(e) => setOpenBackdrop(e)}
              />
              <FormikStep
                label={t("WAITING_FOR_APPROVAL")}
                onChange={(e) => setOpenBackdrop(e)}
              />
              <FormikStep
                label={t("CHECK_APPROVE")}
                onChange={(e) => setOpenBackdrop(e)}
              >
                {status && (
                  <Box px={4} py={4}>
                    {status === String("ACTIVE") ? (
                      <Container maxWidth="md">
                        <AvatarSuccess>
                          <CheckTwoToneIcon />
                        </AvatarSuccess>

                        <Typography
                          align="center"
                          sx={{
                            pt: 5,
                            pb: 4,
                            lineHeight: 1.5,
                            px: 10,
                          }}
                          variant="h2"
                        >
                          {t("ํYOU_CAN_NOW_UES_THE_SYSTEM")}
                        </Typography>
                      </Container>
                    ) : status === String("SUSPENDED") ? (
                      <>
                        <Container maxWidth="md">
                          <AvatarError>
                            <CloseIcon />
                          </AvatarError>

                          <Typography
                            align="center"
                            sx={{
                              pt: 5,
                              pb: 4,
                              lineHeight: 1.5,
                              px: 10,
                            }}
                            variant="h2"
                          >
                            {t("ํYOU_DID_NOT_PASS_THE_VERIFICATION")}
                          </Typography>
                        </Container>

                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="thai_name"
                              defaultValue={comments}
                              disabled={true}
                              placeholder={t(
                                "ํYOU_DID_NOT_PASS_THE_VERIFICATION_BECAUSE_YOU_ARE_NOT_AN_MOU"
                              )}
                              variant="outlined"
                              rows={8}
                              multiline
                            />
                          </Grid>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Container maxWidth="md">
                          <AvatarWarning>
                            <WarningAmberIcon />
                          </AvatarWarning>

                          <Typography
                            align="center"
                            sx={{
                              pt: 5,
                              pb: 4,
                              lineHeight: 1.5,
                              px: 10,
                            }}
                            variant="h2"
                          >
                            {t("REQUEST_ADDITIONAL_DOCUMENTS")}
                          </Typography>
                        </Container>

                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              name="thai_name"
                              defaultValue={comments}
                              disabled={true}
                              variant="outlined"
                              rows={8}
                              multiline
                            />
                          </Grid>

                          <Grid item xs={12}>
                            <PersonalOrganizationComponent
                              registation={false}
                              BoxUploadWrapper={BoxUploadWrapper}
                              request_more_file={"true"}
                              getInitial={initialValues}
                              file={inputFile}
                            />
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </Box>
                )}
              </FormikStep>
            </FormikStepper>
          </Card>
        </Container>
      </MainContent>
    </>
  );
}

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
  onChange: (string) => void;
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
  const [step, setStep] = useState(2);
  const currentChild = childrenArray[step == 1 ? step + 1 : step];
  const [completed, setCompleted] = useState(false);
  const { t }: { t: any } = useTranslation();

  function isLastStep() {
    return step === childrenArray.length - 2;
  }

  const router = useRouter();
  const { demo } = router.query;
  const [user_uuid, setUser_uuid] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const valueStatus = useCallback(async () => {
    try {
      const value = await decryptData(router.query.value as string);
      // setStatus(JSON.parse(value).flag.status_flag);

      setUser_uuid(JSON.parse(value).user_uuid);
      if (JSON.parse(value).flag.status_flag === "ACTIVE") {
        setCompleted(false);
        setStep(2);
      } else {
        setCompleted(false);
        setStep(1);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  // useEffect(() => {
  //   if (registerReducer.result && !registerReducer.isError) {
  //     setCompleted(true);
  //     setStep((s) => s + 1);
  //   }
  // }, [registerReducer]);

  useEffect(() => {
    valueStatus();
    // if (registerReducer.result && !registerReducer.isError) {
    // }
  }, []);

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          // await props.onSubmit(values, helpers);
          // const result = await uploadFileApi.uploadFile(null, formData);
          console.log("values ", values);
          // setCompleted(true);
          // setStep((s) => s + 1);
        } else {
          setStep((s) => s + 1);
          helpers.setTouched({});
        }
      }}
    >
      {() => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step == 1 ? step + 1 : step}>
            {childrenArray.map((child, index) => (
              <Step key={child.props.label} completed={step >= index}>
                {step >= index ? (
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
              p={4}
              display="flex"
              alignItems="center"
              justifyContent="end"
            >
              {props?.initialValues?.detail === String("PENDING") && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={async () => {
                    currentChild.props.onChange(true);

                    let formData = new FormData();
                    props.initialValues.file.map((val) => {
                      formData.append("files", val);
                    });

                    try {
                      const result = await uploadFileApi.uploadFile(
                        props.initialValues.user_uuid,
                        formData
                      );
                      currentChild.props.onChange(false);

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

                      } else {
                        enqueueSnackbar(t(`${result.description.message}`), {
                          variant: "error",
                          anchorOrigin: {
                            vertical: "top",
                            horizontal: "right",
                          },
                          autoHideDuration: 4000,
                          TransitionComponent: Slide,
                        });
                      }

                      formData.delete("files");
                      props.initialValues.file = [];

                    } catch (error) {
                      currentChild.props.onChange(false);

                      if (error.message) {
                        enqueueSnackbar(t(`${error.message}`), {
                          variant: "error",
                          anchorOrigin: {
                            vertical: "top",
                            horizontal: "right",
                          },
                          autoHideDuration: 4000,
                          TransitionComponent: Slide,
                        });
                      } else {
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
                    }
                  }}
                >
                  {t("อัพโหลดไฟล์")}
                </Button>
              )}

              <Button variant="contained" sx={{ ml: 2 }} href={AuthURL.SIGN_IN}>
                {t("BACK_TO_LOGIN")}
              </Button>
            </BoxActions>
          ) : null}
        </Form>
      )}
    </Formik>
  );
}

Register.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default Register;
