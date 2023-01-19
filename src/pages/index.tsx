import Head from "next/head";
import ExtendedSidebarLayout from "src/layouts/ExtendedSidebarLayout";
import { Authenticated } from "src/components/Authenticated";
import { useTranslation } from "react-i18next";
import SearchData from "./information-service";

function DashboardReports() {
  const { t }: { t: any } = useTranslation();
  return (
    <>
      <Head>
        <title>{t("HYDRO_INFORMATION_INSTITUTE_HII")}</title>
      </Head>
      <SearchData />
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;
