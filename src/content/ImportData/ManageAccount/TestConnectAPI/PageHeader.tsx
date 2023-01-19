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
import { AuthURL } from "@/constants";

function PageHeader() {
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
            {t("CONNECTION_TEST")}
          </Typography>
          <Breadcrumbs
            itemsBeforeCollapse={2}
            itemsAfterCollapse={1}
            maxItems={3}
            aria-label="breadcrumb"
          >
            <Link color="inherit" href={AuthURL.DASHBOARD.HOME}>
              {t("HOME")}
            </Link>
            <Link color="inherit" href={AuthURL.MANAGE_ACCOUNT.BASE}>
              {t("MANAGE_AN_ACCOUNT_TO_IMPORT_DATA")}
            </Link>
            <Link color="inherit" href={AuthURL.MANAGE_ACCOUNT.EDIT_ACCOUNT}>
              {t("ปริมาณน้ำฝน ของสำนักงาน A")}
            </Link>
            <Typography color="text.primary">{t("CONNECTION_TEST")}</Typography>
          </Breadcrumbs>
        </Box>
      </Box>
    </>
  );
}

export default PageHeader;
