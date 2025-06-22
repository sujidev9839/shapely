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
    
      const parsed = bookedAppointment?.date
        ? DateTime.fromFormat(bookedAppointment.date, "yyyy-MM-dd HH:mm:ss ZZZ", { setZone: true })
        : null;
    
      if (!parsed?.isValid) {
        console.error("Invalid date:", parsed?.invalidExplanation);
        return;
      }
    
      const converted = parsed.setZone(userTimeZone);
      const zoneMap: Record<string, string> = {
        "America/Anchorage": "AKDT",  // Alaska Daylight Time
        "America/Chicago": "CDT",     // Central Daylight Time
        "America/Phoenix": "MST",     // Mountain Standard Time (no DST)
        "America/Los_Angeles": "PDT", // Pacific Daylight Time
        "America/Denver": "MDT",      // Mountain Daylight Time
        "America/New_York": "EDT",    // Eastern Daylight Time
        "Pacific/Honolulu": "HST",    // Hawaii Standard Time (no DST)
        "America/Boise": "MDT",
        "America/Indiana/Indianapolis": "EDT",
        "America/Kentucky/Louisville": "EDT",
        "America/Detroit": "EDT",
        "Asia/Kolkata": "IST" // India Standard Time
      };
    
      const abbr = zoneMap[userTimeZone] || converted.offsetNameShort || converted.toFormat("ZZ");
    
      const timeStr = `${converted.toFormat("h:mm a")} (${abbr})`;
      const dateStr = converted.toFormat("cccc LLLL dd, yyyy");
    
      setDateTime({
        time: timeStr,
        date: dateStr
      });
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
                    <div className={`flex items-start ${step.LIST ? "flex-wrap" : "gap-3"}`} key={index}>
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
                                    Your appointment is scheduled for <b>{dateTime?.date}{" "}{dateTime?.time}</b>
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