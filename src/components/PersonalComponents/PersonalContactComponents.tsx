import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Field } from "formik";
import { CheckboxWithLabel } from "formik-mui";
import Link from "src/components/Link";
import { useTranslation } from "react-i18next";
import { TextField } from "formik-mui";
import { TextMaskPhoneNumber } from "../Validations/PhoneNumber.validation";
import { PersonalType } from "@/content/Profile/single/UserInformationTab";
import { PAGE } from "@/constants";

const DialogStyldMUI = styled(Dialog)(
  () => `
  .css-pu1qzu-MuiPaper-root-MuiDialog-paper {
      overflow: visible;
    }
  `
);

const DialogActions = styled(Box)(
  ({ theme }) => `
       background: ${theme.colors.alpha.black[5]}
    `
);

export function PersonalContactComponent(props: any) {
  const { t }: { t: any } = useTranslation();
  const [open, setOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(
    props.getInitial?.phone_number ?? "-"
  );
  const [email, setEmail] = useState(props.getInitial?.email ?? "-");
  const [newPassword, setNewPassword] = useState(
    props.getInitial?.new_password ?? "-"
  );
  const [confirmPassword, setConfirmPassword] = useState(
    props.getInitial?.confirm_new_password ?? "-"
  );
  const [oldPassword, setOldPassword] = useState(
    props.getInitial?.old_password ?? "-"
  );

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  return (
    <>
      <Grid container spacing={3}>
        {props.title && (
          <Grid item xs={12} sx={{ mt: 3 }}>
            <Typography variant="h4" component="h4">
              {props.title}
            </Typography>
          </Grid>
        )}

        {props.type === PersonalType.ChangePassword && (
          <Grid item xs={12} md={6}>
            <Field
              fullWidth
              name="old_password"
              value={oldPassword}
              component={TextField}
              // type={props.rightName ? "password" : ""}
              label={t("OLD_PASSWORD")}
              onChange={(event) => {
                setOldPassword(event.target.value);
                props.getInitial.old_password = event.target.value;
              }}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Grid container spacing={2}>
            {props.page === PAGE.REGISTER && (
              <Grid item xs={12} md={6}>
                <Field
                  fullWidth
                  name="email"
                  component={TextField}
                  label={t("EMAIL")}
                  value={props.formik.values.email}
                  error={Boolean(
                    props.formik.touched.email && props.formik.errors.email
                  )}
                  helperText={
                    props.formik.touched.email && props.formik.errors.email
                  }
                  onBlur={props.formik.handleBlur}
                  onChange={props.formik.handleChange}
                />
              </Grid>
            )}

            {props.page !== PAGE.REGISTER && (
              <Grid item xs={12} md={6}>
                <Field
                  fullWidth
                  name={props.rightName ? "new_password" : "email"} //{props.leftName || "email"}
                  value={props.rightName ? newPassword : email}
                  component={TextField}
                  type={props.rightName ? "text" : "email"}
                  disabled={props.disableTextfield}
                  label={props.leftFieldTitle}
                  onChange={(event) =>
                    props.rightName
                      ? (setNewPassword(event.target.value),
                        (props.getInitial.new_password = event.target.value))
                      : (setEmail(event.target.value),
                        (props.getInitial.email = event.target.value))
                  }
                />
              </Grid>
            )}

            {props.page === PAGE.REGISTER && (
              <Grid item xs={12} md={6}>
                <Field
                  fullWidth
                  name="phone_number"
                  component={TextField}
                  label={t("PHONE_NUMBER")}
                  value={props.formik.values.phone_number}
                  error={Boolean(
                    props.formik.touched.phone_number &&
                      props.formik.errors.phone_number
                  )}
                  helperText={
                    props.formik.touched.phone_number &&
                    props.formik.errors.phone_number
                  }
                  onBlur={props.formik.handleBlur}
                  onChange={props.formik.handleChange}
                  InputProps={
                    !props.rightName && {
                      inputComponent: TextMaskPhoneNumber as any,
                    }
                  }
                />
              </Grid>
            )}

            {props.page !== PAGE.REGISTER && (
              <Grid item xs={12} md={6}>
                <Field
                  fullWidth
                  name={props.rightName || "phone_number"}
                  component={TextField}
                  label={props.rightFieldTitle}
                  value={props.rightName ? confirmPassword : phoneNumber}
                  disabled={props.disableTextfield}
                  // type={props.rightName ? "password" : ""}
                  onChange={(event) =>
                    props.rightName
                      ? (setConfirmPassword(event.target.value),
                        (props.getInitial.confirm_new_password =
                          event.target.value))
                      : (setPhoneNumber(event.target.value),
                        (props.getInitial.phone_number = event.target.value))
                  }
                  // InputLabelProps={
                  //   !props.rightName && {
                  //     shrink: phoneNumber && phoneNumber.length > 0,
                  //   }
                  // }
                  InputProps={
                    !props.rightName && {
                      inputComponent: TextMaskPhoneNumber as any,
                    }
                  }
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        {!props.noTermOfUse &&
          props.type != "EDIT" &&
          props.type != PersonalType.ChangePassword && (
            <Grid item xs={12}>
              <Field
                name="terms"
                type="checkbox"
                component={CheckboxWithLabel}
                Label={{
                  label: (
                    <Typography variant="body2">
                      {t("ACCEPT")}{" "}
                      <Link href="#" onClick={handleOpenDialog}>
                        {t("TERM_OF_USE_AND_PRIVACY_POLICY")}
                      </Link>
                    </Typography>
                  ),
                }}
              />
            </Grid>
          )}
      </Grid>

      <DialogStyldMUI
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCloseDialog}
      >
        <DialogTitle sx={{ p: 3 }}>
          <Typography variant="h4">
            นโยบายการคุ้มครองข้อมูลส่วนบุคคลของสถาบันสารสนเทศทรัพยากรน้ำ
            (องค์การมหาชน)
          </Typography>
        </DialogTitle>
        <Divider />

        <DialogContent sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            นโยบายความเป็นส่วนตัว (PrivacyPolicy)
          </Typography>

          <Typography variant="subtitle1" gutterBottom component="div">
            สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน)
            จัดทำนโยบายการคุ้มครองข้อมูลส่วนบุคคลขึ้นเพื่อกำหนดหลักเกณฑ์ กลไก
            รวมถึงมาตรการกำกับดูแลเกี่ยวกับการรวบรวม จัดเก็บ ใช้
            หรือเผยแพร่ข้อมูลส่วนบุคคลสำหรับใช้ในการดำเนินงานภายในสถาบันให้สอดคล้องพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล
            พ.ศ. ๒๕๖๒
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๑. คำนิยาม
          </Typography>

          <Typography variant="subtitle1" gutterBottom component="div">
            “สถาบัน” หมายความว่า สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน)
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            “บุคคล” หมายความว่า บุคคลธรรมดา
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            “ข้อมูลส่วนบุคคล” หมายความว่า
            ข้อมูลเกี่ยวกับบุคคลซึ่งทำให้สามารถระบุตัวบุคคลนั้นได้
            ไม่ว่าทางตรงหรือทางอ้อม แต่ไม่รวมถึงข้อมูลของผู้ถึงแก่กรรมโดยเฉพาะ
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            “ข้อมูลส่วนบุคคลอ่อนไหว” หมายความว่า
            ข้อมูลส่วนบุคคลที่เกี่ยวกับเชื้อชาติ เผ่าพันธุ์
            ความคิดเห็นทางการเมือง ความเชื่อในลัทธิ ศาสนาหรือปรัชญา
            พฤติกรรมทางเพศ ประวัติอาชญากรรม ข้อมูลสุขภาพ ความพิการ
            ข้อมูลสหภาพแรงงาน ข้อมูลพันธุกรรม ข้อมูลชีวภาพ
            หรือข้อมูลอื่นใดซึ่งกระทบต่อเจ้าของข้อมูลส่วนบุคคลในทำนองเดียวกันตามที่กฎหมายกำหนด
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๒. แหล่งที่มาและการเก็บรวบรวมข้อมูลส่วนบุคคล
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            สถาบันอาจได้ข้อมูลส่วนบุคคลดังต่อไปนี้
            ไม่ว่าจะเป็นวิธีการเก็บรวบรวมจากเจ้าของข้อมูลส่วนบุคคลโดยตรงหรือโดยอ้อมก็ตาม
            ซึ่งได้มาจากการใช้บริการ การให้บริการ การเข้าร่วมกิจกรรม
            หรือการปฏิบัติงานตามภารกิจของสถาบัน
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๒.๑ ข้อมูลส่วนบุคคลที่บ่งชี้ตัวตน เช่น ชื่อ นามสกุล
            หน่วยงานที่สังกัดอยู่ อีเมล์ หมายเลขโทรศัพท์ สถานที่ติดต่อ
            ชื่อบัญชีสำหรับการติดต่อสื่อสารในเครือข่ายสังคมออนไลน์ ภาพถ่าย
            ทั้งนี้รวมถึงข้อมูลที่เกี่ยวข้องกับการทำงานและการศึกษา
            ข้อมูลส่วนบุคคลอ่อนไหว
            และข้อมูลส่วนบุคคลของบุคคลในครอบครัวของเจ้าของข้อมูลส่วนบุคคลนั้นด้วย
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๒.๒ ข้อมูลจราจรทางคอมพิวเตอร์
            เป็นข้อมูลทางเทคนิคซึ่งถูกจัดเก็บโดยอัตโนมัติ
            ไม่ว่าจะผ่านทางการใช้คุกกี้ (Cookies) เว็บบีคอน (Web beacons)
            และไฟล์ข้อมูลจราจรทางคอมพิวเตอร์ (log files) หรือข้อมูลอื่นใด รวมถึง
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            • ข้อมูลการตั้งค่า (Configuration Information)
            ที่ถูกกำหนดขึ้นโดยเว็บเบราว์เซอร์
            หรือโปรแกรมอื่นใดที่ได้ใช้เพื่อเข้าสู่บริการรูปแบบอิเล็กทรอนิกส์ของสถาบัน
            รวมถึง IP Address, เวอร์ชั่นและหมายเลขเครื่องของอุปกรณ์สื่อสาร
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            •
            ข้อมูลที่ได้จากการค้นหาหรือตรวจดูในขณะที่ใช้บริการในรูปแบบอิเล็กทรอนิกส์ของสถาบัน
            เช่น ข้อความที่ใช้ในการค้นหา รายละเอียดของข้อมูลต่าง ๆ
            และเนื้อหาที่เข้าถึง
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            การเก็บรวบรวมข้อมูลส่วนบุคคลดังกล่าว
            สถาบันจะกำหนดรายการที่จะเก็บรวบรวมตามความจำเป็นและเหมาะสมต่อการประมวลผลข้อมูลส่วนบุคคล
            และตามบริบทของการใช้บริการ การให้บริการ การเข้าร่วมกิจกรรม
            หรือการปฏิบัติงานตามภารกิจของสถาบัน
            โดยแต่ละกรณีดังกล่าวจะดำเนินการผ่านทางคำประกาศเกี่ยวกับความเป็นส่วนตัว
            (Privacy Notice)
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๓. วัตถุประสงค์ในการประมวลผลข้อมูลส่วนบุคคล
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ข้อมูลส่วนบุคคลที่สถาบันเก็บรวบรวมจะนำไปใช้ในการประมวลผลข้อมูลส่วนบุคคลตามกรอบวัตถุประสงค์
            ดังต่อไปนี้
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๓.๑ เพื่อใช้ในการปฏิบัติงานตามภารกิจของสถาบัน
            ซึ่งกำหนดไว้ในวัตถุประสงค์การจัดตั้งสถาบันตามพระราชกฤษฎีกาจัดตั้งสถาบันสารสนเทศทรัพยากรน้ำ
            (องค์การมหาชน) พ.ศ. ๒๕๖๒
            หรือกฎหมายอื่นที่เกี่ยวข้องกับภารกิจของสถาบันและให้อำนาจแก่สถาบันในการดำเนินการ
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๓.๒ เพื่อให้สถาบันและคู่สัญญาสามารถปฏิบัติตามสัญญาที่ตกลงกันไว้ได้
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๓.๓
            เพื่อใช้ในบริการหรือกิจกรรมที่กฎหมายกำหนดให้ขอความยินยอมจากเข้าของข้อมูลส่วนบุคคล
            และเจ้าของข้อมูลได้ให้ความยินยอมอย่างชัดแจ้งแล้ว
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๓.๔
            เพื่อใช้ในการปฏิบัติตามกฎหมายที่เกี่ยวข้องหรือเพื่อประโยชน์โดยชอบด้วยกฎหมาย
            เช่น
            การส่งรายชื่อและข้อมูลการติดต่อผู้มีส่วนได้ส่วนเสียภายนอกของสถาบันให้แก่สำนักงาน
            ป.ป.ช เพื่อทำการประเมินคุณธรรมและความโปร่งใสในการดำเนินงานของสถาบัน
            , การติดกล้อง CCTV
            ภายในพื้นที่ทำการของสถาบันเพื่อการรักษาความปลอดภัย ,
            การปฏิบัติตามคำสั่งศาล ,
            การเปิดเผยข้อมูลส่วนบุคคลตามพระราชบัญญัติข้อมูลข่าวสารของราชการ พ.ศ.
            ๒๕๔๐
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๓.๕ เพื่อใช้ในการป้องกันหรือระงับอันตรายต่อชีวิต ร่างกาย
            หรือสุขภาพของบุคคล
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๓.๖ เพื่อใช้ในการจัดทำเอกสารประวัติศาสตร์
            การทำจดหมายเหตุเพื่อประโยชน์สาธารณะการศึกษาวิจัย และการจัดทำสถิติ
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            วัตถุประสงค์ในการประมวลผลข้อมูลส่วนบุคคลดังกล่าว
            สถาบันจะระบุไว้ในคำประกาศเกี่ยวกับความเป็นส่วนตัว (Privacy Notice)
            ตามบริบทของการใช้บริการ การให้บริการ การเข้าร่วมกิจกรรม
            หรือการปฏิบัติงานตามภารกิจของสถาบัน
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๔. การประมวลผลข้อมูลส่วนบุคคล
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            สถาบันจะดำเนินการประมวลผลข้อมูลส่วนบุคคล
            โดยกระทำต่อข้อมูลส่วนบุคคลหรือชุดข้อมูลส่วนบุคคล
            ไม่ว่าจะโดยวิธีการอัตโนมัติ เช่น
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            – การเก็บ บันทึก จัดระบบ จัดโครงสร้าง เก็บรักษา เปลี่ยนแปลง
            หรือปรับเปลี่ยน
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            – การรับ พิจารณา ใช้ เปิดเผยด้วยการส่งต่อ เผยแพร่
            หรือการกระทำอื่นใดซึ่งทำให้เกิดความพร้อมใช้งาน
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            – การจัดวางหรือผสมเข้าด้วยกัน การจำกัด การลบ หรือการทำลาย
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ทั้งนี้ให้เป็นไปตามวัตถุประสงค์ในการประมวลผลข้อมูลส่วนบุคคลและที่กำหนดไว้ในคำประกาศเกี่ยวกับความเป็นส่วนตัว
            (Privacy Notice) ตามบริบทของการใช้บริการ การเข้าร่วมกิจกรรม
            หรือการปฏิบัติงานตามภารกิจของสถาบันนั้น
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ในกรณีที่สถาบันมีความประสงค์ในการประมวลผลข้อมูลส่วนบุคคลเพื่อการอื่นนอกเหนือจากวัตถุประสงค์ในการประมวลผลข้อมูลส่วนบุคคลที่ได้แจ้งไว้
            สถาบันจะดำเนินการแจ้งให้เจ้าของข้อมูลส่วนบุคคลดังกล่าวทราบและให้ความยินยอมอย่างชัดแจ้ง
            ก่อนที่จะดำเนินการใด ๆ กับข้อมูลส่วนบุคคลนั้น
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๕. การเก็บรักษาและระยะเวลาในการเก็บรักษาข้อมูลส่วนบุคคล
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            สถาบันจะดำเนินการเก็บรักษาข้อมูลส่วนบุคคลตามมาตรการในการรักษาความมั่นคงปลอดภัยข้อมูลส่วนบุคคลที่กฎหมายกำหนด
            เพื่อป้องกันไม่ให้ผู้ที่ไม่มีสิทธิสามารถเข้าถึงข้อมูลส่วนบุคคลได้
            และเป็นการป้องกันมิให้ข้อมูลส่วนบุคคลสูญหาย
            หรือมีการเข้าถึงข้อมูลส่วนบุคคลเพื่อใช้ ทำลาย เปลี่ยนแปลง แก้ไข
            หรือเปิดเผยข้อมูลส่วนบุคคลโดยไม่ได้รับอนุญาต
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ทั้งนี้
            สถาบันจะดำเนินการเก็บรักษาข้อมูลส่วนบุคคลตามระยะเวลาที่กฎหมายเกี่ยวกับข้อมูลส่วนบุคคลนั้นกำหนดไว้
            หรือตามที่กำหนดไว้ในคำประกาศเกี่ยวกับความเป็นส่วนตัว (Privacy
            Notice) ตามบริบทของการใช้บริการ การเข้าร่วมกิจกรรม
            หรือการปฏิบัติงานตามภารกิจของสถาบันนั้น
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๖. สิทธิของเจ้าของข้อมูลส่วนบุคคล
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            เจ้าของข้อมูลส่วนบุคคลมีสิทธิในการดำเนินการ ดังต่อไปนี้
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๖.๑ สิทธิในการเพิกถอนความยินยอม (right to withdraw consent)
            เจ้าของข้อมูลส่วนบุคคลมีสิทธิเพิกถอนความยินยอมในการประมวลผลข้อมูลส่วนบุคคลที่เจ้าของข้อมูลส่วนบุคคลได้ให้ความยินยอมไว้แก่สถาบันได้ตลอดระยะเวลาที่ข้อมูลส่วนบุคคลของตนอยู่ภายใต้การดูแลของสถาบัน
            ทั้งนี้ การเพิกถอนความยินยอมจะไม่ส่งผลกระทบต่อการเก็บรวบรวม ใช้
            หรือเปิดเผยข้อมูลส่วนบุคคลที่เจ้าของข้อมูลส่วนบุคคลได้ให้ความยินยอมไว้แล้ว
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            อย่างไรก็ดี
            สิทธิในการเพิกถอนความยินยอมของเจ้าของข้อมูลส่วนบุคคลอาจมีข้อจำกัดสิทธิได้
            หากสถาบันใช้ข้อมูลส่วนบุคคลนั้นโดยฐานกฎหมายหรือฐานสัญญา
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๖.๒ สิทธิในการเข้าถึงข้อมูลส่วนบุคคล (right of access)
            เจ้าของข้อมูลส่วนบุคคลมีสิทธิเข้าถึงข้อมูลส่วนบุคคลของตน
            และขอให้สถาบันทำสำเนาข้อมูลส่วนบุคคลดังกล่าวให้แก่เจ้าของข้อมูลส่วนบุคคล
            รวมถึงขอให้สถาบันเปิดเผยการได้มาซึ่งข้อมูลส่วนบุคคลที่เจ้าของข้อมูลส่วนบุคคลไม่ได้ให้ความยินยอมต่อสถาบันได้
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๖.๓ สิทธิในการแก้ไขข้อมูลส่วนบุคคลให้ถูกต้อง (right to
            rectification)
            เจ้าของข้อมูลส่วนบุคคลมีสิทธิขอให้สถาบันแก้ไขข้อมูลส่วนบุคคลที่ไม่ถูกต้อง
            หรือเพิ่มเติมข้อมูลส่วนบุคคลที่ไม่สมบูรณ์
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๖.๔ สิทธิในการลบข้อมูลส่วนบุคคล (right to erasure)
            เจ้าของข้อมูลส่วนบุคคลมีสิทธิในการขอให้สถาบันทำการลบข้อมูลส่วนบุคคลของตนด้วยเหตุบางประการได้
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๖.๕ สิทธิในการระงับการใช้ข้อมูลส่วนบุคคล (right to restriction of
            processing)
            เจ้าของข้อมูลส่วนบุคคลมีสิทธิระงับการใช้ข้อมูลส่วนบุคคลของตนด้วยเหตุบางประการได้
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๖.๖ สิทธิในการให้โอนย้ายข้อมูลส่วนบุคคล (right to data portability)
            เจ้าของข้อมูลส่วนบุคคลมีสิทธิให้สถาบันโอนย้ายข้อมูลส่วนบุคคลซึ่งเจ้าของข้อมูลส่วนบุคคลได้ให้ไว้กับสถาบันไปยังผู้ควบคุมข้อมูลส่วนบุคคลรายอื่น
            หรือตัวเจ้าของข้อมูลส่วนบุคคลเองด้วยเหตุบางประการได้
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ๖.๗ สิทธิในการคัดค้านการประมวลผลข้อมูลส่วนบุคคล (right to object)
            เจ้าของข้อมูลส่วนบุคคลมีสิทธิคัดค้านการประมวลผลข้อมูลส่วนบุคคลของตนด้วยเหตุบางประการได้
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๗. การใช้คุ้กกี้ (Cookies)
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            การใช้บริการในรูปแบบอิเล็กทรอนิกส์ของสถาบัน
            อาจมีการใช้คุ้กกี้หรือเทคโนโลยีอื่นในลักษณะเดียวกัน
            เพื่อเพิ่มมาตรการด้านความมั่นคงปลอดภัย และสามารถรักษาค่าการใช้งาน
            (session) เมื่อมีการใช้บริการในรูปแบบอิเล็กทรอนิกส์ของสถาบัน
            รวมถึงช่วยจดจำข้อมูลเกี่ยวกับเบราว์เซอร์และการตั้งค่าของผู้ที่เข้าใช้บริการในรูปแบบอิเล็กทรอนิกส์ของสถาบันด้วย
            ซึ่งผู้ที่เข้าใช้บริการในรูปแบบอิเล็กทรอนิกส์ของสถาบันสามารถที่จะยอมรับหรือไม่ยอมรับคุกกี้ก็ได้
            โดยสามารถตั้งค่าหรือลบการใช้งานคุกกี้ได้ด้วยตนเองจากการตั้งค่าในเว็บเบราว์เซอร์
            (Web Browser)
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๘. การเปลี่ยนแปลงนโยบายคุ้มครองข้อมูลส่วนบุคคล
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            สถาบันมีสิทธิที่จะพิจารณาดำเนินการการปรับปรุงหรือเปลี่ยนแปลงนโยบายการคุ้มครองข้อมูลส่วนบุคคลนี้
            เพื่อให้นโยบายการคุ้มครองข้อมูลส่วนบุคคลสอดคล้องกับแนวปฏิบัติและกฎหมายที่เกี่ยวข้องกับการคุ้มครองข้อมูลส่วนบุคคล
            โดยสถาบันจะทำการแจ้งให้ทราบผ่านทางเว็บไซต์ของสถาบันหรือช่องทางอื่นใดที่สถาบันเห็นสมควร
          </Typography>

          <Typography variant="h5" gutterBottom>
            ๙. ช่องทางการติดต่อ
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            สถาบันสารสนเทศทรัพยากรน้ำ (องค์การมหาชน)
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            ที่อยู่ : เลขที่ ๙๐๑ ถนนงามวงศ์งาน แขวงลาดยาว เขตจตุจักร
            กรุงเทพมหานคร ๑๐๙๐๐
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            หมายเลขโทรศัพท์ : ๐ ๒๑๕๘ ๐๙๐๑
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            หมายเลขโทรสาร : ๐ ๒๑๕๘ ๐๙๑๐
          </Typography>
          <Typography variant="subtitle1" gutterBottom component="div">
            จดหมายอิเล็กทรอนิกส์ : dpo@hii.or.th
          </Typography>
        </DialogContent>

        <DialogActions
          p={3}
          display="flex"
          alignItems="center"
          justifyContent="end"
        >
          <Button variant="contained" color="error" onClick={handleCloseDialog}>
            {t("CANCEL")}
          </Button>
        </DialogActions>
      </DialogStyldMUI>
    </>
  );
}
