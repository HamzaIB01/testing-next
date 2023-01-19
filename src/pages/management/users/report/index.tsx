// import { useState, useEffect, useCallback } from 'react';
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/Management/Users/Report/PageHeader";
import Footer from "src/components/Footer";
import { Grid } from "@mui/material";
// import { useRefMounted } from 'src/hooks/useRefMounted';
// import type { User } from 'src/models/user';
// import { usersApi } from 'src/mocks/users';
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/Management/Users/Report/Results";
import { useTranslation } from "next-i18next";

function ReportData() {
  const { t }: { t: any } = useTranslation();
  // const isMountedRef = useRefMounted();
  // const [users, setUsers] = useState<User[]>([]);

  // const getUsers = useCallback(async () => {
  //     try {
  //         const response = await usersApi.getUsers();

  //         if (isMountedRef()) {
  //             setUsers(response);
  //         }
  //     } catch (err) {
  //         console.error(err);
  //     }
  // }, [isMountedRef]);

  // useEffect(() => {
  //     getUsers();
  // }, [getUsers]);

  return (
    <>
      <Head>
        <title>{t("USER_REPORT")}</title>
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
          {/* <Results users={users} /> */}
          <Results />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ReportData.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ReportData;
