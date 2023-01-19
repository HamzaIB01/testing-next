import * as React from "react";
// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import {
  Backdrop,
  CircularProgress,
  Dialog,
  Slide,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

const ThemeBackdrop = styled(Dialog)(
  ({ theme }) => `
  .MuiDialog-paper {

      width: 150px;
      height: 150px;
      display: flex;
      justify-content: center;
      box-shadow: none;
    }
  `
);

export default function SimpleBackdrop(status) {
  return (
    <div>
      {/* <Button onClick={handleToggle}>Show backdrop</Button> */}
      {/* <ThemeBackdrop
        sx={{
          // width: "100px",
          // height: "100px",
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // position: "absolute",
          // top: "50%",
          // bottom: 0,
          // right: 0,
          // left: "50%",
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={status}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </ThemeBackdrop> */}
      <ThemeBackdrop
        open={status}
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
        // fullWidth
        // sx={{ width: "100px", height: "100px" }}
      >
        <Stack gap={1} justifyContent="center" alignItems="center">
          <CircularProgress color="inherit" />
          <Typography>Loading...</Typography>
        </Stack>
      </ThemeBackdrop>
    </div>
  );
}

export function SimpleSnackbar(status) {
  const { enqueueSnackbar } = useSnackbar();
  return (
    <div>
      {status &&
        enqueueSnackbar("กำลังดาวน์โหลดไฟล์ กรุณารอสักครู่", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          autoHideDuration: 0,
          TransitionComponent: Slide,
        })}
    </div>
  );
}
