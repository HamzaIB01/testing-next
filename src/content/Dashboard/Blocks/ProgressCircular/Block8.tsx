import { useEffect, useState } from "react";

import {
  Grid,
  Box,
  Card,
  Typography,
  Avatar,
  Divider,
  alpha,
  styled,
  useTheme,
} from "@mui/material";

import { useTranslation } from "react-i18next";
import Text from "src/components/Text";
import KeyboardArrowDownTwoToneIcon from "@mui/icons-material/KeyboardArrowDownTwoTone";
import KeyboardArrowUpTwoToneIcon from "@mui/icons-material/KeyboardArrowUpTwoTone";
import GaugeChart from "react-gauge-chart";

const LabelErrorAlt = styled(Box)(
  ({ theme }) => `
    display: inline-block;
    alignItems: center;
    background: ${theme.palette.error.main};
    color: ${theme.palette.error.contrastText};
    text-transform: uppercase;
    font-size: ${theme.typography.pxToRem(11)};
    font-weight: bold;
    padding: ${theme.spacing(0.5, 1)};
    border-radius: ${theme.general.borderRadiusSm};
  `
);

const CardWrapper = styled(Card)(
  ({ theme }) => `
    transition: ${theme.transitions.create(["box-shadow"])};
    position: relative;
    z-index: 5;

    &:hover {
        z-index: 6;
        box-shadow: 
            0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
            0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
            0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
            0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
    }
  `
);

function Block7() {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const [currentPercent1, setCurrentPercent1] = useState<number>(1);
  const [currentPercent2, setCurrentPercent2] = useState<number>(1);
  const [currentPercent3, setCurrentPercent3] = useState<number>(1);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setCurrentPercent1(Math.random());
  //     setCurrentPercent2(Math.random());
  //     setCurrentPercent3(Math.random());
  //   }, 1900);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  // });

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <CardWrapper
          sx={{
            p: 3,
          }}
        >
          <Box
            pb={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(16)}`,
              }}
              variant="h3"
            >
              {t("ระดับความสม่ำเสมอของข้อมูล 30 วันล่าสุด")}
            </Typography>
            {/* <Typography variant="h4">
              <Text color="success">$43,346.45</Text>
            </Typography> */}
          </Box>
          <Box
            sx={{
              mx: "auto",
              maxWidth: "340px",
            }}
          >
            <GaugeChart
              arcPadding={0.1}
              cornerRadius={3}
              textColor={theme.colors.alpha.black[70]}
              needleColor={theme.colors.alpha.black[50]}
              needleBaseColor={theme.colors.alpha.black[100]}
              colors={[theme.colors.success.lighter, theme.colors.success.main]}
              percent={currentPercent1}
              animDelay={0}
            />
          </Box>
          <Divider />
          <Box
            pt={3}
            mb={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Grid>
              <Typography variant="subtitle2">อยู่ในระดับ</Typography>
              <Typography variant="subtitle2" style={{ color: "#4CBB17" }}>
                <h3>(ดีเยี่ยม)</h3>
              </Typography>
            </Grid>
          </Box>
        </CardWrapper>
      </Grid>
      <Grid item xs={12} md={4}>
        <CardWrapper
          sx={{
            p: 3,
          }}
        >
          <Box
            pb={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(16)}`,
              }}
              variant="h3"
            >
              {t("ระดับความน่าเชื่อถือของข้อมูล 30 วันล่าสุด")}
            </Typography>
          </Box>
          <Box
            sx={{
              mx: "auto",
              maxWidth: "340px",
            }}
          >
            <GaugeChart
              arcPadding={0.1}
              cornerRadius={3}
              textColor={theme.colors.alpha.black[70]}
              needleColor={theme.colors.alpha.black[50]}
              needleBaseColor={theme.colors.alpha.black[100]}
              colors={[theme.colors.warning.lighter, theme.colors.warning.main]}
              percent={currentPercent2}
              animDelay={0}
            />
          </Box>
          <Divider />
          <Box
            pt={3}
            mb={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Grid>
              <Typography variant="subtitle2">อยู่ในระดับ</Typography>
              <Typography variant="subtitle2" style={{ color: "#4CBB17" }}>
                <h3>(ดีเยี่ยม)</h3>
              </Typography>
            </Grid>
          </Box>
        </CardWrapper>
      </Grid>
      <Grid item xs={12} md={4}>
        <CardWrapper
          sx={{
            p: 3,
          }}
        >
          <Box
            pb={2}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              sx={{
                fontSize: `${theme.typography.pxToRem(16)}`,
              }}
              variant="h3"
            >
              {t("ระดับความทันต่อเหตุการณ์ของข้อมูล 30 วันล่าสุด")}
            </Typography>
          </Box>
          <Box
            sx={{
              mx: "auto",
              maxWidth: "340px",
            }}
          >
            <GaugeChart
              arcPadding={0.1}
              cornerRadius={3}
              textColor={theme.colors.alpha.black[70]}
              needleColor={theme.colors.alpha.black[50]}
              needleBaseColor={theme.colors.alpha.black[100]}
              colors={[theme.colors.info.lighter, theme.colors.info.main]}
              percent={currentPercent3}
              animDelay={0}
            />
          </Box>
          <Divider />
          <Box
            pt={3}
            mb={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Grid>
              <Typography variant="subtitle2">อยู่ในระดับ</Typography>
              <Typography variant="subtitle2" style={{ color: "#4CBB17" }}>
                <h3>(ดีเยี่ยม)</h3>
              </Typography>
            </Grid>
          </Box>
          {/* <Typography
            color="success"
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            ดีเยี่ยม
          </Typography> */}
        </CardWrapper>
      </Grid>
    </Grid>
  );
}

export default Block7;
