import * as Yup from "yup";

export const ValidateDescriptionEnglish = () => {

    const description = {
        en: Yup.string()
        // .required(t("PLEASE_ENTER") + t("ENGLISH_DETAILS"))
    };

    return description;
}
