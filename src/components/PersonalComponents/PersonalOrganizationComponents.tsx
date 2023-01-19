import { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  styled,
  Alert,
  Button,
  Card,
  Stack,
  Autocomplete,
  TextField as TextFieldMUI,
  Slide,
} from "@mui/material";
import React from "react";
import { Field, Formik } from "formik";
import Link from "src/components/Link";
import { useTranslation } from "react-i18next";
import { useDropzone } from "react-dropzone";
import ComputerIcon from "@mui/icons-material/Computer";
import CancelIcon from "@mui/icons-material/Cancel";
import { TextField } from "formik-mui";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_SCOPE, server } from "@/constants";
import { format } from "date-fns";
import { uploadFileApi } from "@/actions/uploadFile.action";
import { Department } from "@/types/user.type";
import { roleApi } from "@/actions/role.action";
import { userApi } from "@/actions/user.action";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { decodeBase64, encodeBase64 } from "@/utils/nodeForge";
import { useSnackbar } from "notistack";
import { PAGE } from "@/constants";
import { FunctionPermission } from "@/actions/rolepermission.action";

export function PersonalOrganizationComponent(props: any) {
  const { t }: { t: any } = useTranslation();
  const [fileSize, setFileSize] = useState("");
  const [fileRejected, setFileRejected] = useState<any[]>([]);
  const [fileRejected2, setFileRejected2] = useState<any[]>([]);
  const [checkFile, setCheckFile] = useState("");
  const masterData = useAuth().masterData; // เรียกใช้งานในหน้า register
  const auth = useAuth();
  const [detail, setDetail] = useState(
    props.getInitial && props.getInitial.detail
  );
  const [roles, setRoles] = useState<Department[]>([]);
  const [rolesFlag, setRolesFlag] = useState<any[]>([]);
  const [flag, setFlag] = useState<boolean>(null);
  const [department, setDepartment] = useState<boolean>(false);
  const { enqueueSnackbar } = useSnackbar();

  const onDownload = async (filename: string) => {
    alert("Download");

    // fetch(`${env.GET_FILE}/${filename}`).then((response) => {
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_URL}${server.EXPORT_AUTO_DOWNLOAD}/${filename}`,
        {
          headers: {
            device: localStorage.getItem("device"),
            // access_token: localStorage.getItem("access_token"),
            // "Content-Type": "application/json",
            access_token: localStorage.getItem("refresh_token"),
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            Accept: "application/json",
          },
        }
      ).then((response) => {
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = filename;
          a.click();
        });
      });
    } catch (error) {
      alert(error);
    }
  };

  // const getFiles = useCallback(async (filename) => {
  //   const file = await userApi.get_file_user(btoa(filename));
  //   // const file = await userApi.get_file_user(
  //   //   "L2RvY3VtZW50cy91c2Vycy9Vc2VyLTE3NGQyNzMxLWI3NDUtNDEzNi1iNzk4LTljOTFiNDg1YTBjZC0yMDIyMDkyOFQwNjU4MzY0NjYtMXByRksucG5n"
  //   // );

  //   // console.log("result ",URL.createObjectURL(imageBlob)
  // }, []);

  const onShowFile = async (filename: string) => {
    try {
      const result = await userApi.getDownloadImportFile(
        encodeBase64(filename)
      );

      if (result.status === 200) {
        const text = "Download success";
        enqueueSnackbar(t(`${text}`), {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 2000,
          TransitionComponent: Slide,
        });
      } else {
        enqueueSnackbar(t(`${result.statusText}`), {
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
      enqueueSnackbar(t(`${error.response?.data.description.message}`), {
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

  const downloadAll = async () => {
    alert("Download");
    const allFile = { files: [] };
    props.getAutoFile.map((val: any) => allFile.files.push(val?.path));

    // props.getAutoFile.map((val: any) => onDownload(val?.path));

    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_REACT_APP_API_NONWATER_URL}${server.EXPORT_AUTO_DOWNLOAD}/archiver`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${localStorage.getItem(
            //   server.REFRESH_TOKEN_KEY
            // )}`,
            access_token: localStorage.getItem("refresh_token"),
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            device: localStorage.getItem("device"),
            // token: `${localStorage.getItem(server.ACCESS_TOKEN_KEY)}`,
          },
          body: JSON.stringify(allFile),
        }
      ).then((response) => {
        console.log("response ", response);
        response.blob().then((blob) => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = `file_download_${format(new Date(), "yyyy-MM-dd")}`;
          a.click();
        });
      });
    } catch (error) {
      alert(error);
    }
  };

  const [filters, setFilters] = useState({
    status: 1,
  });

  const getRoles = useCallback(async () => {
    const role = await roleApi.get_all_Role("999", "", "", "ALL");
    console.log("getrole ", role);
    setRoles(role.content);
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated) {
      getRoles();
    }
  }, [props.userGroupOption]);

  const CardLogo = styled("img")(
    ({ theme }) => `
            width: 36px;
            margin-right: ${theme.spacing(2)};
            background: ${theme.colors.alpha.white[100]};
        `
  );

  const CardCc = styled(Card)(
    ({ theme }) => `
            border: 1px solid ${theme.colors.alpha.black[30]};
            background: ${theme.colors.alpha.white[5]};
            box-shadow: none;
        `
  );

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const { getRootProps, getInputProps } = useDropzone({
    maxSize: 3000000,
    // maxFiles: 10,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg"],
      "application/csv": [".csv"],
      "application/pdf": [".pdf"],
    },
    onDropRejected: (fileSize) => {
      // console.log(fileSize);
      if (fileSize[0]) {
        setFileSize(fileSize[0].errors[0].code);
        setFileRejected(fileSize);
      }
    },
    onDropAccepted: (fileSize) => {
      // console.log(fileSize);
      if (fileSize[0]) {
        setFileSize("accept");
      }
    },

    onDrop: async (acceptedFiles, _fileRejections, _event) => {
      if (acceptedFiles.length <= 10) {
        acceptedFiles.map((value) => {
          {
            checkFileInsert(value) &&
              setFileRejected2((oldArray) => [
                ...oldArray,
                {
                  value,
                },
              ]);
          }
        });

        if (props.request_more_file) {
          let formData = new FormData();
          acceptedFiles.map((val) => {
            formData.append("files", val);
          });
          // acceptedFiles.map((val) => props.getInitial.file?.push(val));

          // props.getInitial.file?.push(acceptedFiles.filter((val) => val));
          // acceptedFiles.map((val) => console.log("xx ", val));
          acceptedFiles.map((val) => props.getInitial.file?.push(val));

          // const result = await uploadFileApi.uploadFile(null, formData);
        } else {
          acceptedFiles.map((val) => props.formik.values.file?.push(val));
          // props.getInitial.file.push(acceptedFiles);
        }
      } else {
        setCheckFile("Over");
      }

      setFileRejected([]);
    },
  });

  const checkFileInsert = (value) => {
    if (
      fileRejected2.find(
        (e) =>
          e.value.name === value.name &&
          e.value.size === value.size &&
          e.value.type === value.type
      )
    ) {
      setCheckFile("Duplicate");
      return false;
    }

    if (fileRejected2.length > 9) {
      //   alert("Upload ได้ครั้งละ 10 file");
      setCheckFile("Over");
      return false;
    }
    setCheckFile("");
    return true;
  };

  const alertFile = (): JSX.Element => {
    const textAlert =
      checkFile === "Over"
        ? "ไม่สามารถอัพโหลดไฟล์เกิน 10 ไฟล์"
        : checkFile === "Duplicate"
        ? "ไม่สามารถอัพโหลดไฟล์ซ้ำได้"
        : fileSize === "file-too-large"
        ? "ไฟล์มีขนาดใหญ่กว่า 3MB"
        : "เกิดข้อผิดพลาดในการเลือกไฟล์";

    return (
      <Grid container spacing={1} pt={1}>
        {(fileSize === "file-too-large" ||
          checkFile === "Over" ||
          checkFile === "Duplicate") && (
          <Grid item xs={12}>
            <Alert
              sx={{
                py: 0,
              }}
              severity="error"
            >
              {/* ไฟล์มีขนาดใหญ่กว่า 3MB */}
              {textAlert}
            </Alert>
          </Grid>
        )}
      </Grid>
    );
  };

  const files = fileRejected2.map((file, index) => (
    <Grid item xs={12} md={6} key={index}>
      <CardCc
        sx={{
          p: 1,
        }}
      >
        <Box display="flex" alignItems="center">
          {file.value.type === "image/png" && (
            <CardLogo src="/static/images/files/001-png-file.png" alt="PNG" />
          )}
          {file.value.type === "applications/csv" && (
            <CardLogo src="/static/images/files/002-csv-file.png" alt="CSV" />
          )}
          {file.value.type === "image/jpg" && (
            <CardLogo src="/static/images/files/003-jpg-file.png" alt="JPG" />
          )}
          {file.value.type === "applications/pdf" && (
            <CardLogo src="/static/images/files/004-pdf-file.png" alt="PDF" />
          )}
          {file.value.type === "applications/rar" && (
            <CardLogo src="/static/images/files/005-rar-file.png" alt="RAR" />
          )}
          {file.value.type === "applications/zip" && (
            <CardLogo src="/static/images/files/006-zip-file.png" alt="ZIP" />
          )}

          <Box>
            <Typography variant="h5" fontWeight="normal">
              {file.value.name.length > 24
                ? `${file.value.name.slice(0, 12)}...${file.value.name.slice(
                    -12,
                    file.value.name.length
                  )}`
                : file.value.name}
            </Typography>
            <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
              {formatBytes(file.value.size)}
            </Typography>
          </Box>
          <CancelIcon
            color="error"
            onClick={(e) => removeFile(e, index)}
            sx={{ marginLeft: "auto" }}
          />
        </Box>
      </CardCc>
    </Grid>
  ));

  const getAutoFiles =
    props.getAutoFile &&
    props.getAutoFile.map((file, index) => (
      <Grid item xs={12} md={6} key={index}>
        <CardCc
          sx={{
            p: 1,
          }}
        >
          <Box display="flex" alignItems="center">
            {file.path.split(".")[1].toLowerCase() == "png".toLowerCase() && (
              <CardLogo src="/static/images/files/001-png-file.png" alt="PNG" />
            )}
            {file.path.split(".")[1].toLowerCase() === "csv".toLowerCase() && (
              <CardLogo src="/static/images/files/002-csv-file.png" alt="CSV" />
            )}
            {file.path.split(".")[1].toLowerCase() === "jpg".toLowerCase() && (
              <CardLogo src="/static/images/files/003-jpg-file.png" alt="JPG" />
            )}
            {file.path.split(".")[1].toLowerCase() === "jpeg".toLowerCase() && (
              <CardLogo src="/static/images/files/003-jpg-file.png" alt="JPG" />
            )}
            {file.path.split(".")[1].toLowerCase() === "PDF".toLowerCase() && (
              <CardLogo src="/static/images/files/004-pdf-file.png" alt="PDF" />
            )}
            {file.path.split(".")[1].toLowerCase() === "RAR".toLowerCase() && (
              <CardLogo src="/static/images/files/005-rar-file.png" alt="RAR" />
            )}
            {file.path.split(".")[1].toLowerCase() === "ZIP".toLowerCase() && (
              <CardLogo src="/static/images/files/006-zip-file.png" alt="ZIP" />
            )}

            <Box>
              <Typography variant="h5" fontWeight="normal">
                {file.path.length > 24
                  ? `${file.path.slice(0, 12)}...${file.path.slice(
                      -12,
                      file.path.length
                    )}`
                  : file.value.name}
              </Typography>
              {/* <Typography variant="subtitle2" sx={{ fontSize: 12 }}>
                {formatBytes(file.value?.size)}
              </Typography> */}
            </Box>

            <CloudDownloadIcon
              color="info"
              onClick={(e) => {
                props.showFileOnly
                  ? onShowFile(file.path)
                  : onDownload(file.path),
                  e.preventDefault;
              }}
              sx={{ marginLeft: "auto" }}
            />
          </Box>
        </CardCc>
      </Grid>
    ));

  const removeFile = (e, index) => {
    // e.preventDefault();
    e.stopPropagation();
    setFileRejected2((oldArray) =>
      oldArray.filter((_, index2) => index2 != index)
    );
    setCheckFile("");
  };

  const [filterDepartment, setFilterDepartment] = useState<any[]>([]);
  const [filterRole, setFilterRole] = useState<any[]>([]);

  useEffect(() => {
    // getRoles();
    // console.log("all1 ", props?.getInitial);
    if (props.page !== PAGE.REGISTER) {
      const res = auth.scope?.find((val: any) => val?.code === "SC_MTWS18");

      //23
      if (res?.sub_scopes?.some((val) => val?.code === "SC_MTWS23")) {
        setFilterDepartment(props?.masterData);
        // alert("xx");
      } else {
        const getDepartment = props?.masterData?.filter(
          (depart) => depart?.uuid === auth?.user?.department?.uuid
        );
        // console.log("resauth ", getDepartment);
        setFilterDepartment(getDepartment);
      }
    }
  }, [props?.masterData]);

  useEffect(() => {
    if (props.page !== PAGE.REGISTER) {
      const getDepartment = auth.masterData?.departments?.find(
        (val) => val?.uuid === props?.getInitial?.department
      );

      if (getDepartment) {
        onSelectDepartment(getDepartment);
      }
    }
  }, [props?.getInitial, roles]);

  const onSelectDepartment = useCallback(
    async (value: any) => {
      if (value?.flag?.mou_flag) {
        if (auth?.user?.current_role_code === "Super administrator") {
          setFilterRole(roles?.filter((role: any) => role?.tag === "MOU"));
        } else {
          console.log("role ======", roles);

          setFilterRole(
            roles?.filter(
              (role: any) =>
                role?.code !== "Super administrator" && role?.tag === "MOU"
            )
          );
        }
      } else {
        if (auth?.user?.current_role_code === "Super administrator") {
          // setFilterRole(roles);
          setFilterRole(roles?.filter((role) => role?.tag === "HII"));
        } else {
          setFilterRole(
            roles?.filter(
              (role) =>
                role?.code !== "Super administrator" && role?.tag === "HII"
            )
          );
        }
      }
    },
    [roles]
  );

  return (
    <Grid container spacing={3} pt={props.padding || 0}>
      {/* {props.formik && ( */}
      <>
        {props.title && (
          <Grid item xs={12}>
            <Typography variant="h4" component="h4">
              {props.title}
            </Typography>
          </Grid>
        )}

        {props.page === PAGE.REGISTER && (
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={
                props?.masterData
                  ? props?.masterData
                  : masterData?.departments
                  ? masterData?.departments
                  : []
              }
              disabled={props.disableTextfield}
              getOptionLabel={(option: any) =>
                option?.name?.th ? option?.name?.th : "-"
              }
              isOptionEqualToValue={(option, value) =>
                option.code === value.code || option.code === value
              }
              defaultValue={
                props.formik && props.masterData
                  ? props.masterData.find(
                      (val) => val.uuid === props.formik.values.department_uuid
                    )
                  : masterData?.departments
                  ? masterData?.departments.find(
                      (val) => val.uuid === props.formik.values.department_uuid
                    )
                  : []
              }
              onChange={(_e: any, value: any | null) => {
                if (value === null) {
                  props.formik.setFieldValue("department_uuid", "");
                } else {
                  props.formik.setFieldValue("department_uuid", value?.uuid);
                }

                //   // props.getInitial.department_uuid = value?.uuid;
                //   // props.onChange(value?.uuid);
                //   // ? value.uuid
                //   // : "";
              }}
              // value={props.formik.values.phone_number}
              onBlur={props.formik.handleBlur}
              // onChange={props.formik.handleChange}
              renderInput={(params) => (
                <Field
                  {...params}
                  component={TextField}
                  fullWidth
                  name="department_uuid"
                  label={t("ORGANIZATION")}
                  variant="outlined"
                  onBlur={props.formik?.handleBlur}
                  onChange={props.formik?.handleChange}
                  error={Boolean(
                    props.formik.touched.department_uuid &&
                      props.formik.errors.department_uuid
                  )}
                  helperText={
                    props.formik.touched.department_uuid &&
                    props.formik.errors.department_uuid
                  }
                />
              )}
            />
          </Grid>
        )}

        {props.registation && props.page !== PAGE.REGISTER && (
          <Grid item xs={12} md={6}>
            <Autocomplete
              options={filterDepartment ? filterDepartment : []}
              disabled={props.disableTextfield}
              getOptionLabel={(option: any) =>
                option?.name?.th ? option?.name?.th : "-"
              }
              isOptionEqualToValue={(option, value) =>
                option.code === value.code
              }
              defaultValue={
                props.getInitial && props.masterData
                  ? props.masterData.find(
                      (val) => val.uuid === props.getInitial?.department
                    )
                  : masterData?.departments
                  ? masterData?.departments.find(
                      (val) => val.uuid === props.getInitial?.department
                    )
                  : []
              }
              onChange={(_e: any, value: any | null) => {
                onSelectDepartment(value);
                // setFlag(value?.flag?.mou_flag);

                // if (value === null) {
                //   setDepartment(true)
                // }

                props.getInitial.department_uuid = value?.uuid;
                // props.onChange(value?.uuid);
                // ? value.uuid
                // : "";
              }}
              renderInput={(params) => (
                <Field
                  {...params}
                  component={TextField}
                  fullWidth
                  name="department_uuid"
                  label={t("ORGANIZATION")}
                  variant="outlined"
                />
              )}
            />
          </Grid>
        )}

        {props.userGroupOption && filterRole && (
          <Grid item xs={12} md={6}>
            <Autocomplete
              multiple
              limitTags={1}
              // options={roles}
              options={filterRole}
              noOptionsText={"กรุณาเลือกหน่วยงานต้นสังกัตก่อน"}
              // isOptionEqualToValue={(option: any, value: any) =>
              //   option?.code === value?.code
              // }
              getOptionLabel={(option: any) =>
                option.name?.th ? option.name?.th : "-"
              }
              onChange={(_e: any, value: any | null) => {
                props.getInitial.role_id = [];
                const array = [];
                value.map((val) => {
                  array.push({ id: val?.id });
                });

                props.getInitial.role_id = array;

                props.onChange && props?.onChange(array);

                // console.log(props.getInitial);
              }}
              disabled={
                //   props.disabled || props.disableTextfield ? true : false
                department ? true : false
              }
              renderInput={(params) => (
                <TextFieldMUI
                  {...params}
                  fullWidth
                  variant="outlined"
                  label={t("USER_GROUP")}
                />
              )}
            />
          </Grid>
        )}

        {filters.status == 3 && (
          <Grid item xs={12} md={6}>
            <Field
              fullWidth
              name="detail"
              value={props.getInitial && detail}
              component={TextField}
              label={t("PLEASE_SPECIFY")}
              onChange={(event) => {
                setDetail(event.target.value);
                props.getInitial.detail = event.target.value;
              }}
            />
          </Grid>
        )}
      </>
      {/* )} */}

      <Grid item xs={12}>
        {props.BoxUploadWrapper && (
          <Box>
            {props.getInitial && (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: 1,
                }}
              >
                <Typography variant="h4" component="h4">
                  {props.addTitle
                    ? props.addTitle
                    : t("PLEASE_ATTACH_DOCUMENTS_FROM_ORGANIZATIONS")}
                </Typography>

                {props.downloadHidden && (
                  <Typography variant="subtitle1">
                    <Link href="#">{t("DOWNLOAD_MORE_DOCUMENTS")}</Link>
                  </Typography>
                )}
              </Grid>
            )}

            {props.downloadAll && (
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: 2,
                }}
              >
                <Stack
                  spacing={1}
                  direction="row"
                  sx={{ alignItems: "center" }}
                >
                  <Typography variant="h4" component="h4">
                    {t("DATA_ITEM")}
                  </Typography>

                  {files.length > 0 && (
                    <Typography variant="subtitle1" component="div">
                      {t("(พบ ")}
                      {files.length}
                      {t(" รายการ)")}
                    </Typography>
                  )}
                </Stack>
                <Typography variant="subtitle1">
                  {/* <Link href="#">{t("DOWNLOAD_ALL")}</Link> */}
                  <Button onClick={downloadAll}>{t("DOWNLOAD_ALL")}</Button>
                </Typography>
              </Grid>
            )}

            <props.BoxUploadWrapper
              {...(!props.getAutoFile && { ...getRootProps() })}
              sx={{
                display: files.length > 0 ? "block" : "flex",
                height: files.length > 0 ? 330 : "auto",
                overflowY: files.length > 8 ? "scroll" : "disable",
              }}

              // onClick={getRootProp}
              // { ...getRootProps }
            >
              <input {...getInputProps()} />
              {files.length > 0 || props.getAutoFile ? (
                <Grid container spacing={1} sx={{}}>
                  {props.getAutoFile ? getAutoFiles : files}
                </Grid>
              ) : (
                <>
                  <UploadOutlinedIcon color="primary" fontSize="large" />
                  <Typography
                    sx={{
                      mt: 1,
                    }}
                    color="secondary"
                  >
                    {t("DRAG_DOCCUMENT_ATTACH")}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<ComputerIcon />}
                    size="small"
                    sx={{
                      mt: 1,
                    }}
                  >
                    {t("SELECT_DOCUMENT_FROM_DEVICE")}
                  </Button>
                </>
              )}
            </props.BoxUploadWrapper>

            {props.registation && (
              <>
                {!props.document && (
                  <Typography
                    variant="subtitle1"
                    color="error"
                    sx={{ paddingTop: 1 }}
                  >
                    {t("DOCUMENT_MUST_EXCEED_3MB")}
                  </Typography>
                )}
              </>
            )}
          </Box>
        )}

        {alertFile()}
      </Grid>
    </Grid>
  );
}
