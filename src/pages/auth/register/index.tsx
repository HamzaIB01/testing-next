import { useState, Children, useEffect } from "react";
import {
  Typography,
  Container,
  Button,
  Card,
  CircularProgress,
  Box,
  Step,
  StepLabel,
  Stepper,
  Collapse,
  Alert,
  Avatar,
  IconButton,
  styled,
  TextField as TextFieldMUI,
  Slide,
} from "@mui/material";
import type { ReactElement } from "react";
import BaseLayout from "src/layouts/BaseLayout";
import { Form, Formik, FormikConfig, FormikValues } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import { Guest } from "src/components/Guest";
import Link from "src/components/Link";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import Logo from "src/components/LogoSign";
import { useRouter } from "next/router";
import { PersonalComponent } from "@/components/PersonalComponents/PersonalComponents";
import { PersonalContactComponent } from "@/components/PersonalComponents/PersonalContactComponents";
import { PersonalOrganizationComponent } from "@/components/PersonalComponents/PersonalOrganizationComponents";
import { StepIconProps } from "@mui/material/StepIcon";
import { Check } from "@mui/icons-material";
import { format } from "date-fns";
import { authApi } from "@/actions/login.action";
import { ValidateFirstName } from "@/components/Validations/FirstName.validation";
import { ValidateLastName } from "@/components/Validations/LastName.validation";
import { ValidateCitizenNumber } from "@/components/Validations/CitizenNumber.validation";
import { ValidateLaserCode } from "@/components/Validations/LaserCode.validation";
import { ValidateBirthDate } from "@/components/Validations/BirthDate.validation";
import { ValidatePhoneNumber } from "@/components/Validations/PhoneNumber.validation";
import { ValidateEmail } from "@/components/Validations/Email.validation";
import { ValidateTerms } from "@/components/Validations/Terms.validation";
import { AuthURL, PAGE } from "@/constants";
import { masterDataApi } from "@/actions/masterdata.action";
import { uploadFileApi } from "@/actions/uploadFile.action";
import React from "react";
import { registerApi } from "@/actions/register.action";
import { ValidatePassport } from "@/components/Validations/Passport.validation";
import { ValidateDepartment } from "@/components/Validations/Department.validation";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";

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
  const [openAlert, setOpenAlert] = useState(true);
  const [step, setStep] = useState(0);
  const [filtersIdCard, setFiltersIdCard] = useState({
    status: 1,
  });
  var inputFile = [];

  // Import validate
  const first_name = ValidateFirstName();
  const last_name = ValidateLastName();
  const citizen_number = ValidateCitizenNumber();
  const passport = ValidatePassport();
  const laser_code = ValidateLaserCode();
  // const birth_date = ValidateBirthDate();
  const phone_number = ValidatePhoneNumber();
  const email = ValidateEmail();
  const department_uuid = ValidateDepartment();
  // const terms = ValidateTerms();

  const initialValues = {
    prefix_id: 1,
    first_name: "",
    last_name: "",
    citizen_number: "",
    passport: "",
    laser_code: "",
    birth_date: format(new Date(), "yyyy-MM-dd"),
    people_type: 1,
    email: "",
    phone_number: "",
    department_uuid: "",
    nationality_id: 206,
    role_id: [
      {
        id: 1,
      },
    ],
    terms: true,
    file: [],
    nationality: "",
  };

  const initialValuesOrganization = {
    department_uuid: "",
    file: [],
  };

  const [body_type, setBodyType] = useState({});

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      ...first_name,
      ...last_name,
      ...body_type,
      ...email,
      ...phone_number,
    }),
    onSubmit: async (values) => {
      console.log("submit import config ", values);
    },
  });

  const formikOrganization = useFormik({
    initialValues: initialValuesOrganization,
    validationSchema: Yup.object({
      ...department_uuid,
    }),
    onSubmit: async (values) => {
      console.log("submit import config ", values);
    },
  });

  useEffect(() => {
    // alert("type");
    if (formik.values.people_type === 1) {
      setBodyType({
        ...citizen_number,
        ...laser_code,
      });
    } else {
      setBodyType({
        ...passport,
        nationality: Yup.string().required(
          t("PLEASE_ENTER") + t("NATIONALITY")
        ),
      });
    }
  }, [formik.values.people_type]);

  const [masterData, setmMsterData] = useState<any[]>([]);

  const getMasterData = async () => {
    try {
      const result = await masterDataApi.getMasterDataWater("departments");
      setmMsterData(result);
    } catch (error) {
      setmMsterData([]);
    }
  };

  useEffect(() => {
    getMasterData();
  }, []);

  const [citizenNumberType, setCitizenNumberType] = useState(
    initialValues?.people_type ?? {
      id: null,
      name: "",
    }
  );

  const [birthDate, setBirthDate] = useState(initialValues?.birth_date ?? "-");

  const [value, setValue] = useState<Date | null>(
    initialValues?.birth_date ? new Date(initialValues?.birth_date) : new Date()
  );

  const handleChange = (newValue: Date | null) => {
    const formattedDate = format(newValue, "yyyy-MM-dd");
    setBirthDate(formattedDate);
    initialValues.birth_date = formattedDate;
    setValue(newValue);
  };

  return (
    <>
      <Head>
        <title>
          {t("REGISTER")} - {t("HYDRO_INFORMATION_INSTITUTE_HII")}
        </title>
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
                  {t("REQUEST_CREATE_NEW_USER")}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3,
                  }}
                >
                  {t("COMPLETE_INFORMATION_SPECIFIED")}
                </Typography>
              </Box>
            </Box>

            <FormikStepper
              enableReinitialize
              initialValues={formik.initialValues}
              onSubmit={async (_values) => {
                await sleep(3000);
              }}
            >
              <FormikStep
                validationSchema={Yup.object().shape({
                  // ...first_name,
                  // ...last_name,
                  // ...body_type,
                  // ...birth_date,
                  // ...phone_number,
                  // ...email,
                  // ...terms,
                })}
                formik={formik}
                formikOrganization={formikOrganization}
                step={step}
                label={t("PERSONAL_INFORMATION")}
              >
                <Box p={4}>
                  <PersonalComponent
                    page={PAGE.REGISTER}
                    title={t("PLEASE_ENTER_PERSONAL_INFORMATION")}
                    hidden={true}
                    formik={formik}
                  />
                  <PersonalContactComponent
                    page={PAGE.REGISTER}
                    title={t("PLEASE_ENTER_CONTACT_INFORMATION")}
                    leftFieldTitle={t("EMAIL")}
                    rightFieldTitle={t("PHONE_NUMBER")}
                    formik={formik}
                  />
                </Box>
              </FormikStep>

              <FormikStep
                validationSchema={Yup.object().shape({
                  // ...department_uuid,
                })}
                formik={formik}
                formikOrganization={formikOrganization}
                step={step}
                label={t("ORGANIZATION_INFORMATION")}
              >
                <Box p={4}>
                  {masterData && department_uuid && (
                    <PersonalOrganizationComponent
                      page={PAGE.REGISTER}
                      title={t("PLEASE_ENTER_ORGANIZATIONS_INFORMATION")}
                      BoxUploadWrapper={BoxUploadWrapper}
                      masterData={masterData}
                      file={inputFile}
                      formik={formikOrganization}
                    />
                  )}
                </Box>
              </FormikStep>

              <FormikStep
                formik={formik}
                formikOrganization={formikOrganization}
                step={step}
                label={t("PENDING_APPROVE")}
              >
                <Box px={4} py={8}>
                  <Container maxWidth="sm">
                    <AvatarSuccess>
                      <CheckTwoToneIcon />
                    </AvatarSuccess>
                    <Collapse in={openAlert}>
                      <Alert
                        sx={{
                          mt: 5,
                        }}
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              setOpenAlert(false);
                            }}
                          >
                            <CloseIcon fontSize="inherit" />
                          </IconButton>
                        }
                        severity="info"
                      >
                        {t("REQUEST_APPLY_NEW_ACCOUNT")}
                      </Alert>
                    </Collapse>

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
                      {t("PLEASE_WAIT_FOR_ADMIN_OF_ORGANIZATION_APPROVE")}
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      href={AuthURL.DASHBOARD.HOME}
                    >
                      {t("BACK_TO_LOGIN")}
                    </Button>
                  </Container>
                </Box>
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
  formik: any;
  formikOrganization: any;
  step: number;
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
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  function isLastStep() {
    return step === childrenArray.length - 2;
  }

  const router = useRouter();
  const { demo } = router.query;
  var last = 0;

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        // console.log("values ", values);

        if (isLastStep()) {
          currentChild.props.formikOrganization.handleSubmit();
          if (
            !currentChild.props.formikOrganization.dirty ||
            Object.keys(currentChild.props.formikOrganization.errors).length !=
              0
          ) {
            // alert("xx");
            // !currentChild.props.formikOrganization.isValid();
            // console.log("xx ", currentChild.props.formikOrganization);
            currentChild.props.formikOrganization.onSubmit();
          } else {
            // await setFileUpload(values.file);
            last = 3;
            try {
              await props.onSubmit(values, helpers);
              currentChild.props.formikOrganization.isValid;
              await authApi.device();
              const data = {
                prefix_id: 1,
                first_name: currentChild.props.formik.values.first_name,
                last_name: currentChild.props.formik.values.last_name,
                citizen_number:
                  currentChild.props.formik.values.people_type === 1
                    ? currentChild.props.formik.values.citizen_number
                    : currentChild.props.formik.values.passport,
                laser_code: currentChild.props.formik.values.laser_code,
                birth_date: currentChild.props.formik.values.birth_date,
                people_type: currentChild.props.formik.values.people_type,
                email: currentChild.props.formik.values.email,
                phone_number: currentChild.props.formik.values.phone_number,
                department_uuid:
                  currentChild.props.formikOrganization.values.department_uuid,
                nationality_id: currentChild.props.formik.values.nationality_id,
                role_id: [
                  {
                    id: currentChild.props.formik.values.role_id[0].id,
                  },
                ],
                // detail: values.detail,
                terms: currentChild.props.formik.values.terms,
                file: currentChild.props.formikOrganization.values.file,
              };
              // console.log("registerinitial ", props.initialValues);
              console.log("regiter data ", data);
              const result_user_uuid = await registerApi.regiter(data, null);
              if (result_user_uuid?.code === 200) {
                if (
                  currentChild.props.formikOrganization.values.file.length > 0
                ) {
                  let formData = new FormData();
                  currentChild.props.formikOrganization.values.file.map(
                    (val) => {
                      formData.append("files", val);
                    }
                  );
                  console.log(
                    "Fileeeee ",
                    currentChild.props.formikOrganization.values.file
                  );
                  setCompleted(true);
                  setStep((s) => s + 1);
                  last = 0;
                  try {
                    const result = await uploadFileApi.uploadFile(
                      result_user_uuid.result.user_uuid,
                      formData
                    );
                    console.log("result  ", result);
                    if (result?.code === 200) {
                      enqueueSnackbar(`${result.status}`, {
                        variant: "success",
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "right",
                        },
                        autoHideDuration: 2000,
                        TransitionComponent: Slide,
                      });
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
                    console.log("result2  ", error);
                    enqueueSnackbar(
                      `${error.response.data.description.message}`,
                      {
                        variant: "error",
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "right",
                        },
                        autoHideDuration: 5000,
                        TransitionComponent: Slide,
                      }
                    );
                  }
                } else {
                  setCompleted(true);
                  setStep((s) => s + 1);
                  last = 0;
                }
              } else {
                // currentChild.props.formikOrganization.values.file = [];
                // props.initialValues.department_uuid = "";
                enqueueSnackbar(`${result_user_uuid.description.message}`, {
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
              last = 0;
              // currentChild.props.formikOrganization.values.file = [];
              // props.initialValues.department_uuid = "";
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
          }
        } else {
          currentChild.props.formik.handleSubmit();
          if (
            !currentChild.props.formik.dirty ||
            Object.keys(currentChild.props.formik.errors).length != 0
          ) {
            currentChild.props.formik.onSubmit();
          } else {
            setStep((s) => s + 1);
            helpers.setTouched({});
          }
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index || completed}
              >
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
              p={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              {step === 0 ? (
                <Box>
                  <Typography
                    component="span"
                    variant="subtitle2"
                    color="text.primary"
                    fontWeight="bold"
                  >
                    {t("ALREADY_ACCOUNT")}
                  </Typography>{" "}
                  <Link
                    href={
                      demo ? `${AuthURL.SIGN_IN}?demo=${demo}` : AuthURL.SIGN_IN
                    }
                  >
                    <b>{t("SIGN_IN")}</b>
                  </Link>
                </Box>
              ) : (
                <Button
                  disabled={isSubmitting || step === 0 || last === 3}
                  variant="outlined"
                  color="primary"
                  type="button"
                  onClick={() => {
                    setStep((s) => s - 1),
                      (currentChild.props.formikOrganization.values.file = []);
                  }}
                >
                  {t("PREVIOUS")}
                </Button>
              )}

              <Button
                startIcon={
                  isSubmitting || last === 3 ? (
                    <CircularProgress size="1rem" />
                  ) : null
                }
                disabled={isSubmitting || last === 3}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting || last === 3
                  ? t("SUBMITTING")
                  : isLastStep()
                  ? t("NEXT")
                  : t("NEXT")}
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
