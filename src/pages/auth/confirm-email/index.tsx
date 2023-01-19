import * as Yup from "yup";
import {
  Box,
  Card,
  TextField,
  Typography,
  Container,
  Button,
  styled,
  Dialog,
  Slide,
  Avatar,
  Collapse,
  Alert,
  IconButton,
  CircularProgress,
} from "@mui/material";
import Head from "next/head";
import BaseLayout from "src/layouts/BaseLayout";
import { Guest } from "src/components/Guest";
import Link from "src/components/Link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Logo from "src/components/LogoSign";
import React, { Dispatch, forwardRef, Ref, useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import type { ReactElement } from "react";
import { TransitionProps } from "@mui/material/transitions";
import CheckTwoToneIcon from "@mui/icons-material/CheckTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import { passwordApi } from "@/actions/password.action";
import { authApi } from "@/actions/login.action";
import { ValidateEmail } from "@/components/Validations/Email.validation";
import { AuthURL } from "@/constants";
import { registerApi } from "@/actions/register.action";
import { decodeBase64 } from "@/utils/nodeForge";
import { useSnackbar } from "notistack";
import SimpleBackdrop from "@/components/Backdrop";

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

function ConfirmEmail() {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const { demo } = router.query;
  const dispatch: Dispatch<any> = useDispatch();
  const [openAlert, setOpenAlert] = useState(true);
  const [last, setLast] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  //   var last = false;

  useEffect(() => {
    console.log("router.query ", router.query);
    if (router.query.token) {
      setOpenBackdrop(true);
      handleSubmit();
    }
  }, [router.query]);

  const handleSubmit = async () => {
    // last = true;

    // console.log(router.query.token);
    // console.log(decodeBase64(router.query.token));

    setLast(true);
    try {
      const response = await registerApi.verifyRegister(
        decodeBase64(router.query.token)
      );

      //   if (verifyRegister) {
      //     setLast(false);
      //     alert("Verify Successsss");
      //     router.push(AuthURL.SIGN_IN);
      //   } else {
      //     setLast(false);
      //     console.log("ไม่สามารถ verify ได้");
      //   }
      // } catch (error) {
      //   setLast(false);
      //   alert(error);
      //   console.log("ผิดพลาด");
      // }

      if (response?.code === 200) {
        setOpenBackdrop(false);
        enqueueSnackbar(t(`${response.status}`), {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 2000,
          TransitionComponent: Slide,
        });
        setLast(false);
        router.push(AuthURL.SIGN_IN);
      } else {
        console.log("else");
        setOpenBackdrop(false);
        enqueueSnackbar(`${response.description.message}`, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 4000,
          TransitionComponent: Slide,
        });
        setLast(false);
        router.push("/404");
      }
    } catch (error) {
      console.log("catch");
      setOpenBackdrop(false);
      enqueueSnackbar(t(`${error.response?.data?.description?.message}`), {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        autoHideDuration: 5000,
        TransitionComponent: Slide,
      });
      setLast(false);
      router.push("/404");
    }
  };
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      {/* <Head>
        <title>{t("CONFIRM_EMAIL")}</title>
      </Head>
      <MainContent>
        <Container maxWidth="sm">
          <Card
            sx={{
              position: "relative",
              overflow: "visible",
            }}
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
                  {t("PLEASE_CONFIRM_EMAIL")}
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
                {t(
                  'กรุณากดที่ปุ่ม "ยืนยันอีเมล" เพื่อทำการยืนยันอีเมลที่สมัคร'
                )}
              </Typography>

              <Button
                fullWidth
                // component={Link}
                size="large"
                variant="contained"
                // href={
                //   demo ? `${AuthURL.SIGN_IN}?demo=${demo}` : AuthURL.SIGN_IN
                // }
                startIcon={last && <CircularProgress size="1rem" />}
                disabled={last}
                // onClick={handleSubmit}
              >
                {t("CONFIRM_EMAIL")}
              </Button>
            </Box>
          </Card>
        </Container>
      </MainContent> */}
    </>
  );
}

ConfirmEmail.getLayout = (page) => (
  // <Guest>
  <BaseLayout>{page}</BaseLayout>
  // </Guest>
);

export default ConfirmEmail;
