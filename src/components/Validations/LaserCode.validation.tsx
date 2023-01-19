import React from "react";
import { IMaskInput } from "react-imask";
import { useTranslation } from "next-i18next";
import * as Yup from "yup";

interface LaserCodeProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

export const TextMaskLaserCode = React.forwardRef<HTMLElement, LaserCodeProps>(
    function TextMaskLaserCode(props, ref) {
        const { onChange, ...other } = props;
        return (
            <IMaskInput
                {...other}
                mask="aa#-#######-##"
                definitions={{
                    "#": /[0-9]/,
                    "a": /[A-Za-z]/,
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
                    onChange({ target: { name: props.name, value: value.toUpperCase() } })
                }
                overwrite
            />
        );
    }
);



export const ValidateLaserCode = () => {

    const { t }: { t: any } = useTranslation();

    const validate = {
        laser_code: Yup.string()
            .min(14, t("FILL_OUT_THE_INFORMATION_IN_THE_CORRECT_FORMAT"))
            .required(t("PLEASE_ENTER") + t("LASER_CODE")),
    };

    return validate;
}



