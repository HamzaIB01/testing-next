import { FC } from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Card,
  CardContent,
  Avatar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import { useRouter } from "next/router";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AuthURL } from "@/constants";

const Results: FC<any> = () => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom>
            {t("รายงานระบบให้บริการข้อมูล")}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card onClick={() => router.push(AuthURL.REPORT_LITS + `/1`)}>
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
                        {t("รายงานระบบให้บริการ")}
                      </Typography>
                    </Stack>
                  </Typography>
                  <Typography noWrap variant="subtitle2">
                    3 {t("LIST")}
                  </Typography>
                </Box>
              </Box>
              <ArrowForwardIosIcon />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Results;
