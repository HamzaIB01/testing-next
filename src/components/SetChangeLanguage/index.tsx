import { server } from "@/constants";

export default function SetChangeLanguage({ props }: any) {

    console.log("SetChangeLanguage " + props.th);

    return (
        <>

        </>
    );

    // export const Seti18nextLng = (props: any) => {
    // try {

    //     console.log("Seti18nextLng " + props);



    //     // const event: any = new Date(props.date);
    //     // const options: any = {
    //     //     // weekday: "long",
    //     //     year: "numeric",
    //     //     month: "long",
    //     //     day: "numeric"
    //     // };

    //     // if (event != "Invalid Date") {
    //     //     return event.toLocaleDateString(
    //     //         localStorage.getItem(server.LANGUAGE) === "th" ? "th" : "en-GB",
    //     //         options
    //     //     );
    //     // } else {
    //     //     return props.date;
    //     // }
    // } catch (error) {
    //     console.log(error);
    //     return;
    // }
};