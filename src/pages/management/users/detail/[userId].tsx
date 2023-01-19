import { useState, useCallback, ChangeEvent, useEffect, Dispatch } from "react";
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
import { useRefMounted } from "src/hooks/useRefMounted";
import { useTranslation } from "react-i18next";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import Link from "@/components/Link";
import { useRouter } from "next/router";
import ActivityTab from "@/content/Management/Users/Detail/ActivityTab";
import UserInformationTab from "@/content/Management/Users/Detail/UserInformationTab";
import { useDispatch, useSelector } from "react-redux";
// import { RootReducer } from "@/store/rootReducer";
import * as userActions from "@/actions/user.action";
import { decryptData } from "@/utils/crypto";
import { User, UserResult } from "@/types/user.type";
import { userApi } from "@/actions/user.action";
import { AuthURL } from "@/constants";
import SimpleBackdrop from "@/components/Backdrop";
import React from "react";
import { nonWaterApi } from "@/actions/nonwater.action";

const TabsWrapper = styled(Tabs)(
  () => `
    .MuiTabs-scrollableX {
      overflow-x: auto !important;
    }
  `
);

function ManagementUsersView() {
  const isMountedRef = useRefMounted();
  const [user, setUser] = useState<any>(null);
  const [activityUser, setActivityUser] = useState<UserResult>();
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const dispatch: Dispatch<any> = useDispatch();
  const [currentTab, setCurrentTab] = useState<string>("user_information");
  // const userReducer = useSelector((state: RootReducer) => state.userReducer);

  const tabs = [
    { value: "user_information", label: t("USER_INFORMATION") },
    { value: "activity", label: t("ACTIVITY") },
  ];

  const user_uuid = user?.uuid;
  const department_uuid = user?.department?.uuid;

  const handleTabsChange = (_event: ChangeEvent<{}>, value: string): void => {
    setCurrentTab(value);
  };
  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  const getUser = useCallback(async () => {
    setOpenBackdrop(true);
    try {
      const getUser = await userApi.get_user(
        decryptData(atob(router.query.userId as string))
      );
      setUser(getUser.result);
      setOpenBackdrop(false);
    } catch (error) {
      alert(error);
      setOpenBackdrop(false);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const getActivityUser = useCallback(
    async (user_uuid, department_uuid) => {
      setOpenBackdrop(true);

      const limit = "10";
      const offset = "0";
      const keyword = "user";
      const action = "display";

      try {
        const resultUser = await nonWaterApi.getActivityUser(
          limit,
          offset,
          keyword,
          action,
          user_uuid,
          department_uuid
        );

        if (resultUser.code === 200) {
          setOpenBackdrop(false);
          setActivityUser(resultUser?.result);
          // console.log("resultUser", resultUser);
        } else {
          alert("kkk");
          // console.log("resultUser", resultUser);
        }
      } catch (err) {
        setOpenBackdrop(false);
        setActivityUser(null);
        // alert(err);
      }
    },
    [user_uuid, department_uuid]
  );

  useEffect(() => {
    getActivityUser(user_uuid, department_uuid);
    // getActivity();
  }, [getActivityUser]);

  if (!user) {
    return null;
  }

  return (
    <>
      {SimpleBackdrop(openBackdrop)}
      <Head>
        <title>{t("PROFILE")}</title>
      </Head>
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
                  {decryptData(user.first_name) +
                    " " +
                    decryptData(user.last_name)}
                </Typography>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link color="inherit" href={AuthURL.DASHBOARD.HOME}>
                    {t("HOME")}
                  </Link>
                  <Link color="inherit" href={AuthURL.MANAGE_USER}>
                    {t("MANAGE_USER_INFORMATION")}
                  </Link>
                  <Typography color="text.primary">
                    {decryptData(user.first_name) +
                      " " +
                      decryptData(user.last_name)}
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
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabsWrapper>
          </Grid>
          <Grid item xs={12}>
            {currentTab === "activity" && (
              <ActivityTab activityUser={activityUser} />
            )}
            {currentTab === "user_information" && (
              <UserInformationTab user={user} onChange={() => getUser()} />
            )}
          </Grid>
        </Grid>
      </Box>
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
