import * as Yup from "yup";

export const ValidateDescriptionThai = () => {

    const description = {
        th: Yup.string()
        // .required(t("PLEASE_ENTER") + t("THAI_DETAILS"))
    };

    return description;
}
