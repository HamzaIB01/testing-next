import { FC } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  CardContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import Text from "src/components/Text";
import DialogMUI, { DialogType } from "@/components/Dialog";
import { DatasetContent } from "@/types/water.type";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { ROLE_SCOPE } from "@/constants";

interface ResultsProps {
  dataset: DatasetContent;
  onChangeConnection: (string) => void;
}

const Results: FC<ResultsProps> = ({ dataset, onChangeConnection }) => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const formik = useFormik({
    initialValues: dataset,
    validationSchema: Yup.object({}),
    onSubmit: async (values) => {
      console.log("submit import config ", values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        {dataset && (
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
                      {t("ข้อมูลพื้นฐาน")}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("จัดการข้อมูลพื้นฐาน")}
                    </Typography>
                  </Box>


                  {FunctionPermission(ROLE_SCOPE.EDIT_IMPORT_CONFIG) && (
                    <DialogMUI
                      code={"EDIT_DATA_IMPORT_DATA"}
                      update={"update_connection"}
                      type={DialogType.EDIT}
                      maxWidth={"md"}
                      title={t("DATA_IMPORT_DATA")}
                      formik={formik}
                      data={dataset}
                      provide_source_uuid={String(router.query.id as string)}
                      onChangeConnect={(e) => onChangeConnection(e)}
                    />
                  )}
                </Box>
                <Divider />
                <CardContent
                  sx={{
                    p: 4,
                  }}
                >
                  <Typography variant="subtitle2">
                    <Grid container spacing={0}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("DURATION")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          {console.log(dataset)}
                          <b>{dataset?.interval?.id ?? "-"}</b>
                        </Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("THAI_NAME")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          <b>{dataset?.name?.th ?? "-"}</b>
                        </Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("ENGLISH_NAME")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          <b>{dataset?.name?.en ?? "-"}</b>
                        </Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("THAI_DETAILS")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          {dataset?.description?.th ?? "-"}
                        </Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("ENGLISH_DETAILS")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          {dataset?.description?.en ?? "-"}
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
                      {t("ข้อมูลการเชื่อมต่อ")}
                    </Typography>
                    <Typography variant="subtitle2">
                      {t("จัดการข้อมูลการเชื่อมต่อ")}
                    </Typography>
                  </Box>

                  {FunctionPermission(ROLE_SCOPE.EDIT_IMPORT_CONFIG) && (
                    <DialogMUI
                      code={"EDIT_RESPONSIBLE_PERSON_INFORMATION"}
                      update={"update_connection"}
                      type={DialogType.EDIT}
                      maxWidth={"md"}
                      title={t("RESPONSIBLE_PERSON_INFORMATION")}
                      formik={formik}
                      data={dataset}
                      provide_source_uuid={String(router.query.id as string)}
                      onChangeConnect={(e) => onChangeConnection(e)}
                    />
                  )}
                </Box>
                <Divider />
                <CardContent
                  sx={{
                    p: 4,
                  }}
                >
                  <Typography variant="subtitle2">
                    <Grid container spacing={0}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("รูปแบบของข้อมูลที่ได้รับ")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">ชุดข้อมูลมาตรฐาน</Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("PROTOCAL")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black"> {dataset?.protocol ?? "-"}</Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("HOST")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black"> {dataset?.host ?? "-"}</Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("HTTP_REQUEST")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          {" "}
                          {dataset?.http_request ?? "-"}
                        </Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("HOW_TO_AUTHENTICATION")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">{dataset?.api_key ?? "-"}</Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("CRON_TAB")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">{dataset?.crontab ?? "-"}</Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("SLA_TIME_MINUTES")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">{dataset?.sla_time ?? "-"}</Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("MAXIMUM_CONNECTIONS_TIMES")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">{dataset?.retry_count ?? "-"}</Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("ROUTE")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">{dataset?.route ?? "-"}</Text>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("PARAMETER")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          {`latest=${String(
                            dataset.parameter?.latest ?? "-"
                          )}&startDate=${dataset.parameter?.startDatetime
                            }&endDate=${dataset.parameter?.endDatetime
                            }&interval=${dataset.parameter?.interval}`}
                        </Text>
                      </Grid>
                    </Grid>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </form>
    </>
  );
};

export default Results;
