import { useState } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { wait } from "src/utils/wait";

import {
  Dialog,
  DialogContent,
  Button,
  Box,
  styled,
  DialogTitle,
  Divider,
  Typography,
  Slide,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useSnackbar } from "notistack";
import { PersonalComponent } from "@/components/PersonalComponents/PersonalComponents";
import { PersonalContactComponent } from "@/components/PersonalComponents/PersonalContactComponents";
import { PersonalOrganizationComponent } from "@/components/PersonalComponents/PersonalOrganizationComponents";
import { decryptData } from "@/utils/crypto";
import { PersonalType } from "./UserInformationTab";
import { useAuth } from "@/hooks/useAuth";
import { passwordApi } from "@/actions/password.action";
import { encryptWithPublicKey } from "@/utils/nodeForge";
import { userApi } from "@/actions/user.action";
import { ValidateFirstName } from "@/components/Validations/FirstName.validation";
import { ValidateLastName } from "@/components/Validations/LastName.validation";
import { ValidatePhoneNumber } from "@/components/Validations/PhoneNumber.validation";
import { ValidateEmail } from "@/components/Validations/Email.validation";
import {
  ValidateConfirmNewPassword,
  ValidateNewPassword,
  ValidateOldPassword,
} from "@/components/Validations/Password.validation";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { ROLE_SCOPE, server } from "@/constants";

