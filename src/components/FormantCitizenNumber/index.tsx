interface CitizenNumber {
  citizenNumber: any;
}

export const CitizenNumberFormat = (props: CitizenNumber): JSX.Element => {
  try {
    const cleaned = ("" + props.citizenNumber).replace(/\D/g, "");
    const match = cleaned.match(/^(\d{1})(\d{4})(\d{5})(\d{2})(\d{1})$/);
    if (match) {
      // return [match[1], ' ', match[2], ' ', match[3], ' ', match[4], ' ', match[5]].join('');
      return props.citizenNumber;
    }

    return props.citizenNumber;
  } catch (error) {
    console.log(error);
    return;
  }
};
