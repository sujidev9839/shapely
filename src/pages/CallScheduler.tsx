import { useContext } from "react";
import Logo from "../assets/images/logo.svg"
import DateTimeSelector from "./DateAndTimeSelector";
import OnboardSteps from "./OnboardSteps";
import UserInformation from "./UserInformation";
import { CallSchedulerContext } from "../context/CallSchedulerContext";

function CallScheduler() {
    const context = useContext(CallSchedulerContext);
    if (!context) {
        return;
    }

    const { step } = context;
    return (
        <div className="mainContainer w-full text-2xl max-h-screen">
            <img src={Logo} alt="Logo" className="h-8" />
            <div className="mt-4 text-start contentContainer w-[75%] mx-auto">
                {step === "dateTime" && <DateTimeSelector />}
                {step === "userInfo" && <UserInformation />}
                {step === "onboardSteps" && <OnboardSteps />}
            </div>
        </div>
    )
}

export default CallScheduler