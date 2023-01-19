// import { useState, useCallback, useEffect } from 'react';
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import Footer from "src/components/Footer";
import { Box, Grid } from "@mui/material";
// import type { User } from 'src/models/user';
// import { usersApi } from 'src/mocks/users';
// import { useRefMounted } from 'src/hooks/useRefMounted';
import ReportDetail from "@/content/Report/Detail";
import { useTranslation } from "next-i18next";

function ReportDetailViwe() {
  const { t }: { t: any } = useTranslation();
  // const isMountedRef = useRefMounted();
  // const [user, setUser] = useState<User | null>(null);

  // const getUser = useCallback(async () => {
  //     try {
  //         const response = await usersApi.getUser();

  //         if (isMountedRef()) {
  //             setUser(response);
  //         }
  //     } catch (err) {
  //         console.error(err);
  //     }
  // }, [isMountedRef]);

  // useEffect(() => {
  //     getUser();
  // }, [getUser]);

  // if (!user) {
  //     return null;
  // }

  return (
    <>
      <Head>
        <title>{t("REPORT_DETAILS")}</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row">
          <Grid item xs={12}>
            {/* <ReportDetail user={user} /> */}
            <ReportDetail />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

ReportDetailViwe.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ReportDetailViwe;
