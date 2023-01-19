import { server } from "@/constants";

export const ConvertDateTimeFormat = (props: any): JSX.Element => {
    try {
        const event: any = new Date(props.date);
        const options: any = {
            // weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        };

        if (event != "Invalid Date") {
            return event.toLocaleDateString(
                localStorage.getItem(server.LANGUAGE) === "th" ? "th" : "en-GB",
                options
            );
        } else {
            return props.date;
        }
    } catch (error) {
        console.log(error);
        return;
    }
};