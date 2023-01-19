import {
  FC,
  useState,
  Children,
  ReactElement,
  useEffect,
  useContext,
} from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  styled,
  Container,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "@/components/Link";
import { Form, Formik, FormikConfig, FormikValues } from "formik";
import * as Yup from "yup";
import Head from "next/head";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import { useRouter } from "next/router";
import { StepIconProps } from "@mui/material/StepIcon";
import { Check } from "@mui/icons-material";
import { FilterData } from "@/components/FilterData";
import { DetailMore } from "@/components/DetailMore";
import { decryptData } from "@/utils/crypto";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { nonWaterApi } from "@/actions/nonwater.action";
import { AuthURL, server } from "@/constants";
import { TabbarContext } from "@/contexts/TabbarContext";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

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

const CardLogo = styled("img")(
  ({ theme }) => `
          width: 36px;
          margin-right: ${theme.spacing(2)};
          background: ${theme.colors.alpha.white[100]};
      `
);

//DOWNLOADE_EXPORT_MANUAL
const onDownload = async (filename: string) => {
  // const link = document.createElement("a");
  // link.download = `download.txt`;
  // link.href = "./download.txt";
  // link.click();
  alert("Download Export");
  console.log("file ", filename);

  // fetch(`${env.GET_FILE}/${filename}`).then((response) => {
  try {
    const uuid = localStorage.getItem(server.UUID);
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_URL}${server.EXPORT_MANUAL}/download/${uuid}/${filename}`,
      {
        headers: {
          method: "GET",
          device: localStorage.getItem("device"),
          access_token: localStorage.getItem("refresh_token"),
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem(
          //   server.REFRESH_TOKEN_KEY
          // )}`,
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          Accept: "application/json",
        },
      }
    ).then((response) => {
      response.blob().then((blob) => {
        let url = window.URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
      });
    });
  } catch (error) {
    alert(error);
  }
};

const ShowFile = (fileName: any, _tag: any, type: any): JSX.Element => {
  return (
    <Box
      sx={{
        backgroundColor: "white",
        marginTop: 2,
        borderRadius: "10px",
        border: "1px solid #000 ",
        padding: 2,
        marginX: 5,
      }}
      display="flex"
      alignItems="center"
    >
      {/* {file.value.type === "image/png" ? (
      <CardLogo src="/static/images/files/png.png" alt="PNG" />
    ) : file.value.type === "image/jpeg" ? (
      <CardLogo src="/static/images/files/jpg.png" alt="JPG" />
    ) : (
      <CardLogo src="/static/images/files/pdf.png" alt="PDF" />
    )} */}

      {type === "PNG" && (
        <CardLogo src="/static/images/files/001-png-file.png" alt="PNG" />
      )}
      {type === "CSV" && (
        <CardLogo src="/static/images/files/002-csv-file.png" alt="CSV" />
      )}
      {type === "JPG" && (
        <CardLogo src="/static/images/files/003-jpg-file.png" alt="JPG" />
      )}
      {type === "PDF" && (
        <CardLogo src="/static/images/files/004-pdf-file.png" alt="PDF" />
      )}
      {type === "RAR" && (
        <CardLogo src="/static/images/files/005-rar-file.png" alt="RAR" />
      )}
      {type === "ZIP" && (
        <CardLogo src="/static/images/files/006-zip-file.png" alt="ZIP" />
      )}

      <Box>
        {/* <Typography variant="h5" fontWeight="normal">
        {file.value.name.length > 24
          ? `${file.value.name.slice(
              0,
              12
            )}...${file.value.name.slice(
              -12,
              file.value.name.length
            )}`
          : file.value.name}
      </Typography> */}
        <Typography variant="h5" fontWeight="normal">
          {fileName}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
          {/* {formatBytes(file.value.size)} */}
          {/* 10.9MB */}
          {type}
        </Typography>
      </Box>
      <CloudDownloadIcon
        color="info"
        onClick={(_e) => onDownload(fileName)}
        sx={{ marginLeft: "auto" }}
      />
      {/* </IconButton> */}
    </Box>
  );
};

