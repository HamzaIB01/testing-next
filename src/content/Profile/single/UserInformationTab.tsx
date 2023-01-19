import {
  Grid,
  Typography,
  CardContent,
  Card,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import CloseIcon from "@mui/icons-material/Close";
import Text from "src/components/Text";
import Label from "src/components/Label";
import EditUserInformation from "./EditUserInformation";
import { decryptData } from "@/utils/crypto";
import { useAuth } from "@/hooks/useAuth";
import { ConvertDateTimeFormat } from "@/components/FormatConvertDateTime";
import { CitizenNumberFormat } from "@/components/FormantCitizenNumber";
import { PhoneNumberFormat } from "@/components/FormantPhoneNumber";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { ROLE_SCOPE, server } from "@/constants";
import { useCallback, useEffect, useState } from "react";
import { userApi } from "@/actions/user.action";
import { UserResult } from "@/types/user.type";
import { Content } from "@/types/user.type";

export enum PersonalType {
  Personal,
  Organization,
  Contact,
  ChangePassword,
}

function UserInformationTab(props: any) {
  const { t }: { t: any } = useTranslation();
  // const auth = useAuth();
  const [users, setUsers] = useState<Content>();


  const getUser = useCallback(async () => {
    // setOpenBackdrop(true);

    try {
      const uuid = localStorage.getItem(server.UUID);
      const resultUser = await userApi.get_user(uuid);

      if (resultUser?.code === 200) {
        setUsers(resultUser.result);
      }

      // setOpenBackdrop(false);

    } catch (error) {

      setUsers(null);
      // setOpenBackdrop(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  const Verified_EMAIL_Status = (
    verified_email_status: string
  ): JSX.Element => {
    const map = {
      true: {
        text: t("SUCCESSFUL_CONFIRMATION"),
        icon: <DoneTwoToneIcon fontSize="small" />,
        color: "success",
      },
      false: {
        text: t("UNCOMFIRMED"),
        icon: <CloseIcon fontSize="small" />,
        color: "error",
      },
    };

    const { text, icon, color }: any = map[verified_email_status];

    return (
      <Box pl={1} component="span">
        <Label color={color}>
          <Stack spacing={0.3} direction="row">
            {icon}
            <b>{text}</b>
          </Stack>
        </Label>
      </Box>
    );
  };

  return (
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
                {t("PERSONAL_INFORMATION")}
              </Typography>
              <Typography variant="subtitle2">
                {t("MANAGE_PERSONAL_INFORMATION")}
              </Typography>
            </Box>
            {FunctionPermission(ROLE_SCOPE.MANAGE_PROFILE) && (
              <EditUserInformation
                type={PersonalType.Personal}
                editUser={true}
                users={props.users}
                onChangeUpdateUser={(e) => props.onChange(e)}
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
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {t("FULL_NAME")}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>
                      {console.log("users pppp ", props.users)}

                      {decryptData(props.users?.first_name || "-") +
                        " " +
                        decryptData(props.users?.last_name || "-")}
                    </b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {props.users?.people_type === 1 ? t("CITIZEN_NUMBER") : t("PASSPORT")}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>
                      {props?.users?.people_type === 1 ?
                        <CitizenNumberFormat
                          citizenNumber={decryptData(props.users?.citizen_number) || "-"}
                        />
                        : decryptData(props.users?.citizen_number) || "-"
                      }
                    </b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {t("BIRTHDAY")}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>
                      <ConvertDateTimeFormat
                        date={props.users?.birth_date || "-"}
                      />
                    </b>
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
                {t("ORGANIZATION_INFORMATION")}
              </Typography>
              <Typography variant="subtitle2">
                {t("MANAGE_ORGANIZATION_INFORMATION")}
              </Typography>
            </Box>
            {/* <EditUserInformation type={PersonalType.Organization} /> */}
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
                    {t("ORGANIZATION_INFORMATION")}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} sx={{ display: "flex" }}>
                  <Text color="black">
                    <b>
                      {users?.department?.name?.th ?? "-"}
                    </b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {t("PLEASE_SPECIFY")}:
                  </Box>
                </Grid>

                <Grid item xs={12} sm={8} md={9} sx={{ display: "flex" }}>
                  <Text color="black">
                    <b>{users?.department?.uuid && "-"}</b>
                  </Text>

                  {!users?.department?.uuid && (
                    <Box pl={1} component="span">
                      <Label color="success">
                        <Stack spacing={0.3} direction="row">
                          <DoneTwoToneIcon fontSize="small" />
                          <b>
                            {users?.flag.status_flag === "ACTIVE"
                              ? t("SUCCESSFUL_CONFIRMATION")
                              : null
                            }
                          </b>
                        </Stack>
                      </Label>
                    </Box>
                  )}
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
                {t("CONTACT_INFORMATION")}
              </Typography>
              <Typography variant="subtitle2">
                {t("MANAGE_CONTACT_INFORMATION")}
              </Typography>
            </Box>
            {FunctionPermission(ROLE_SCOPE.MANAGE_PROFILE) && (
              <EditUserInformation
                type={PersonalType.Contact}
                users={props.users}
                onChangeUpdateUser={(e) => props.onChange(e)}
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
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {t("PHONE_NUMBER")}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Text color="black">
                    <b>
                      <PhoneNumberFormat
                        phoneNumber={decryptData(props.users?.phone_number) || "-"}
                      />
                    </b>
                  </Text>
                </Grid>
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                  <Box pr={3} pb={2}>
                    {t("EMAIL")}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} sx={{ display: "flex" }}>
                  <Text color="black">
                    <b>{decryptData(props.users?.email || "-")}</b>
                  </Text>
                  {Verified_EMAIL_Status(
                    String(props.users?.flag?.verified_email_flag)
                  )}
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default UserInformationTab;
