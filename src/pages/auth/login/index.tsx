import { Box, Card, Typography, Container, styled, Grid } from "@mui/material";
import Head from "next/head";
import { useAuth } from "src/hooks/useAuth";
import { Guest } from "src/components/Guest";
import { LoginBaseJWT } from "@/content/Auth/Login/LogingJWT";
import BaseLayout from "src/layouts/BaseLayout";
import Link from "src/components/Link";
import { useTranslation } from "react-i18next";
import { AuthURL } from "@/constants";

const Content = styled(Box)(
  () => `
      display: flex;
      flex: 1;
      width: 100%;
  `
);

const MainContent = styled(Box)(
  ({ theme }) => `
    @media (min-width: ${theme.breakpoints.values.md}px) {
      padding: 0 0 0 440px;
    }
    width: 100%;
    display: flex;
    align-items: center;
  `
);

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      background: ${theme.colors.alpha.white[100]};
      width: 440px;
  `
);

function Login() {
  const { t }: { t: any } = useTranslation();
  const { method } = useAuth() as any;

  return (
    <>
      <Head>
        <title>{t("SIGN_IN")}</title>
      </Head>
      <Content>
        <SidebarWrapper
          sx={{
            display: { xs: "none", md: "flex" },
          }}
        >
          <img
            style={{ width: "inherit" }}
            src={require("/public/static/images/logo/bg.svg")}
          />
        </SidebarWrapper>
        <MainContent>
          <Container
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
            maxWidth="sm"
          >
            <Card
              sx={{
                p: 4,
                my: 4,
              }}
            >
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1,
                  }}
                >
                  {t("SIGN_IN")}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3,
                  }}
                >
                  {t("ENTER_EMAIL_PASSWORD_FOR_LOGIN")}
                </Typography>
              </Box>

              {method === "JWT" && <LoginBaseJWT />}

              <Grid container spacing={3}>
                <Grid
                  item
                  xs={12}
                  mt={4}
                  sx={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Box>
                    <Typography
                      component="span"
                      variant="subtitle2"
                      color="text.primary"
                      fontWeight="bold"
                    >
                      {t("DONT_HAVE_ACCOUNT")}
                    </Typography>{" "}
                    <Link href={`${AuthURL.REGISTER}`}>
                      <b>{t("REGISTER")}</b>
                    </Link>
                  </Box>
                  <Box>
                    <Link href={AuthURL.CHECK_REGISTRATION}>
                      <b>{t("LINK_CHECK_REGISTATION")}</b>
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Container>
        </MainContent>
      </Content>
    </>
  );
}

Login.getLayout = (page) => (
  <Guest>
    <BaseLayout>{page}</BaseLayout>
  </Guest>
);

export default Login;
