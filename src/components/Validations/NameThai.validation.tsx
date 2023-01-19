import { useTranslation } from "next-i18next";
import * as Yup from "yup";

export const ValidateNameThai = () => {
  const { t }: { t: any } = useTranslation();

  const name = {
    th: Yup.string()
      .min(1, t("THAI_NAME") + t("MUST_HAVE_AT_LEAST_CHARACTERS"))
      .matches(
        /^[^\s]([(0-9ก-๏)|(a-zA-Z)\s]+)[^\s]$/,
        t("THAI_NAME") + t("MUST_CONTAIN_CHARACTERS")
      )
      .required(t("PLEASE_ENTER") + t("THAI_NAME")),
  };

  return name;
}
