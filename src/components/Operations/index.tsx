import { FC, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Grid, Typography } from "@mui/material";
import Link from "../Link";
import { ConvertDateTimeFormat } from "../FormatConvertDateTime";
import Text from "src/components/Text";
import { useRefMounted } from "@/hooks/useRefMounted";
import { userApi } from "@/actions/user.action";
import React from "react";
import { User } from "@/types/user.type";
import { decryptData } from "@/utils/crypto";

const Operations: FC<any> = (props) => {
  const { t }: { t: any } = useTranslation();

  const [userCreate, setUserCreate] = React.useState<string>(
    props.operation.created_by ?? "-"
  );
  const [userUpdate, setUserUpdate] = React.useState<string>(
    props.operation.updated_by ?? "-"
  );

  const getUsers = useCallback(async (user_uuid, type) => {
    try {

      const result = await userApi.get_user(user_uuid);

      if (result?.code === 200) {

        if (type === "created") {
          setUserCreate(
            `${decryptData(result.result?.first_name)} ${decryptData(result.result?.last_name)}`
          );
        } else {

          setUserUpdate(
            `${decryptData(result.result?.first_name)} ${decryptData(result.result?.last_name)}`
          );
        }
      } else {
        if (type === "created") {
          setUserCreate("-")
        } else {
          setUserUpdate("-");
        }
      }

    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {

    const isHEX = (ch) => "0123456789abcdef".includes(ch.toLowerCase());

    const isGuidValid = (guid) => {
      guid = guid?.replaceAll("-", ""); // Format it first!
      return guid?.length === 32 && [...guid].every(isHEX);
    };

    if (isGuidValid(props.operation.created_by)) {
      getUsers(props.operation.created_by, "created")
    }

    if (isGuidValid(props.operation.updated_by)) {
      getUsers(props.operation.updated_by, "updated")
    }


  }, []);

  return (
    <>
      <Typography variant="subtitle2">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid container spacing={0}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: { sm: "end" } }}
              >
                <Box pr={1}>{t("CREATED_BY")}:</Box>
                {userCreate && (
                  <Text color="black">
                    <b> {userCreate ?? "-"}</b>
                    {/* <b>{props.operation?.created_by}</b> */}
                  </Text>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: { sm: "end" } }}
              >
                <Box pr={1}>{t("CREATED_DATE")}:</Box>
                <Text color="black">
                  <ConvertDateTimeFormat
                    date={props.operation?.created_date ?? new Date()}
                  />
                </Text>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={0}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: { sm: "end" } }}
              >
                <Box pr={1}>{t("UPDATED_BY")}:</Box>
                {userUpdate && (
                  <Text color="black">
                    <b> {userUpdate ?? "-"}</b>
                    {/* <b> {props.operation?.updated_by ?? t("-")}</b> */}
                  </Text>
                )}

              </Grid>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: { sm: "end" } }}
              >
                <Box pr={1}>{t("UPDATED_DATE")}:</Box>
                <Text color="black">
                  <ConvertDateTimeFormat
                    date={props.operation?.updated_date ?? "-"}
                  />
                </Text>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={0}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", justifyContent: { sm: "end" } }}
              >
                <Typography variant="subtitle1" marginY={"auto !important"}>
                  <Link href="#">
                    <b>{t("SEE_MORE")}</b>
                  </Link>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Typography>
    </>
  );
};

export default Operations;
function setUserCreate(arg0: string) {
  throw new Error("Function not implemented.");
}
