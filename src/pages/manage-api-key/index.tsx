import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/ManageApiKey/PageHeader";
import { Grid } from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/ManageApiKey/Results";

function ManageApiKey() {
  return (
    <>
      <Head>
        <title>Manage API key</title>
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

ManageApiKey.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManageApiKey;
