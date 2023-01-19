import { FC, ReactNode } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import LanguageSwitcher from "../ExtendedSidebarLayout/Header/Buttons/LanguageSwitcher";

// import Header from '../BoxedSidebarLayout/Header';
// import LanguageSwitcher from '../BoxedSidebarLayout/Header/Buttons/LanguageSwitcher';

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <LanguageSwitcher />
      </Box>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          height: "100%",
        }}
      >
        {children}
      </Box>
    </>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node,
};

export default BaseLayout;
