import { FC, ChangeEvent, useState, useEffect } from "react";
import { Grid, InputAdornment, TextField, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import React from "react";
import { TableComponent, TableType } from "@/components/TableComponent";
import { WaterResult } from "@/types/water.type";

interface ResultsProps {
  importDatas: WaterResult;
  onChangeProvideSource: (string) => void;
  filterProvideSource: (fetchData: {
    limit: string;
    offset: string;
    keyword: string;
  }) => void;
}

interface Filters {
  role?: string;
  type: TableType;
}

const Results: FC<ResultsProps> = ({
  importDatas,
  filterProvideSource,
  onChangeProvideSource,
}) => {
  const { t }: { t: any } = useTranslation();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [query, setQuery] = useState<string>("");
  const [filters, setFilters] = useState<Filters>({
    type: TableType.IMPORT_DATA,
  });

  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQuery(searchTerm);
      filterProvideSource({
        limit: String(limit),
        offset: String(limit * page + 1 - 1),
        keyword: searchTerm,
      });
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setQuery(searchTerm);
      filterProvideSource({
        limit: String(limit),
        offset: String(limit * page + 1 - 1),
        keyword: searchTerm,
      });
    }
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.persist();
    setSearchTerm(event.target.value);
    setQuery(event.target.value);
  };

  const handlePageChange = (_event: any, newPage: number): void => {
    setPage(newPage - 1);
    filterProvideSource({
      limit: String(limit),
      offset: String(limit * (newPage - 1) + 1 - 1),
      keyword: query,
    });
  };

  const handlePageChangeTable = (_event: any, newPage: number): void => {
    setPage(newPage);
    filterProvideSource({
      limit: String(limit),
      offset: String(limit * newPage + 1 - 1),
      keyword: query,
    });
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPage(0);
    setLimit(parseInt(event.target.value));
    filterProvideSource({
      limit: event.target.value,
      offset: String(limit * page + 1 - 1),
      keyword: query,
    });
  };

  const [openSearch, setOpenSearch] = useState(false);

  return (
    <>
      <Grid
        container
        spacing={{ xs: 1, sm: 2 }}
        sx={{ mb: { xs: 2, sm: 0, md: 2 } }}
      >
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" mt={2}>
            <TextField
              sx={{ backgroundColor: "white", borderRadius: "10px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchTwoToneIcon color="secondary" />
                  </InputAdornment>
                ),
              }}
              onChange={handleQueryChange}
              onKeyDown={handleKeyPress}
              placeholder={t("SEARCH")}
              value={query}
              fullWidth
              variant="outlined"
            />
            {/* <Button
              color={openSearch ? "error" : "primary"}
              sx={{ whiteSpace: "nowrap" }}
              size="large"
              type="submit"
              variant="contained"
              onClick={() => setOpenSearch(!openSearch)}
            >
              {openSearch ? t("CLOSE_ADVANCED_SEARCH") : t("ADVANCED_SEARCH")}
            </Button> */}
          </Stack>
        </Grid>
      </Grid>

      {/* {openSearch && (
        <FilterData headder={false} page={"manage-account"} footer={true} />
      )} */}

      <TableComponent
        filters={filters}
        filteredUsers={importDatas}
        page={page}
        limit={limit}
        paginatedUsers={importDatas}
        handlePageChange={handlePageChange}
        handleLimitChange={handleLimitChange}
        handlePageChangeTable={handlePageChangeTable}
        onChangeProvideSource={
          (e) => console.log("why ", e)
          // filterProvideSource({e.limit, e.offset, e.keyword})
        }
        onChangeDelete={(e: any) => onChangeProvideSource(e)}
      />
    </>
  );
};

export default Results;
