import {
  Typography,
  Box,
  Avatar,
  Card,
  Grid,
  useTheme,
  styled,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import ArrowUpwardTwoToneIcon from "@mui/icons-material/ArrowUpwardTwoTone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LanIcon from "@mui/icons-material/Lan";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import PeopleIcon from "@mui/icons-material/People";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import WarningIcon from "@mui/icons-material/Warning";
import ShareIcon from "@mui/icons-material/Share";
// import Block1 from "src/content/Blocks/ProgressCircular/Block8";
// import TransactionsStatistics from "@/content/Dashboards/Banking/TransactionsStatistics";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import HttpIcon from "@mui/icons-material/Http";
import Battery20Icon from "@mui/icons-material/Battery20";
import { useAuth } from "@/hooks/useAuth";
import TransactionsStatistics from "../../TransactionsStatistics";
import Block1 from "../ProgressCircular/Block8";

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      color:  ${theme.colors.alpha.trueWhite[100]};
      width: ${theme.spacing(5.5)};
      height: ${theme.spacing(5.5)};
`
);

function Block3() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const role = useAuth().user.current_role_code;
  const check = "User";

  // switch (role) {
  //   case User:

  //     break;

  //   default:
  //     break;
  // }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} lg={3}>
        <Card
          sx={{
            px: 3,
            pb: 6,
            pt: 3,
          }}
        >
          <Box display="flex" alignItems="center">
            <AvatarWrapper
              sx={{
                background: `${theme.colors.primary.main}`,
              }}
            >
              {role.includes(check) ? (
                <PeopleIcon fontSize="small" />
              ) : (
                <InsertDriveFileIcon fontSize="small" />
              )}
            </AvatarWrapper>
            <Typography
              sx={{
                ml: 1.5,
                fontSize: `${theme.typography.pxToRem(15)}`,
                fontWeight: "bold",
              }}
              variant="subtitle2"
              component="div"
            >
              {role.includes(check)
                ? t("จำนวนผู้ใช้งานภายในหน่วยงาน")
                : t("จำนวนการขอรับบริการข้อมูล")}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              ml: -2,
              pt: 2,
              pb: 1.5,
              justifyContent: "center",
            }}
          >
            {role.includes(check) ? (
              <EmojiPeopleIcon
                sx={{
                  color: `${theme.colors.primary.main}`,
                }}
              />
            ) : (
              <FolderOpenIcon
                sx={{
                  color: `${theme.colors.primary.main}`,
                }}
              />
            )}
            <Typography
              sx={{
                pl: 1,
                fontSize: `${theme.typography.pxToRem(35)}`,
              }}
              variant="h1"
            >
              400
            </Typography>
          </Box>
          <Typography
            align="center"
            variant="body2"
            noWrap
            color="text.secondary"
            component="div"
            sx={{
              // ml: 2,
              pt: 2,
              // pb: 1.5,
              justifyContent: "center",
            }}
          >
            <b> </b>
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Card
          sx={{
            px: 3,
            pb: 6,
            pt: 3,
          }}
        >
          <Box display="flex" alignItems="center">
            {role.includes(check) ? (
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.orange3}`,
                }}
              >
                <SentimentVeryDissatisfiedIcon fontSize="small" />
              </AvatarWrapper>
            ) : (
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.green1}`,
                }}
              >
                <CloudQueueIcon fontSize="small" />
              </AvatarWrapper>
            )}
            <Typography
              sx={{
                ml: 1.5,
                fontSize: `${theme.typography.pxToRem(15)}`,
                fontWeight: "bold",
              }}
              variant="subtitle2"
              component="div"
            >
              {role.includes(check)
                ? t("จำนวนผู้ใช้งานที่รออนุมัติ")
                : t("จำนวนข้อมูลที่พร้อมดาวน์โหลด")}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              ml: -2,
              pt: 2,
              pb: 1.5,
              justifyContent: "center",
            }}
          >
            {role.includes(check) ? (
              <WarningIcon
                sx={{
                  color: `${theme.colors.warning.light}`,
                }}
              />
            ) : (
              <CloudDownloadIcon
                sx={{
                  color: `${theme.colors.success.light}`,
                }}
              />
            )}
            <Typography
              sx={{
                pl: 1,
                fontSize: `${theme.typography.pxToRem(35)}`,
              }}
              variant="h1"
            >
              20
            </Typography>
          </Box>
          <Typography
            align="center"
            variant="body2"
            noWrap
            color="text.secondary"
            component="div"
          >
            <b>
              {role.includes(check)
                ? t("5% จากจำนวนผู้ใช้งานทั้งหมด")
                : t("90% จากจำนวนข้อมูลที่ขอรับบริการทั้งหมด")}
            </b>
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Card
          sx={{
            px: 3,
            pb: 6,
            pt: 3,
          }}
        >
          <Box display="flex" alignItems="center">
            {role.includes(check) ? (
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.blue1}`,
                }}
              >
                <LanIcon fontSize="small" />
              </AvatarWrapper>
            ) : (
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.orange1}`,
                }}
              >
                <VpnKeyIcon fontSize="small" />
              </AvatarWrapper>
            )}
            <Typography
              sx={{
                ml: 1.5,
                fontSize: `${theme.typography.pxToRem(15)}`,
                fontWeight: "bold",
              }}
              variant="subtitle2"
              component="div"
            >
              {role.includes(check)
                ? t("จำนวนบัญชีข้อมูลที่ให้บริการ")
                : t("จำนวน API key ที่กำลังจะหมดอายุ")}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              ml: -2,
              pt: 2,
              pb: 1.5,
              justifyContent: "center",
            }}
          >
            {role.includes(check) ? (
              <ShareIcon
                sx={{
                  color: `${theme.colors.info.main}`,
                }}
              />
            ) : (
              <WarningIcon
                sx={{
                  color: `${theme.colors.warning.main}`,
                }}
              />
            )}
            <Typography
              sx={{
                pl: 1,
                fontSize: `${theme.typography.pxToRem(35)}`,
              }}
              variant="h1"
            >
              200
            </Typography>
          </Box>
          <Typography
            align="center"
            variant="body2"
            noWrap
            color="text.secondary"
            component="div"
            sx={{
              // ml: 2,
              pt: role.includes(check) ? 2 : 0,
              // pb: 1.5,
              justifyContent: "center",
            }}
          >
            <b>
              {role.includes(check) ? t("") : t("วันหมดอายุน้อยกว่า 30 วัน")}
            </b>
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <Card
          sx={{
            px: 3,
            pb: 6,
            pt: 3,
          }}
        >
          <Box display="flex" alignItems="center">
            {role.includes(check) ? (
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.success.light}`,
                }}
              >
                <InsertDriveFileIcon fontSize="small" />
              </AvatarWrapper>
            ) : (
              <AvatarWrapper
                sx={{
                  background: `${theme.colors.gradients.blue2}`,
                }}
              >
                <HttpIcon fontSize="small" />
              </AvatarWrapper>
            )}
            <Typography
              sx={{
                ml: 1.5,
                fontSize: `${theme.typography.pxToRem(15)}`,
                fontWeight: "bold",
              }}
              variant="subtitle2"
              component="div"
            >
              {role.includes(check)
                ? t("จำนวนการขอรับบริการข้อมูล")
                : t("จำนวนการใช้งาน API")}
            </Typography>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            sx={{
              ml: -2,
              pt: 2,
              pb: 1.5,
              justifyContent: "center",
            }}
          >
            {role.includes(check) ? (
              <ArrowUpwardTwoToneIcon
                sx={{
                  color: `${theme.colors.success.main}`,
                }}
              />
            ) : (
              <Battery20Icon
                sx={{
                  color: `${theme.colors.info.main}`,
                }}
              />
            )}
            <Typography
              sx={{
                pl: 1,
                fontSize: `${theme.typography.pxToRem(35)}`,
              }}
              variant="h1"
            >
              5,106
            </Typography>
          </Box>
          <Typography
            align="center"
            variant="body2"
            noWrap
            color="text.secondary"
            component="div"
          >
            <b>
              {role.includes(check)
                ? t("เพิ่มขึ้น 30% จากเดือนที่ผ่านมา")
                : t("อีก 20 ครั้งจะเกินกำหนดของเดือนนี้")}
            </b>
          </Typography>
        </Card>
      </Grid>

      {console.log("role===", role)}
      {console.log("check===", check)}

      {/* {role.includes(check) && ( */}

      {role !== "User" && (
        <>
          <Grid item lg={12}>
            <Block1 />
          </Grid>

          <Grid item lg={6} md={6} xs={12}>
            <TransactionsStatistics />
          </Grid>
        </>
      )}

      {/* )} */}

      <Grid item lg={6} md={6} xs={12}>
        <TransactionsStatistics
          title={"จำนวนการเผยแพร่ข้อมูลจากหน่วยงานของท่าน"}
        />
      </Grid>
    </Grid>
  );
}

export default Block3;
