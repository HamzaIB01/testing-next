import { FunctionPermission } from "@/actions/rolepermission.action";
import { ROLE_SCOPE } from "@/constants";
import {
  Box,
  Typography,
  Card,
  Grid,
  ListItem,
  List,
  ListItemText,
  Divider,
  Switch,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import EditUserInformation from "./EditUserInformation";
import { PersonalType } from "./UserInformationTab";

function SecuritySettingsTab() {
  const { t }: { t: any } = useTranslation();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box pb={2}>
          <Typography variant="h3">{t("SECURITY")}</Typography>
          <Typography variant="subtitle2">{t("SERCURITY_SETTINGS")}</Typography>
        </Box>
        <Card>
          <List>
            <ListItem
              sx={{
                p: 3,
              }}
            >
              <ListItemText
                primaryTypographyProps={{ variant: "h5", gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  lineHeight: 1,
                }}
                primary={t("CHANGE_PASSWORD")}
                secondary={t("PRESS_ENTER_CHANGE_PASSWORD")}
              />
              {FunctionPermission(ROLE_SCOPE.MANAGE_PROFILE) && (
                <EditUserInformation type={PersonalType.ChangePassword} />
              )}
            </ListItem>
            <Divider component="li" />
            <ListItem
              sx={{
                p: 3,
              }}
            >
              <ListItemText
                primaryTypographyProps={{ variant: "h5", gutterBottom: true }}
                secondaryTypographyProps={{
                  variant: "subtitle2",
                  lineHeight: 1,
                }}
                primary={t("CHANGE_PASSWORD_NOTIFICATION")}
                secondary={t("CHANGE_PASSWORD_NOTIFICATION_EVERY_90_DAYS")}
              />
              {FunctionPermission(ROLE_SCOPE.MANAGE_PROFILE) && (
                <Switch color="primary" />
              )}
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SecuritySettingsTab;
