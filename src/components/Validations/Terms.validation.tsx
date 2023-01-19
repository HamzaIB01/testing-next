import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateTerms = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        terms: Yup.boolean().oneOf(
            [true],
            t("You must agree to our terms and conditions")
        ),
    };

    return validate;
}