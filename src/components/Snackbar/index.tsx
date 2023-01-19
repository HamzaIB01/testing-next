import { Slide } from "@mui/material";
import { useTranslation } from "next-i18next";
import { useSnackbar } from "notistack";
import Snackbar from "@mui/material/Snackbar";
import React from "react";

interface Isnackbar {
  title: string;
  variant: string;
  vertical: string;
  horizontal: string;
  autoHideDuration: number;
  TransitionComponent: () => void;
}

export const SnackbarMUI = (props: Isnackbar) => {
  const { t }: { t: any } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(true);

  return (
    enqueueSnackbar(t(`${props.title}`)),
    {
      variant: props.variant,
      anchorOrigin: {
        vertical: props.vertical,
        horizontal: props.horizontal,
      },
      autoHideDuration: props.autoHideDuration,
      TransitionComponent: props.TransitionComponent,
    }
  );
};
