import { FC } from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import { useRouter } from "next/router";
import { TableType } from "@/components/TableComponent";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AuthURL } from "@/constants";

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const tabs = [
    {
      value: "data_report_not_update",
      label: t("THE_DATA_REPORT_NOT_UPDATE"),
      type: TableType.DATA_REPORT_NOT_UPDATE,
    },
    {
      value: "data_integrity_report",
      label: t("DATA_INTEGRITY_REPORT"),
      type: TableType.DATA_INTEGRITY_REPORT,
    },
    {
      value: "data_accuracy_report",
      label: t("DATA_ACCURACY_REPORT"),
      type: TableType.DATA_ACCURACY_REPORT,
    },
    {
      value: "report_timeliness_data",
      label: t("REPORT_TIMELINESS_DATA"),
      type: TableType.REPORT_TIMELINESS_DATA,
    },
    {
      value: "data_import_work_history",
      label: t("DATA_IMPORT_WORK_HISTORY"),
      type: TableType.DATA_IMPORT_WORK_HISTORY,
    },
  ];

  const list_sum = tabs.length;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom>
            {t("CONNECT_AND_IMPORT_REPORTS")}
          </Typography>
        </Grid>

        {/* {tabs.map((tab, index) => ( */}
        {/* <Grid item xs={12} sm={6} md={4} key={index}> */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            onClick={() =>
              router.push(AuthURL.CONNECT_AND_IMPORT_REPORTS + `/lits/1`)
            }
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
                        {t("CONNECT_AND_IMPORT_REPORTS")}
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

export default Results;
