import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/ImportData/ManageAccount/EditAccount/PageHeader";
import Footer from "src/components/Footer";
import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/ImportData/ManageAccount/EditAccount/Results";
import { useTranslation } from "next-i18next";
import { decryptData } from "@/utils/crypto";
import { waterApi } from "@/actions/water.action";
import { useRouter } from "next/router";
import { Department } from "@/types/user.type";
import { waterDatasetApi } from "@/actions/water.dataset.action";
import SimpleBackdrop from "@/components/Backdrop";
import React from "react";
import { DatasetResult } from "@/types/water.type";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_SCOPE } from "@/constants";

function AddAccountPages() {
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const [importConfigs, setImportConfigs] = useState<Department>(null);
  const [importDataset, setImportDataset] = useState<DatasetResult>(null);
  const router = useRouter();

  const getImportConfig = useCallback(async () => {
    setOpenBackdrop(true);
    const uuid = decryptData(atob(router.query.id as string));
    try {
      const result = await waterApi.getImportConfigurations(uuid);

      if (isMountedRef()) {
        setImportConfigs(result);
        setOpenBackdrop(false);
      }
    } catch (error) {
      console.log("err config ", error);
      setOpenBackdrop(false);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getImportConfig();
  }, [getImportConfig]);

  const getDataSet = useCallback(async () => {
    setOpenBackdrop(true);
    const uuid = decryptData(atob(router.query.id as string));
    try {
      const resultDataset = await waterDatasetApi.getAllDataset(uuid);

      if (isMountedRef()) {
        setImportDataset(resultDataset);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.log("err config ", err);
      setOpenBackdrop(false);
      setImportDataset(null);
    }
  }, [isMountedRef]);

  const role = useAuth();

  useEffect(() => {
    // getDataSet();

    role.scope?.map((scopes) => {
      if (scopes.code === ROLE_SCOPE.MANAGE_IMPORT_CONFIG) {
        getDataSet();
      } else {
        if (scopes.sub_scopes) {
          scopes.sub_scopes?.map((sub_scopes) => {
            if (sub_scopes.code === ROLE_SCOPE.MANAGE_IMPORT_CONFIG) {
              getDataSet();
              // console.log("if sub_scopes", sub_scopes.code);
            }
          });
        }
      }
    });
  }, [getDataSet]);

  useEffect(() => {
    if (importConfigs && importDataset) {
      setOpenBackdrop(false);
    }
  }, [importConfigs, importDataset]);

  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Head>
        <title>{t("MANAGE_AN_ACCOUNT_TO_IMPORT_DATA")}</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader importConfigs={importConfigs} />
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
            importConfigs={importConfigs}
            importDataset={importDataset}
            onChangeDataset={(e) => getDataSet()}
            onChangeProvideSource={(e) => getImportConfig()}
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
