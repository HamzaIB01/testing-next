import { ChangeEvent, FC, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Grid,
  Divider,
  CardContent,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import Text from "src/components/Text";
import Label from "src/components/Label";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { TableComponent, TableType } from "@/components/TableComponent";
import DialogMUI, { DialogType } from "@/components/Dialog";
import { FunctionPermission } from "@/actions/rolepermission.action";
import { ROLE_SCOPE } from "@/constants";
import { Department } from "@/types/user.type";
import { DatasetResult } from "@/types/water.type";

interface ResultsProps {
  importConfigs: Department;
  importDataset: DatasetResult;
  onChangeDataset: (string) => void;
  onChangeProvideSource: (string) => void;
}

interface Filters {
  role?: string;
  type: TableType;
}

const Results: FC<ResultsProps> = ({
  importConfigs,
  importDataset,
  onChangeDataset,
  onChangeProvideSource,
}) => {
  const { t }: { t: any } = useTranslation();
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);

  const [filters, setFilters] = useState<Filters>({
    role: null,
    type: TableType.EDIT_ACCOUNT,
  });

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

  const formik = useFormik({
    initialValues: importConfigs,
    validationSchema: Yup.object({
      // thai_name: Yup.string()
      //   .max(255)
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {t("บัญชีข้อมูล")}
                  </Typography>
                  <Typography variant="subtitle2">
                    {t("MANAGE_ACCOUNTS")}
                  </Typography>
                </Box>
                {importConfigs &&
                  (
                    FunctionPermission(ROLE_SCOPE.EDIT_PROVIDE_SOURCE) && FunctionPermission(ROLE_SCOPE.EDIT_PROVIDE_SOURCE) ||
                    FunctionPermission(ROLE_SCOPE.EDIT_PROVIDE_SOURCE_DEPARTMENT) && FunctionPermission(ROLE_SCOPE.EDIT_PROVIDE_SOURCE_DEPARTMENT)
                  ) && (
                    <DialogMUI
                      update={"update_import_config"}
                      code={"DATA_IMPORT_DATA"}
                      type={DialogType.EDIT}
                      operator={"provider"}
                      maxWidth={"md"}
                      title={t("บัญชีข้อมูล")}
                      formik={formik}
                      data={importConfigs}
                      onChange={(e) => onChangeProvideSource(e)}
                    />
                  )}
              </Box>
              <Divider />
              <CardContent
                sx={{
                  p: 4,
                }}
              >
                <Typography variant="subtitle2">
                  <Grid container spacing={0}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("DATA_TYPE")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        <b>{importConfigs?.category?.name?.th ?? "-"}</b>
                      </Text>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("AGENCY")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        <b>{importConfigs?.department?.name?.th ?? "-"}</b>
                      </Text>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("THAI_NAME")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        <b>{importConfigs?.name?.th}</b>
                      </Text>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("ENGLISH_NAME")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        <b>{importConfigs?.name?.en}</b>
                      </Text>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("THAI_DETAILS")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        {importConfigs?.description?.th}
                      </Text>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("ENGLISH_DETAILS")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        {importConfigs?.description?.en}
                      </Text>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("DURATION")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        <Grid container spacing={1}>
                          {importConfigs?.interval?.map((value, index) => {
                            return (
                              <Grid item key={index}>
                                <Label color="success">
                                  {value?.interval?.name?.th ?? "-"}
                                  <CheckCircleOutlineIcon
                                    sx={{
                                      fontSize: "15px",
                                      marginLeft: "4px",
                                    }}
                                  />
                                </Label>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Text>
                    </Grid>
                  </Grid>
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {t("PUBLICATION_INFORMATION")}
                  </Typography>
                  <Typography variant="subtitle2">
                    {t("MANAGE_PUBLICATION_INFORMATION")}
                  </Typography>
                </Box>

                {importConfigs &&
                  FunctionPermission(ROLE_SCOPE.EDIT_PROVIDE_SOURCE) && (
                    <DialogMUI
                      code={"PUBLICATION_INFORMATION"}
                      update={"update_import_config"}
                      type={DialogType.EDIT}
                      operator={"permission"}
                      maxWidth={"md"}
                      title={t("PUBLICATION_INFORMATION")}
                      formik={formik}
                      data={importConfigs}
                      onChange={(e) => onChangeProvideSource(e)}
                    />
                  )}
              </Box>
              <Divider />
              <CardContent
                sx={{
                  p: 4,
                }}
              >
                {importConfigs?.interval?.map((data: any, index: any) => (
                  <Typography variant="subtitle2">
                    <Grid container spacing={0}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("DURATION")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          <Grid container spacing={1}>
                            <Grid item key={index}>
                              <Label color="success">
                                {data.interval?.name?.th ?? "-"}
                                <CheckCircleOutlineIcon
                                  sx={{
                                    fontSize: "15px",
                                    marginLeft: "4px",
                                  }}
                                />
                              </Label>
                            </Grid>
                          </Grid>
                        </Text>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        textAlign={{ sm: "right" }}
                      >
                        <Box pr={3} pb={2}>
                          {t("SECRET_CLASS")}:
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={8} md={9}>
                        <Text color="black">
                          {data.permission?.name?.th ?? "-"}
                        </Text>
                      </Grid>

                      {data?.channel && (
                        <>
                          <Grid
                            item
                            xs={12}
                            sm={4}
                            md={3}
                            textAlign={{ sm: "right" }}
                          >
                            <Box pr={3} pb={2}>
                              {t("DISCOSURE_CHANNEL")}:
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={8} md={9}>
                            <Grid container spacing={2}>
                              {data?.channel && data?.channel?.map((val) => {

                                return (
                                  <Grid item xs={12}>
                                    <Text color="black">
                                      {val?.name?.th ?? "-"}
                                    </Text>
                                  </Grid>
                                )

                              })}
                            </Grid>
                          </Grid>
                        </>
                      )}

                      {
                        importConfigs?.interval?.length - 1 !== index
                          ? data?.channel
                            ? <Divider sx={{ width: "100%", mt: 3, mb: 3 }} />
                            : <Divider sx={{ width: "100%", mt: 1, mb: 3 }} />
                          : null
                      }

                    </Grid>
                  </Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <Box
                p={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {t("RESPONSIBLE_PERSON_INFORMATION")}
                  </Typography>
                  <Typography variant="subtitle2">
                    {t("MANAGE_RESPONSIBLE_PERSON_INFORMATION")}
                  </Typography>
                </Box>

                {importConfigs &&
                  FunctionPermission(ROLE_SCOPE.EDIT_PROVIDE_SOURCE) && (
                    <DialogMUI
                      update={"update_import_config"}
                      code={"RESPONSIBLE_PERSON_INFORMATION"}
                      type={DialogType.EDIT}
                      operator={"coordinator"}
                      maxWidth={"md"}
                      title={t("RESPONSIBLE_PERSON_INFORMATION")}
                      formik={formik}
                      data={importConfigs}
                      onChange={(e) => onChangeProvideSource(e)}
                    />
                  )}
              </Box>
              <Divider />
              <CardContent
                sx={{
                  p: 4,
                }}
              >
                <Typography variant="subtitle2">
                  <Grid container spacing={0}>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("FULL_NAME")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        {`${importConfigs?.coordinator?.first_name ?? "-"} ${importConfigs?.coordinator?.last_name ?? "-"
                          }`}
                      </Text>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("PHONE_NUMBER")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        {importConfigs?.coordinator?.phone_number ?? "-"}
                      </Text>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      md={3}
                      textAlign={{ sm: "right" }}
                    >
                      <Box pr={3} pb={2}>
                        {t("EMAIL")}:
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Text color="black">
                        {importConfigs?.coordinator?.email ?? "-"}
                      </Text>
                    </Grid>
                  </Grid>
                </Typography>
              </CardContent>
            </Card>
          </Grid>


          {FunctionPermission(ROLE_SCOPE.MANAGE_IMPORT_CONFIG) && (
            <Grid item xs={12}>
              <TableComponent
                filters={filters}
                filteredUsers={importDataset}
                page={page}
                limit={limit}
                paginatedUsers={importDataset}
                handlePageChange={handlePageChange}
                handleLimitChange={handleLimitChange}
                handlePageChangeTable={handlePageChangeTable}
                provide_source_uuid={importConfigs?.uuid}
                onChange={(e) => onChangeDataset(e)}
              />
            </Grid>
          )}
        </Grid>
      </form>
    </>
  );
};

export default Results;
