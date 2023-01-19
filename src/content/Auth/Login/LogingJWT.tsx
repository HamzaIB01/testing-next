import * as Yup from "yup";
import { FC, useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import Link from "src/components/Link";

import {
  Box,
  Button,
  FormHelperText,
  TextField,
  Checkbox,
  Typography,
  FormControlLabel,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useAuth } from "src/hooks/useAuth";
import { useRefMounted } from "src/hooks/useRefMounted";
import { useTranslation } from "react-i18next";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { ValidatePasswordSignIn } from "@/components/Validations/Password.validation";
import { AuthURL } from "@/constants";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export const LoginBaseJWT: FC = (props) => {
  const { t }: { t: any } = useTranslation();
  const { login } = useAuth() as any;
  const isMountedRef = useRefMounted();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const validate_password_singin = ValidatePasswordSignIn();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      terms: false,
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string().required(t("PLEASE_ENTER") + t("EMAIL")),
      ...validate_password_singin,
      // terms: Yup.boolean().oneOf(
      //     [true],
      //     t('You must agree to our terms and conditions')
      // )
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await login(values.email, values.password);

        if (isMountedRef()) {
          router.push(AuthURL.INFORMATION_SERVICE);
        }
      } catch (error) {
        if (isMountedRef()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: error.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit} {...props}>
      <TextField
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        margin="normal"
        helperText={formik.touched.email && formik.errors.email}
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={formik.values.email}
        variant="outlined"
        placeholder={t("EMAIL")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutlineIcon />
            </InputAdornment>
          ),
        }}
      />
      <TextField
        error={Boolean(formik.touched.password && formik.errors.password)}
        fullWidth
        margin="normal"
        helperText={formik.touched.password && formik.errors.password}
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type={showPassword ? "text" : "password"}
        value={formik.values.password}
        variant="outlined"
        placeholder={t("PASSWORD")}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Box
        alignItems="center"
        display={{ xs: "block", md: "flex" }}
        justifyContent="space-between"
      >
        <Box display={{ xs: "block", md: "flex" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.terms}
                name="terms"
                color="primary"
                onChange={formik.handleChange}
              />
            }
            label={
              <>
                <Typography variant="body2">
                  {t("REMEMBER_PASSWORD")}
                </Typography>
              </>
            }
          />
        </Box>
        <Link href={AuthURL.FORGOT_PASSWORD}>
          <b>{t("FORGOT_PASSWORD")}</b>
        </Link>
      </Box>

      {Boolean(formik.touched.terms && formik.errors.terms) && (
        <FormHelperText error>{formik.errors.terms}</FormHelperText>
      )}

      <Button
        sx={{ marginTop: 3 }}
        startIcon={
          formik.isSubmitting ? <CircularProgress size="1rem" /> : null
        }
        disabled={Boolean(!formik.isValid || formik.isSubmitting)}
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
      >
        {t("SIGN_IN")}
      </Button>
    </form>
  );
};
