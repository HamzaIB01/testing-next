import users from "@/pages/management/users";
import {
  Box,
  Typography,
  Card,
  Grid,
  Stack,
  TablePagination,
  Paper,
  TableContainer,
  Table,
  TableHead,
  Pagination,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConvertDateTimeFormat } from "@/components/FormatConvertDateTime";

interface ResultsProps {
  users: any[];
}

interface Filters {
  role?: string;
  // type: TableType;
}

const applyFilters = (users: any[], query: string, filters: Filters): any[] => {
  return users.filter((user) => {
    let matches = true;

    if (query) {
      const properties = ["email", "name", "username"];
      let containsQuery = false;

      properties.forEach((property) => {
        if (user[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.role && user.role !== filters.role) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && user[key] !== value) {
        // matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (users: any[], page: number, limit: number): any[] => {
  return users.slice(page * limit, page * limit + limit);
};

function ActivityTab(props: any) {
  const { t }: { t: any } = useTranslation();

  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    role: null,
    // type: TableType.DATA_REPORT_NOT_UPDATE,
  });

  const users = [
    {
      id: 1,
      name: "จัดการข้อมูลส่วนตัว mock",
      sub: "แก้ไขข้อมูลส่วนตัว",
      date: "15 กรกฏาคม 2556",
      time: "เวลา 08:30 น.",
    },
  ];

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage - 1);
  };

  const handlePageChangeTable = (_event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
  };

  const filteredUsers = applyFilters(users, query, filters);
  const paginatedUsers = applyPagination(filteredUsers, page, limit);

  const [filtertabs, setFilterTabs] = useState({
    status: null,
  });

  console.log("props....", props.activityUser);

  return (
    <Card>
      <Grid container spacing={2} p={2}>
        <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
          <Stack spacing={3} direction="row">
            <Typography
              variant="h4"
              gutterBottom
              component="div"
              marginY={"auto"}
            >
              {t("ACTIVITY")}
            </Typography>
          </Stack>

          <TablePagination
            component="div"
            count={props?.activityUser?.pagination?.total_items ?? 0}
            onPageChange={handlePageChangeTable}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            labelRowsPerPage={null}
            rowsPerPageOptions={[
              { label: `${t("SHOW")} ${5} ${t("PER_PAGE_LIST")}`, value: 5 },
              { label: `${t("SHOW")} ${10} ${t("PER_PAGE_LIST")}`, value: 10 },
              { label: `${t("SHOW")} ${15} ${t("PER_PAGE_LIST")}`, value: 15 },
            ]}
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} ${t("OF")} ${
                count !== -1 ? count : `${t("MORE_THAN")} ${to}`
              }`
            }
          />
        </Grid>
      </Grid>

      {props?.activityUser && props?.activityUser?.content?.length === 0 ? (
        <>
          <Typography
            sx={{
              py: 10,
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {t("ไม่พบข้อมูลกิจกรรม")}
          </Typography>
        </>
      ) : (
        <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 200 }} align="center">
                    {t("NO.")}
                  </TableCell>
                  <TableCell>{t("ACTIVITY")}</TableCell>
                  <TableCell sx={{ width: 300 }}>
                    {t("วันที่ทำกิจกรรม")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props?.activityUser?.content?.map((value: any, index: any) => {
                  return (
                    <TableRow hover key={index}>
                      <TableCell align="center">
                        <Typography>{limit * page + 1 + index}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="bold">
                          <Stack direction="row" spacing={1}>
                            <Typography>
                              {/* <b>{value.activity}</b> */}
                              {value.activity}
                            </Typography>
                          </Stack>
                        </Typography>
                        {/* <Typography noWrap variant="subtitle2">
                          {user.sub}
                        </Typography> */}
                      </TableCell>
                      <TableCell>
                        <ConvertDateTimeFormat date={value.timestamp} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <Box p={3} display="flex" justifyContent="center">
            <Pagination
              shape="rounded"
              size="large"
              color="primary"
              onChange={handlePageChange}
              count={props?.activityUser?.pagination?.total_items ?? 0}
              page={page + 1}
              defaultPage={0}
            />
          </Box>
        </>
      )}
    </Card>
  );
}

export default ActivityTab;
