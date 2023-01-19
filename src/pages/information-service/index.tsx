import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/InformationService/PageHeader";
import { Grid } from "@mui/material";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/InformationService/Results";
import React from "react";
import { useTranslation } from "next-i18next";

function SearchData() {
  const { t }: { t: any } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("INFORMATION_SERVICE")}</title>
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

SearchData.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default SearchData;
