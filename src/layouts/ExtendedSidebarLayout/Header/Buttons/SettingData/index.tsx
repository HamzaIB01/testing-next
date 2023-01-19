import React from 'react';
import { IconButton, styled, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'next-i18next';

const IconButtonWrapper = styled(IconButton)(
    ({ theme }) => `
    width: ${theme.spacing(4)};
    height: ${theme.spacing(4)};
    border-radius: ${theme.general.borderRadiusLg};
    margin-left: 9px;
  `
);

const SettingDdata = () => {
    const { t }: { t: any } = useTranslation();
    return (
        <Tooltip arrow title={t('SETTING_DATA')}>
            <IconButtonWrapper color="primary">
                <SettingsIcon fontSize="small" />
            </IconButtonWrapper>
        </Tooltip>
    )
}

export default SettingDdata;