import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/ImportData/ManageAccount/EditConnection/PageHeader";
import Footer from "src/components/Footer";
import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";
// import type { User } from "src/models/user";
// import { usersApi } from "src/mocks/users";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/ImportData/ManageAccount/EditConnection/Results";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { waterDatasetApi } from "@/actions/water.dataset.action";
import { decryptData } from "@/utils/crypto";
import { DatasetContent } from "@/types/water.type";
import SimpleBackdrop from "@/components/Backdrop";
import React from "react";

function AddAccountPages() {
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const [dataset, setDataset] = useState<DatasetContent>({});
  const router = useRouter();

  const getImportDataset = useCallback(async () => {
    setOpenBackdrop(true);
    try {
      const importConfig_uuid = await decryptData(
        atob(router.query.id as string)
      );

      const resultDataset = await waterDatasetApi.getDatasetImportConfig(
        importConfig_uuid
      );

      if (isMountedRef()) {
        setDataset(resultDataset);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.log("err config ", err);
      setOpenBackdrop(false);
      router.back();
    }
  }, [isMountedRef]);

  useEffect(() => {
    getImportDataset();
  }, [getImportDataset]);

  // console.log(dataset);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
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
          <Results
            dataset={dataset}
            onChangeConnection={() => getImportDataset()}
          />
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
