import { useEffect } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  styled,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";

const AccordionSummaryWrapper = styled(AccordionSummary)(
  () => `
      &.Mui-expanded {
        min-height: 48px;
      }

      .MuiAccordionSummary-content.Mui-expanded {
        margin: 12px 0;
      }
    `
);

const ListItemWrapper = styled(ListItemButton)(
  () => `
  
      &.MuiButtonBase-root {
        border-radius: 0;
      }
  `
);

function Sidebar(props: any) {
  const { t }: { t: any } = useTranslation();

  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleListItemClick = (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (props.list) {
      setSelectedIndex(
        typeOfEmployment.find((item) => item.value === props.list).id
      );
    }
  }, []);

  const typeOfEmployment = [
    {
      id: 0,
      value: "Rainfall",
      text: t("/Rainfall"),
    },
    {
      id: 1,
      value: "Runoff",
      text: t("/Runoff"),
    },
    {
      id: 2,
      value: "WaterResource",
      text: t("/WaterResource"),
    },
    // {
    //   id: 3,
    //   value: "Station",
    //   text: t("/Station"),
    // },
    // {
    //   id: 4,
    //   value: "WaterResourceInfo",
    //   text: t("/WaterResourceInfo"),
    // },
  ];

  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <CardContent>
        <Accordion
          sx={{
            p: 1,
            border: "1px solid #d6d6d6",
          }}
          defaultExpanded
        >
          <AccordionSummaryWrapper expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h5">{t("TEST_DATA_RETRIEVAL")}</Typography>
          </AccordionSummaryWrapper>
          <Divider
            sx={{
              mb: 1,
            }}
          />
          <AccordionDetails
            sx={{
              p: 0,
            }}
          >
            <List disablePadding component="div">
              {typeOfEmployment.map((item, index) => {
                return (
                  <ListItemWrapper
                    sx={{
                      py: 0,
                      px: 2,
                    }}
                    key={item.id}
                    selected={selectedIndex === index}
                    onClick={(event) => {
                      handleListItemClick(event, index);
                      props.onClick(item.text);
                    }}
                  >
                    <Button
                      color="primary"
                      size="small"
                      variant="contained"
                      sx={{
                        m: 0.8,
                      }}
                    >
                      {t("GET")}
                    </Button>

                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{ variant: "h5" }}
                    />
                  </ListItemWrapper>
                );
              })}
            </List>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export default Sidebar;
