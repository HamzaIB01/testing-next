import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateBirthDate = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        birth_date: Yup.string()
            .required(t("The birth date is requireded")),
    };

    return validate;
}
