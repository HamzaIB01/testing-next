import PageHeader from "@/content/Dashboard/PageHeader";
import Footer from "src/components/Footer";
import PageTitleWrapper from "src/components/PageTitleWrapper";

import { Grid } from "@mui/material";

import Block1 from "@/content/Dashboard/Blocks/Statistics/Block3";
import Block2 from "@/content/Dashboard/Blocks/ListsLarge/Block8";
import Block3 from "@/content/Dashboard/Dashboards/Reports/Block3";
import Block4 from "@/content/Dashboard/Dashboards/Reports/Block4";

function DashboardContent() {
  return (
    <>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Grid
        sx={{
          px: 4,
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Block1 />
        </Grid>
        <Grid item md={7} xs={12}>
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12}>
              <Block2 />
            </Grid>
            <Grid item xs={12}>
              <Block4 />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={5} xs={12}>
          <Block3 />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default DashboardContent;
