import { useState, forwardRef, Ref } from "react";
import * as Yup from "yup";
import {
  Box,
  Card,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Slide,
  Dialog,
  Collapse,
  Button,
  Avatar,
  IconButton,
  styled,
} from "@mui/material";
import Head from "next/head";
import type { ReactElement } from "react";
import BaseLayout from "src/layouts/BaseLayout";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { Guest } from "src/components/Guest";
import Link from "src/components/Link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Logo from "src/components/LogoSign";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import { useFormik } from "formik";
import { passwordApi } from "@/actions/password.action";
import {
  ValidateConfirmNewPassword,
  ValidateNewPassword,
} from "@/components/Validations/Password.validation";
import { AuthURL } from "@/constants";
import { useSnackbar } from "notistack";

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

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

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.success};
      top: -${theme.spacing(6)};
      position: absolute;
      left: 50%;
      margin-left: -${theme.spacing(6)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

function RecoverPasswordBasic() {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { demo } = router.query;
  const [openAlert, setOpenAlert] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const validate_new_password = ValidateNewPassword();
  const validate_confirm_new_password = ValidateConfirmNewPassword();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formik = useFormik({
    initialValues: {
      new_password: "",
      confirm_new_password: "",
      submit: null,
    },
    validationSchema: Yup.object({
      ...validate_new_password,
      ...validate_confirm_new_password,
    }),
    onSubmit: async (values) => {
      try {
        const result = await passwordApi.reset_password(
          values.new_password,
          atob(String(router.query.token))
        );

        if (result.code === 200) {
          setOpenDialog(true);
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
        <title>{t("RESET_PASSWORD")}</title>
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
                variant="h2"
                sx={{
                  mb: 1,
                }}
              >
                {t("RESET_PASSWORD")}
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{
                  mb: 3,
                }}
              >
                {t("PLEASE_ENTER_NEW_PASSWORD_AND_CONFIRM_NEW_PASSWORD")}
              </Typography>
            </Box>

            <form noValidate onSubmit={formik.handleSubmit}>
              <TextField
                error={Boolean(
                  formik.touched.new_password && formik.errors.new_password
                )}
                fullWidth
                helperText={
                  formik.touched.new_password && formik.errors.new_password
                }
                label={t("NEW_PASSWORD")}
                name="new_password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.new_password}
                variant="outlined"
              />
              <TextField
                error={Boolean(
                  formik.touched.confirm_new_password &&
                  formik.errors.confirm_new_password
                )}
                fullWidth
                helperText={
                  formik.touched.confirm_new_password &&
                  formik.errors.confirm_new_password
                }
                label={t("CONFIRM_NEW_PASSWORD")}
                margin="normal"
                name="confirm_new_password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                type="text"
                value={formik.values.confirm_new_password}
                variant="outlined"
              />

              <Button
                sx={{ mt: 3 }}
                startIcon={
                  formik.isSubmitting
                    ? <CircularProgress size="1rem" />
                    : null
                }
                disabled={Boolean(!formik.isValid || formik.isSubmitting)}
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                color="primary"
              >
                {t("SAVE")}
              </Button>
            </form>
          </Card>
        </Container>
      </MainContent>

      <DialogWrapper
        open={openDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
      >
        <Box
          sx={{
            px: 4,
            pb: 4,
            pt: 10,
          }}
        >
          <AvatarSuccess>
            <CheckTwoToneIcon />
          </AvatarSuccess>

          <Collapse in={openAlert}>
            <Alert
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
              {t("PLEASE_CHECK_YOUR_EMAIL")}
            </Alert>
          </Collapse>

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 10,
            }}
            variant="h3"
          >
            {t("YOUR_WILL_RECEIVE_EMAIL_TO_RESET_PASSWORD")}
          </Typography>

          <Button
            fullWidth
            component={Link}
            size="large"
            variant="contained"
            onClick={handleCloseDialog}
            href={demo ? `${AuthURL.SIGN_IN}?demo=${demo}` : AuthURL.SIGN_IN}
          >
            {t("LOGIN_AGAIN")}
          </Button>
        </Box>
      </DialogWrapper>
    </>
  );
}

RecoverPasswordBasic.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default RecoverPasswordBasic;
