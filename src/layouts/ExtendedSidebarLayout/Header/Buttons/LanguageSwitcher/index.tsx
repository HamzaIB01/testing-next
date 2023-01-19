import { useRef, useState } from "react";

import {
  IconButton,
  Box,
  List,
  ListItem,
  Divider,
  Typography,
  ListItemText,
  alpha,
  Popover,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";
import Text from "src/components/Text";

import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone";
import internationalization from "src/i18n/i18n";
import { useTranslation } from "react-i18next";

import { US } from "country-flag-icons/react/3x2";
import { JP } from "country-flag-icons/react/3x2";
import { TH } from "country-flag-icons/react/3x2";

const SectionHeading = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
        padding: ${theme.spacing(2, 2, 0)};
`
);

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: ${theme.general.borderRadiusLg};
`
);

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t }: { t: any } = useTranslation();
  const getLanguage = i18n.language;
  const theme = useTheme();

  const switchLanguage = ({ lng }: { lng: any }) => {
    internationalization.changeLanguage(lng);
  };
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title={t("Language Switcher")}>
        <IconButtonWrapper
          color="secondary"
          ref={ref}
          onClick={handleOpen}
          sx={{
            mx: 1,
            background: alpha(theme.colors.error.main, 0.1),
            transition: `${theme.transitions.create(["background"])}`,
            color: theme.colors.error.main,
            "& svg": { height: "1em" },
            "&:hover": {
              background: alpha(theme.colors.error.main, 0.2),
            },
          }}
        >
          {getLanguage === "en" && <US title="English" />}
          {getLanguage === "en-US" && <US title="English" />}
          {getLanguage === "en-GB" && <US title="English" />}
          {getLanguage === "jp" && <JP title="Japan" />}
          {getLanguage === "th" && <TH title="Thailand" />}
        </IconButtonWrapper>
      </Tooltip>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box
          sx={{
            maxWidth: 240,
          }}
        >
          <SectionHeading variant="body2" color="text.primary">
            {t("Language Switcher")}
          </SectionHeading>
          <List
            sx={{
              p: 2,
              svg: {
                width: 26,
                mr: 1,
              },
            }}
            component="nav"
          >
            <ListItem
              className={
                getLanguage === "en" || getLanguage === "en-US" ? "active" : ""
              }
              button
              onClick={() => {
                switchLanguage({ lng: "en" });
                handleClose();
              }}
            >
              <US title="English" />
              <ListItemText
                sx={{
                  pl: 1,
                }}
                primary="English"
              />
            </ListItem>
            <ListItem
              className={getLanguage === "th" ? "active" : ""}
              button
              onClick={() => {
                switchLanguage({ lng: "th" });
                handleClose();
              }}
            >
              <TH title="Thailand" />
              <ListItemText
                sx={{
                  pl: 1,
                }}
                primary="Thailand"
              />
            </ListItem>
            <ListItem
              className={getLanguage === "jp" ? "active" : ""}
              button
              onClick={() => {
                switchLanguage({ lng: "jp" });
                handleClose();
              }}
            >
              <JP title="Japan" />
              <ListItemText
                sx={{
                  pl: 1,
                }}
                primary="Japan"
              />
            </ListItem>
          </List>
          <Divider />
          <Text color="warning">
            <Box
              p={1.5}
              display="flex"
              alignItems="flex-start"
              sx={{
                maxWidth: 340,
              }}
            >
              <WarningTwoToneIcon fontSize="small" />
              <Typography
                variant="body1"
                sx={{
                  pl: 1,
                  fontSize: theme.typography.pxToRem(12),
                }}
              >
                {t(
                  "We only translated a small part of the template, for demonstration purposes"
                )}
                !
              </Typography>
            </Box>
          </Text>
        </Box>
      </Popover>
    </>
  );
}

export default LanguageSwitcher;
