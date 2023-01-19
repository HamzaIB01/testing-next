import Head from "next/head";

import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";

import Footer from "src/components/Footer";

import { Box, Grid } from "@mui/material";

import RolePermission from "@/content/Management/Role/permission/RolePermission";

function ManagementRoleView() {
  return (
    <>
      <Head>
        <title>Role Permission</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row">
          <Grid item xs={12}>
            <RolePermission />
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </>
  );
}

ManagementRoleView.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementRoleView;