const RequestData: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const [openAlert, setOpenAlert] = useState(true);
  const auth = useAuth();
  const [data, setData] = useState<any>();
  const { changeTab, tabNumber } = useContext(TabbarContext);

  useEffect(() => {
    if (Number(decryptData(router.query.step)) === 3) {
      setData(JSON.parse(decryptData(router.query.data)));
    }
    // console.log("data", data);
  }, []);

  // useEffect(() => {
  //   setInitial(data);
  // }, [data]);

  //
  // setData(JSON.parse(decryptData(router.query.data)));
  // const [data, setData] = useState<any>();
  const initialValues = {
    user_uuid: auth.user.uuid,
    parameter: {
      category: { uuid: "" },
      interval: [],
      basin: [],
      station: [],
      province: [],
      district: [],
      sub_district: [],
      department: [],
    },
    from: format(new Date(), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd"),
    description: "",
  };

  const [initial, setInitial] = useState<any>({
    category: { uuid: "" },
    interval: [],
    basin: [],
    station: [],
    province: [],
    district: [],
    sub_district: [],
    department: [],
    from: initialValues.from,
    to: initialValues.to,
    description: initialValues.description,
  });

  // useEffect(() => {
  //   if (Number(decryptData(router.query.step)) === 3) {
  //     setData(JSON.parse(decryptData(router.query.data)));
  //   }
  // }, []);

  // useEffect(() => {
  //   setInitial(data);
  // }, [data]);

  //
  // setData(JSON.parse(decryptData(router.query.data)));
  // const [data, setData] = useState<any>();

  const router = useRouter();

  return (
    <FormikStepper
      enableReinitialize
      initialValues={initialValues}
      onSubmit={async (values) => {
        // await sleep(3000);
        changeTab(null);
        console.log("submit request ", values);
        // try {
        //   const result = await nonWaterApi.createManual(values);
        //   // if (result) {
        //   alert("create success");
        //   changeTab(null);
        //   // router.back();
        //   // } else {
        //   //   alert("failed");
        //   // }
        // } catch (error) {
        //   alert(error);
        // }
      }}
    >
      <FormikStep
        validationSchema={Yup.object().shape({
          // email: Yup.string()
          //     .email(
          //         t('The email provided should be a valid email address')
          //     )
          //     .max(255)
          //     .required(t('The email field is required')),
          // first_name: Yup.string()
          //     .max(255)
          //     .required(t('The first name field is required')),
          // last_name: Yup.string()
          //     .max(255)
          //     .required(t('The first name field is required')),
          // password: Yup.string()
          //     .min(8)
          //     .max(255)
          //     .required(t('The password field is required')),
          // password_confirm: Yup.string()
          //     .oneOf(
          //         [Yup.ref('password')],
          //         t('Both password fields need to be the same')
          //     )
          //     .required(t('This field is required'))
        })}
        label={t("SEND_REQUEST_INFORMATION")}
      >
        <Grid container spacing={3} pt={3}>
          <Grid item xs={12}>
            <FilterData
              headder={true}
              page={"search"}
              filtersRole={"subscriber"}
              title={t("SELECT_INFORMATION_YOU_WISH_TO_REQUEST")}
              agency={true}
              submitValue={initial}
              getInitial={initialValues}
            />
          </Grid>

          <Grid item xs={12}>
            <DetailMore title={t("MORE_DETAILS")} getInitial={initialValues} />
          </Grid>
        </Grid>
      </FormikStep>
      <FormikStep label={t("PENDING")} />
      <FormikStep label={t("SUCCEED")}>
        <Box px={4} py={8}>
          <Container maxWidth="sm">
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
              {Number(decryptData(router.query.step)) === 3
                ? t("YOU_CAN_DOWNLOAD_DATA_FILE")
                : t("PLEASE_WAIT_EMAIL_WHEN_YOU_REQUEST_PROCESSED")}
            </Typography>

            {decryptData(router.query.data) &&
              JSON.parse(decryptData(router.query.data))?.file?.map(
                (value: any) => ShowFile(value?.path, value?.tag, value?.type)
              )}
          </Container>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FilterData
              disabled
              headder={true}
              page={"search"}
              filtersRole={"subscriber"}
              title={t("INFORMATION_TO_BE_REQUEST")}
              agency={true}
              submitValue={
                decryptData(router.query.data) &&
                JSON.parse(decryptData(router.query.data))
                  ? JSON.parse(decryptData(router.query.data))
                  : initial
              }
            />
          </Grid>
          <Grid item xs={12}>
            <DetailMore
              title={t("MORE_DETAILS")}
              disabled
              getInitial={
                decryptData(router.query.data) &&
                JSON.parse(decryptData(router.query.data))
                  ? JSON.parse(decryptData(router.query.data))
                  : initialValues
              }
            />
          </Grid>
        </Grid>
      </FormikStep>
    </FormikStepper>
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
  const [currentChild, setCurrentChild] = useState(childrenArray[step]);
  // var currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);
  const { t }: { t: any } = useTranslation();

  function isLastStep() {
    return step === childrenArray.length - 2;
  }

  const router = useRouter();
  const { demo } = router.query;

  useEffect(() => {
    if (Number(decryptData(router.query.step)) === 3) {
      setStep(3);
      setCurrentChild(childrenArray[2]);
      setCompleted(true);
    }
  }, []);

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
          setStep((s) => s + 1);
        } else {
          // const result = await nonWaterApi.createManual(values);

          // console.log("vax ", result);
          console.log("sumbit yeah ", values);

          try {
            const result = await nonWaterApi.createManual(values);
            // if (result) {
            alert("create success");

            await props.onSubmit(values, helpers);
            // router.back();
            // } else {
            //   alert("failed");
            // }
            setCompleted(true);
            setStep((s) => s + 2);
            setCurrentChild(childrenArray[2]);
            helpers.setTouched({});
          } catch (error) {
            alert(error);
          }
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
                <Link
                  href={
                    demo
                      ? AuthURL.INFORMATION_SERVICE + `?demo=${demo}`
                      : AuthURL.INFORMATION_SERVICE
                  }
                >
                  <Button variant="contained" color="error" type="button">
                    {t("CANCEL")}
                  </Button>
                </Link>
              ) : (
                <Button
                  disabled={isSubmitting || step === 0}
                  variant="outlined"
                  color="primary"
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                >
                  {t("PREVIOUS")}
                </Button>
              )}

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
                  ? t("SEND_REQUEST_INFORMATION")
                  : t("SEND_REQUEST_INFORMATION")}
              </Button>
            </BoxActions>
          ) : null}
        </Form>
      )}
    </Formik>
  );
}

export default RequestData;
