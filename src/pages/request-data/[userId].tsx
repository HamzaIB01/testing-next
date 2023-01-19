import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import { Box, Grid } from "@mui/material";
import RequestData from "@/content/RequestData/Results";
import PageTitleWrapper from "@/components/PageTitleWrapper";
import PageHeader from "@/content/RequestData/PageHeader";

function RequestDataView() {
  return (
    <>
      <Head>
        <title>Role Details</title>
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
          <RequestData />
        </Grid>
      </Grid>
    </>
  );
}

RequestDataView.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default RequestDataView;
