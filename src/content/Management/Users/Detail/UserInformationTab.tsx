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
import { decryptData } from "@/utils/crypto";
import { ROLE_SCOPE } from "@/constants";
import { useRouter } from "next/router";
import DialogMUI, { DialogType } from "@/components/Dialog";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { PhoneNumberFormat } from "@/components/FormantPhoneNumber";

export enum PersonalType {
  Personal,
  Organization,
  Contact,
  ChangePassword,
}

function UserInformationTab(props: any) {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  const Verified_EMAIL_Status = (
    verified_email_status: boolean
  ): JSX.Element => {
    return (
      <Box pl={1} component="span">
        <Label color={verified_email_status ? "success" : "error"}>
          <Stack spacing={0.3} direction="row">
            {verified_email_status ? (
              <DoneTwoToneIcon fontSize="small" />
            ) : (
              <CloseIcon fontSize="small" />
            )}
            <b>
              {verified_email_status
                ? t("SUCCESSFUL_CONFIRMATION")
                : t("UNCOMFIRMED")}
            </b>
          </Stack>
        </Label>
      </Box>
    );
  };

  const Verified_DEPARTMENT_Status = (
    verified_department_status: boolean
  ): JSX.Element => {
    return (
      <Box pl={1} component="span">
        <Label color={verified_department_status ? "success" : "error"}>
          <Stack spacing={0.3} direction="row">
            {verified_department_status ? (
              <DoneTwoToneIcon fontSize="small" />
            ) : (
              <CloseIcon fontSize="small" />
            )}
            <b>
              {verified_department_status
                ? t("SUCCESSFUL_CONFIRMATION")
                : t("UNCOMFIRMED")}
            </b>
          </Stack>
        </Label>
      </Box>
    );
  };

  const Verified_USER_Status = (verified_user_status: boolean): JSX.Element => {
    return (
      <Box pl={1} component="span">
        <Label color={verified_user_status ? "success" : "error"}>
          <Stack spacing={0.3} direction="row">
            {verified_user_status ? (
              <DoneTwoToneIcon fontSize="small" />
            ) : (
              <CloseIcon fontSize="small" />
            )}
            <b>
              {verified_user_status
                ? t("SUCCESSFUL_CONFIRMATION")
                : t("UNCOMFIRMED")}
            </b>
          </Stack>
        </Label>
      </Box>
    );
  };

  const initialValues = {
    uuid: props?.user?.uuid,
    first_name: props.user?.first_name,
    last_name: props.user?.last_name,
    phone_number: props.user?.phone_number,
    email: props.user?.email,
    department_uuid: props.user?.department,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({}),
    onSubmit: (values) => {
      console.log(values);
    },
  });

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

            {router.query.type === "EDIT_USER" && (
              <DialogMUI
                code={"EDIT_USER_PERSONAL_INFORMATION"}
                update={"update_user"}
                params={"profile"}
                type={DialogType.EDIT}
                maxWidth={"md"}
                title={t("PERSONAL_INFORMATION")}
                formik={formik}
                data={initialValues}
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
                <Grid item xs={12} sm={8} md={9} sx={{ display: "flex" }}>
                  {router.query.type !== "EDIT_USER" && (
                    <>
                      <Text color="black">
                        {console.log("props.user", props.user.first_name)}
                        <b>
                          {decryptData(props.user.first_name) +
                            " " +
                            decryptData(props.user.last_name)}
                        </b>
                      </Text>

                      {Verified_USER_Status(props.user.flag?.status_flag)}
                    </>
                  )}

                  {router.query.type === "EDIT_USER" && (
                    <>
                      <Text color="black">
                        <b>
                          {decryptData(props.user.first_name) +
                            " " +
                            decryptData(props.user.last_name)}
                        </b>
                      </Text>
                    </>
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
                {t("ORGANIZATION_INFORMATION")}
              </Typography>
              <Typography variant="subtitle2">
                {t("MANAGE_ORGANIZATION_INFORMATION")}
              </Typography>
            </Box>

            {router.query.type === "EDIT_USER" &&
              FunctionPermission(ROLE_SCOPE.EDIT_PROVIDE_SOURCE) && (
                <DialogMUI
                  code={"EDIT_USER_ORGANIZATION_INFORMATION"}
                  update={"update_user"}
                  params={"department"}
                  type={DialogType.EDIT}
                  maxWidth={"md"}
                  title={t("ORGANIZATION_INFORMATION")}
                  formik={formik}
                  data={initialValues}
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
                    {t("ORGANIZATION")}:
                  </Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} sx={{ display: "flex" }}>
                  {router.query.type !== "EDIT_USER" && (
                    <>
                      <Text color="black">
                        <b>{props.user?.department?.name?.th}</b>
                      </Text>

                      {Verified_DEPARTMENT_Status(
                        props.user?.department?.flag.status_flag
                      )}
                    </>
                  )}
                  {router.query.type === "EDIT_USER" && (
                    <>
                      <Text color="black">
                        <b>{props.user.department?.name?.th || "-"}</b>
                      </Text>
                    </>
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

            {router.query.type === "EDIT_USER" && (
              <DialogMUI
                code={"EDIT_USER_CONTACT_INFORMATION"}
                update={"update_user"}
                params={"contract"}
                type={DialogType.EDIT}
                maxWidth={"md"}
                title={t("CONTACT_INFORMATION")}
                formik={formik}
                data={initialValues}
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
                        phoneNumber={
                          decryptData(props.user?.phone_number) || "-"
                        }
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
                  {router.query.type !== "EDIT_USER" && (
                    <>
                      <Text color="black">
                        <b>{decryptData(props.user.email || "-")}</b>
                      </Text>

                      {Verified_EMAIL_Status(
                        props.user?.flag?.verified_email_flag
                      )}
                    </>
                  )}

                  {router.query.type === "EDIT_USER" && (
                    <>
                      <Text color="black">
                        <b>{decryptData(props.user.email || "-")}</b>
                      </Text>
                    </>
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
