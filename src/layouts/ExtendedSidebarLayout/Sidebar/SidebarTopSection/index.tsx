import { useRef, useState } from "react";
import { useAuth } from "src/hooks/useAuth";

import {
  Avatar,
  Box,
  Button,
  Divider,
  alpha,
  List,
  ListItem,
  ListItemText,
  Popover,
  IconButton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";

import { useTranslation } from "react-i18next";
import InboxTwoToneIcon from "@mui/icons-material/InboxTwoTone";
import UnfoldMoreTwoToneIcon from "@mui/icons-material/UnfoldMoreTwoTone";
import AccountBoxTwoToneIcon from "@mui/icons-material/AccountBoxTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import { decryptData } from "@/utils/crypto";
import { AuthURL, server } from "@/constants";

const MenuUserBox = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]};
    padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
    text-align: left;
    padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.sidebar.menuItemColor};
    display: block;

    &.popoverTypo {
      color: ${theme.palette.secondary.main};
    }
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
    color: ${alpha(theme.sidebar.menuItemColor, 0.6)};

    &.popoverTypo {
      color: ${theme.palette.secondary.light};
    }
`
);

function SidebarTopSection() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const auth = useAuth();

  const { logout } = useAuth();

  const user = {
    avatar: "/static/images/avatars/4.jpg",
    name:
      decryptData(auth.user.first_name || "-") +
      " " +
      decryptData(auth.user.last_name || "-"), //"Rachael Simons",
    jobtitle:
      auth.user.role?.length > 0
        ? localStorage.getItem(server.LANGUAGE) == "th"
          ? auth.user.role[0].name?.th ?? "-"
          : auth.user.role[0].name?.en ?? "-"
        : "-",
  };

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      handleClose();
      await logout();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
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
        width: 68,
        height: 68,
        mb: 2,
        mx: "auto",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  const stringAvatarMini = (name: string) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
        // mb: 2,
        // mx: "auto",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        mx: 2,
        pt: 1,
        position: "relative",
      }}
    >
      {/* <Avatar
        sx={{
          width: 68,
          height: 68,
          mb: 2,
          mx: "auto",
        }}
        alt={user.name}
        src={user.avatar}
      /> */}
      {/* <Box display="flex" alignItems="center"> */}
      <Avatar
        {...stringAvatar(
          `${
            decryptData(auth?.user?.first_name ?? "-") +
            " " +
            decryptData(auth?.user?.last_name ?? "-")
          }`
        )}
        // src={`${user.image_path ? user.image_path : null}`}
      />
      {/* </Box> */}

      <Typography
        variant="h4"
        sx={{
          color: `${theme.colors.alpha.trueWhite[100]}`,
        }}
      >
        {user.name}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          color: `${theme.colors.alpha.trueWhite[70]}`,
        }}
      >
        {user.jobtitle}
      </Typography>
      <IconButton
        size="small"
        sx={{
          position: "absolute",
          right: theme.spacing(0),
          color: `${theme.colors.alpha.trueWhite[70]}`,
          top: theme.spacing(0),
          background: `${theme.colors.alpha.trueWhite[10]}`,

          "&:hover": {
            color: `${theme.colors.alpha.trueWhite[100]}`,
            background: `${alpha(theme.colors.alpha.trueWhite[100], 0.2)}`,
          },
        }}
        ref={ref}
        onClick={handleOpen}
      >
        <UnfoldMoreTwoToneIcon fontSize="small" />
      </IconButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210,
          }}
          display="flex"
        >
          {/* <Avatar variant="rounded" alt={user.name} src={user.avatar} /> */}
          <Avatar
            variant="rounded"
            {...stringAvatarMini(
              `${
                decryptData(auth?.user?.first_name ?? "-") +
                " " +
                decryptData(auth?.user?.last_name ?? "-")
              }`
            )}
            // src={`${user.image_path ? user.image_path : null}`}
          />
          <UserBoxText>
            <UserBoxLabel className="popoverTypo" variant="body1">
              {user.name}
            </UserBoxLabel>
            <UserBoxDescription className="popoverTypo" variant="body2">
              {user.jobtitle}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider
          sx={{
            mb: 0,
          }}
        />
        <List
          sx={{
            p: 1,
          }}
          component="nav"
        >
          <ListItem
            onClick={() => {
              router.push(AuthURL.PROFILE);
              handleClose();
            }}
            button
          >
            <AccountBoxTwoToneIcon fontSize="small" />
            <ListItemText primary={t("Profile")} />
          </ListItem>
          {/* <ListItem
            onClick={() => {
              handleClose();
            }}
            button
          >
            <InboxTwoToneIcon fontSize="small" />
            <ListItemText primary={t("Inbox")} />
          </ListItem>
          <ListItem
            onClick={() => {
              handleClose();
            }}
            button
          >
            <AccountTreeTwoToneIcon fontSize="small" />
            <ListItemText primary={t("Projects")} />
          </ListItem> */}
        </List>
        <Divider />
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1,
              }}
            />
            {t("Sign out")}
          </Button>
        </Box>
      </Popover>
    </Box>
  );
}

export default SidebarTopSection;
