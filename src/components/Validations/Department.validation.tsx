import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateDepartment = () => {
    const { t }: { t: any } = useTranslation();

    const validate = {
        department_uuid: Yup.string().required(t("PLEASE_SELECT") + t("DEPARTMENT"))
    };

    return validate;
}
