import { useCallback, useEffect, useState } from "react";

import {
  Typography,
  Accordion,
  AccordionDetails,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  styled,
  Card,
  CardContent,
  ListItem,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { ConvertDateTimeFormat } from "@/components/FormatConvertDateTime";
import { AllApiKeyResult } from "@/types/api_keys.type";
import { useAuth } from "@/hooks/useAuth";
import { apiKeyApi } from "@/actions/api.key.action";

const ListItemWrapper = styled(ListItemButton)(
  () => `
  
      &.MuiButtonBase-root {
        border-radius: 0;
      }
  `
);

function Sidebar(props: any) {
  const { t }: { t: any } = useTranslation();
  const auth = useAuth();
  const [getAllAPI, setGetAllAPI] = useState<AllApiKeyResult[]>([]);

  const getApikeys = useCallback(async () => {
    try {
      const apiData = await apiKeyApi.getApikeybyuser(auth.user.uuid);
      setGetAllAPI(apiData ? apiData : []);
    } catch (err) {
      setGetAllAPI([]);
    }
  }, []);

  useEffect(() => {
    getApikeys();
  }, []);

  useEffect(() => {
    getApikeys();
  }, [props]);

  const handleDelete = async (api_key_uuid: any) => {
    // const value = {
    //   enable_flag: false,
    //   status_flag: "TERMINATED",
    // };
    try {
      const result = await apiKeyApi.updateStatusApikey(api_key_uuid);
      if (result) {
        alert("Delete success");
        getApikeys();
      }
    } catch (err) {
      alert(err);
    }
  };

  const typeOfEmployment = [
    {
      id: 1,
      value: "demo_api",
      text: t("demo_api"),
      expired_date: t("12-02-2022"),
    },
    {
      id: 2,
      amount: 16,
      value: "xzy",
      text: t("xzy"),
      expired_date: null,
    },
    {
      id: 3,
      amount: 9,
      value: "demo_api_02",
      text: t("demo_api_02"),
      expired_date: t("09-01-2023"),
    },
  ];

  const [checked, setChecked] = useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Card
      sx={{
        height: "100%",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Accordion defaultExpanded>
          <AccordionDetails
            sx={{
              p: 0,
            }}
          >
            <List disablePadding component="div">
              {getAllAPI &&
                getAllAPI.map((value, index) => {
                  return (
                    <Box key={index}>
                      <ListItem
                        secondaryAction={
                          <Tooltip arrow title={t("DELETE")}>
                            <IconButton
                              edge="end"
                              aria-label="comments"
                              color="error"
                              onClick={() => {
                                handleDelete(value.uuid);
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                        disablePadding
                      >
                        <ListItemWrapper
                          sx={{
                            p: "16px",
                          }}
                          onClick={() => props.onSelect(value)}
                          //   onClick={handleToggle(value.id)}
                        >
                          <ListItemText
                            primary={value.name}
                            primaryTypographyProps={{ variant: "h5" }}
                            secondary={
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {t("EXPIRATION_DATE") + ": "}
                                </Typography>
                                <ConvertDateTimeFormat
                                  date={value.expired_date || "-"}
                                />
                              </React.Fragment>
                            }
                          />
                        </ListItemWrapper>
                      </ListItem>
                      <Divider />
                    </Box>
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
