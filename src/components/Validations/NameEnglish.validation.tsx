import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateNameEnglish = () => {
    const { t }: { t: any } = useTranslation();

    const name = {
        en: Yup.string()
            .min(1, t("ENGLISH_NAME") + t("MUST_HAVE_AT_LEAST_CHARACTERS"))
            .matches(
                /^[^\s]([(0-9)|(a-zA-Z)\s]+)[^\s]$/,
                t("ENGLISH_NAME") + t("MUST_CONTAIN_CHARACTERS_SPACES")
            )
            .required(t("PLEASE_ENTER") + t("ENGLISH_NAME"))
    };

    return name;
}