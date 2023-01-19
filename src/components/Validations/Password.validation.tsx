import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidatePasswordSignIn = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        password: Yup.string()
            .required(t("PLEASE_ENTER") + t("PASSWORD")),
    };

    return validate;
}

export const ValidatePassword = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        password: Yup.string()
            .required(t("PLEASE_ENTER") + t("PASSWORD")),
    };

    return validate;
}

export const ValidateOldPassword = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        old_password: Yup.string()
            // .matches(
            //     /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^@$!%*#?&_-])[A-Za-z\d][^@$!%*#?&_-]{8,}$/,
            //     t("CONFIRM_PASSWORD_CARACTERS")
            // )
            .max(20)
            .required(t("PLEASE_ENTER") + t("OLD_PASSWORD")),
    };

    return validate;
}

export const ValidateNewPassword = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        new_password: Yup.string()
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_-])[A-Za-z\d@$!%*#?&_-]{8,}$/,
                t("CONFIRM_PASSWORD_CARACTERS")
            )
            .max(20)
            .required(t("PLEASE_ENTER") + t("NEW_PASSWORD")),
    };

    return validate;
}

export const ValidateConfirmNewPassword = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        confirm_new_password: Yup.string()
            .oneOf(
                [Yup.ref("new_password")],
                t("BOTH_PASSWORD_FIELDS_NEED_TO_THE_SAME")
            )
            .required(t("PLEASE_ENTER") + t("CONFIRM_NEW_PASSWORD")),
    };

    return validate;
}
