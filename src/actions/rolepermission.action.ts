import { AuthURL } from "@/constants";
import urlItems from "@/data/urlItem";
import { useAuth } from "@/hooks/useAuth";
import menuItems from "@/layouts/ExtendedSidebarLayout/Sidebar/SidebarMenu/items";

// export function FunctionPermission(router: string, scope_id: any): boolean {
//   const role = useAuth();
//   const role_code = urlItems.find((role: any) =>
//     role.link.includes(router)
//   )?.role;

//   const scope = role?.scope?.find((roles: any) =>
//     roles?.code?.includes(role_code)
//   );

//   return scope.sub_scopes.some((val) => val.code.includes(scope_id));
// }

///check url
export function Permission(router: string, role: any): boolean {
  let set_scopes = false;

  const role_code =
    urlItems.find((role: any) => role.link === router)?.role || "Not url part";
  console.log("role_code", role_code);
  // console.log("role_sub_scopes", role_sub_scopes);
  // console.log("role.scope", role);

  role?.scope?.map((scopes) => {
    // console.log("scopes.code", scopes.code);
    // console.log("role_code", role_code);

    if (scopes?.code === role_code) {
      set_scopes = true;
    } else {
      if (scopes?.sub_scopes) {
        // console.log("oscopes.sub_scopesoop", scopes.sub_scopes);

        scopes?.sub_scopes?.map((sub_scopes) => {
          // const role_code = urlItems.find((role: any) => role.link === router)?.role || "ไม่มี link ในระบบ";

          urlItems?.map((rolex: any) => {
            rolex.sub_scopes?.map((val) => {
              if (sub_scopes?.code === val.role && router === val.link) {
                // set_scopes = false;
                set_scopes = true;
                console.log("if sub_scopes", sub_scopes?.code);
              }
            });
          });
        });
      }
    }
  });
  return set_scopes;
}

export function CheckRolePermission(permission: string): boolean {
  const role = useAuth();
  var check = false;

  if (role) {
    // console.log("rolx ", role);

    role?.scope?.some((roles: any) =>
      roles?.sub_scopes?.some((val) => {
        if (val.code === permission) {
          check = true;
        }
      })
    );

    if (role?.scope?.some((roles: any) => roles?.code === permission)) {
      check = true;
    }

    return check; //role?.scope?.some((roles: any) => roles?.code === permission);
  }

  return false;
}

export function FunctionPermission(code: string): any {
  const role = useAuth();
  let set_scopes = false;

  role.scope?.map((scopes) => {
    if (scopes.code === code) {
      set_scopes = true;
    } else {
      if (scopes.sub_scopes) {
        scopes.sub_scopes?.map((sub_scopes) => {
          if (sub_scopes.code === code) {
            set_scopes = true;
            // console.log("if sub_scopes", sub_scopes.code);
          }
        });
      }
    }
  });

  return set_scopes;

  // =================================================================== //

  // const role_code = urlItems.find((roleUrl: any) => roleUrl.link === router)?.role || "Not url part";

  // console.log("role_code func", role_code);

  // const scope =
  //   role?.scope?.find((roles: any) => roles?.code === role_code)?.sub_scopes ||
  //   [];

  // const scope2 =
  //   role?.scope?.find((roles: any) =>
  //     roles.sub_scopes?.find((sub_scope) => sub_scope.code === role_code)
  //   )?.sub_scopes || [];

  // return scope.length > 0 ? scope : scope2; //scope.some((sub) => sub.code.includes(function_scope));
}

class PermissionAuth {
  async Permission(router: string, function_scope: string): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      const role = useAuth();
      const menu = menuItems.find((route) =>
        route.items.find(
          (item) =>
            item.items &&
            item.items.find((link: any) => link.link.includes(router))
        )
      );

      const scope = role?.scope?.find((roles: any) =>
        roles?.code?.includes(menu?.role || "x")
      ).sub_scopes;

      resolve(scope.some((sub: any) => sub.code.includes(function_scope)));
    });
  }
}

export const authPermission = new PermissionAuth();
