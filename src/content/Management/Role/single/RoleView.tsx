import { FC, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
// import type { User } from "src/models/user";
import {
  Box,
  Button,
  Typography,
  Card,
  Tooltip,
  IconButton,
  Breadcrumbs,
  Grid,
  Divider,
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  styled,
  Autocomplete,
  Slide,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import Link from "@/components/Link";
import Text from "src/components/Text";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Label from "@/components/Label";
import { useFormik } from "formik";
import * as Yup from "yup";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { roleApi } from "@/actions/role.action";
import { ScopeResult } from "@/types/scope.type";
import { Department } from "@/types/user.type";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { AuthURL, ROLE_SCOPE, server } from "@/constants";
import { ValidateNameThai } from "@/components/Validations/NameThai.validation";
import { ValidateNameEnglish } from "@/components/Validations/NameEnglish.validation";
import { ValidateDescriptionThai } from "@/components/Validations/DescriptionThai.validation";
import { ValidateDescriptionEnglish } from "@/components/Validations/DescriptionEnglish.validation";
import { useSnackbar } from "notistack";
import Operations from "@/components/Operations";
import { tags } from "@/mocks/tags";

const DialogActions = styled(Box)(
  ({ theme }) => `
      background: ${theme.colors.alpha.black[5]}
   `
);

interface RoleViewProps {
  groups?: Department;
  scope: ScopeResult;
  tabs: Department[];
  onChangeRole: (number) => void;
}

// const initialUser = [
//   {
//     id: 1,
//     thai_system_name: "จัดการผู้ใช้งาน",
//     enlish_system_name: "Manage user",
//     group: [
//       {
//         id: 1,
//         label: "เพิ่มผู้ใชงาน",
//         checkbox: false,
//       },
//       {
//         id: 2,
//         label: "ดูข้อมูลผู้ใช้งาน",
//         checkbox: false,
//       },
//       {
//         id: 3,
//         label: "ลบผู้ใช้งาน",
//         checkbox: false,
//       },
//       {
//         id: 4,
//         label: "แก้ไขผู้ใช้งาน",
//         checkbox: false,
//       },
//       {
//         id: 5,
//         label: "อนุมัติผู้ใช้งาน",
//         checkbox: false,
//       },
//       {
//         id: 6,
//         label: "ดูรายงานผู้ใช้งาน",
//         checkbox: false,
//       },
//     ],
//   },
//   {
//     id: 2,
//     thai_system_name: "จัดการกลุ่มผู้ใช้งาน",
//     enlish_system_name: "Manage role",
//     group: [
//       {
//         label: "เพิ่มกลุ่มผู้ใชงาน",
//         checkbox: true,
//       },
//       {
//         label: "ดูข้อมูลกลุ่มผู้ใช้งาน",
//         checkbox: true,
//       },
//       {
//         label: "ลบกลุ่มผู้ใช้งาน",
//         checkbox: true,
//       },
//       {
//         label: "แก้ไขกลุ่มผู้ใช้งาน",
//         checkbox: true,
//       },
//     ],
//   },
//   {
//     id: 3,
//     thai_system_name: "จัดการผู้ใช้งาน",
//     enlish_system_name: "Manage role premission",
//     group: [
//       {
//         label: "ดูข้อมูลสิทธิการใช้งาน",
//         checkbox: true,
//       },
//       {
//         label: "แก้ไขสิทธิการใช้งาน",
//         checkbox: true,
//       },
//     ],
//   },
// ];

// const reducer = (state, action) => {
//   switch (action.type) {
//     case "COMPLETE":
//       return state.map((user) => {
//         if (user.id === action.id) {
//           // console.log(user.group);

//           // user.group.map((value) => {

//           //    console.log(value.id, '===', action.sub_id);
//           //    // console.log(action.sub_id);

//           //    if (value.id === action.sub_id) {

//           //       console.log(value.checkbox);

//           //       return {
//           //          ...user, checkbox: !value.checkbox
//           //       }
//           //       // return user;

//           //    } else {
//           //       return user;
//           //    }

//           // })

//           return { ...user, checkbox: !user.checkbox };

//           // user.group.map((value) => {
//           //    console.log(value.checkbox);
//           //    return {
//           //       ...user,
//           //       checkbox: !value.checkbox,
//           //    }
//           // })
//         } else {
//           // console.log(user);

//           return user;
//         }
//       });
//     default:
//       return state;
//   }
// };

const RoleView: FC<RoleViewProps> = ({
  groups,
  scope,
  tabs,
  onChangeRole,
}: any) => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  // const [state, dispatch] = useReducer(reducer, initialUser);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  // const sub_scope = FunctionPermission(router.route);
  // const permission = (func: any): boolean => {
  //   return sub_scope.some((sub) => sub.code.includes(func));
  // };

  const handleCreateUserOpen = () => {
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    formik.setFieldValue("name.th", groups?.name?.th ?? "-");
    formik.setFieldValue("name.en", groups?.name?.en ?? "-");
    formik.setFieldValue("description.th", groups?.description?.th ?? "-");
    formik.setFieldValue("description.en", groups?.description?.en ?? "-");
    formik.setFieldValue("ref_id", Number(groups?.ref_id?.id) ?? null);
    formik.setFieldValue("tag", groups?.tag ?? "-");
  }, [groups]);

  const name_th = ValidateNameThai();
  const name_en = ValidateNameEnglish();
  const description_th = ValidateDescriptionThai();
  const description_en = ValidateDescriptionEnglish();

  const formik = useFormik({
    initialValues: {
      name: {
        th: groups?.name?.th,
        en: groups?.name?.en,
      },
      description: {
        th: groups?.description?.th,
        en: groups?.description?.en,
      },
      tag: groups?.tag,
      color_hex_value: groups?.color_hex_value,
      ref_id: Number(groups?.ref_id?.id),
    },
    validationSchema: Yup.object({
      name: Yup.object({
        ...name_th,
        ...name_en,
      }),
      description: Yup.object({
        ...description_th,
        ...description_en,
      }),
      tag: Yup.string().required(t(t("PLEASE_SELECT") + t("TAG"))),
      // color_hex_value: "",
      ref_id: Yup.string().required(
        t(t("PLEASE_SELECT") + t("SUB_USER_GROUP_OF"))
      ),
    }),
    onSubmit: async (values) => {
      // console.log("vas ", values);
      try {
        const result: any = await roleApi.update_Scope(groups?.id, values);

        if (result?.code == 200) {
          enqueueSnackbar("update Succes!", {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 2000,
            TransitionComponent: Slide,
          });
          handleCreateUserClose();
          onChangeRole(groups?.id);
        }
      } catch (err) {
        enqueueSnackbar(err.response.data.description.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 5000,
          TransitionComponent: Slide,
        });
      }
    },
  });

  return (
    <>
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
            {localStorage.getItem(server.LANGUAGE) == "th"
              ? groups?.name?.th
              : groups?.name?.en}
          </Typography>
          <Breadcrumbs maxItems={3} aria-label="breadcrumb">
            <Link color="inherit" href={AuthURL.DASHBOARD.HOME}>
              {t("HOME")}
            </Link>
            <Link color="inherit" href={AuthURL.MANAGE_ROLE}>
              {t("MANAGE_DATE_MANAGEMENT")}
            </Link>
            <Typography color="text.primary">
              {localStorage.getItem(server.LANGUAGE) == "th"
                ? groups?.name?.th
                : groups?.name?.en}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {FunctionPermission(ROLE_SCOPE.VIEW_ROLE) && (
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
                    {t("USER_GROUP_INFORMATION")}
                  </Typography>
                  <Typography variant="subtitle2">
                    {t("MANAGE_USER_GROUP_INFORMATION")}
                  </Typography>
                </Box>
                {FunctionPermission(ROLE_SCOPE.EDIT_ROLE) && (
                  <Button
                    variant="text"
                    startIcon={<EditIcon />}
                    onClick={handleCreateUserOpen}
                  >
                    {t("EDIT")}
                  </Button>
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
                        {t("THAI_NAME")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        <b>{groups?.name?.th ?? "-"}</b>
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
                        <b>{groups?.name?.en ?? groups?.name?.name_en}</b>
                      </Text>
                    </Grid>
                    {groups?.ref_id?.name?.th && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={3}
                          textAlign={{ sm: "right" }}
                        >
                          <Box pr={3} pb={2}>
                            {t("SUB_USER_GROUP_OF")}:
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={8} md={9}>
                          <Text color="black">
                            {groups?.ref_id?.name?.th ?? "-"}
                          </Text>
                        </Grid>
                      </>
                    )}
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
                        {groups?.description?.th || "-"}
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
                        {groups?.description?.en || "-"}
                      </Text>
                    </Grid>
                  </Grid>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

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
                  {t("LICENSE_INFORMATION")}
                </Typography>
                <Typography variant="subtitle2">
                  {t("MANAGE_LICENSE_INFORMATION")}
                </Typography>
              </Box>
              {FunctionPermission(ROLE_SCOPE.OPEN_CLOSE_ROLE) && (
                <NextLink
                  href={AuthURL.MANAGE_ROLE_PERMISSION + router.query.userId}
                >
                  <Button component="a" startIcon={<EditIcon />}>
                    {t("EDIT")}
                  </Button>
                </NextLink>
              )}
            </Box>
            <Divider />
            <CardContent
              sx={{
                p: 0,
              }}
            >
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("NO.")}</TableCell>
                      <TableCell>{t("THAI_SYSTEM_NAME")}</TableCell>
                      <TableCell>{t("ENGLISH_SYSTEM_NAME")}</TableCell>
                      <TableCell>{t("USER_GROUP")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scope && scope.length ? (
                      scope.map((scopes, index) => {
                        return (
                          <TableRow key={scopes.id}>
                            <TableCell align="center">
                              <Typography fontWeight="bold">
                                {index + 1}
                              </Typography>
                            </TableCell>
                            <TableCell>{scopes?.name?.th}</TableCell>
                            <TableCell>{scopes?.name?.en}</TableCell>
                            <TableCell>
                              <Grid container spacing={1}>
                                {scopes?.sub_scopes
                                  ? scopes?.sub_scopes.map((value, index) => {
                                      return (
                                        <Grid item key={index}>
                                          <Label color="success">
                                            {value.name.th}
                                            <CheckCircleOutlineIcon
                                              sx={{
                                                fontSize: "15px",
                                                marginLeft: "4px",
                                              }}
                                            />
                                          </Label>
                                        </Grid>
                                      );
                                    })
                                  : "-"}
                              </Grid>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow key={0}>
                        <TableCell align="center">
                          <Typography fontWeight="bold">
                            {"ไม่พบข้อมูล"}
                          </Typography>
                        </TableCell>
                        <TableCell>{"ไม่พบข้อมูล"}</TableCell>
                        <TableCell>{"ไม่พบข้อมูล"}</TableCell>
                        <TableCell>{"ไม่พบข้อมูล"}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {groups && (
            <Operations
              operation={groups?.operation}
              // onChangeRole={() => onChangeRole}
            />
          )}
        </Grid>
      </Grid>

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateUserClose}
      >
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4">
            {t("EDIT_USER_GROUP_INFORMATION")}
          </Typography>
        </DialogTitle>
        <Divider />
        <form onSubmit={formik.handleSubmit}>
          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      error={Boolean(
                        formik.touched.name?.th && formik.errors.name?.th
                      )}
                      fullWidth
                      helperText={
                        formik.touched.name?.th ? (
                          formik.errors.name?.th
                        ) : formik.values.name.th === "" ? (
                          <span
                            className="Mui-error css-74zzzz-MuiFormHelperText-root"
                            style={{ margin: "0px" }}
                          >
                            * {t("PLEASE_ENTER") + t("THAI_NAME")}
                          </span>
                        ) : null
                      }
                      label={t("THAI_NAME")}
                      name="name.th"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values?.name?.th ?? "-"}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      error={Boolean(
                        formik.touched.name?.en && formik.errors.name?.en
                      )}
                      fullWidth
                      helperText={
                        formik.touched.name?.en ? (
                          formik.errors.name?.en
                        ) : formik.values.name.en === "" ? (
                          <span
                            className="Mui-error css-74zzzz-MuiFormHelperText-root"
                            style={{ margin: "0px" }}
                          >
                            * {t("PLEASE_ENTER") + t("THAI_NAME")}
                          </span>
                        ) : null
                      }
                      label={t("ENGLISH_NAME")}
                      name="name.en"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.name?.en}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      disablePortal
                      options={tabs}
                      getOptionLabel={(option: any) => option.name.th ?? option}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option.name.th === value.name.th
                      }
                      defaultValue={groups?.ref_id}
                      onChange={(_e, value: any | null) =>
                        formik.setFieldValue(
                          "ref_id",
                          value !== null ? Number(value.ref_id) : ""
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(
                            formik.touched.ref_id && formik.errors.ref_id
                          )}
                          fullWidth
                          name="ref_id"
                          helperText={
                            formik.touched.ref_id && formik.errors.ref_id
                          }
                          label={t("SUB_USER_GROUP_OF")}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      disablePortal
                      options={tags}
                      getOptionLabel={(option: any) => option.code ?? option}
                      isOptionEqualToValue={(option: any, value: any) =>
                        option?.code === value?.code
                      }
                      defaultValue={groups?.tag}
                      onChange={(_e, value: any | null) =>
                        formik.setFieldValue(
                          "tag",
                          value !== null ? value.code : ""
                        )
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          error={Boolean(
                            formik.touched.tag && formik.errors.tag
                          )}
                          fullWidth
                          name="tag"
                          helperText={formik.touched.tag && formik.errors.tag}
                          label={t("TAG")}
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          variant="outlined"
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t("THAI_DETAILS")}
                      name="description.th"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.description?.th}
                      variant="outlined"
                      rows={5}
                      multiline
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t("ENGLISH_DETAILS")}
                      name="description.en"
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      value={formik.values.description?.en}
                      variant="outlined"
                      rows={5}
                      multiline
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
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
              disabled={Boolean(!formik.isValid)}
              // disabled={Boolean(formik.errors.submit) || formik.isSubmitting}
              variant="contained"
            >
              {t("SAVE")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

// RoleView.propTypes = {
//   // @ts-ignore
//   user: PropTypes.object.isRequired,
// };

export default RoleView;
