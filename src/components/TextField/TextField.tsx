import { FastField, Field } from "formik";
import { TextField } from "formik-mui";
import { useTranslation } from "next-i18next";
import React from "react";
import { IMaskInput } from "react-imask";

/*{ Inerface Props }*/
interface CustomCitizenProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
}

export const TextMaskCitizenValidate = React.forwardRef<
  HTMLElement,
  CustomCitizenProps
>(function TextMaskCitizenValidate(props, _ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="#-####-#####-##-#"
      // shrink={true}
      definitions={{
        "#": /[0-9]/,
      }}
      onAccept={(value: any) =>
        onChange({ target: { name: props.name, value } })
      }
      overwrite
    />
  );
});

export const TextMaskBackCitizenValidate = React.forwardRef<
  HTMLElement,
  CustomCitizenProps
>(function TextMaskCitizenValidate(props, _ref) {
  const { onChange, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="###-#######-##"
      // shrink={true}
      definitions={{
        "#": /[0-9]/,
      }}
      onAccept={(value: any) =>
        onChange({ target: { name: props.name, value } })
      }
      overwrite
    />
  );
});

export default function InputField(props) {
  const { t }: { t: any } = useTranslation();
  const { className, name, validateOnChange = true, ...rest } = props;
  // validateField
  return (
    <FastField
      name={name}
      {...rest}
      render={({ field, form: { touched, errors, validateField } }) => {
        touched[name] = true;
        const error =
          (validateOnChange || touched[name]) &&
          typeof errors[name] === "string"
            ? errors[name]
            : null;

        const onChange = validateOnChange
          ? (_e) => {
              if (validateOnChange) {
                validateField(field.name);
              }
              //   return field.onChange(e);
            }
          : field.onChange;
        return (
          <>
            <FastField
              component={TextField}
              fullWidth
              label={props.label}
              {...field}
              //   onChange={onChange}
              //   InputProps={
              //     props.iMask && {
              //       inputComponent: TextMaskCitizenValidate as any,
              //     }
              //   }
            />
            {/* {error && <div className="error">{error}</div>} */}
          </>
        );
      }}
    />
  );
}
