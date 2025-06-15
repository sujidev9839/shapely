import React, { useContext, useEffect, useState } from "react"
import { localStrings } from "../utils/Constants"
import { Card } from "react-bootstrap"
import ContactDetails from "../components/ContactDetails"
import { CallSchedulerContext } from "../context/CallSchedulerContext";
import { DateTime } from 'luxon';

function OnboardSteps() {
    const context = useContext(CallSchedulerContext);
    if (!context) {
        return;
    }
    const { bookedAppointment, timezone } = context;
    const [dateTime, setDateTime] = useState({
        time: "",
        date: ""
    })

    useEffect(() => {
        const userTimeZone = timezone;
        const parsed: any = bookedAppointment?.date
            ? DateTime.fromFormat(bookedAppointment?.date, "yyyy-MM-dd HH:mm:ss ZZZ", { zone: timezone })
            : "";

        if (!parsed.isValid) {
            console.error("Invalid date:", parsed.invalidExplanation);
        } else {
            const converted = parsed.setZone(userTimeZone);

            const timeStr = `${converted.toFormat("h:mm a")} (${converted.zoneName})`;
            const dateStr = converted.toFormat("cccc LLLL dd, yyyy");

            setDateTime({
                time: timeStr,
                date: dateStr
            });
        }
    }, [bookedAppointment]);
    return (
        <>
            <h1 className="!text-3xl mb-3 flex gap-2 !font-bold">
                {localStrings.EXCITED_TO_MEET.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </h1>
            <Card className="p-3 mb-4">
                {localStrings.STEPS("April 19, 2025 at 4:20 PM PST").map((step, index) => (
                    <div className={`flex items-start ${step.LIST ? "flex-wrap" : "gap-3"}`}>
                        <span className={`w-6 h-6 text-white text-sm rounded-full flex items-center justify-center ${step.LIST ? "me-3" : ""}`}
                            style={{ background: "#ff769a", flexShrink: 0 }}
                        >{index + 1}</span>
                        <h4 className="!text-lg">
                            <b className="!font-semibold pe-2">
                                {step.HEADING}
                            </b>
                            {step.SUBHEADING}
                        </h4>
                        {step.LIST ?
                            <ul className="w-full">
                                <li className="list-disc text-lg">
                                    Your appointment is scheduled for {dateTime?.date}{" "}{dateTime?.time}
                                </li>
                                <li className="list-disc text-lg">
                                    You'll receive a secure video link via email to join your video visit. Please join 5 minutes early to ensure everything is working properly.
                                </li>
                            </ul> : ""
                        }
                    </div>
                ))}
            </Card>
            <ContactDetails className="contactInfo" />
        </>
    )
}

export default OnboardSteps