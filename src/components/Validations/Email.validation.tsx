import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateEmail = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        email: Yup.string()
            .email(t("THE_EMAIL_PROVIDED_SHOULD_VALID_EMAIL_ADDRESS"))
            .required(t("PLEASE_ENTER") + t("EMAIL")),
    };

    return validate;
}
