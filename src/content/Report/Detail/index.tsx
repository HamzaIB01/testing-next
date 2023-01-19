import { FC } from "react";
// import type { User } from "src/models/user";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Breadcrumbs,
  Grid,
  Tooltip,
  Divider,
  CardContent,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "@/components/Link";
import Head from "next/head";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import Text from "src/components/Text";
import Label from "src/components/Label";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useRouter } from "next/router";
import { AuthURL } from "@/constants";

// interface ReportDetailProps {
//   user: User;
// }

const ReportDetail: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const group: any = [
    {
      id: 1,
      label: "สะสม 5 นาที",
      checkbox: false,
    },
    {
      id: 2,
      label: "สะสม 10 นาที",
      checkbox: false,
    },
    {
      id: 3,
      label: "สะสม 15 นาที",
      checkbox: false,
    },
    {
      id: 4,
      label: "สะสม 1 ชม.",
      checkbox: false,
    },
    {
      id: 5,
      label: "สะสม 3 ชม.",
      checkbox: false,
    },
    {
      id: 6,
      label: "สะสม 24 ชม.",
      checkbox: false,
    },
  ];

  return (
    <>
      <Head>
        <title>{t("REQUEST_DATAIL")}</title>
      </Head>

      <Box display="flex" alignItems="center" mb={3}>
        <Tooltip arrow placement="top" title={t("Go back")}>
          <IconButton
            onClick={() => router.back()}
            color="primary"
            size="small"
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
            {t("ปริมาณน้ำฝน (02-02-2021 ถึง 02-02-2021)")}
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href={AuthURL.DASHBOARD.HOME}>
              {t("HOME")}
            </Link>
            <Link color="inherit" href="/admin/search/data">
              {t("IMFORMATION_SERVICE")}
            </Link>
            <Typography color="text.primary">
              {t("ปริมาณน้ำฝน (02-02-2021 ถึง 02-02-2021)")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <Box
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {t("DOWNLOADED_DATA")}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent
              sx={{
                p: 4,
              }}
            >
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("DATA_SET")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>ปริมาณน้ำฝน</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("SINCE")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      1 มกราคม 2565 ถึง 30 มิถุนายน 2565
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("DURATION")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <Stack direction="row" spacing={1}>
                        {group.map((value, index) => {
                          return (
                            <Label color="success" key={index}>
                              {value.label}
                              <CheckCircleOutlineIcon
                                sx={{ fontSize: "15px", marginLeft: "4px" }}
                              />
                            </Label>
                          );
                        })}
                      </Stack>
                    </Text>
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Box
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  {t("DATA_DOWNLOADE_DETAILS")}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <CardContent
              sx={{
                p: 4,
              }}
            >
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("FULL_NAME")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">
                      <b>จริงใจ โชคเจริญดี</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("ORGANIZATION")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9} sx={{ display: "flex" }}>
                    <Text color="black">
                      <b>หน่วยงาน A</b>
                    </Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("DOWNLOAD_DATE")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9} sx={{ display: "flex" }}>
                    <Text color="black">15 มิถุนายน 2565</Text>
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ReportDetail;
