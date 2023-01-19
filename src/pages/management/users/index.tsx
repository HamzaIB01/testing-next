import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import PageHeader from "@/content/Management/Users/PageHeader";
import Footer from "src/components/Footer";
import { Grid } from "@mui/material";
import { useRefMounted } from "src/hooks/useRefMounted";
import PageTitleWrapper from "src/components/PageTitleWrapper";
import Results from "@/content/Management/Users/Results";
import { useTranslation } from "next-i18next";
import { Department, UserResult } from "@/types/user.type";
import SimpleBackdrop from "@/components/Backdrop";
import React from "react";
import { userApi } from "@/actions/user.action";
import { roleApi } from "@/actions/role.action";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_SCOPE } from "@/constants";

function ManagementUsers() {
  const { t }: { t: any } = useTranslation();
  const isMountedRef = useRefMounted();
  const [users, setUsers] = useState<UserResult>();
  const [roles, setRoles] = useState<Department[]>([]);
  const auth = useAuth();
  const [type, setType] = useState<string>("");

  const getUsers = useCallback(async () => {
    setOpenBackdrop(true);
    try {
      const resultUser = await userApi.getAllUser("5", "", "", "");
      setUsers(resultUser);
      setOpenBackdrop(false);
    } catch (err) {
      setUsers(null);
      setOpenBackdrop(false);
    }
  }, []);

  const getRole = useCallback(async () => {
    try {
      const resultRole = await roleApi.get_all_Role("", "", "", "");
      const response =
        resultRole &&
        resultRole.content
          .filter((user) => !user.ref_id)
          .sort((a, b) => (a.id > b.id ? 1 : -1));
      setRoles(response);
    } catch (error) {
      alert(error);
      setRoles([]);
    }
  }, []);

  const role = useAuth();

  useEffect(() => {
    // FunctionPermission(ROLE_SCOPE.SHOW_ALL_ROLE)
    // setOpenBackdrop(true);
    getUsers();
    // if (auth?.user?.current_role_code === "Super administrator") {
    // FunctionPermission(ROLE_SCOPE.SHOW_ALL_ROLE)
    role.scope?.map((scopes) => {
      if (scopes.code === ROLE_SCOPE.SHOW_ALL_ROLE) {
        getRole();
      } else {
        if (scopes.sub_scopes) {
          scopes.sub_scopes?.map((sub_scopes) => {
            if (sub_scopes.code === ROLE_SCOPE.SHOW_ALL_ROLE) {
              getRole();
              // console.log("if sub_scopes", sub_scopes.code);
            }
          });
        }
      }
    });

    // }
  }, []);
  // FunctionPermission(ROLE_SCOPE.SHOW_ALL_ROLE);

  const getUsersbyTab = useCallback(
    async (limit, offset, keyword, type) => {
      setOpenBackdrop(true);
      try {
        // dispatch(roleActions.getRole("ALL"));
        // dispatch(getalluserActions.getAllUser(""));
        const resultUser = await userApi.getAllUser(
          limit,
          offset,
          keyword,
          type
        );
        setUsers(resultUser);
        setOpenBackdrop(false);
      } catch (err) {
        setUsers(null);
        // alert(err);
        setOpenBackdrop(false);
      }
    },
    [type]
  );

  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Head>
        <title>{t("MANAGE_USER_INFORMATION")}</title>
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
            users={users}
            roles={roles}
            getUsers={() => getUsers()}
            selectTabUser={(e) =>
              getUsersbyTab(
                e.limit,
                e.offset,
                e.keyword,
                e.value.replace(/ /g, "")
              )
            }
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementUsers.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementUsers;
