import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Pagination,
  Paper,
  Slide,
  Stack,
  styled,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslation } from "next-i18next";
import Label from "../Label";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ConvertDateTimeFormat } from "../FormatConvertDateTime";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useRouter } from "next/router";
import { AuthURL, ROLE_SCOPE } from "@/constants";
import { forwardRef, ReactElement, Ref, useCallback, useState } from "react";
import Text from "src/components/Text";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { waterDatasetApi } from "@/actions/water.dataset.action";
import { useSnackbar } from "notistack";
import { encryptData } from "@/utils/crypto";
import { format } from "date-fns";
import { waterApi } from "@/actions/water.action";
import { encodeBase64 } from "@/utils/nodeForge";
import { reportApi } from "@/actions/report.action";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const AntSwitch = styled(Switch)(({ theme }) => ({
  "& .css-hqp9x7-MuiSwitch-thumb": {
    border: "1px solid " + "rgb(87 202 34 / 20%)",
    boxShadow: "0 2px 4px 0 rgb(87 202 34 / 20%)",
    backgroundColor: theme.palette.success.main,
  },
}));

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

export enum TableType {
  SERVICE_REPORT, //
  DOWNLOADED_REPORT, //
  IMPORT_DATA, //
  EDIT_ACCOUNT, //
  TEST_CONNECT_API,
  CONNECT_IMPORT_REPORTS,
  DATA_REPORT_NOT_UPDATE, //
  DATA_INTEGRITY_REPORT, ///
  DATA_ACCURACY_REPORT, //
  REPORT_TIMELINESS_DATA, //
  DATA_IMPORT_WORK_HISTORY, ///
  WEB_SERVICE_REPORT, //
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export function TableComponent(props: any) {
  const { t }: { t: any } = useTranslation();
  const type: TableType = props.filters.type;
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [uuidUser, setUUIDUser] = useState<string>("");
  const [typeDelete, setTypeDelete] = useState<string>("");
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleSwitch = async (uuid: any, status: string) => {
    try {
      let body = {};
      if (status === "INACTIVE") {
        body = { enable_flag: true, status_flag: "ACTIVED" };
      } else {
        body = { enable_flag: true, status_flag: "INACTIVE" };
      }

      const result = await waterDatasetApi.patchDatasetImportConfig(uuid, body);

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
        props.onChange("updateDataset");
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
  };

  const handleConfirmDelete = async (event: any, uuid: any, type: string) => {
    event.stopPropagation();

    if (type === "ProvideSource") {
      setUUIDUser(uuid);
      setTypeDelete(type);
      setOpenConfirmDelete(true);
    } else {
      setUUIDUser(uuid);
      setTypeDelete(type);
      setOpenConfirmDelete(true);
    }
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = async (uuid: any) => {
    try {
      let resultDelete: any;

      if (typeDelete === "ProvideSource") {
        resultDelete = await waterApi.patchImportConfigurations(uuid);
      } else {
        resultDelete = await waterApi.patchDeleteImportConfigurations(uuid);
      }

      if (resultDelete?.code === 200) {
        enqueueSnackbar(t(`${resultDelete.status}`), {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          autoHideDuration: 2000,
          TransitionComponent: Slide,
        });

        if (typeDelete === "ProvideSource") {
          props.onChangeDelete("updateDataset");
        } else {
          props.onChange("updateDataset");
        }

        setOpenConfirmDelete(false);
      } else {
        enqueueSnackbar(`${resultDelete.description.message}`, {
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
  };

  const statusCheckData = (status: any): JSX.Element => {
    return (
      <Label
        color={
          status === true ? "success" : status === false ? "error" : "error"
        }
      >
        {status === true ? "ผ่าน QC" : "ไม่ผ่าน QC"}

        {status === true ? (
          <CheckCircleOutlineIcon
            sx={{ fontSize: "15px", marginLeft: "4px" }}
          />
        ) : status === false ? (
          <HighlightOffIcon sx={{ fontSize: "15px", marginLeft: "4px" }} />
        ) : (
          <HighlightOffIcon sx={{ fontSize: "15px", marginLeft: "4px" }} />
        )}
      </Label>
    );
  };

  const headerTitleTable = (type: TableType) => {
    switch (type) {
      case TableType.SERVICE_REPORT:
        return t("FINISHED_FILE_DOWNLOAD_REPORT");
      case TableType.DOWNLOADED_REPORT:
        return t("DOWNLOADED_READY_MADE_REPORT");
      case TableType.WEB_SERVICE_REPORT:
        return t("รายงานการใช้ Web Service");
      case TableType.IMPORT_DATA:
        return t("จัดการบัญชีข้อมูล");
      case TableType.EDIT_ACCOUNT:
        return t("ข้อมูลการเชื่อมโยง");
      case TableType.TEST_CONNECT_API:
        return t("DATA_FROM_API");
      case TableType.DATA_REPORT_NOT_UPDATE:
        return t("THE_DATA_REPORT_NOT_UPDATE");
      case TableType.DATA_INTEGRITY_REPORT:
        return t("DATA_INTEGRITY_REPORT");
      case TableType.DATA_ACCURACY_REPORT:
        return t("DATA_ACCURACY_REPORT");
      case TableType.REPORT_TIMELINESS_DATA:
        return t("REPORT_TIMELINESS_DATA");
      case TableType.DATA_IMPORT_WORK_HISTORY:
        return t("DATA_IMPORT_WORK_HISTORY");
      default:
        return;
    }
  };

  const titleTable = (type: TableType, index: any) => {
    switch (index) {
      case 1:
        return t("NO.");
      case 2:
        if (type === TableType.SERVICE_REPORT) {
          return t("USER_ACCOUNT");
        } else if (type === TableType.DOWNLOADED_REPORT) {
          return t("บัญชีผู้ใช้งาน");
        } else if (type === TableType.WEB_SERVICE_REPORT) {
          return t("บัญชีผู้ใช้งาน");
        } else if (type === TableType.IMPORT_DATA) {
          return t("FIRST_NAME");
        } else if (type === TableType.EDIT_ACCOUNT) {
          return t("FIRST_NAME");
        } else if (type === TableType.TEST_CONNECT_API) {
          return t("IMPORTED_DATA_VALUES");
        } else if (type === TableType.DATA_REPORT_NOT_UPDATE) {
          return t("DATA_SET");
        } else if (type === TableType.DATA_INTEGRITY_REPORT) {
          return t("DATA_SET");
        } else if (type === TableType.DATA_ACCURACY_REPORT) {
          return t("DATA_SET");
        } else if (type === TableType.REPORT_TIMELINESS_DATA) {
          return t("DATA_SET");
        } else if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("http_code");
        } else {
          return t("no type 2");
        }
      case 3:
        if (type === TableType.SERVICE_REPORT) {
          return t("ORGANIZATION");
        } else if (type === TableType.DOWNLOADED_REPORT) {
          return t("หน่วยงานต้นสังกัด");
        } else if (type === TableType.WEB_SERVICE_REPORT) {
          return t("หน่วยงานต้นสังกัด");
        } else if (type === TableType.IMPORT_DATA) {
          return t("DETAILS");
        } else if (type === TableType.EDIT_ACCOUNT) {
          return t("HOST");
        } else if (type === TableType.TEST_CONNECT_API) {
          return t("AGENCY");
        } else if (type === TableType.DATA_REPORT_NOT_UPDATE) {
          return t("AGENCY");
        } else if (type === TableType.DATA_INTEGRITY_REPORT) {
          return t("AGENCY");
        } else if (type === TableType.DATA_ACCURACY_REPORT) {
          return t("AGENCY");
        } else if (type === TableType.REPORT_TIMELINESS_DATA) {
          return t("AGENCY");
        } else if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("http_request");
        } else {
          return t("no type 3");
        }
      case 4:
        if (type === TableType.SERVICE_REPORT) {
          return t("DATA_SET");
        } else if (type === TableType.DOWNLOADED_REPORT) {
          return t("ชุดข้อมูล");
        } else if (type === TableType.WEB_SERVICE_REPORT) {
          return t("API");
        } else if (type === TableType.IMPORT_DATA) {
          return t("AGENCY");
        } else if (type === TableType.EDIT_ACCOUNT) {
          return t("DRIVER");
        } else if (type === TableType.TEST_CONNECT_API) {
          return t("STATION");
        } else if (type === TableType.DATA_REPORT_NOT_UPDATE) {
          return t("STATION");
        } else if (type === TableType.DATA_INTEGRITY_REPORT) {
          return t("DATE");
        } else if (type === TableType.DATA_ACCURACY_REPORT) {
          return t("DATE");
        } else if (type === TableType.REPORT_TIMELINESS_DATA) {
          return t("DATE");
        } else if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("parameter");
        } else {
          return t("no type 4");
        }
      case 5:
        if (type === TableType.SERVICE_REPORT) {
          return t("ระยะเวลา");
        } else if (type === TableType.WEB_SERVICE_REPORT) {
          return t("Error");
        } else if (type === TableType.IMPORT_DATA) {
          return t("DURATION");
        } else if (type === TableType.EDIT_ACCOUNT) {
          return t("DURATION");
        } else if (type === TableType.DOWNLOADED_REPORT) {
          return t("จำนวนครั้ง");
        } else if (type === TableType.TEST_CONNECT_API) {
          return t("TIME");
        } else if (type === TableType.DATA_REPORT_NOT_UPDATE) {
          return t("วันที่เวลา ได้รับข้อมูลครั้งสุดท้าย");
        } else if (type === TableType.DATA_INTEGRITY_REPORT) {
          return t("ร้อยละความครบถ้วนของข้อมูล");
        } else if (type === TableType.DATA_ACCURACY_REPORT) {
          return t("ร้อยละความครบถ้วนของข้อมูล");
        } else if (type === TableType.REPORT_TIMELINESS_DATA) {
          return t("ร้อยละความครบถ้วนของข้อมูล");
        } else if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("route");
        } else {
          return t("no type 5");
        }
      case 6:
        if (type === TableType.SERVICE_REPORT) {
          return t("รูปแบบการให้บริการ");
        } else if (type === TableType.IMPORT_DATA) {
          return t("SETTINGS");
        } else if (type === TableType.WEB_SERVICE_REPORT) {
          return t("วันที่ดาวน์โหลด");
        } else if (type === TableType.DOWNLOADED_REPORT) {
          return t("วันที่ดาวน์โหลด");
        } else if (type === TableType.EDIT_ACCOUNT) {
          return t("TEST_API");
        } else if (type === TableType.TEST_CONNECT_API) {
          return t("DATA_VERIFICATION_STATUS");
        } else if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("response");
        } else {
          return t("no type 6");
        }
      case 7:
        if (type === TableType.SERVICE_REPORT) {
          return t("จำนวนครั้ง");
        } else if (type === TableType.EDIT_ACCOUNT) {
          return t("OPEN_LICENSE");
        } else if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("create date");
        } else {
          return t("no type 7");
        }
      case 8:
        if (type === TableType.SERVICE_REPORT) {
          return t("DOWNLOAD_DATE");
        } else if (type === TableType.EDIT_ACCOUNT) {
          return t("SETTINGS");
        } else if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("ไฟล์ที่ดึงได้");
        } else {
          return t("no type 8");
        }
      case 9:
        if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("จำนวน record นำเข้า");
        } else {
          return t("no type 9");
        }
      case 10:
        if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("จำนวน record มีปัญหา");
        } else {
          return t("no type 10");
        }
      case 11:
        if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t("วันที่เริ่มต้น ");
        } else {
          return t("no type 11");
        }
      case 12:
        if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t(" วันที่สิ้นสุด ");
        } else {
          return t("no type 12");
        }
      case 13:
        if (type === TableType.DATA_IMPORT_WORK_HISTORY) {
          return t(" สถานะผลการแปลงข้อมูล ");
        } else {
          return t("no type 13");
        }
      default:
        return;
    }
  };

  const handleClickAPI = (event: any, _index: any, user: any) => {
    event.stopPropagation();
    // router.push(
    //   AuthURL.CONNECTING_AND_IMPORTING_DATA.MANAGE_DATA_IMPORT_METHODS
    //     .TEST_CONNECT_API
    // );
    router.push({
      pathname: `${AuthURL.MANAGE_ACCOUNT.TEST_CONNECT_API}`,
      query: {
        // id: btoa(encryptData(user?.uuid)),
        connectData: btoa(encryptData(JSON.stringify({ user }))),
      },
    }); //,user.uuid
    console.log("user test connection ", user);
  };

  const handleTestConnectAPI = (event: any, _index: any, user: any) => {
    event.stopPropagation();

    router.push({
      pathname: `${AuthURL.MANAGE_ACCOUNT.TEST_CONNECT_API}`,
      query: {
        connectData: btoa(encryptData(JSON.stringify({ user }))),
      },
    }); //,user.uuid
    console.log("user test connection ", user);
  };

  const handleDownloadFile = async (name: any) => {
    console.log("udownload file ", name);

    try {
      const result = await waterApi.getDownloadImportFile(encodeBase64(name));
    } catch (error) {
      alert(error);
    }
  };

  const [open, setOpen] = useState(false);
  const [dialogData, setDialogData] = useState<any[]>([]);

  const handleOpenDialog = (_event, value: any) => {
    setOpen(true);
    console.log(value);
    setDialogData(value);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const downloadReport = useCallback(
    async (parameter, limit, offset, keyword, type = "", path = "") => {
      setOpenBackdrop(true);

      try {
        // alert("Download Report");
        const reportResult = await reportApi.downloadExportReport(
          parameter,
          limit,
          offset,
          keyword,
          type,
          path
        );

        downloadFile({
          data: reportResult,
          fileName: "SERVICE_REPORT.csv",
          fileType: "text/csv",
        });
        // setReportData(reportResult);
        // setOpenBackdrop(false);
      } catch (err) {
        setOpenBackdrop(false);
        alert(err);
        //   // setReportData(null);
        //   // setOpenBackdrop(false);
      }
    },
    []
  );

  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    try {
      const blob = new Blob([data], { type: fileType });
      // Create an anchor element and dispatch a click event on it
      // to trigger a download
      const a = document.createElement("a");
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      const clickEvt = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      });
      a.dispatchEvent(clickEvt);
      a.remove();
      setOpenBackdrop(false);
    } catch (error) {
      setOpenBackdrop(false);
      alert(error);
    }
  };

  const [openBackDrop, setOpenBackdrop] = React.useState(false);

  return (
    <>
      {/* {SimpleBackdrop(openBackDrop)} */}
      <Card>
        <Grid container spacing={2} p={2}>
          <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
            <Stack spacing={3} direction="row">
              <Typography
                variant="h4"
                gutterBottom
                component="div"
                marginY={"auto"}
              >
                {headerTitleTable(type)}
              </Typography>

              {type === TableType.SERVICE_REPORT && (
                <Typography variant="subtitle1" marginY={"auto !important"}>
                  <Button
                    // href="#"
                    onClick={(e) => {
                      // alert("Download");
                      props.onClickDownloadReportNonWater();
                      // downloadReport(
                      //   "",
                      //   5,
                      //   String(5 * 0 + 1 - 1),
                      //   "information-service",
                      //   "CN_MTWS2"
                      // );
                      //   e.preventDefault;
                    }}
                  >
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Button>
                </Typography>
              )}

              {type === TableType.DOWNLOADED_REPORT && (
                <Typography variant="subtitle1" marginY={"auto !important"}>
                  {/* <Link href="#">
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Link> */}
                  <Button
                    onClick={(e) => {
                      props.onClickDownloadReportNonWater();
                    }}
                  >
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Button>
                </Typography>
              )}

              {type === TableType.WEB_SERVICE_REPORT && (
                <Typography variant="subtitle1" marginY={"auto !important"}>
                  {/* <Link href="#">
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Link> */}
                  <Button
                    onClick={(e) => {
                      props.onClickDownloadReportNonWater();
                    }}
                  >
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Button>
                </Typography>
              )}

              {type === TableType.IMPORT_DATA &&
                FunctionPermission(ROLE_SCOPE.ADD_PROVIDE_SOURCE) && (
                  <Button
                    variant="contained"
                    startIcon={<ControlPointIcon fontSize="small" />}
                    onClick={() =>
                      router.push(AuthURL.MANAGE_ACCOUNT.ADD_ACCOUNT)
                    }
                  >
                    {t("เพิ่มบัญชีข้อมูล")}
                  </Button>
                )}

              {type === TableType.EDIT_ACCOUNT &&
                FunctionPermission(ROLE_SCOPE.ADD_IMPORT_CONFIG) && (
                  <Button
                    variant="contained"
                    startIcon={<ControlPointIcon fontSize="small" />}
                    onClick={() =>
                      router.push({
                        pathname: AuthURL.MANAGE_ACCOUNT.ADD_CONNECTION,
                        query: {
                          id: router.query.id,
                        },
                      })
                    }
                  >
                    {t("เพิ่มการเชื่อมโยง")}
                  </Button>
                )}

              {type === TableType.DATA_REPORT_NOT_UPDATE &&
                ((FunctionPermission(
                  ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                ) &&
                  FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                  )) ||
                  (FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                  ) &&
                    FunctionPermission(
                      ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                    ))) && (
                  <Typography variant="subtitle1" marginY={"auto !important"}>
                    {/* <Link href="#">
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Link> */}
                    <Button
                      onClick={(e) => {
                        props.onClickDownloadReportWater();
                      }}
                    >
                      <b>{t("DOWNLOAD_REPORT")}</b>
                    </Button>
                  </Typography>
                )}

              {type === TableType.DATA_INTEGRITY_REPORT &&
                ((FunctionPermission(
                  ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                ) &&
                  FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                  )) ||
                  (FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                  ) &&
                    FunctionPermission(
                      ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                    ))) && (
                  <Typography variant="subtitle1" marginY={"auto !important"}>
                    {/* <Link href="#">
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Link> */}
                    <Button
                      onClick={(e) => {
                        props.onClickDownloadReportWater();
                      }}
                    >
                      <b>{t("DOWNLOAD_REPORT")}</b>
                    </Button>
                  </Typography>
                )}
              {type === TableType.DATA_ACCURACY_REPORT &&
                ((FunctionPermission(
                  ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                ) &&
                  FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                  )) ||
                  (FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                  ) &&
                    FunctionPermission(
                      ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                    ))) && (
                  <Typography variant="subtitle1" marginY={"auto !important"}>
                    {/* <Link href="#">
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Link> */}
                    <Button
                      onClick={(e) => {
                        props.onClickDownloadReportWater();
                      }}
                    >
                      <b>{t("DOWNLOAD_REPORT")}</b>
                    </Button>
                  </Typography>
                )}
              {type === TableType.REPORT_TIMELINESS_DATA &&
                ((FunctionPermission(
                  ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                ) &&
                  FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                  )) ||
                  (FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                  ) &&
                    FunctionPermission(
                      ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                    ))) && (
                  <Typography variant="subtitle1" marginY={"auto !important"}>
                    {/* <Link href="#">
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Link> */}
                    <Button
                      onClick={(e) => {
                        props.onClickDownloadReportWater();
                      }}
                    >
                      <b>{t("DOWNLOAD_REPORT")}</b>
                    </Button>
                  </Typography>
                )}
              {type === TableType.DATA_IMPORT_WORK_HISTORY &&
                ((FunctionPermission(
                  ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                ) &&
                  FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT
                  )) ||
                  (FunctionPermission(
                    ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                  ) &&
                    FunctionPermission(
                      ROLE_SCOPE.DOWNLOAD_PROVIDE_SOURCE_REPORT_DEPARTMENT
                    ))) && (
                  <Typography variant="subtitle1" marginY={"auto !important"}>
                    {/* <Link href="#">
                    <b>{t("DOWNLOAD_REPORT")}</b>
                  </Link> */}
                    <Button
                      onClick={(e) => {
                        props.onClickDownloadReportWater();
                      }}
                    >
                      <b>{t("DOWNLOAD_REPORT")}</b>
                    </Button>
                  </Typography>
                )}
            </Stack>

            {/* {props.paginatedUsers?.pagination?.total_items && ( */}
            <TablePagination
              component="div"
              count={props.paginatedUsers?.pagination?.total_items ?? 0}
              onPageChange={props.handlePageChangeTable}
              onRowsPerPageChange={props.handleLimitChange}
              page={props.page}
              rowsPerPage={props.limit}
              labelRowsPerPage={null}
              rowsPerPageOptions={[
                // { label: `${t("SHOW")}${t("ทั้งหมด")}`, value: -1 },
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
            {/* )} */}
          </Grid>
        </Grid>

        <Divider />

        {!props.paginatedUsers ||
        props.paginatedUsers?.content?.length === 0 ? (
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
              {`ไม่พบข้อมูล${headerTitleTable(type)}`}
            </Typography>
          </>
        ) : (
          <>
            <Paper sx={{ width: "100%", overflow: "hidden" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ maxWidth: 100 }} align="center">
                        {titleTable(type, 1)}
                      </TableCell>
                      <TableCell>{titleTable(type, 2)}</TableCell>
                      <TableCell>{titleTable(type, 3)}</TableCell>
                      <TableCell>{titleTable(type, 4)}</TableCell>
                      <TableCell>{titleTable(type, 5)}</TableCell>
                      {type === TableType.SERVICE_REPORT && (
                        <>
                          <TableCell>{titleTable(type, 6)}</TableCell>
                          <TableCell>{titleTable(type, 7)}</TableCell>
                          <TableCell>{titleTable(type, 8)}</TableCell>
                        </>
                      )}
                      {type === TableType.DOWNLOADED_REPORT && (
                        <TableCell>{titleTable(type, 6)}</TableCell>
                      )}
                      {type === TableType.IMPORT_DATA && (
                        <TableCell align="center">
                          {titleTable(type, 6)}
                        </TableCell>
                      )}
                      {type === TableType.WEB_SERVICE_REPORT && (
                        <TableCell>{titleTable(type, 6)}</TableCell>
                      )}
                      {type === TableType.TEST_CONNECT_API && (
                        <TableCell>{titleTable(type, 6)}</TableCell>
                      )}
                      {type === TableType.EDIT_ACCOUNT && (
                        <>
                          {/* {FunctionPermission(
                            ROLE_SCOPE.OPEN_CLOSE_IMPORT_CONFIG
                          ) && <TableCell>{titleTable(type, 6)}</TableCell>} */}

                          {FunctionPermission(
                            ROLE_SCOPE.OPEN_CLOSE_IMPORT_CONFIG
                          ) && <TableCell>{titleTable(type, 7)}</TableCell>}

                          <TableCell align="center">
                            {titleTable(type, 8)}
                          </TableCell>
                        </>
                      )}
                      {type === TableType.DATA_IMPORT_WORK_HISTORY && (
                        <>
                          <TableCell>{titleTable(type, 6)}</TableCell>
                          <TableCell>{titleTable(type, 7)}</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(props.paginatedUsers?.content?.rows
                      ? props.paginatedUsers?.content?.rows
                      : props.paginatedUsers?.content
                    )?.map((user, index) => {
                      // const Filter_interval =
                      //   type === TableType.IMPORT_DATA &&
                      //   user.interval?.filter((v, i) => {
                      //     return user.interval.map((val) =>
                      //       console.log(val.interval.code)
                      //     );

                      //     return (
                      //       user.interval
                      //         .map((val) => val.interval.code)
                      //         .indexOf(v.interval.code) == i
                      //     );
                      //   });

                      let Filter_interval = [];

                      if (type === TableType.IMPORT_DATA) {
                        Filter_interval = user.interval?.filter((v, i) => {
                          return (
                            user.interval
                              .map((val) => val.interval?.code)
                              .indexOf(v.interval?.code) == i
                          );
                        });
                      }

                      return (
                        <>
                          {type === TableType.SERVICE_REPORT && (
                            <TableRow hover>
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user.email ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  {user?.department?.map((val) => {
                                    return (
                                      <Typography>{`${
                                        val?.th ?? "-"
                                      }`}</Typography>
                                    );
                                  })}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>
                                    {user.category?.th ?? "-"}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>
                                    {`${format(
                                      new Date(user.from),
                                      "dd-MMM-yyyy"
                                    )} ถึง ${format(
                                      new Date(user.to),
                                      "dd-MMM-yyyy"
                                    )}`}
                                  </Typography>
                                </Box>
                                {/* <Grid container spacing={1}>
                                  {group
                                    .slice(
                                      0,
                                      Math.floor(Math.random() * (5 - 1 + 1)) +
                                        1
                                    )
                                    .map((value, index) => {
                                      return (
                                        <Grid item key={index}>
                                          <Label color="success">
                                            {value.label}
                                            <CheckCircleOutlineIcon
                                              sx={{
                                                fontSize: "15px",
                                                marginLeft: "4px",
                                              }}
                                            />
                                          </Label>
                                        </Grid>
                                      );
                                    })}
                                </Grid> */}
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>{user.params ?? "-"}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>{`${
                                    user.count ?? "-"
                                  } ครั้ง`}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  <ConvertDateTimeFormat
                                    date={user.download_date ?? new Date()}
                                  />
                                </Typography>
                                {/* <Typography>{"เวลา 10:00 น."}</Typography> */}
                                <Typography>
                                  {user.download_date
                                    ? `เวลา ${format(
                                        new Date(user.download_date),
                                        "HH:mm"
                                      )} น.`
                                    : ""}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            // </NextLink>
                          )}

                          {type === TableType.DOWNLOADED_REPORT && (
                            // <NextLink href={"/#"} key={index}>
                            <TableRow hover key={user.id}>
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>{user?.email ?? "-"}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                {user?.department?.map((val) => {
                                  return (
                                    <Typography>{val?.th ?? "-"}</Typography>
                                  );
                                })}
                                {/* <Typography>
                                  {user?.department
                                    ? user?.department
                                    : user?.departmemt
                                    ? user?.departmemt
                                    : "-"}
                                </Typography> */}
                              </TableCell>
                              <TableCell>
                                {user?.category?.th ?? "-"}
                                {/* <Grid container spacing={1}>
                                  {group
                                    .slice(
                                      0,
                                      Math.floor(Math.random() * (5 - 1 + 1)) +
                                        1
                                    )
                                    .map((value, index) => {
                                      return (
                                        <Grid item key={index}>
                                          <Label color="success">
                                            {value.label}
                                            <CheckCircleOutlineIcon
                                              sx={{
                                                fontSize: "15px",
                                                marginLeft: "4px",
                                              }}
                                            />
                                          </Label>
                                        </Grid>
                                      );
                                    })}
                                </Grid> */}
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {`${user?.count ?? "-"} ครั้ง`}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  <ConvertDateTimeFormat
                                    date={user.download_date ?? new Date()}
                                  />
                                </Typography>
                                <Typography>
                                  {user.download_date
                                    ? `เวลา ${format(
                                        new Date(user.download_date),
                                        "HH:mm"
                                      )} น.`
                                    : ""}
                                </Typography>
                                {/* <Typography>{"เวลา 13:30 น."}</Typography> */}
                              </TableCell>
                            </TableRow>
                            // </NextLink>
                          )}

                          {type === TableType.WEB_SERVICE_REPORT && (
                            // <NextLink href={"/admin/report/detail/1"} key={index}>
                            <TableRow hover>
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user.email ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>
                                    {user?.department ?? "-"}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>{user.request ?? "-"}</Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Typography>
                                    {user.response ?? "-"}
                                  </Typography>
                                </Box>
                              </TableCell>
                              {/* <TableCell>
                              <Box display="flex" alignItems="center">
                                <Typography>{`${
                                  user.count ?? "-"
                                } ครั้ง`}</Typography>
                              </Box>
                            </TableCell> */}
                              <TableCell>
                                <Typography>
                                  <ConvertDateTimeFormat
                                    date={user.create_date ?? new Date()}
                                  />
                                </Typography>
                                {/* <Typography>{"เวลา 10:00 น."}</Typography> */}
                                <Typography>
                                  {user.create_date
                                    ? `เวลา ${format(
                                        new Date(user.create_date),
                                        "HH:mm"
                                      )} น.`
                                    : ""}
                                </Typography>
                              </TableCell>
                            </TableRow>
                            // </NextLink>
                          )}

                          {type === TableType.IMPORT_DATA &&
                            ((FunctionPermission(
                              ROLE_SCOPE.MANAGE_PROVIDE_SOURCE
                            ) &&
                              FunctionPermission(
                                ROLE_SCOPE.MANAGE_PROVIDE_SOURCE
                              )) ||
                              (FunctionPermission(
                                ROLE_SCOPE.SHOW_ALL_PROVIDE_SOURCE
                              ) &&
                                FunctionPermission(
                                  ROLE_SCOPE.SHOW_ALL_PROVIDE_SOURCE
                                )) ||
                              (FunctionPermission(
                                ROLE_SCOPE.SHOW_ALL_PROVIDE_SOURCE_DEPARTMENT
                              ) &&
                                FunctionPermission(
                                  ROLE_SCOPE.SHOW_ALL_PROVIDE_SOURCE_DEPARTMENT
                                ))) && (
                              <TableRow
                                hover
                                onClick={() => {
                                  // if (FunctionPermission(ROLE_SCOPE.VIEW_PROVIDE_SOURCE)) {
                                  router.push({
                                    pathname: `${AuthURL.MANAGE_ACCOUNT.EDIT_ACCOUNT}`,
                                    query: {
                                      id: btoa(encryptData(user?.uuid)),
                                    },
                                  });
                                  // }
                                  // handleClickPermission(user?.uuid);

                                  // setPermission(FunctionPermission(ROLE_SCOPE.VIEW_PROVIDE_SOURCE))
                                }}
                              >
                                <TableCell align="center">
                                  <Typography>
                                    {props.limit * props.page + 1 + index}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Typography>{user.name?.th}</Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Typography>
                                      {user.description?.th}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Typography>
                                      {user.department?.name?.th ?? "-"}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Grid container spacing={1}>
                                    {Filter_interval.length > 0 && (
                                      <Grid item sm={12}>
                                        <Grid container spacing={1}>
                                          {Filter_interval.slice(0, 3).map(
                                            (value, index) => {
                                              return (
                                                <>
                                                  <Grid item key={index}>
                                                    <Label color="success">
                                                      {value.interval?.code ??
                                                        "-"}
                                                      <CheckCircleOutlineIcon
                                                        sx={{
                                                          fontSize: "15px",
                                                          marginLeft: "4px",
                                                        }}
                                                      />
                                                    </Label>
                                                  </Grid>
                                                </>
                                              );
                                            }
                                          )}
                                        </Grid>
                                      </Grid>
                                    )}

                                    {Filter_interval.length > 3 && (
                                      <Grid item sm={12}>
                                        <Grid container spacing={1}>
                                          {Filter_interval.slice(3, 5).map(
                                            (value, index) => {
                                              return (
                                                <>
                                                  <Grid item key={index}>
                                                    <Label color="success">
                                                      {value.interval?.code ??
                                                        "-"}
                                                      <CheckCircleOutlineIcon
                                                        sx={{
                                                          fontSize: "15px",
                                                          marginLeft: "4px",
                                                        }}
                                                      />
                                                    </Label>
                                                  </Grid>
                                                </>
                                              );
                                            }
                                          )}

                                          {Filter_interval.length > 5 && (
                                            <Grid item>
                                              <Label color="success">
                                                +{" "}
                                                {Filter_interval.length - 5 ??
                                                  "-"}
                                              </Label>
                                            </Grid>
                                          )}
                                        </Grid>
                                      </Grid>
                                    )}
                                  </Grid>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography noWrap>
                                    {((FunctionPermission(
                                      ROLE_SCOPE.EDIT_PROVIDE_SOURCE
                                    ) &&
                                      FunctionPermission(
                                        ROLE_SCOPE.EDIT_PROVIDE_SOURCE
                                      )) ||
                                      (FunctionPermission(
                                        ROLE_SCOPE.EDIT_PROVIDE_SOURCE_DEPARTMENT
                                      ) &&
                                        FunctionPermission(
                                          ROLE_SCOPE.EDIT_PROVIDE_SOURCE_DEPARTMENT
                                        ))) && (
                                      <Tooltip title={t("EDIT")} arrow>
                                        <IconButton
                                          // onClick={(event) => {
                                          //   event.stopPropagation();
                                          //   router.push({
                                          //     pathname: `/admin/management/users/detail/${btoa(
                                          //       encryptData(user?.uuid)
                                          //     )}`
                                          //   })
                                          // }}
                                          color="primary"
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {/* )} */}

                                    {/* {FunctionPermission(ROLE_SCOPE.DELETE_USER) && ( */}
                                    {FunctionPermission(
                                      ROLE_SCOPE.DELETE_PROVIDE_SOURCE
                                    ) && (
                                      <Tooltip title={t("DELETE")} arrow>
                                        <IconButton
                                          onClick={(event) => {
                                            const type = "ProvideSource";
                                            handleConfirmDelete(
                                              event,
                                              user?.uuid,
                                              type
                                            );
                                          }}
                                          color="error"
                                        >
                                          <DeleteTwoToneIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {/* )} */}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            )}

                          {type === TableType.EDIT_ACCOUNT && (
                            // FunctionPermission(ROLE_SCOPE.SHOW_ALL_IMPORT_CONFIG) &&
                            <TableRow
                              hover
                              key={index}
                              onClick={() =>
                                // FunctionPermission(ROLE_SCOPE.VIEW_IMPORT_CONFIG)
                                router.push({
                                  pathname: `${AuthURL.MANAGE_ACCOUNT.EDIT_CONNECTION}`,
                                  query: {
                                    id: btoa(encryptData(user?.uuid)),
                                    uuid: btoa(
                                      encryptData(props.provide_source_uuid)
                                    ),
                                    name_th: encryptData(user?.name?.th),
                                    name_en: encryptData(user?.name?.en),
                                  },
                                })
                              }
                            >
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user?.name?.th ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user?.host ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user?.protocol ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Grid container spacing={1}>
                                  {user.interval?.map((value, index) => {
                                    return (
                                      <Grid item key={index}>
                                        <Label color="success">
                                          {/* {user?.interval?.name?.th ?? "-"} */}
                                          {value?.code ?? "-"}
                                          <CheckCircleOutlineIcon
                                            sx={{
                                              fontSize: "15px",
                                              marginLeft: "4px",
                                            }}
                                          />
                                        </Label>
                                      </Grid>
                                    );
                                  })}
                                </Grid>
                              </TableCell>
                              {/* {FunctionPermission(
                                  ROLE_SCOPE.OPEN_CLOSE_IMPORT_CONFIG
                                ) && (
                                  <TableCell style={{ width: 160 }}>
                                    <Tooltip title={t("API")} arrow>
                                      <Button
                                        component="a"
                                        color="primary"
                                        variant="text"
                                        sx={{ letterSpacing: 1, fontSize: 10 }}
                                        // onClick={(event) =>
                                        //   handleClickAPI(event, index, user)
                                        // }
                                      >
                                        {t("<API>")}
                                      </Button>
                                    </Tooltip>
                                  </TableCell>
                                )} */}
                              <TableCell style={{ width: 160 }}>
                                <AntSwitch
                                  color="success"
                                  checked={
                                    user?.flag?.status_flag === "INACTIVE"
                                      ? false
                                      : true
                                  }
                                  onClick={(event) => (
                                    event.stopPropagation(),
                                    handleSwitch(
                                      user?.uuid,
                                      user?.flag?.status_flag
                                    )
                                  )}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Typography noWrap>
                                  {FunctionPermission(
                                    ROLE_SCOPE.EDIT_IMPORT_CONFIG
                                  ) && (
                                    <Tooltip title={t("EDIT")} arrow>
                                      <IconButton
                                        // onClick={(event) => {
                                        //   event.stopPropagation();
                                        //   router.push({
                                        //     pathname: `/admin/management/users/detail/${btoa(
                                        //       encryptData(user?.uuid)
                                        //     )}`
                                        //   })
                                        // }}
                                        color="primary"
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}

                                  {FunctionPermission(
                                    ROLE_SCOPE.DELETE_IMPORT_CONFIG
                                  ) && (
                                    <Tooltip title={t("DELETE")} arrow>
                                      <IconButton
                                        onClick={(event) => {
                                          const type = "Dataset";
                                          handleConfirmDelete(
                                            event,
                                            user?.uuid,
                                            type
                                          );
                                        }}
                                        color="error"
                                      >
                                        <DeleteTwoToneIcon fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}

                          {type === TableType.TEST_CONNECT_API && (
                            <TableRow
                              hover
                              key={index}
                              onClick={(event) => handleOpenDialog(event, user)}
                            >
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user.value ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.department_code ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.station_code ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.currents_date ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Grid container spacing={1}>
                                  {statusCheckData(user.hii_qc_flag)}
                                  {/* {group
                                    .slice(
                                      0,
                                      Math.floor(Math.random() * (1 - 1 + 1)) +
                                        1
                                    )
                                    .map((value, index) => {
                                      return (
                                        <Grid item key={index}>
                                          <Label color="success">
                                            {value.label}
                                            <CheckCircleOutlineIcon
                                              sx={{
                                                fontSize: "15px",
                                                marginLeft: "4px",
                                              }}
                                            />
                                          </Label>
                                        </Grid>
                                      );
                                    })} */}
                                </Grid>
                              </TableCell>
                            </TableRow>
                          )}

                          {type === TableType.DATA_REPORT_NOT_UPDATE && (
                            <TableRow hover key={index}>
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user.value ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.department.th ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.station.th ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.lasted_update ? (
                                    <ConvertDateTimeFormat
                                      date={format(
                                        new Date(user.lasted_update),
                                        "dd-MMM-yyyy"
                                      )}
                                    />
                                  ) : (
                                    "-"
                                  )}
                                </Typography>
                                <Typography>
                                  {user.lasted_update
                                    ? `เวลา ${format(
                                        new Date(user.lasted_update),
                                        "HH:mm"
                                      )} น.`
                                    : ""}
                                </Typography>
                                {/* <Typography>{"เวลา 10:00 น."}</Typography> */}
                              </TableCell>
                            </TableRow>
                          )}

                          {type === TableType.DATA_INTEGRITY_REPORT && (
                            <TableRow hover key={index}>
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user?.category ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user?.department?.th ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  <ConvertDateTimeFormat date={user.date} />
                                </Typography>
                                <Typography>
                                  {user.date
                                    ? `เวลา ${format(
                                        new Date(user.date),
                                        "HH:mm"
                                      )} น.`
                                    : ""}
                                </Typography>
                                {/* <Typography>{"เวลา 10:00 น."}</Typography> */}
                              </TableCell>
                              <TableCell>
                                <Typography>{`${
                                  user?.value ?? "-"
                                } %`}</Typography>
                              </TableCell>
                            </TableRow>
                          )}

                          {type === TableType.DATA_ACCURACY_REPORT && (
                            <TableRow hover key={index}>
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.category?.th ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.department?.th ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  <ConvertDateTimeFormat
                                    date={format(
                                      new Date(user.date),
                                      "dd-MMM-yyyy"
                                    )}
                                  />
                                </Typography>
                                <Typography>
                                  {user.date
                                    ? `เวลา ${format(
                                        new Date(user.date),
                                        "HH:mm"
                                      )} น.`
                                    : ""}
                                </Typography>
                                {/* <Typography>{"เวลา 10:00 น."}</Typography> */}
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user?.value ?? "-" + `%`}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          )}

                          {type === TableType.REPORT_TIMELINESS_DATA && (
                            <TableRow hover key={index}>
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.category?.th ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.department?.th ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  <ConvertDateTimeFormat date={user.date} />
                                </Typography>
                                <Typography>
                                  {user.date
                                    ? `เวลา ${format(
                                        new Date(user.date),
                                        "HH:mm"
                                      )} น.`
                                    : ""}
                                </Typography>
                                {/* <Typography>{"เวลา 10:00 น."}</Typography> */}
                              </TableCell>
                              <TableCell>
                                <Typography>{`${
                                  user.value ?? "-"
                                } %`}</Typography>
                              </TableCell>
                            </TableRow>
                          )}

                          {type === TableType.DATA_IMPORT_WORK_HISTORY && (
                            <TableRow
                              hover
                              key={index}
                              onClick={(event) =>
                                handleTestConnectAPI(event, index, user)
                              }
                            >
                              <TableCell align="center">
                                <Typography>
                                  {props.limit * props.page + 1 + index}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {/* {console.log("JSON.parse", JSON.parse(user.category)?.th)} */}

                                <Typography>{user.http_code ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.http_request ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.log_parameter ?? "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user.log_route ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>
                                  {user.http_code !== "200"
                                    ? user.log_response ?? "-"
                                    : "-"}
                                </Typography>
                              </TableCell>
                              {/* <TableCell>
                                <Typography>{user.success ?? "-"}</Typography>
                              </TableCell>
                              <TableCell>
                                <Typography>{user.missing ?? "-"}</Typography>
                              </TableCell> */}
                              <TableCell>
                                <Typography>
                                  {user.created_date ? (
                                    <ConvertDateTimeFormat
                                      date={format(
                                        new Date(user.created_date),
                                        "dd-MMM-yyyy"
                                      )}
                                    />
                                  ) : (
                                    "-"
                                  )}
                                </Typography>
                                <Typography>
                                  {user.created_date
                                    ? `เวลา ${format(
                                        new Date(user.created_date),
                                        "HH:mm"
                                      )} น.`
                                    : ""}
                                </Typography>
                              </TableCell>
                              {/* <TableCell>
                                <Typography>
                                  {user.time_end ? (
                                    <ConvertDateTimeFormat
                                      date={format(
                                        new Date(user.time_end),
                                        "dd-MMM-yyyy"
                                      )}
                                    />
                                  ) : (
                                    "-"
                                  )}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="subtitle1"
                                  marginY={"auto !important"}
                                >
                                  <Link
                                    href="#"
                                    onClick={() =>
                                      handleDownloadFile(user.import_file)
                                    }
                                  >
                                    <CloudDownloadIcon />
                                  </Link>
                                </Typography>
                              </TableCell> */}
                            </TableRow>
                          )}
                        </>
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
                  onChange={props.handlePageChange}
                  // count={Math.ceil(props.filteredUsers?.length / props.limit)}\
                  count={
                    // type === TableType.IMPORT_DATA ||
                    // type === TableType.SERVICE_REPORT ||
                    // type === TableType.DOWNLOADED_REPORT ||
                    // type === TableType.WEB_SERVICE_REPORT ||
                    // type === TableType.DATA_REPORT_NOT_UPDATE ||
                    // type === TableType.DATA_INTEGRITY_REPORT ||
                    // type === TableType.DATA_ACCURACY_REPORT ||
                    // type === TableType.REPORT_TIMELINESS_DATA ||
                    // type === TableType.DATA_IMPORT_WORK_HISTORY
                    //   ? props.paginatedUsers?.pagination?.total_pages
                    //   : Math.ceil(props.filteredUsers?.length / props.limit)

                    props.paginatedUsers?.pagination?.total_pages ?? 0
                  }
                  page={props.page + 1}
                  defaultPage={0}
                />
              </Box>
            </Paper>
          </>
        )}

        {type === TableType.TEST_CONNECT_API && (
          <Dialog
            fullWidth
            maxWidth="md"
            open={open}
            onClose={handleCloseDialog}
          >
            <DialogTitle sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom mb={0}>
                {t("DATA_FROM_API")}
              </Typography>
            </DialogTitle>

            <Divider />

            {/* <form noValidate onSubmit={props.formik.handleSubmit} {...props}> */}

            <DialogContent sx={{ p: 3 }}>
              {console.log(dialogData)}
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("IMPORTED_DATA_VALUES")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    {/* <Text color="black">{dialogData.posts}</Text> */}
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("AGENCY")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    {/* <Text color="black">{dialogData.followers}</Text> */}
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("STATION")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">110.22.33.44:8081</Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("TIME")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">GET</Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: "right" }}>
                    <Box pr={3} pb={2}>
                      {t("FAILED_QC_RULE")}:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">API key</Text>
                  </Grid>
                </Grid>
              </Typography>
            </DialogContent>

            <DialogActions
              p={3}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseDialog}
              >
                {t("CANCEL")}
              </Button>

              <Button
                type="submit"
                // disabled={Boolean(errors.submit) || isSubmitting}
                variant="contained"
                color="success"
              >
                {t("SAVE")}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Card>

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
}
