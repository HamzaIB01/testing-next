import { useState, ChangeEvent, useCallback, useEffect } from "react";
import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import Footer from "src/components/Footer";
import {
  Box,
  Tabs,
  Tab,
  Grid,
  styled,
  Tooltip,
  IconButton,
  Typography,
  Breadcrumbs,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ActivityTab from "@/content/Profile/single/ActivityTab";
import UserInformationTab from "@/content/Profile/single/UserInformationTab";
import SecuritySettingsTab from "@/content/Profile/single/SecuritySettingsTab";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import Link from "@/components/Link";
import { useRouter } from "next/router";
import { AuthURL, ROLE_SCOPE, server } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import React from "react";
import { userApi } from "@/actions/user.action";
import { UserResult } from "@/types/user.type";
import SimpleBackdrop from "@/components/Backdrop";
import { nonWaterApi } from "@/actions/nonwater.action";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
  `
);

function ManagementUsersView() {
  // const isMountedRef = useRefMounted();
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const [users, setUsers] = useState<UserResult>();
  const [activity, setActivity] = useState<UserResult>();
  const [activityProfile, setActivityProfile] = useState<UserResult>();
  const role = useAuth();
  const [currentTab, setCurrentTab] = useState<string>("activity");
  const [tabs, setTabs] = React.useState<any[]>([
    { value: "activity", label: t("ACTIVITY") },
    { value: "user_information", label: t("USER_INFORMATION") },
    { value: "security_settings", label: t("SECURITY_SETTINGS") },
  ]);

  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };

  const getUser = useCallback(async () => {
    setOpenBackdrop(true);

    try {
      const uuid = localStorage.getItem(server.UUID);
      const resultUser = await userApi.get_user(uuid);

      if (resultUser?.code === 200) {
        setUsers(resultUser.result);
      }

      setOpenBackdrop(false);
    } catch (error) {
      setUsers(null);
      setOpenBackdrop(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const getActivity = useCallback(async () => {
    setOpenBackdrop(true);
    try {
      const resultActivity = await nonWaterApi.getActivity();

      if (resultActivity.code === 200) {
        setOpenBackdrop(false);
        setActivity(resultActivity?.result);
      } else {
        // console.log("resultUser", resultUser);
        alert(resultActivity.status);
      }
    } catch (err) {
      setOpenBackdrop(false);
      setActivity(null);
      alert(err);
    }
  }, []);

  const getActivityProfile = useCallback(async () => {
    setOpenBackdrop(true);

    const limit = "10";
    const offset = "0";
    const keyword = "user";
    const action = "display";

    try {
      const resultUser = await nonWaterApi.getActivityProfile(
        limit,
        offset,
        // department_uuid,
        keyword,
        action
        // activity,
        // email
      );

      if (resultUser.code === 200) {
        setOpenBackdrop(false);
        setActivityProfile(resultUser?.result);
        // console.log("resultUser", resultUser);
      } else {
        alert("err mock");
        // console.log("resultUser", resultUser);
      }
    } catch (err) {
      setOpenBackdrop(false);
      setActivityProfile(null);
      // alert(err);
    }
  }, []);

  useEffect(() => {
    getActivityProfile();
    // getActivity();
  }, [getActivityProfile]);

  if (!users) {
    return null;
  }

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Head>
        <title>{t("PROFILE")}</title>
      </Head>
      {tabs && (
        <Box sx={{ mt: 3 }}>
          <Grid
            sx={{ px: 4 }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={3}
          >
            <Grid item xs={12}>
              <Box display="flex" alignItems="center">
                <Tooltip arrow placement="top" title={t("GO_BACK")}>
                  <IconButton
                    onClick={() => router.back()}
                    color="primary"
                    sx={{
                      p: 2,
                      mr: 2,
                    }}
                  >
                    <ArrowBackTwoToneIcon />
                  </IconButton>
                </Tooltip>
                <Box>
                  <Typography variant="h3" component="h3" gutterBottom>
                    {t("SETTING_DATA")}
                  </Typography>
                  <Breadcrumbs maxItems={2} aria-label="breadcrumb">
                    <Link color="inherit" href={AuthURL.DASHBOARD.HOME}>
                      {t("HOME")}
                    </Link>
                    <Typography color="text.primary">
                      {t("SETTING_DATA")}
                    </Typography>
                  </Breadcrumbs>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TabsWrapper
                onChange={handleTabsChange}
                value={currentTab}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
              >
                {tabs.map((tab, index) => {
                  if (
                    index === 0 ||
                    (index === 1 &&
                      role?.scope?.some(
                        (roles: any) =>
                          roles?.code === ROLE_SCOPE.MANAGE_PROFILE
                      )) ||
                    (index === 2 &&
                      role?.scope?.some(
                        (roles: any) =>
                          roles?.code === ROLE_SCOPE.MANAGE_PROFILE
                      ))
                  ) {
                    return (
                      <Tab
                        key={tab?.value}
                        label={tab?.label}
                        value={tab?.value}
                      />
                    );
                  }
                })}
              </TabsWrapper>
            </Grid>
            <Grid item xs={12}>
              {currentTab === "activity" && (
                <ActivityTab
                  activity={activity}
                  activityProfile={activityProfile}
                />
              )}
              {currentTab === "user_information" && (
                <UserInformationTab users={users} onChange={() => getUser()} />
              )}
              {currentTab === "security_settings" && <SecuritySettingsTab />}
            </Grid>
          </Grid>
        </Box>
      )}
      <Footer />
    </>
  );
}

ManagementUsersView.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementUsersView;
