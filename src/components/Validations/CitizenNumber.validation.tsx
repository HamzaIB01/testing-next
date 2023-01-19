import React from "react";
import { IMaskInput } from "react-imask";
import { useTranslation } from "next-i18next";
import * as Yup from "yup";

interface CitizenNumberProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export const TextMaskCitizenNumber = React.forwardRef<HTMLElement, CitizenNumberProps>(
    function TextMaskCitizenNumber(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="#-####-#####-##-#"
                definitions={{
                    "#": /[0-9]/,
                }}
                inputRef={
                    el => {
                        if (typeof ref === 'function') {
                            ref(el as HTMLInputElement);
                        } else if (ref) {
                            // @ts-ignore
                            ref.current = el;
                        }
                    }
                }
                onAccept={(value: any) =>
                    onChange({ target: { name: props.name, value } })
                }
                overwrite
            />
        );
    }
);


export const ValidateCitizenNumber = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        citizen_number: Yup.string()
            .min(17, t("FILL_OUT_THE_INFORMATION_IN_THE_CORRECT_FORMAT"))
            .required(t("PLEASE_ENTER") + t("CITIZEN_NUMBER")),
    };

    return validate;
}
