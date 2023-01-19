import { useRef, useState } from "react";
import {
  Button,
  Card,
  Box,
  CardContent,
  CardHeader,
  Menu,
  MenuItem,
  Typography,
  Divider,
  styled,
  useTheme,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";

import { Chart } from "src/components/Chart";
import type { ApexOptions } from "apexcharts";

const DotPrimaryLight = styled("span")(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.primary.lighter};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

const DotPrimary = styled("span")(
  ({ theme }) => `
    border-radius: 22px;
    background: ${theme.colors.primary.main};
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

function TransactionsStatistics(props) {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const chartOptions: ApexOptions = {
    chart: {
      background: "transparent",
      type: "bar",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 7,
        columnWidth: "60%",
      },
    },
    colors: [
      theme.colors.info.main,
      theme.colors.success.main,
      theme.colors.warning.main,
    ],
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    theme: {
      mode: theme.palette.mode,
    },
    stroke: {
      show: true,
      width: 3,
      colors: ["transparent"],
    },
    legend: {
      show: false,
    },
    xaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: true,
      },
      categories: [
        "ต.ค.",
        "พ.ย.",
        "ธ.ค.",
        "ม.ค.",
        "ก.พ.",
        "มี.ค.",
        "เม.ย.",
        "พ.ค.",
        "มิ.ย.",
        "ก.ค.",
        "ส.ค.",
        "ก.ย.",
      ],
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + "k";
        },
      },
    },
    grid: {
      strokeDashArray: 6,
      borderColor: theme.palette.divider,
    },
  };

  const chartData = [
    {
      name: "FileSuccess",
      data: [1769, 791, 1093, 189, 869, 1065, 980, 1419, 380, 1146, 797, 659],
    },
    {
      name: "Api",
      data: [1083, 649, 312, 1538, 1404, 630, 1714, 853, 1765, 1067, 696, 538],
    },
    {
      name: "Request",
      data: [1083, 649, 312, 1538, 1404, 630, 1714, 853, 1765, 1067, 696, 538],
    },
  ];

  const periods = [
    {
      value: "ประเภทข้อมูล",
      text: t("ประเภทข้อมูล"),
    },
    {
      value: "last_year",
      text: t("Last Year"),
    },
    {
      value: "all_time",
      text: t("All time"),
    },
  ];

  const data = {
    bills: "2,150",
    income: "2,150",
    expenses: "1,380",
    taxes: "1,576",
  };
  const actionRef1 = useRef<any>(null);
  const [openPeriod, setOpenMenuPeriod] = useState<boolean>(false);
  const [period, setPeriod] = useState<string>("ประเภทข้อมูล");

  return (
    <Card>
      <CardHeader
        title={t(
          props.title
            ? props.title
            : "จำนวนการขอรับบริการข้อมูลของผู้ใช้งานภายในหน่วยงาน"
        )}
      />
      <Divider />
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            size="small"
            variant="outlined"
            ref={actionRef1}
            onClick={() => setOpenMenuPeriod(true)}
            endIcon={<ExpandMoreTwoToneIcon fontSize="small" />}
          >
            {period}
          </Button>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
              }}
            >
              <DotPrimary sx={{ bgcolor: "info.light" }} />
              {t("ไฟล์สำเร็จรูป")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
              }}
            >
              <DotPrimary sx={{ bgcolor: "success.light" }} />
              {t("API")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <DotPrimary
                sx={{ bgcolor: "warning.light" }}
                // sx={{
                //   color: `${theme.colors.warning.light}`,
                // }}
              />
              {t("คำขอรับบริการ")}
            </Typography>
          </Box>
        </Box>
        <Menu
          disableScrollLock
          anchorEl={actionRef1.current}
          onClose={() => setOpenMenuPeriod(false)}
          open={openPeriod}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          {periods.map((_period) => (
            <MenuItem
              key={_period.value}
              onClick={() => {
                setPeriod(_period.text);
                setOpenMenuPeriod(false);
              }}
            >
              {_period.text}
            </MenuItem>
          ))}
        </Menu>

        <Box
          sx={{
            pt: 3,
            px: { lg: 2 },
          }}
        >
          <Chart
            options={chartOptions}
            series={chartData}
            type="bar"
            height={288}
          />
        </Box>

        <Box
          sx={{
            py: 2,
            textAlign: "center",
          }}
        >
          <Grid spacing={4} container>
            <Grid item sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                {t("ไฟล์สำเร็จรูปภายในเดือนนี้")}
              </Typography>
              <Typography variant="h3">{data.income}</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                {t("API ภายในเดือนนี้")}
              </Typography>
              <Typography variant="h3">{data.expenses}</Typography>
            </Grid>
            <Grid item sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                {t("คำขอรับบริการภายในเดือนนี้")}
              </Typography>
              <Typography variant="h3">{data.taxes}</Typography>
            </Grid>
            {/* <Grid item sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                {t("Bills")}
              </Typography>
              <Typography variant="h3">{data.bills}</Typography>
            </Grid> */}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

export default TransactionsStatistics;
