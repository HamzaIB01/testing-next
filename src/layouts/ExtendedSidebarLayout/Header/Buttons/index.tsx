import { Box } from "@mui/material";
import HeaderNotifications from "./Notifications";
import LanguageSwitcher from "./LanguageSwitcher";
// import Chat from './Chat';
import SettingDdata from "./SettingData";

function HeaderButtons() {
  return (
    <Box>
      {/* <HeaderNotifications /> */}
      {/* <Chat /> */}
      {/* <SettingDdata /> */}
      <LanguageSwitcher />
    </Box>
  );
}

export default HeaderButtons;
