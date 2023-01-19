import {
  FC,
  ChangeEvent,
  SyntheticEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
  Dispatch,
} from "react";
import {
  Avatar,
  Box,
  Card,
  Grid,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Tab,
  Tabs,
  TextField,
  Button,
  Typography,
  Dialog,
  Zoom,
  styled,
  Pagination,
  DialogTitle,
  DialogContent,
  Stack,
  CircularProgress,
} from "@mui/material";

import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import Label from "src/components/Label";
// import BulkActions from "./BulkActions";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useSnackbar } from "notistack";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import EditIcon from "@mui/icons-material/Edit";
import { Formik } from "formik";
import * as Yup from "yup";
import { PersonalComponent } from "@/components/PersonalComponents/PersonalComponents";
import { PersonalContactComponent } from "@/components/PersonalComponents/PersonalContactComponents";
import { PersonalOrganizationComponent } from "@/components/PersonalComponents/PersonalOrganizationComponents";
import { useDispatch } from "react-redux";
import { Content, Department, UserResult } from "@/types/user.type";
import { decryptData, encryptData } from "@/utils/crypto";
import { AuthURL, ROLE_SCOPE, server } from "@/constants";
import { useRouter } from "next/router";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useAuth } from "@/hooks/useAuth";
import { ValidateFirstName } from "@/components/Validations/FirstName.validation";
import { ValidateLastName } from "@/components/Validations/LastName.validation";
import { ValidateEmail } from "@/components/Validations/Email.validation";
import { ValidatePhoneNumber } from "@/components/Validations/PhoneNumber.validation";
import { userApi } from "@/actions/user.action";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import React from "react";
import { FunctionPermission } from "@/actions/rolepermission.action";

const DialogActions = styled(Box)(
  ({ theme }) => `
       background: ${theme.colors.alpha.black[5]}
    `
);

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const TabsWrapper = styled(Tabs)(
  ({ theme }) => `
    @media (max-width: ${theme.breakpoints.values.xl}px) {
      .MuiTabs-scrollableX {
        overflow-x: auto !important;
      }

      .MuiTabs-indicator {
          box-shadow: none;
      }
    }
    `
);

