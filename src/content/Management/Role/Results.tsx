import {
  FC,
  ChangeEvent,
  SyntheticEvent,
  useState,
  ReactElement,
  Ref,
  forwardRef,
  useEffect,
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
  Autocomplete,
} from "@mui/material";

import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { useSnackbar } from "notistack";
import EditIcon from "@mui/icons-material/Edit";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { Department } from "@/types/user.type";
import { AuthURL, ROLE_SCOPE, server } from "@/constants";
import { useRouter } from "next/router";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { useFormik } from "formik";
import * as Yup from "yup";
import { roleApi } from "@/actions/role.action";
import { useDispatch } from "react-redux";
import { ValidateNameEnglish } from "@/components/Validations/NameEnglish.validation";
import { ValidateNameThai } from "@/components/Validations/NameThai.validation";
import { ValidateDescriptionThai } from "@/components/Validations/DescriptionThai.validation";
import { ValidateDescriptionEnglish } from "@/components/Validations/DescriptionEnglish.validation";
import { tags } from "@/mocks/tags";
import React from "react";
import SimpleBackdrop from "@/components/Backdrop";
import { RoleResult } from "@/types/role.type";
import { useAuth } from "@/hooks/useAuth";

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

interface ResultsProps {
  roles: RoleResult;
  tabs: Department[];
  onChange: (fetchData: {
    limit: string;
    offset: string;
    keyword: string;
    value: string;
  }) => void;
  getRoles: () => void;
}

