import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidatePassport = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        passport: Yup.string()
            // .min(17, t("FILL_OUT_THE_INFORMATION_IN_THE_CORRECT_FORMAT"))
            .required(t("PLEASE_ENTER") + t("PASSPORT")),
    };

    return validate;
}