const DialogActions = styled(Box)(
  ({ theme }) => `
       background: ${theme.colors.alpha.black[5]}
    `
);

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
         border-radius: ${theme.general.borderRadius};
         padding: ${theme.spacing(2)};
         background: ${theme.colors.alpha.black[5]};
         border: 1px dashed ${theme.colors.alpha.black[30]};
         outline: none;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         transition: ${theme.transitions.create(["border", "background"])};
         min-height: 320px;
     
         &:hover {
           background: ${theme.colors.alpha.white[50]};
           border-color: ${theme.colors.primary.main};
         }
     `
);

function EditUserInformation(props: any) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  // const { editUser } = props;
  const auth = useAuth();

  const handleCreateUserOpen = () => {
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setOpen(false);
  };

  // const handleCreateUserSuccess = () => {
  //   enqueueSnackbar(t("The user account was created successfully"), {
  //     variant: "success",
  //     anchorOrigin: {
  //       vertical: "top",
  //       horizontal: "right",
  //     },
  //     TransitionComponent: Slide,
  //   });

  //   setOpen(false);
  // };

  const statusOptions = [
    {
      id: "1",
      name: "บัตรประจำตัวประชาชนไทย",
    },
    {
      id: "2",
      name: "หนังสือเดินทาง",
    },
  ];

  const initialValuesPersonal = {
    first_name: decryptData(props?.users?.first_name || ""),
    last_name: decryptData(props?.users?.last_name || ""),
    citizen_number: decryptData(props?.users?.citizen_number || ""),
    laser_code: decryptData(props?.users?.laser_code || ""),
    birth_date: props?.users?.birth_date,
    citizen_number_type: statusOptions[0].id,
  };

  const initialValuesOrganization = {
    department_uuid: auth.user?.department?.uuid || "",
  };

  const initialValuesContact = {
    email: decryptData(props?.users?.email || "-"),
    phone_number: decryptData(props?.users?.phone_number || "-"),
  };

  const initialValuesChangePassword = {
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  };

  // Import validate
  const first_name = ValidateFirstName();
  const last_name = ValidateLastName();
  const phone_number = ValidatePhoneNumber();
  const email = ValidateEmail();

  const old_password = ValidateOldPassword();
  const new_password = ValidateNewPassword();
  const confirm_new_password = ValidateConfirmNewPassword();

  const validate = (type: PersonalType) => {
    switch (type) {
      case PersonalType.Personal: //"PERSONAL_INFORMATION":
        return Yup.object().shape({
          ...first_name,
          ...last_name,
        });
      case PersonalType.Contact: //"CONTACT_INFORMATION":
        return Yup.object().shape({
          ...email,
          ...phone_number,
        });
      case PersonalType.Organization: //"ORGANIZATION_INFORMATIONS":
        // if (initialValuesOrganization.organization === 3) {
        //   return Yup.object().shape({
        //     detail: Yup.string()
        //       .max(55)
        //       .required(t("The detail field is required")),
        //   });
        // }
        return;
      default:
        return Yup.object().shape({
          ...old_password,
          ...new_password,
          ...confirm_new_password,
        });
    }
  };

  const changePass = async (old_password, new_password): Promise<void> => {
    try {
      // const device = await authApi.device();

      const result = await passwordApi.change_password(
        old_password,
        new_password
      );

      console.log("passwordApi", result);

      if (result.code === 200) {
        enqueueSnackbar(t(`${result.status}`), {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 2000,
          TransitionComponent: Slide,
        });
        handleCreateUserClose(); // close dialog
      } else {
        enqueueSnackbar(t(`${result.message}`), {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 2000,
          TransitionComponent: Slide,
        });
      }
    } catch (error) {
      enqueueSnackbar(t(`${error.response.data.description.message}`), {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        autoHideDuration: 5000,
        TransitionComponent: Slide,
      });
    }
  };

  return (
    <>
      {props.type !== PersonalType.ChangePassword &&
        FunctionPermission(ROLE_SCOPE.EDIT_PROFILE) && (
          <Button
            variant="text"
            startIcon={<EditIcon />}
            onClick={handleCreateUserOpen}
          >
            {t("EDIT")}
          </Button>
        )}

      {props.type === PersonalType.ChangePassword && (
        <Button variant="outlined" size="large" onClick={handleCreateUserOpen}>
          {t("CHANGE_PASSWORD")}
        </Button>
      )}

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateUserClose}
      >
        <Formik
          {...props}
          initialValues={
            props.type == PersonalType.Personal //"PERSONAL_INFORMATION"
              ? initialValuesPersonal
              : props.type == PersonalType.Contact //"CONTACT_INFORMATION"
              ? initialValuesContact
              : props.type == PersonalType.Organization //"ORGANIZATION_INFORMATIONS"
              ? initialValuesOrganization
              : initialValuesChangePassword
          }
          validationSchema={validate(props.type)}
          onSubmit={async (
            values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            var body: any = null;
            var path: string = "";
            // if (props.type === PersonalType.Organization) {
            //   if (initialValuesOrganization.organization !== 3) {
            //     values.detail = "";
            //   }
            //   values.organization = initialValuesOrganization.organization;
            // }

            if (props.type === PersonalType.ChangePassword) {
              await changePass(
                initialValuesChangePassword.old_password,
                initialValuesChangePassword.new_password
              );
            } else {
              if (
                props.type === PersonalType.Personal ||
                props.type === PersonalType.Organization
              ) {
                body = {
                  first_name: await encryptWithPublicKey(values.first_name),
                  last_name: await encryptWithPublicKey(values.last_name),
                };
                path = "info";

                try {
                  const result = await userApi.update_Profile(body, path);
                  if (result) {
                    if (result.code === 200) {
                      enqueueSnackbar(t(`${result.status}`), {
                        variant: "success",
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "right",
                        },
                        autoHideDuration: 2000,
                        TransitionComponent: Slide,
                      });
                      setOpen(false);
                      props.onChangeUpdateUser("UpdateUser");
                    } else {
                      enqueueSnackbar(t(`${result.description.message}`), {
                        variant: "error",
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "right",
                        },
                        autoHideDuration: 2000,
                        TransitionComponent: Slide,
                      });
                    }
                  }
                } catch (error) {
                  enqueueSnackbar(
                    t(`${error.response.data.description.message}`),
                    {
                      variant: "error",
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                      autoHideDuration: 5000,
                      TransitionComponent: Slide,
                    }
                  );
                }
              } else if (props.type === PersonalType.Contact) {
                body = {
                  phone_number: await encryptWithPublicKey(
                    values.phone_number.split("-").join("")
                  ),
                  email: await encryptWithPublicKey(values.email),
                };

                const uuid = JSON.parse(localStorage.getItem(server.USER)).uuid;
                path = `${uuid}?operator=contract`;
                try {
                  const result = await userApi.update_Profile(body, path);

                  if (result.code === 200) {
                    enqueueSnackbar(t(`${result.status}`), {
                      variant: "success",
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                      autoHideDuration: 2000,
                      TransitionComponent: Slide,
                    });
                    setOpen(false);
                    props.onChangeUpdateUser("UpdateUser");
                  } else {
                    enqueueSnackbar(t(`${result.description.message}`), {
                      variant: "error",
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                      autoHideDuration: 2000,
                      TransitionComponent: Slide,
                    });
                  }
                } catch (error) {
                  enqueueSnackbar(
                    t(`${error.response.data.description.message}`),
                    {
                      variant: "error",
                      anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                      },
                      autoHideDuration: 5000,
                      TransitionComponent: Slide,
                    }
                  );
                }
              }
            }

            try {
              await wait(1000);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              // handleCreateUserSuccess();
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form autoComplete="off">
              <DialogTitle
                sx={{
                  p: 3,
                }}
              >
                <Typography variant="h4" gutterBottom m={0}>
                  {props.type === PersonalType.Personal
                    ? t("EDIT_PERSONAL_INFORMATION")
                    : props.type === PersonalType.Contact
                    ? t("EDIT_CONTACT_INFORMATION")
                    : props.type !== PersonalType.ChangePassword
                    ? t("EDIT_ORGNIZATION_INFORMATION")
                    : t("CHANGE_PASSWORD")}
                </Typography>
              </DialogTitle>
              <Divider />
              <DialogContent
                sx={{
                  p: 4,
                }}
              >
                {props.type === PersonalType.Personal ? (
                  <PersonalComponent
                    hidden={false}
                    getInitial={initialValuesPersonal}
                    onChange={(e: any) =>
                      (initialValuesPersonal.citizen_number_type = e)
                    }
                  />
                ) : props.type === PersonalType.Contact ? (
                  <PersonalContactComponent
                    type={"EDIT"}
                    leftFieldTitle={t("EMAIL")}
                    rightFieldTitle={t("PHONE_NUMBER")}
                    getInitial={initialValuesContact}
                  />
                ) : props.type !== PersonalType.ChangePassword ? (
                  <PersonalOrganizationComponent
                    registation={true}
                    BoxUploadWrapper={BoxUploadWrapper}
                    getInitial={initialValuesOrganization}
                  />
                ) : (
                  <PersonalContactComponent
                    type={PersonalType.ChangePassword}
                    leftFieldTitle={t("NEW_PASSWORD")}
                    rightFieldTitle={t("CONFIRM_NEW_PASSWORD")}
                    leftName={"new_password"}
                    rightName={"confirm_new_password"}
                    getInitial={initialValuesChangePassword}
                  />
                )}
              </DialogContent>
              <DialogActions
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button
                  color="error"
                  variant="contained"
                  onClick={handleCreateUserClose}
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  type="submit"
                  disabled={Boolean(!isValid)}
                  variant="contained"
                >
                  {t("SAVE")}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default EditUserInformation;
