import { localStrings } from "../utils/Constants";
import { IoIosCall } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";

function ContactDetails(props:any) {
    return (
        <div className={`ms-3 flex flex-col ${props.className}`}>
            <span className="text-lg">
                <span className="pe-2 !font-semibold">
                    {localStrings.ANY_QUESTIONS}
                </span>
                {localStrings.HERE_TO_HELP}
            </span>
            <span className="text-lg flex items-center gap-2">
                <IoIosCall />
                <span>
                    {localStrings.CALL_US}
                </span>
                <a href={`tel:${localStrings.NUMBER}`} className="!text-[#212529] text-lg !font-normal">
                {localStrings.NUMBER}
                </a>
            </span>
            <span className="text-lg flex items-center gap-2">
                <MdOutlineEmail />
                <span>
                    {localStrings.EMAIL_US_AT}
                </span>
                <a href={`mailto:${localStrings.EMAIL_ID}`} className="!text-[#212529] text-lg !font-normal">
                {localStrings.EMAIL_ID}
                </a>
            </span>
        </div>
    )
}

export default ContactDetails