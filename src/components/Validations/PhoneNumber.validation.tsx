import React from "react";
import { IMaskInput } from "react-imask";
import { useTranslation } from "next-i18next";
import * as Yup from "yup";


interface PhoneNumberProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
    value?: string;
}

export const TextMaskPhoneNumber = React.forwardRef<HTMLElement, PhoneNumberProps>(
    function TextMaskPhoneNumber(props, ref) {

        const { onChange, ...other } = props;

        const phone = props.value.split("-").join("").length;

        return (
            <IMaskInput
                {...other}
                mask={phone === 9 ? "0-####-#####" : "0##-###-####"}
                definitions={{
                    "0": /[0]/,
                    "#": /[0-9]/,
                }}
                inputRef={el => {
                    if (typeof ref === 'function') {
                        ref(el as HTMLInputElement);
                    } else if (ref) {
                        // @ts-ignore
                        ref.current = el;
                    }
                }}
                onAccept={(value: any) =>
                    onChange({ target: { name: props.name, value } })
                }
                overwrite
            />
        );
    }
);

export const ValidatePhoneNumber = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        phone_number: Yup.string()
            .min(11, t("FILL_OUT_THE_INFORMATION_IN_THE_CORRECT_FORMAT"))
            .max(12, t("FILL_OUT_THE_INFORMATION_IN_THE_CORRECT_FORMAT"))
            .required(t("PLEASE_ENTER") + t("PHONE_NUMBER")),
    };

    return validate;
}
