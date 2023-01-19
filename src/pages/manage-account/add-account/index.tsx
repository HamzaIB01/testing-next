import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/ImportData/ManageAccount/AddAccount/PageHeader";
import Footer from "src/components/Footer";
import { Grid } from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/ImportData/ManageAccount/AddAccount/Results";
import { useTranslation } from "next-i18next";

function AddAccountPages() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("MANAGE_AN_ACCOUNT_TO_IMPORT_DATA")}</title>
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
      <Footer />
    </>
  );
}

AddAccountPages.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default AddAccountPages;
