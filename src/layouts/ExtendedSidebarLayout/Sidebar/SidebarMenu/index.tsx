import { useEffect } from "react";

import { ListSubheader, alpha, Box, List, styled } from "@mui/material";
import SidebarMenuItem from "./item";
import menuItems, { MenuItem } from "./items";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import { CheckRolePermission } from "@/actions/rolepermission.action";

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.Mui-active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  "transform",
                  "opacity",
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.Mui-active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

const renderSidebarMenuItems = ({
  items,
  role,
  path,
}: {
  items: MenuItem[];
  role: string;
  path: string;
}): JSX.Element => (
  <SubMenuWrapper>
    <List component="div">
      {items.reduce(
        (ev, item) => reduceChildRoutes({ ev, item, role, path }),
        []
      )}
    </List>
  </SubMenuWrapper>
);

const reduceChildRoutes = ({
  ev,
  path,
  role,
  item,
}: {
  ev: JSX.Element[];
  path: string;
  role: string;
  item: MenuItem;
}): Array<JSX.Element> => {
  const key = item.name;
  const partialMatch = path.includes(item.link);
  const exactMatch = path === item.link;
  const auth = useAuth();

  if (item.items) {
    if (CheckRolePermission(item.role) && !item.show) {
      // if (!auth.user?.current_role_code.includes("user")) {
      ev.push(
        <SidebarMenuItem
          key={key}
          active={partialMatch}
          open={partialMatch}
          name={item.name}
          icon={item.icon}
          link={item.link}
          badge={item.badge}
          badgeTooltip={item.badgeTooltip}
          role={item.role}
        >
          {renderSidebarMenuItems({
            path,
            role: role,
            items: item.items,
          })}
        </SidebarMenuItem>
      );
      // }
    }
  } else {
    if (!item.show) {
      if (CheckRolePermission(item.role) && !item.show) {
        // if (auth.user?.current_role_code.includes("user")) {
        // if (item.name === "IMFORMATION_SERVICE") {
        ev.push(
          <SidebarMenuItem
            key={key}
            active={exactMatch}
            name={item.name}
            link={item.link}
            badge={item.badge}
            badgeTooltip={item.badgeTooltip}
            icon={item.icon}
            role={item.role}
          />
        );
      }
    }
  }

  return ev;
};

function SidebarMenu() {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const auth = useAuth();
  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }
  };

  useEffect(handlePathChange, [router.isReady, router.asPath]);

  return (
    <>
      {/* {console.log("section ", menuItems.some((val) => val.items))} */}
      {menuItems.map((section) => (
        <MenuWrapper key={section.heading}>
          {section.items.some((val) => CheckRolePermission(val.role)) && (
            // CheckRolePermission(section.role) && (
            <List
              component="div"
              subheader={
                <ListSubheader component="div" disableSticky>
                  {t(section.heading)}
                </ListSubheader>
              }
            >
              {renderSidebarMenuItems({
                items: section.items,
                role: section.role,
                path: router.asPath,
              })}
            </List>
          )}
        </MenuWrapper>
      ))}
    </>
  );
}

export default SidebarMenu;
