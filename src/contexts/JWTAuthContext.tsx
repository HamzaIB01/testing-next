import { FC, ReactNode, createContext, useEffect, useReducer } from "react";
import { authApi } from "@/actions/login.action";
import PropTypes from "prop-types";
import { Content } from "@/types/user.type";
import { server } from "@/constants";
import { roleApi } from "@/actions/role.action";
import { ScopeResult } from "@/types/scope.type";
import { useRouter } from "next/router";
import { masterDataApi } from "@/actions/masterdata.action";
import { MasterData } from "@/types/master.type";
import { useSnackbar } from "notistack";
import { Slide } from "@mui/material";

interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  // accessToken: String;
  user: Content | null;
  scope: ScopeResult[] | [];
  masterData: MasterData | null;
  //   user: Member | null;
}

interface AuthContextValue extends AuthState {
  method: "JWT";
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: "INITIALIZE";
  payload: {
    isAuthenticated: boolean;
    // accessToken: String;
    user: Content | null;
    scope: ScopeResult[] | null;
    masterData: MasterData | null;
    // user: Member | null;
  };
};

type LoginAction = {
  type: "LOGIN";
  payload: {
    user: Content | null;
    scope: ScopeResult[] | null;
    masterData: MasterData | null;
  };
};

type LogoutAction = {
  type: "LOGOUT";
};

type Action = InitializeAction | LoginAction | LogoutAction;

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  scope: null,
  masterData: null,
};

const handlers: Record<
  string,
  (state: AuthState, action: Action) => AuthState
> = {
  INITIALIZE: (state: AuthState, action: InitializeAction): AuthState => {
    const { isAuthenticated, user, scope, masterData } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      // accessToken,
      user,
      scope,
      masterData,
    };
  },
  LOGIN: (state: AuthState, action: LoginAction): AuthState => {
    const { user, scope, masterData } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      scope,
      masterData,
    };
  },
  LOGOUT: (state: AuthState): AuthState => ({
    ...state,
    isAuthenticated: false,
    // accessToken: null,
    scope: null,
    user: null,
    masterData: null,
  }),
};

const reducer = (state: AuthState, action: Action): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthContext = createContext<AuthContextValue>({
  ...initialAuthState,
  method: "JWT",
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const access_token = window.localStorage.getItem("access_token");
        const uuid = window.localStorage.getItem("uuid");
        const user = JSON.parse(window.localStorage.getItem("user"));
        // console.log("user2 ", user2);

        if (access_token) {
          // const user = await authApi.me(uuid);
          const device = await authApi.device();
          user.device = device;

          // console.log("user ", user);
          const role_id = user.role.find((role) =>
            role.code.includes(user.current_role_code)
          ).id;
          const scope = await roleApi.check_Scope_login(role_id);
          const department = await masterDataApi.getMasterDataWater(
            "departments"
          );
          const channels = await masterDataApi.getMasterDataWater("channels");
          const permissions = await masterDataApi.getMasterDataWater(
            "permissions"
          );
          const category = await masterDataApi.getMasterDataWater("categories");
          const intervals = await masterDataApi.getMasterDataWater("intervals");
          const basins = await masterDataApi.getMasterDataWater("basins");
          const stations = await masterDataApi.getMasterDataWater("stations");
          const masterData = {
            intervals: intervals,
            departments: department,
            categories: category,
            channels: channels,
            permissions: permissions,
            basins: basins,
            stations: stations,
          };

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user: user,
              scope: scope,
              masterData: masterData,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
              scope: null,
              masterData: null,
            },
          });
        }
      } catch (err) {
        var language = localStorage.getItem("i18nextLng");
        localStorage.clear();
        localStorage.setItem("i18nextLng", language);
        // console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
            scope: null,
            masterData: null,
          },
        });
        enqueueSnackbar(err.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          autoHideDuration: 2000,
          TransitionComponent: Slide,
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const device = await authApi.device();
      if (device) {
        const user = await authApi.login({ email, password });
        // const user = await authApi.me(uuid);
        // const user = await authApi.me(uuid);
        user.device = device;
        const role_id = user.role.find((role) =>
          role.code.includes(user.current_role_code)
        ).id;
        const scope = await roleApi.check_Scope_login(role_id);
        const department = await masterDataApi.getMasterDataWater(
          "departments"
        );
        const category = await masterDataApi.getMasterDataWater("categories");
        const channels = await masterDataApi.getMasterDataWater("channels");
        const permissions = await masterDataApi.getMasterDataWater(
          "permissions"
        );
        const intervals = await masterDataApi.getMasterDataWater("intervals");
        const basins = await masterDataApi.getMasterDataWater("basins");
        const stations = await masterDataApi.getMasterDataWater("stations");
        const masterData = {
          intervals: intervals,
          departments: department,
          categories: category,
          channels: channels,
          permissions: permissions,
          basins: basins,
          stations: stations,
        };
        dispatch({
          type: "LOGIN",
          payload: {
            user,
            scope,
            masterData,
          },
        });
      }
    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        autoHideDuration: 2000,
        TransitionComponent: Slide,
      });
    }
  };

  const logout = async (): Promise<void> => {
    const uuid = await authApi.signOut();
    // localStorage.removeItem("access_token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "JWT",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;
