import { FC, useEffect, useReducer, useState } from "react";
// import PropTypes from "prop-types";
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
  CardContent,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControlLabel,
  Checkbox,
  styled,
  Slide,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import Link from "@/components/Link";
import { useFormik } from "formik";
// import * as Yup from "yup";
// import NextLink from "next/link";
import { useRouter } from "next/router";
import { roleApi } from "@/actions/role.action";
// import { useAuth } from "@/hooks/useAuth";
import { AuthURL } from "@/constants";
import { useSnackbar } from "notistack";
import React from "react";
import SimpleBackdrop from "@/components/Backdrop";

const BoxActions = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]}
    `
);

interface RolePermissionProps {
  // user: User;
}

const initialData = [
  {
    id: 101,
    thai_system_name: "จัดการผู้ใช้งาน",
    enlish_system_name: "Manage user",
    group: [
      {
        id: 1,
        label: "เพิ่มผู้ใชงาน",
        checkbox: false,
      },
      {
        id: 2,
        label: "ดูข้อมูลผู้ใช้งาน",
        checkbox: false,
      },
      {
        id: 3,
        label: "ลบผู้ใช้งาน",
        checkbox: false,
      },
      {
        id: 4,
        label: "แก้ไขผู้ใช้งาน",
        checkbox: false,
      },
      {
        id: 5,
        label: "อนุมัติผู้ใช้งาน",
        checkbox: false,
      },
      {
        id: 6,
        label: "ดูรายงานผู้ใช้งาน",
        checkbox: false,
      },
    ],
  },
  {
    id: 102,
    thai_system_name: "จัดการกลุ่มผู้ใช้งาน",
    enlish_system_name: "Manage role",
    group: [
      {
        id: 1,
        label: "เพิ่มกลุ่มผู้ใชงาน",
        checkbox: true,
      },
      {
        id: 2,
        label: "ดูข้อมูลกลุ่มผู้ใช้งาน",
        checkbox: true,
      },
      {
        id: 3,
        label: "ลบกลุ่มผู้ใช้งาน",
        checkbox: true,
      },
      {
        id: 4,
        label: "แก้ไขกลุ่มผู้ใช้งาน",
        checkbox: true,
      },
    ],
  },
  {
    id: 103,
    thai_system_name: "จัดการผู้ใช้งาน",
    enlish_system_name: "Manage role premission",
    group: [
      {
        id: 1,
        label: "ดูข้อมูลสิทธิการใช้งาน",
        checkbox: true,
      },
      {
        id: 2,
        label: "แก้ไขสิทธิการใช้งาน",
        checkbox: true,
      },
    ],
  },
];

const reducer = (state, action) => {
  switch (action.type) {
    case "COMPLETE":
      return {
        ...state,
        result: state.result.map((data: any) => {
          if (data.id === action.payload.id) {
            return {
              ...data,
              group: data.group.map((value) => {
                if (value.id === action.payload.newgroup.id) {
                  return { ...value, checkbox: !value.checkbox };
                }
                return value;
              }),
            };
          }
          return data;
        }),
      };

    default:
      return state;
  }
};

const RolePermission: FC<RolePermissionProps> = () => {
  const { t }: { t: any } = useTranslation();
  const [state, dispatch] = useReducer(reducer, { result: initialData });
  const router = useRouter();
  const [ScopeAll, setAllScopes] = useState<any>([]);
  const [scope, setScope] = useState<any>([]);
  const [checked, setChecked] = useState<any>([]);
  const { enqueueSnackbar } = useSnackbar();
  const sleep = (time: number) => new Promise((acc) => setTimeout(acc, time));
  const [formData, setFormData] = useState<any>({
    deleted: [],
    inserted: [],
  });
  // const [delete, setDelete] = useState<any>([]);
  // const [add, setAdd] = useState<any>([]);
  // let checked = [];

  const getAllScope = async (): Promise<void> => {
    setOpenBackdrop(true);
    try {
      const scope = await roleApi.get_Scope(router.query.userId);
      const allScope = await roleApi.getAllScope();
      setScope(scope);
      setAllScopes(allScope);
      setOpenBackdrop(false);
    } catch (error) {
      setOpenBackdrop(false);
    }
  };

  useEffect(() => {
    getAllScope();
  }, []);

  const handleChange = (data, value) => {
    if (!checked.some((check) => check.id === value.id)) {
      if (
        !scope
          ?.find((scopeData) => scopeData.code.includes(data.code))
          ?.sub_scopes?.some((subScope) => subScope.code.includes(value.code))
      ) {
        if (
          !checked.some((val) => val.type === "inserted" && val.id === data.id)
        ) {
          //insert Header id
          const checkSubScope = {
            type: "inserted",
            id: data?.id,
          };
          setChecked((current) => [...current, checkSubScope]);
        }

        const checkSubScope = {
          type: "inserted",
          id: value.id,
          ref_id: data.id,
        };
        setChecked((current) => [...current, checkSubScope]);
      } else {
        // if (
        //   !checked.some((val) => val.type === "deleted" && val.id === data.id)
        // ) {
        //   //deleted Header id
        //   const checkSubScope = {
        //     type: "deleted",
        //     id: data?.id,
        //   };
        //   setChecked((current) => [...current, checkSubScope]);
        // }

        const checkSubScope = {
          type: "deleted",
          id: value.id,
          ref_id: data.id,
        };
        setChecked((current) => [...current, checkSubScope]);
      }
    } else {
      const header = checked.filter((val) => val.ref_id === data.id);
      // console.log("header ", header);
      // if(checked.filter((val) => val.ref_id ===  data.id))

      if (
        header.length === 1 &&
        header[0].ref_id === data.id &&
        header[0].id === value.id
      ) {
        console.log("Clear");
        setChecked((current) =>
          current.filter((employee) => {
            return employee.id !== data.id;
          })
        );
      }

      setChecked((current) =>
        current.filter((employee) => {
          return employee.id !== value.id;
        })
      );
    }
  };

  // console.log(state);

  const formik = useFormik({
    initialValues: {},
    // validationSchema: Yup.object({
    //   email: Yup.string()
    //     .email(t("The email provided should be a valid email address"))
    //     .max(255)
    //     .required(t("The email field is required")),
    //   password: Yup.string()
    //     .max(255)
    //     .required(t("The password field is required")),
    //   terms: Yup.boolean().oneOf(
    //     [true],
    //     t("You must agree to our terms and conditions")
    //   ),
    // }),
    onSubmit: async (_values, _helpers): Promise<void> => {
      checked
        .filter((value) => value.type === "deleted")
        .filter((value) => formData.deleted.push({ id: value.id }));

      checked
        .filter((value) => value.type === "inserted")
        .filter((value) => formData.inserted.push({ id: value.id }));

      console.log("final ", formData);

      try {
        const result = await roleApi.updateRoleScope(
          router.query.userId,
          formData
        );

        if (result?.code === 200) {
          enqueueSnackbar(`${result.status}`, {
            variant: "success",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 2000,
            TransitionComponent: Slide,
          });
          await sleep(1000);
          router.back();
        } else {
          enqueueSnackbar(`${result.description.message}`, {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            autoHideDuration: 4000,
            TransitionComponent: Slide,
          });
        }
      } catch (error) {
        enqueueSnackbar(`${error.response.data.description.message}`, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 5000,
          TransitionComponent: Slide,
        });
      }

      setFormData({ deleted: [], inserted: [] });
      // setFormData({ inserted: [] });

      //   try {
      //     console.log("xxx ", values);
      //     console.log(helpers);
      //     // await login(values.email, values.password);
      //   } catch (err) {
      //     console.error(err);
      //   }
    },
  });

  const [openBackdrop, setOpenBackdrop] = React.useState(false);

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      {SimpleBackdrop(openBackdrop)}
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
            {t("LICENSE_INFORMATION")}
          </Typography>
          <Breadcrumbs maxItems={3} aria-label="breadcrumb">
            <Link color="inherit" href={AuthURL.DASHBOARD.HOME}>
              {t("HOME")}
            </Link>
            <Link color="inherit" href="#">
              {t("MANAGE_DATE_MANAGEMENT")}
            </Link>
            <Typography color="text.primary">
              {t("LICENSE_INFORMATION")}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
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
                      <TableCell sx={{ width: "60%" }}>
                        {t("USER_GROUP")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {ScopeAll &&
                      ScopeAll.map((data, index) => (
                        <TableRow hover key={index}>
                          <TableCell align="center">
                            <Typography fontWeight="bold">
                              {index + 1}
                            </Typography>
                          </TableCell>
                          <TableCell>{data?.name?.th ?? "-"}</TableCell>
                          <TableCell>{data?.name?.en ?? "-"}</TableCell>
                          <TableCell>
                            {data &&
                              data.sub_scope &&
                              data.sub_scope.map((value, index2) => (
                                <FormControlLabel
                                  key={index2}
                                  control={
                                    <Checkbox
                                      // checked={value.checkbox}
                                      defaultChecked={
                                        scope &&
                                        scope
                                          .find((scopeData) =>
                                            scopeData.code.includes(data.code)
                                          )
                                          ?.sub_scopes?.some((subScope) =>
                                            subScope.code.includes(value.code)
                                          )
                                      }
                                      color="primary"
                                      onChange={() => handleChange(data, value)}
                                    />
                                  }
                                  label={
                                    <Typography variant="body2">
                                      {value.name?.th ?? "-"}
                                    </Typography>
                                  }
                                />
                              ))}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <BoxActions
          p={3}
          mt={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Button
            component="a"
            color="error"
            variant="contained"
            onClick={() => router.back()}
          >
            {t("CANCEL")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
          >
            {t("SAVE")}
          </Button>
        </BoxActions>
      </Grid>
    </form>
  );
};

export default RolePermission;
