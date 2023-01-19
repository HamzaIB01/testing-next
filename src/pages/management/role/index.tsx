import { useState, useEffect, useCallback, Dispatch } from "react";

import Head from "next/head";

import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";

import PageHeader from "@/content/Management/Role/PageHeader";
import Footer from "src/components/Footer";

import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";
import { Department, RoleResult } from "@/types/user.type";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/Management/Role/Results";
import { useTranslation } from "next-i18next";
import { roleApi } from "@/actions/role.action";
import React from "react";
import SimpleBackdrop from "@/components/Backdrop";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_SCOPE } from "@/constants";

function ManagementRolePages() {
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const [roles, setRoles] = useState<RoleResult>();
  const [tabs, setTabs] = useState<Department[]>([]);
  const [search, setSearch] = useState("ALL");
  const roleScope = useAuth();

  // useEffect(() => {
  // FunctionPermission(ROLE_SCOPE.SHOW_ALL_ROLE)
  // setOpenBackdrop(true);
  // getUsers();
  // if (auth?.user?.current_role_code === "Super administrator") {
  // FunctionPermission(ROLE_SCOPE.SHOW_ALL_ROLE)

  //   // }
  // }, []);

  const getRoles = useCallback(async () => {
    setOpenBackdrop(true);
    roleScope.scope?.map(async (scopes) => {
      if (scopes.code === ROLE_SCOPE.SHOW_ALL_ROLE) {
        const tab = (await roleApi.get_all_Role("", "", "", "")).content;
        const role = await roleApi.get_all_Role("5", "", "", "ALL");
        setRoles(role);
        setTabs(tab);
      } else {
        if (scopes.sub_scopes) {
          scopes.sub_scopes?.map(async (sub_scopes) => {
            if (sub_scopes.code === ROLE_SCOPE.SHOW_ALL_ROLE) {
              const tab = (await roleApi.get_all_Role("", "", "", "")).content;
              setTabs(tab);
              const role = await roleApi.get_all_Role("5", "", "", "ALL");
              setRoles(role);
            }
          });
        }
      }
    });

    // const role = await roleApi.get_all_Role("5", "", "", "ALL");
    // .content.sort(
    //   (a: any, b: any) => (a.id > b.id ? 1 : -1)
    // );

    // setTabs(tab);

    setOpenBackdrop(false);
  }, [isMountedRef]);

  useEffect(() => {
    getRoles();
  }, [getRoles]);

  // useEffect(() => {
  //   setOpenBackdrop(true);
  //   const fetchData = async () => {
  //     const role = await roleApi.get_all_Role(search);
  //     // .content.sort((a, b) =>
  //     //   a.id > b.id ? 1 : -1
  //     // );
  //     setOpenBackdrop(false);
  //     setRoles(role);
  //   };

  //   fetchData();
  // }, [search]);

  const getRolebyTab = useCallback(
    async (limit, offset, keyword, search) => {
      setOpenBackdrop(true);
      try {
        // dispatch(roleActions.getRole("ALL"));
        // dispatch(getalluserActions.getAllUser(""));
        const resultUser = await roleApi.get_all_Role(
          limit,
          offset,
          keyword,
          search
        );
        setRoles(resultUser);
        setOpenBackdrop(false);
      } catch (err) {
        setRoles(null);
        // alert(err);
        setOpenBackdrop(false);
      }
    },
    [search]
  );

  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Head>
        <title>{t("MANAGE_ROLE")}</title>
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
            roles={roles}
            tabs={tabs}
            onChange={(e) =>
              getRolebyTab(e.limit, e.offset, e.keyword, e.value)
            }
            getRoles={() => getRoles()}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementRolePages.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementRolePages;
