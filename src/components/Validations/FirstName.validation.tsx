import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateFirstName = () => {
    const { t }: { t: any } = useTranslation();

    const validate = {
        first_name: Yup.string()
            .min(2, t("FIRST_NAME") + t("MUST_HAVE_AT_LEAST_CHARACTERS"))
            .matches(
                /^[^\s]([(ก-๏)|(a-zA-Z)\s]+)[^\s]$/,
                t("FIRST_NAME") + t("MUST_CONTAIN_CHARACTERS")
            )
            .required(t("PLEASE_ENTER") + t("FIRST_NAME"))
    };

    return validate;
}
