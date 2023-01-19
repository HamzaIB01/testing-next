import { FC, ReactNode, useCallback } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuth } from "src/hooks/useAuth";
import { useSnackbar } from "notistack";
import { Slide } from "@mui/material";
import { Permission } from "@/actions/rolepermission.action";
import { AuthURL } from "@/constants";
import urlItems from "@/data/urlItem";

interface AuthenticatedProps {
  children: ReactNode;
}

export const Authenticated: FC<AuthenticatedProps> = (props) => {
  const { children } = props;
  const auth = useAuth();
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  //  const getCategory = useCallback(async () => {
  //     try {
  //       const categoriesData = await nonWaterApi.getAutoCategories(
  //         auth.user.uuid
  //       );
  //       setManualExport(categoriesData?.content ?? []);
  //     } catch (err) {
  //       setManualExport([]);
  //     }
  //   }, []);


  const checkPermission = useCallback(async () => {

    // console.log("==== auth ======", auth.isAuthenticated);
    // console.log("==== router.route ======", router.route);
    console.log("==== auth ======", auth);


    if (auth.isAuthenticated && !Permission(router.route, auth)) {
      // console.log("router ", router.route);
      // console.log("router ", router.route);

      await enqueueSnackbar("คุณไม่ได้รับอนุญาตให้เข้าใช้งาน", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        autoHideDuration: 3000,
        TransitionComponent: Slide,
      });


      router.push("/500");

      // router.back();

      // router.push("/");
      // window.location.href = AuthURL.SEARCH.DATA;

      // if (window.navigation.canGoBack) {
      //   router.back();
      // } else {
      //   router.push("/");
      // }



      // router.push("/the-page-you-were-looking-for-doesn't-exist.");
      // return null;
    } else {

      if (!router.isReady) {
        return;
      }

      if (!auth.isAuthenticated) {
        router.push({
          pathname: AuthURL.SIGN_IN,
        });
      } else {
        setVerified(true);

        // enqueueSnackbar("You are successfully authenticated!", {
        //   variant: "success",
        //   anchorOrigin: {
        //     vertical: "bottom",
        //     horizontal: "right",
        //   },
        //   autoHideDuration: 2000,
        //   TransitionComponent: Slide,
        // });
      }
    }
  }, []);

  useEffect(() => {

    checkPermission();

  }, [router.isReady]);

  if (!verified) {
    return null;
  }

  return <>{children}</>;
};

Authenticated.propTypes = {
  children: PropTypes.node,
};
