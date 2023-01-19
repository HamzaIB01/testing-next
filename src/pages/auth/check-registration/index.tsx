import * as Yup from "yup";
import {
  Box,
  Card,
  TextField,
  Typography,
  Container,
  Slide,
  Button,
  styled,
} from "@mui/material";
import Head from "next/head";
import BaseLayout from "src/layouts/BaseLayout";
import { Guest } from "src/components/Guest";
import Link from "src/components/Link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Logo from "src/components/LogoSign";
import { useFormik } from "formik";
// import { ValidateCitizenNumber } from "@/components/Validations/CitizenNumber.validation";
import { ValidateEmail } from "@/components/Validations/Email.validation";
import { AuthURL } from "@/constants";
import { registerApi } from "@/actions/register.action";
import { encryptData } from "@/utils/crypto";
import { useSnackbar } from "notistack";

const MainContent = styled(Box)(
  () => `
    height: 100%;
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
);

function CheckRegistation() {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { demo } = router.query;
  const email = ValidateEmail();
  // const citizen_number = ValidateCitizenNumber();

  const formik = useFormik({
    initialValues: {
      email: "",
      citizen_number: "",
    },
    validationSchema: Yup.object({
      ...email,
      // ...citizen_number,
    }),
    onSubmit: async (values) => {
      try {
        const response = await registerApi.checkRegiterStatus(values);

        if (response?.code === 200) {
          enqueueSnackbar(t(`${response.status}`), {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 2000,
            TransitionComponent: Slide,
          });

          router.push({
            pathname: `${AuthURL.CHECK_REGISTRATION}/detail`,
            query: {
              value: encryptData(JSON.stringify(response.result)),
            },
          });

        } else {
          enqueueSnackbar(t(`${response.description.message}`), {
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
    },
  });

  return (
    <>
      <Head>
        <title>{t("CHECK_A_REGISTATION")}</title>
      </Head>
      <MainContent>
        <Container maxWidth="sm">
          <Logo />
          <Card
            sx={{
              mt: 3,
              p: 4,
            }}
          >
            <Box>
              <Typography
                variant="h3"
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
                {t("CHECK_A_REGISTATION_DETAIL")}
              </Typography>
            </Box>

            <form noValidate onSubmit={formik.handleSubmit}>
              <TextField
                error={Boolean(formik.touched.email && formik.errors.email)}
                fullWidth
                helperText={formik.touched.email && formik.errors.email}
                label={t("EMAIL")}
                margin="normal"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.email}
                variant="outlined"
              />
              <TextField
                fullWidth
                label={t("CITIZEN_NUMBER") + "/" + t("PASSPORT")}
                margin="normal"
                name="citizen_number"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.citizen_number}
                variant="outlined"
              />

              <Button
                sx={{ mt: 3 }}
                color="primary"
                disabled={Boolean(!formik.isValid && formik.isSubmitting)}
                type="submit"
                fullWidth
                size="large"
                variant="contained"
              >
                {t("CHECK_REGISTATION")}
              </Button>
            </form>
          </Card>
          <Box mt={3} textAlign="right">
            <Typography
              component="span"
              variant="subtitle2"
              color="text.primary"
              fontWeight="bold"
            >
              {t("WANT_TO_LOGIN_AGAIN")}
            </Typography>{" "}
            <Link
              href={demo ? `${AuthURL.SIGN_IN}?demo=${demo}` : AuthURL.SIGN_IN}
            >
              <b>{t("SIGN_IN")}</b>
            </Link>
          </Box>
        </Container>
      </MainContent>
    </>
  );
}

CheckRegistation.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default CheckRegistation;
