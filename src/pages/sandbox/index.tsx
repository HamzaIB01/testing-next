import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/SandBox/PageHeader";
import { Grid } from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/SandBox/Results";
import { useTranslation } from "next-i18next";

function SandBoxPage() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("SANDBOX")}</title>
      </Head>

      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results />
        </Grid>
      </Grid>
    </>
  );
}

SandBoxPage.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default SandBoxPage;
