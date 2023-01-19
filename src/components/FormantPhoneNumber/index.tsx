interface phoneNumber {
  phoneNumber: any;
}

export const PhoneNumberFormat = (props: phoneNumber): JSX.Element => {
  try {
    var cleaned = ("" + props.phoneNumber).replace(/\D/g, "");
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    var match2 = cleaned.match(/^(\d{1})(\d{4})(\d{4})$/);

    if (match) {
      const match_data: any = [match[1], "-", match[2], "-", match[3]].join("");
      return match_data;
    } else if (match2) {
      const match_data: any = [match2[1], "-", match2[2], "-", match2[3]].join(
        ""
      );
      return match_data;
    } else {
      return props.phoneNumber;
    }
  } catch (error) {
    console.log(error);
    return;
  }
};
