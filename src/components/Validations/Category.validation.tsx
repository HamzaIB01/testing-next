import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateCategory = () => {
    const { t }: { t: any } = useTranslation();

    const validate = {
        category_uuid: Yup.string()
            .required(t("PLEASE_SELECT") + t("DATA_TYPE"))
    };

    return validate;
}
