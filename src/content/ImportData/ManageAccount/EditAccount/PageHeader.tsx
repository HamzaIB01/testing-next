import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Breadcrumbs,
} from "@mui/material";
import ArrowBackTwoToneIcon from "@mui/icons-material/ArrowBackTwoTone";
import Link from "@/components/Link";
import { useRouter } from "next/router";
import { AuthURL, server } from "@/constants";
import { FC } from "react";
import { Department } from "@/types/user.type";

interface PageHeaderProps {
  importConfigs: Department;
}

const PageHeader: FC<PageHeaderProps> = ({ importConfigs }) => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Box display="flex" alignItems="center">
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
            {localStorage.getItem(server.LANGUAGE) === "th"
              ? importConfigs?.name?.th
              : "ไม่พบชื่อ"
              ? importConfigs?.name?.en
              : "Undefined named"}
          </Typography>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href={AuthURL.DASHBOARD.HOME}>
              {t("HOME")}
            </Link>
            <Link color="inherit" href={AuthURL.MANAGE_ACCOUNT.BASE}>
              {t("MANAGE_AN_ACCOUNT_TO_IMPORT_DATA")}
            </Link>
            <Typography color="text.primary">
              {localStorage.getItem(server.LANGUAGE) === "th"
                ? importConfigs?.name?.th
                : importConfigs?.name?.en}
            </Typography>
          </Breadcrumbs>
        </Box>
      </Box>
    </>
  );
};

export default PageHeader;