interface Filters {
  code?: string;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Results: FC<ResultsProps> = ({
  roles,
  tabs = [],
  onChange,
  getRoles,
}) => {
  const [selectedItems, setSelectedUsers] = useState<string[]>([]);
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [paginatedRole, setPaginatedRole] = useState<Department[]>([]);
  const [openAddUserGroup, setOpenAddUserGroup] = useState(false);
  const roleScope = useAuth();
  // const dispatch = useDispatch();

  useEffect(() => {
    setPaginatedRole(tabs);
  }, [paginatedRole.length < tabs.length]);

  // useEffect(() => {
  //   setPage(0);
  // }, [roles]);

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    code: null,
  });

  const handleTabsChange = (_event: SyntheticEvent, tabsValue: string) => {
    let value = null;

    if (tabsValue !== "ALL") {
      value = tabsValue;
    }

    onChange({
      limit: String(limit),
      offset: String(limit * page + 1 - 1),
      keyword: query,
      value: tabsValue ?? "ALL",
    });

    setFilters((prevFilters) => ({
      ...prevFilters,
      code: value,
    }));

    setSelectedUsers([]);
  };

  const [searchTerm, setSearchTerm] = useState(null);
  useEffect(() => {
    if (searchTerm !== null) {
      const delayDebounceFn = setTimeout(() => {
        setQuery(searchTerm);
        onChange({
          limit: String(limit),
          offset: String(limit * page + 1 - 1),
          keyword: searchTerm,
          value: filters.code ?? "ALL",
        });
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // alert(e.target.value);
      // event.persist();

      roleScope.scope?.map(async (scopes) => {
        if (scopes.code === ROLE_SCOPE.SHOW_ALL_ROLE) {
          setQuery(searchTerm);
          onChange({
            limit: String(limit),
            offset: String(limit * page + 1 - 1),
            keyword: searchTerm,
            value: filters.code ?? "ALL",
          });
        } else {
          if (scopes.sub_scopes) {
            scopes.sub_scopes?.map(async (sub_scopes) => {
              if (sub_scopes.code === ROLE_SCOPE.SHOW_ALL_ROLE) {
                setQuery(searchTerm);
                onChange({
                  limit: String(limit),
                  offset: String(limit * page + 1 - 1),
                  keyword: searchTerm,
                  value: filters.code ?? "ALL",
                });
              }
            });
          }
        }
      });
    }
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    roleScope.scope?.map(async (scopes) => {
      if (scopes.code === ROLE_SCOPE.SHOW_ALL_ROLE) {
        setSearchTerm(event.target.value);
        setQuery(event.target.value);
      } else {
        if (scopes.sub_scopes) {
          scopes.sub_scopes?.map(async (sub_scopes) => {
            if (sub_scopes.code === ROLE_SCOPE.SHOW_ALL_ROLE) {
              setSearchTerm(event.target.value);
              setQuery(event.target.value);
            }
          });
        }
      }
    });

    // onChange({
    //   limit: String(limit),
    //   offset: String(limit * page + 1 - 1),
    //   keyword: event.target.value,
    //   value: filters.code ?? "ALL",
    // });
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage - 1);
    onChange({
      limit: String(limit),
      offset: String(limit * (newPage - 1) + 1 - 1),
      keyword: query,
      value: filters.code ?? "ALL",
    });
  };

  const handlePageChangeTable = (_event: any, newPage: number): void => {
    setPage(newPage);
    onChange({
      limit: String(limit),
      offset: String(limit * newPage + 1 - 1),
      keyword: query,
      value: filters.code ?? "ALL",
    });
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
    onChange({
      limit: event.target.value,
      offset: String(limit * page + 1 - 1),
      keyword: query,
      value: filters.code ?? "ALL",
    });
  };

  const selectedBulkActions = selectedItems.length > 0;
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(0);

  const handleConfirmDelete = (role_id: any) => {
    setOpenConfirmDelete(true);
    setDeleteRoleId(role_id);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async () => {
    const result = await roleApi.deleted_Role(deleteRoleId);

    console.log("resutl delete ", result);

    if (result) {
      if (result.code === 200) {
        setOpenConfirmDelete(false);
        enqueueSnackbar(t("The role account has been removed"), {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Zoom,
        });
        setPage(0);
        getRoles();
      } else {
        enqueueSnackbar(result.message),
          {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            TransitionComponent: Zoom,
          };
      }
    }
  };

  const handleAddUserGroup = () => {
    setOpenAddUserGroup(true);
  };

  const closeAddUserGroup = () => {
    formik.resetForm();
    setOpenAddUserGroup(false);
  };

  const name_th = ValidateNameThai();
  const name_en = ValidateNameEnglish();
  const description_th = ValidateDescriptionThai();
  const description_en = ValidateDescriptionEnglish();

  const formik = useFormik({
    initialValues: {
      name: {
        th: "",
        en: "",
      },
      description: {
        th: "",
        en: "",
      },
      tag: "",
      color_hex_value: "",
      ref_id: "",
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
      ref_id: Yup.string().required(
        t(t("PLEASE_SELECT") + t("SUB_USER_GROUP_OF"))
      ),
      // color_hex_value: "",
    }),
    onSubmit: async (values) => {
      try {
        const response = await roleApi.create_role(values);

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
          closeAddUserGroup();
          getRoles();
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
    },
  });

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
          value={filters.code || "ALL"}
          variant="scrollable"
        >
          <Tab key={0} value={"ALL"} label={t("SHOW_ALL")} />

          {paginatedRole &&
            paginatedRole.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.code}
                label={
                  localStorage.getItem(server.LANGUAGE) == "th"
                    ? tab.name.th
                    : tab.name.en
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
            {!selectedBulkActions && (
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
                placeholder={t("SEARCH")}
                value={query}
                size="small"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
          </Grid>

          {FunctionPermission(ROLE_SCOPE.ADD_ROLE) && (
            <Grid item xs={12} sm={6} md={2}>
              <Button
                sx={{
                  mt: { xs: 1, sm: 0.5 },
                }}
                variant="contained"
                startIcon={<ControlPointIcon fontSize="small" />}
                onClick={() => handleAddUserGroup()}
              >
                {t("ADD_USER_GROUP")}
              </Button>
            </Grid>
          )}

          {!selectedBulkActions && (
            <Grid item xs={12} sm={6} md={6}>
              <TablePagination
                component="div"
                count={roles?.pagination?.total_items ?? 0}
                onPageChange={handlePageChangeTable}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                labelRowsPerPage={null}
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
                    count !== -1 ? count : `${t("MORE_THAN")} ${to}`
                  }`
                }
              />
            </Grid>
          )}
        </Grid>

        <Divider />

        {/* {console.log("roles", roles)}
        {console.log("roles.content", roles?.content?.length)}
        {console.log("roles.content  === 0", roles?.content?.length === 0)} */}

        {!roles ||
        (roles && roles?.content?.length === 0) ||
        !FunctionPermission(ROLE_SCOPE.SHOW_ALL_ROLE) ? (
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
              {t("ไม่พบข้อมูลกลุ่มผู้ใช้งาน")}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">{t("NO.")}</TableCell>
                    <TableCell>{t("THAI_NAME")}</TableCell>
                    <TableCell>{t("ENGLISH_NAME")}</TableCell>
                    <TableCell>{t("SUB_USER_GROUP_OF")}</TableCell>
                    <TableCell align="center">{t("SETTINGS")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles?.content?.map((value, index: any) => {
                    const isUserSelected = selectedItems.includes(index);
                    return (
                      <TableRow key={index} selected={isUserSelected}>
                        <TableCell align="center">
                          <Typography fontWeight="bold">
                            {limit * page + 1 + index}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography>{value.name?.th ?? "-"}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography>{value.name?.en ?? "-"}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {tabs.find(
                              (val) => val?.id === Number(value?.ref_id)
                            )?.name?.th ?? "-"}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            {FunctionPermission(ROLE_SCOPE.VIEW_ROLE) && (
                              <Tooltip title={t("EDIT")} arrow>
                                <IconButton
                                  onClick={() =>
                                    router.push(
                                      AuthURL.MANAGE_ROLE_SINGLE + value.id
                                    )
                                  }
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {FunctionPermission(ROLE_SCOPE.DELETE_ROLE) && (
                              <Tooltip title={t("DELETE")} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(value.id)}
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
                count={roles?.pagination?.total_pages ?? 0}
                page={page + 1}
                defaultPage={0}
              />
            </Box>
          </>
        )}
      </Card>

      <Dialog
        fullWidth
        maxWidth="md"
        open={openAddUserGroup}
        onClose={closeAddUserGroup}
      >
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4">
            {t("ADD_USER_GROUP_INFORMATION")}
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
                      value={formik.values.name.th}
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
                        option?.code === value?.code
                      }
                      onChange={(_e, value: any | null) =>
                        formik.setFieldValue(
                          "ref_id",
                          value !== null ? Number(value.id) : ""
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
                      error={Boolean(
                        formik.touched.description?.th &&
                          formik.errors.description?.th
                      )}
                      fullWidth
                      helperText={
                        formik.touched.description?.th &&
                        formik.errors.description?.th
                      }
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
                      error={Boolean(
                        formik.touched.description?.en &&
                          formik.errors.description?.en
                      )}
                      fullWidth
                      helperText={
                        formik.touched.description?.en &&
                        formik.errors.description?.en
                      }
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
              onClick={closeAddUserGroup}
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
            {t("Are you sure you want to permanently delete this user account")}
            ?
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
              onClick={handleDeleteCompleted}
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

// Results.propTypes = {
//   roles: PropTypes.array.isRequired,
// };

// Results.defaultProps = {
//   roles: [],
// };

export default Results;