// background: ${theme.colors.alpha.black[5]};
// border: 1px dashed ${theme.colors.alpha.black[30]};
// outline: none;
// flex-direction: column;
// align-items: center;
// justify-content: center;
// min-height: 320px;

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
      border-radius: ${theme.general.borderRadius};
      padding: ${theme.spacing(2)};

      transition: ${theme.transitions.create(["border", "background"])};

      
      &:hover {
        background: ${theme.colors.alpha.white[50]};
        border-color: ${theme.colors.primary.main};
      }
  `
);

interface ResultsProps {
  users: UserResult;
  roles: Department[];
  getUsers: () => void;
  selectTabUser: (fetchData: {
    limit: string;
    offset: string;
    keyword: string;
    value: string;
  }) => void;
}

interface Filters {
  role?: string;
  code?: number;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const getUserLoginLabel = (userRole: string): JSX.Element => {
  const map = {
    true: {
      text: "Active directory",
      color: "info",
    },
    false: {
      text: "Normal",
      color: "warning",
    },
    ACTIVE: {
      text: "Active",
      color: "info",
    },
    PENDING: {
      text: "Pending",
      color: "error",
    },
    User: {
      text: "User",
      color: "error",
    },
    AdministratorHII: {
      text: "Administrator - HII",
      color: "warning",
    },
    UserHII: {
      text: "User - HII",
      color: "warning",
    },
    AdministratorMOU: {
      text: "Administrator - MOU",
      color: "warning",
    },
    UserMOU: {
      text: "User - MOU",
      color: "warning",
    },
    UserGuest: {
      text: "User - Guest",
      color: "warning",
    },
    EmptyRole: {
      text: "Empty Role",
      color: "warning",
    },
  };

  const { text, color }: any = map[userRole];

  return <Label color={color}>{text}</Label>;
};

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 58,
      height: 58,
      mr: 1,
      letterSpacing: 2,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
};

const Results: FC<ResultsProps> = ({
  users,
  roles,
  getUsers,
  selectTabUser,
}) => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>("");
  const selectedBulkActions = selectedItems.length > 0;
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openConfirmEdit, setOpenConfirmEdit] = useState(false);
  const [openDetaileField, setOpenDetaileField] = useState(false);
  const [openAddUser, setOpenAddUser] = useState(false);
  const [indexPath, setIndexPath] = useState<number>(0);
  const [uuidUser, setUUIDUser] = useState<string>("");
  const [uuidVerifyUser, setUUIDVerifyUser] = useState<string>("");
  const [titleDetail, settitleDetail] = useState({
    title: "",
    detail: "",
    status: "",
  });
  const [filters, setFilters] = useState<Filters>({ role: "" });
  const dispatch: Dispatch<any> = useDispatch();
  const router = useRouter();
  const auth = useAuth();

  const first_name = ValidateFirstName();
  const last_name = ValidateLastName();
  const phone_number = ValidatePhoneNumber();
  const email = ValidateEmail();
  const [roleUser, setRoleUser] = useState<[]>([]);

  // const userDelete: any = useSelector(
  //   ({ userDeleteReducer }: RootReducer) => userDeleteReducer
  // );

  // useEffect(() => {
  //   if (userDelete.isError) {
  //     enqueueSnackbar(userDelete.error, {
  //       variant: "error",
  //       anchorOrigin: {
  //         vertical: "top",
  //         horizontal: "right",
  //       },
  //       TransitionComponent: Slide,
  //     });
  //   } else if (userDelete.isSuccess) {
  //     getUsers();
  //     enqueueSnackbar(t("The user account has been removed"), {
  //       variant: "success",
  //       anchorOrigin: {
  //         vertical: "top",
  //         horizontal: "right",
  //       },
  //       TransitionComponent: Slide,
  //     });
  //   }
  // }, [userDelete]);

  // const filteredUsers = applyFilters(users, query, { role: "" });
  // const paginatedUsers = applyPagination(filteredUsers, page, limit);

  const handleTabsChange = (_event: SyntheticEvent, tabsValue: string) => {
    // getUsers();
    let value = "";

    if (tabsValue !== "ALL") {
      value = tabsValue;
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      role: value,
    }));

    // console.log(value);
    selectTabUser({
      limit: String(limit),
      offset: String(limit * page + 1 - 1),
      keyword: query,
      value: value ?? "",
    });

    // dispatch(getalluserActions.getAllUser(value));

    setSelectedUsers([]);
  };

  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(searchTerm);
      selectTabUser({
        limit: String(limit),
        offset: String(limit * page + 1 - 1),
        keyword: searchTerm,
        value: filters.role ?? "",
      });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // alert(e.target.value);
      // event.persist();
      setQuery(searchTerm);
      selectTabUser({
        limit: String(limit),
        offset: String(limit * page + 1 - 1),
        keyword: searchTerm,
        value: filters.role ?? "",
      });
    }
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setSearchTerm(event.target.value);
    setQuery(event.target.value);
    // selectTabUser({
    //   limit: String(limit),
    //   offset: String(limit * page + 1 - 1),
    //   keyword: event.target.value,
    //   value: filters.role ?? "",
    // });
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage - 1);
    selectTabUser({
      limit: String(limit),
      offset: String(limit * (newPage - 1) + 1 - 1),
      keyword: query,
      value: filters.role ?? "",
    });
  };

  const handlePageChangeTable = (_event: any, newPage: number): void => {
    setPage(newPage);
    selectTabUser({
      limit: String(limit),
      offset: String(limit * newPage + 1 - 1),
      keyword: query,
      value: filters.role ?? "",
    });
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
    selectTabUser({
      limit: event.target.value,
      offset: String(limit * page + 1 - 1),
      keyword: query,
      value: filters.role ?? "",
    });
    // setPaginatedUsers(
    //    applyPagination((Alluser && Alluser.content) || [], page, limit)
    // );
  };

  const showDetailField = (): JSX.Element => {
    return (
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openDetaileField}
        onClose={closeOpenDetaileField}
      >
        <DialogTitle
          sx={{
            p: 3,
            pb: 1,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 500 }} gutterBottom>
            {titleDetail.title}
          </Typography>
        </DialogTitle>
        <Divider />
        <Formik
          enableReinitialize={true}
          initialValues={{ detail: "" }}
          onSubmit={async (values) => {
            //
            const value = {
              comment: values.detail,
              status: titleDetail.status,
            };

            const verify_user = await userApi.verify_user(
              uuidVerifyUser,
              value
            );
            closeOpenDetaileField();

            // console.log(verify_user);
            // if (values.detail != "") {
            //    closeOpenDetaileField();
            // }

            // onClick = { closeOpenDetaileField };
          }}
        >
          {({ values, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                sx={{
                  p: 3,
                }}
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="detail"
                      defaultValue={values.detail}
                      onChange={(event) => {
                        values.detail = event.target.value;
                      }}
                      //  component={TextField}
                      rows={10}
                      multiline
                      label={titleDetail.detail}
                    />
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
                  onClick={closeOpenDetaileField}
                  variant="contained"
                  color="error"
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  type="submit"
                  // disabled={Boolean(errors.submit) || isSubmitting}
                  variant="contained"
                  color="primary"
                >
                  {t("SAVE")}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    );
    // return <Label color={color}>{text}</Label>;
  };

  const handleConfirmEdit = (event: any, index: any, uuid: any) => {
    event.stopPropagation();
    setIndexPath(index);
    setOpenConfirmEdit(true);
    setUUIDVerifyUser(uuid);
  };

  const closeConfirmEdit = () => {
    setOpenConfirmEdit(false);
  };

  const handleConfirmDelete = (event: any, index: any, uuid: any) => {
    event.stopPropagation();
    setUUIDUser(uuid);
    setIndexPath(index);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleOpenDetaileField = () => {
    setOpenDetaileField(true);
  };

  const closeOpenDetaileField = () => {
    setOpenDetaileField(false);
  };

  const handleAddUser = () => {
    setOpenAddUser(true);
  };

  const closeAddUser = () => {
    setOpenAddUser(false);
  };

  const handleDeleteCompleted = async (uuid: any) => {
    try {
      const result = await userApi.delete_user_profile(uuid);

      if (result?.code === 200) {
        enqueueSnackbar(t(`${result.status}`), {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 2000,
          TransitionComponent: Slide,
        });
        setPage(0);
        getUsers();
        setOpenConfirmDelete(false);
      } else {
        enqueueSnackbar(t(`${result.description.message}`), {
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

  const handleRowClick = (event, uuid) => {
    // console.log(event);
    router.push({
      pathname: AuthURL.MANAGE_USER_DETAIL + btoa(encryptData(uuid)),
    });
  };

  const getUserGroupType = (data: any, index: any, uuid: any): JSX.Element => {
    return (
      <Label
        color={
          data.description?.th === "ยังไม่ระบุกลุ่มผู้ใช้งาน" ||
          data.description?.en === "Undefined roles"
            ? "error"
            : "success"
        }
      >
        {localStorage.getItem(server.LANGUAGE) == "th"
          ? data.name?.th
          : data.name?.en}

        {data.description?.th === "ยังไม่ระบุกลุ่มผู้ใช้งาน" ||
        data.description?.en === "Undefined roles" ? (
          <HighlightOffIcon sx={{ fontSize: "15px", marginLeft: "4px" }} />
        ) : (
          <CheckCircleOutlineIcon
            sx={{ fontSize: "15px", marginLeft: "4px" }}
          />
        )}
      </Label>
    );
  };

  // const role = useAuth();
  // console.log("role =======", role);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent={{ xs: "center", sm: "space-between" }}
        pb={3}
      >
        <TabsWrapper
          onChange={handleTabsChange}
          scrollButtons="auto"
          textColor="secondary"
          value={filters.role || "ALL"}
          variant="scrollable"
        >
          <Tab key={0} value={"ALL"} label={t("SHOW_ALL")} />
          {roles &&
            roles.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.code}
                label={
                  localStorage.getItem(server.LANGUAGE) == "th"
                    ? tab.name?.th
                    : tab.name?.en
                }
              />
            ))}
        </TabsWrapper>
      </Box>

      <Card>
        <Grid
          container
          spacing={2}
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} sm={6} md={4}>
            {/* {!selectedBulkActions && ( */}
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              onChange={handleQueryChange}
              onKeyDown={handleKeyPress}
              // onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("SEARCH")}
              value={query}
              size="small"
              fullWidth
              margin="normal"
              variant="outlined"
            />
            {/* // )} */}
            {/* {selectedBulkActions && <BulkActions />} */}
          </Grid>

          {((FunctionPermission(ROLE_SCOPE.ADD_USER) &&
            FunctionPermission(ROLE_SCOPE.ADD_USER)) ||
            (FunctionPermission(ROLE_SCOPE.ADD_USER_DEPARTMENT) &&
              FunctionPermission(ROLE_SCOPE.ADD_USER_DEPARTMENT))) && (
            <Grid item xs={12} sm={6} md={2}>
              <Button
                sx={{
                  mt: { xs: 1, sm: 0.5 },
                }}
                variant="contained"
                startIcon={<ControlPointIcon fontSize="small" />}
                onClick={handleAddUser}
              >
                {t("ADD_USER")}
              </Button>
            </Grid>
          )}

          {/* {!selectedBulkActions && ( */}
          <Grid item xs={12} sm={6} md={6}>
            <TablePagination
              component="div"
              count={users?.pagination?.total_items ?? 0}
              onPageChange={handlePageChangeTable}
              onRowsPerPageChange={handleLimitChange}
              page={page}
              rowsPerPage={limit}
              labelRowsPerPage={``}
              rowsPerPageOptions={[
                {
                  label: `${t("SHOW")} ${5} ${t("PER_PAGE_LIST")}`,
                  value: 5,
                },
                {
                  label: `${t("SHOW")} ${10} ${t("PER_PAGE_LIST")}`,
                  value: 10,
                },
                {
                  label: `${t("SHOW")} ${15} ${t("PER_PAGE_LIST")}`,
                  value: 15,
                },
              ]}
              labelDisplayedRows={({ from, to, count }) =>
                `${from}–${to} ${t("OF")} ${
                  count !== -1 ? count : `มากกว่า ${to}`
                }`
              }
            />
          </Grid>
          {/* // )} */}
        </Grid>
        <Divider />

        {!users ||
        (users && users.content?.length === 0) ||
        // !FunctionPermission(ROLE_SCOPE.EDIT_USER)
        (FunctionPermission(ROLE_SCOPE.SHOW_ALL_USER) &&
          !FunctionPermission(ROLE_SCOPE.SHOW_ALL_USER)) ||
        (FunctionPermission(ROLE_SCOPE.SHOW_ALL_USER_DEPARTMENT) &&
          !FunctionPermission(ROLE_SCOPE.SHOW_ALL_USER_DEPARTMENT)) ? (
          <>
            <Typography
              sx={{
                py: 10,
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {`ไม่พบข้อมูลผู้ใช้งาน`}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{t("NO.")}</TableCell>
                    <TableCell>{t("FULL_NAME")}</TableCell>
                    <TableCell>{t("AGENCY")}</TableCell>
                    <TableCell>{t("USER_GROUP")}</TableCell>
                    <TableCell>{t("LOGIN")}</TableCell>
                    <TableCell align="center">{t("SETTINGS")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.content?.map((user: Content, index: any) => {
                    const isUserSelected = selectedItems.includes(index);
                    return (
                      <TableRow
                        hover
                        key={index}
                        selected={isUserSelected}
                        onClick={
                          (event) =>
                            // FunctionPermission(ROLE_SCOPE.VIEW_USER) &&
                            // handleRowClick(event, user.uuid)
                            // if()
                            // handleConfirmEdit(event, index, user?.uuid);

                            {
                              if (
                                user.current_role_code === "Undefined roles"
                              ) {
                                handleConfirmEdit(event, index, user?.uuid);
                              } else {
                                handleRowClick(event, user.uuid);
                              }
                            }

                          // console.log(FunctionPermission(ROLE_SCOPE.VIEW_USER))
                        }
                      >
                        <TableCell align="center">
                          <Typography fontWeight="bold">
                            {limit * page + 1 + index}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar
                              {...stringAvatar(
                                `${
                                  decryptData(user?.first_name ?? "-") +
                                  " " +
                                  decryptData(user?.last_name ?? "-")
                                }`
                              )}
                              src={`${
                                user.image_path ? user.image_path : null
                              }`}
                            />
                            <Box>
                              <Typography fontWeight="bold">
                                <Stack direction="row" spacing={1}>
                                  <Typography>
                                    <b>
                                      {decryptData(user?.first_name ?? "-") ??
                                        "-"}
                                    </b>
                                  </Typography>
                                  <Typography>
                                    <b>{decryptData(user?.last_name ?? "-")}</b>
                                  </Typography>
                                </Stack>
                              </Typography>
                              <Typography noWrap variant="subtitle2">
                                {decryptData(user?.email ?? "-")}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {localStorage.getItem(server.LANGUAGE) == "th"
                              ? user.department?.name?.th || "-"
                              : user.department?.name?.en || "-"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Grid container spacing={1}>
                            {user.role &&
                              user.role.map((data, _index2) => {
                                return (
                                  <Grid item>
                                    {getUserGroupType(data, index, user?.uuid)}
                                  </Grid>
                                );
                              })}
                          </Grid>
                        </TableCell>
                        <TableCell>
                          {getUserLoginLabel(String(user.flag.used_ad_flag))}
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            {((FunctionPermission(ROLE_SCOPE.EDIT_USER) &&
                              FunctionPermission(ROLE_SCOPE.EDIT_USER)) ||
                              (FunctionPermission(
                                ROLE_SCOPE.EDIT_USER_DEPARTMENT
                              ) &&
                                FunctionPermission(
                                  ROLE_SCOPE.EDIT_USER_DEPARTMENT
                                ))) && (
                              <Tooltip title={t("EDIT")} arrow>
                                <IconButton
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    {
                                      user.role &&
                                        user.role.map((data, _index2) => {
                                          // console.log("data", data);
                                          return (
                                            <>
                                              {data.code ===
                                                "Undefined roles" &&
                                                handleConfirmEdit(
                                                  event,
                                                  index,
                                                  user?.uuid
                                                )}

                                              {data.code !==
                                                "Undefined roles" &&
                                                router.push({
                                                  pathname:
                                                    AuthURL.MANAGE_USER_DETAIL +
                                                    btoa(
                                                      encryptData(user?.uuid)
                                                    ),
                                                  query: {
                                                    type: "EDIT_USER",
                                                  },
                                                })}
                                            </>
                                          );
                                        });
                                    }
                                  }}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {((FunctionPermission(ROLE_SCOPE.DELETE_USER) &&
                              FunctionPermission(ROLE_SCOPE.DELETE_USER)) ||
                              (FunctionPermission(
                                ROLE_SCOPE.DELETE_USER_DEPARTMENT
                              ) &&
                                FunctionPermission(
                                  ROLE_SCOPE.DELETE_USER_DEPARTMENT
                                ))) && (
                              <Tooltip title={t("DELETE")} arrow>
                                <IconButton
                                  onClick={(event) =>
                                    // (event) => alert(index)
                                    handleConfirmDelete(
                                      event,
                                      index,
                                      user?.uuid
                                    )
                                  }
                                  color="error"
                                >
                                  <DeleteTwoToneIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={3} display="flex" justifyContent="center">
              <Pagination
                shape="rounded"
                size="large"
                color="primary"
                onChange={handlePageChange}
                count={users?.pagination?.total_pages ?? 0}
                page={page + 1}
                defaultPage={0}
              />
            </Box>
          </>
        )}
      </Card>

      {/* Edit user */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openConfirmEdit}
        onClose={closeConfirmEdit}
      >
        <DialogTitle
          sx={{
            p: 3,
          }}
        >
          <Typography variant="h4" gutterBottom mb={0}>
            {t("CHECK_USER_INFORMATION")}
          </Typography>
        </DialogTitle>
        <Divider />
        <Formik
          enableReinitialize={true}
          // initialValues={initialValues}
          initialValues={
            users && {
              first_name: decryptData(
                users?.content[indexPath]?.first_name ?? ""
              ),
              last_name: decryptData(
                users?.content[indexPath]?.last_name ?? ""
              ),
              citizen_number: decryptData(
                users?.content[indexPath]?.citizen_number ?? ""
              ),
              laser_code: "ME1-1123223-12",
              birth_date: users?.content[indexPath]?.birth_date ?? "",
              id_card_type: "all",
              email: decryptData(users?.content[indexPath]?.email ?? ""),
              phone_number: decryptData(
                users?.content[indexPath]?.phone_number ?? ""
              ),
              department: users?.content[indexPath]?.department?.uuid ?? "-",
              organization: "other",
              detail: "Terminal 8",
              textmask: "",
              terms: true,
              role_id: [],
            }
          }
          validationSchema={Yup.object().shape({
            // ...first_name,
            // first_name: Yup.string()
            //   .max(255)
            //   .required(t("The first name field is required")),
          })}
          onSubmit={async (_values) => {
            const value = {
              role: roleUser,
              comment: "Verify user",
              status: titleDetail.status,
            };

            try {
              const response = await userApi.verify_user(uuidVerifyUser, value);

              if (response?.code === 200) {
                enqueueSnackbar(t(`${response.status}`), {
                  variant: "success",
                  anchorOrigin: {
                    vertical: "top",
                    horizontal: "right",
                  },
                  autoHideDuration: 2000,
                  TransitionComponent: Slide,
                });

                closeConfirmEdit();
                getUsers();
              } else {
                enqueueSnackbar(`${response.description.message}`, {
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
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            isValid,
            values,
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                sx={{
                  p: 3,
                }}
              >
                <PersonalComponent
                  hidden={false}
                  title={t("PERSONAL_INFORMATION")}
                  disableTextfield={true}
                  getInitial={values}
                />
                <PersonalContactComponent
                  title={t("CONTACT_INFORMATION")}
                  leftFieldTitle={t("EMAIL")}
                  rightFieldTitle={t("PHONE_NUMBER")}
                  noTermOfUse={true}
                  getInitial={values}
                  disableTextfield={true}
                />
                <PersonalOrganizationComponent
                  title={t("ORGANIZATION_INFORMATION")}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  getInitial={values}
                  padding={3}
                  registation={true}
                  userGroupOption={true}
                  disableTextfield={true}
                  document={true}
                  downloadHidden={false}
                  addTitle={"เอกสารแนบ"}
                  BoxUploadWrapper={
                    users?.content[indexPath]?.file && BoxUploadWrapper
                  }
                  getAutoFile={users?.content[indexPath]?.file}
                  showFileOnly={true}
                  onChange={(e: any) => {
                    values.role_id = e;
                    setRoleUser(e);
                  }}
                />
              </DialogContent>
              <DialogActions
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button
                  onClick={() => (
                    handleOpenDetaileField(),
                    settitleDetail({
                      title: t("ไม่อนุมัติการใช้งาน"),
                      detail: "กรุณากรอกรายละเอียดการไม่อนุมัติการใช้งาน",
                      status: "SUSPENDED",
                    })
                  )}
                  variant="contained"
                  color="error"
                >
                  {t("ไม่อนุมัติการใช้งาน")}
                </Button>
                <Button
                  onClick={() => (
                    handleOpenDetaileField(),
                    settitleDetail({
                      title: t("ขอเอกสารเพิ่มเติม"),
                      detail: "กรุณากรอกรายละเอียดการขอเอกสารเพิ่มเติม",
                      status: "PENDING",
                    })
                  )}
                  variant="contained"
                  color="info"
                >
                  {t("ขอเอกสารเพิ่มเติม")}
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={() =>
                    settitleDetail({
                      title: null,
                      detail: null,
                      status: "ACTIVE",
                    })
                  }
                >
                  {t("อนุมัติการใช้งาน")}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Add user */}
      <DialogWrapper
        fullWidth
        maxWidth="md"
        open={openAddUser}
        onClose={closeAddUser}
      >
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4">{t("ADD_USER")}</Typography>
        </DialogTitle>
        <Divider />
        <Formik
          enableReinitialize={true}
          initialValues={{
            prefix_id: 1,
            first_name: "",
            last_name: "",
            citizen_number: "",
            birth_date: "1996-11-17",
            people_type: 1,
            email: "",
            phone_number: "",
            laser_code: "",
            nationality_id: 206,
            role_id: [],
            department_uuid: "",
          }}
          validationSchema={Yup.object().shape({
            ...first_name,
            ...last_name,
            ...email,
            ...phone_number,
            department_uuid: Yup.string().required(
              t(t("PLEASE_SELECT") + t("DEPARTMENT"))
            ),
            // ref_id: Yup.string().required(t(t("PLEASE_SELECT") + t("SUB_USER_GROUP_OF"))),
          })}
          onSubmit={async (values) => {
            try {
              const result = await userApi.create_user(values);

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
                setPage(0);
                closeAddUser();
                getUsers();
                // onChange(filters.role || "ALL");
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
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            isValid,
            values,
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                sx={{
                  p: 3,
                }}
              >
                <PersonalComponent
                  hidden={false}
                  title={t("PERSONAL_INFORMATION")}
                  getInitial={values}
                />
                <PersonalContactComponent
                  title={t("CONTACT_INFORMATION")}
                  leftFieldTitle={t("EMAIL")}
                  rightFieldTitle={t("PHONE_NUMBER")}
                  noTermOfUse={true}
                  getInitial={values}
                />
                <PersonalOrganizationComponent
                  title={t("ORGANIZATION_INFORMATION")}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  getInitial={values}
                  padding={3}
                  registation={true}
                  userGroupOption={true}
                  masterData={auth.masterData.departments}
                />
              </DialogContent>
              <DialogActions
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Button
                  onClick={closeAddUser}
                  variant="contained"
                  color="error"
                >
                  {t("CANCEL")}
                </Button>
                <Button
                  type="submit"
                  startIcon={
                    isSubmitting ? <CircularProgress size="1rem" /> : null
                  }
                  disabled={Boolean(!isValid && isSubmitting)}
                  variant="contained"
                  color="success"
                >
                  {t("ADD_USER")}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogWrapper>

      {showDetailField()}

      {/* Dialog delete */}
      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              py: 4,
              px: 6,
            }}
            variant="h3"
          >
            {t("ARE_YOU_SURE_YOU_WANT_TO_PERMANENTLY_DELETE_THIS_USER_ACCOUNT")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1,
              }}
              onClick={closeConfirmDelete}
            >
              {t("CANCEL")}
            </Button>
            <ButtonError
              onClick={() => handleDeleteCompleted(uuidUser)}
              size="large"
              sx={{
                mx: 1,
                px: 3,
              }}
              variant="contained"
            >
              {t("DELETE")}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

export default Results;
