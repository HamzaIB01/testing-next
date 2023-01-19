import { FC } from "react";
// import PropTypes from "prop-types";
import {
  Box,
  Card,
  Grid,
  Typography,
  CardContent,
  Stack,
  Avatar,
} from "@mui/material";
// import type { User } from "src/models/user";
import { useTranslation } from "react-i18next";
// import { useFormik } from "formik";
// import * as Yup from "yup";
import React from "react";
import { useRouter } from "next/router";
// import { useRefMounted } from "@/hooks/useRefMounted";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AuthURL } from "@/constants";

// interface ResultsProps {
//   users: User[];
// }

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  // const isMountedRef = useRefMounted();
  const router = useRouter();

  const tab: any = {
    all: "all",
    one: "admin",
    two: "customer",
    three: "subscriber",
  };

  const tabs = [
    {
      id: 1,
      value: tab.all,
      label: t("USER_REPORT"),
    },
    {
      id: 2,
      value: tab.one,
      label: t("รายงานบัญชีผู้ใช้ที่ครบกำหนดตรวจสอบ"),
    },
    {
      id: 3,
      value: tab.two,
      label: t("รายงานบัญชีผู้ใช้ที่ไม่เคลื่อนไหว"),
    },
    {
      id: 4,
      value: tab.three,
      label: t("รายงานบัญชีผู้ใช้ใหม่"),
    },
  ];

  const list_sum = tabs.length;

  // const getReport = useCallback(async (parameter, keyword, type = "") => {
  //   try {
  //     const reportResult = await reportApi.getExportReport(
  //       parameter,
  //       keyword,
  //       type
  //     );
  //     setReportData(reportResult?.content);
  //   } catch (err) {
  //     setReportData([]);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (filters.type === 0) {
  //     getReport("", "information-service", "CN_MTWS2");
  //   } else if (filters.type === 1) {
  //     getReport("", "manual-export");
  //   } else {
  //     getReport("", "api");
  //   }
  // }, [filters]);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom>
            {t("MASTER_DATA_MANAGEMENT_SYSTEM_REPORT")}
          </Typography>
        </Grid>

        {/* {tabs.map((tab, index) => ( */}
        {/* <Grid item xs={12} sm={6} md={4} key={index}> */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() => router.push(AuthURL.MANAGE_USER_REPORT_LITS + 1)}
          >
            <CardContent
              sx={{
                padding: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 1,
                  }}
                >
                  <FolderOpenIcon />
                </Avatar>
                <Box>
                  <Typography fontWeight="bold">
                    <Stack direction="row" spacing={1}>
                      <Typography variant="h4">
                        {/* {tab.label} */}
                        {t("MASTER_DATA_MANAGEMENT_SYSTEM_REPORT")}
                      </Typography>
                    </Stack>
                  </Typography>
                  <Typography noWrap variant="subtitle2">
                    {list_sum} {t("LIST")}
                  </Typography>
                </Box>
              </Box>
              <ArrowForwardIosIcon />
            </CardContent>
          </Card>
        </Grid>
        {/* ))} */}
      </Grid>
    </>
  );
};

// Results.propTypes = {
//   users: PropTypes.array.isRequired,
// };

// Results.defaultProps = {
//   users: [],
// };

export default Results;
