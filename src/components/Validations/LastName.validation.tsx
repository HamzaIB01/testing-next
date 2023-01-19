import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateLastName = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        last_name: Yup.string()
            .min(1, t("LAST_NAME") + t("MUST_HAVE_AT_LEAST_CHARACTERS"))
            .matches(
                /^[^\s]([(ก-๏)|(a-zA-Z)\s]+)[^\s]$/,
                t("LAST_NAME") + t("MUST_CONTAIN_CHARACTERS")
            )
            .required(t("PLEASE_ENTER") + t("LAST_NAME")),
    };

    return validate;
}
