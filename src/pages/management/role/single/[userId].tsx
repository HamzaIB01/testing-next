import { useState, useEffect } from "react";
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import RoleView from "@/content/Management/Role/single/RoleView";
import { useRouter } from "next/router";
import { roleApi } from "@/actions/role.action";
import { Department } from "@/types/user.type";
import SimpleBackdrop from "@/components/Backdrop";
import React from "react";

function ManagementRoleView() {
  // const isMountedRef = useRefMounted();
  // const [user, setUser] = useState<User | null>(null);
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const [object, setObject] = useState<any>();
  const [scope, setScpes] = useState<any>([]);
  const [tabs, setTabs] = useState<Department[]>([]);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  useEffect(() => {
    getRole(router.query.userId);
  }, [router.query]);

  const getRole = async (role_id: any): Promise<void> => {
    setOpenBackdrop(true);
    try {
      const tab = (await roleApi.get_all_Role("", "", "", "")).content;
      const role = await roleApi.get_Role(role_id);
      const scope = await roleApi.get_Scope(role_id);
      // if (role) {
      setTabs(tab);
      setObject(role);
      // }
      // if (scope) {
      setScpes(scope);
      setOpenBackdrop(false);
      // }
    } catch (error) {
      setOpenBackdrop(false);
      console.log(error);
    }
  };

  // const getUser = useCallback(async () => {
  //   try {
  //     const response = await usersApi.getUser();

  //     if (isMountedRef()) {
  //       setUser(response);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }, [isMountedRef]);

  // useEffect(() => {
  //   getUser();
  // }, [getUser]);

  // if (!user) {
  //   return null;
  // }

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Head>
        <title>Role Details</title>
      </Head>
      <Box sx={{ mt: 3 }}>
        <Grid sx={{ px: 4 }} container direction="row">
          <Grid item xs={12}>
            <RoleView
              // user={user}
              tabs={tabs}
              groups={object}
              scope={scope}
              onChangeRole={(e) => getRole(Number(e))}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

ManagementRoleView.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementRoleView;
