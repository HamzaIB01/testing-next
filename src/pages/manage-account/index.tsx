import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/ImportData/ManageAccount/PageHeader";
import Footer from "src/components/Footer";
import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/ImportData/ManageAccount/Results";
import { useTranslation } from "next-i18next";
import { waterApi } from "@/actions/water.action";
import SimpleBackdrop from "@/components/Backdrop";
import React from "react";
import { WaterResult } from "@/types/water.type";

function ManageAccountPages() {
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const [importDatas, setImportDatas] = useState<WaterResult>();

  const getImportConfig = useCallback(async () => {
    setOpenBackdrop(true);
    try {
      const resultConfig = await waterApi.getAllImportConfigurations();

      if (isMountedRef()) {
        setImportDatas(resultConfig);
        setOpenBackdrop(false);
      }
    } catch (err) {
      setImportDatas(null);
      setOpenBackdrop(false);
    }
  }, [isMountedRef]);

  const getImportbyfilter = useCallback(async (limit, offset, keyword) => {
    setOpenBackdrop(true);
    try {
      const result_Provide_source = await waterApi.getAllImportConfigurations(
        limit,
        offset,
        keyword
      );
      setImportDatas(result_Provide_source);
      setOpenBackdrop(false);
    } catch (err) {
      setImportDatas(null);
      setOpenBackdrop(false);
    }
  }, []);

  useEffect(() => {
    getImportConfig();
  }, [getImportConfig]);

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
            importDatas={importDatas}
            onChangeProvideSource={(e) => getImportConfig()}
            filterProvideSource={(e) =>
              getImportbyfilter(e.limit, e.offset, e.keyword)
            }
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManageAccountPages.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManageAccountPages;
