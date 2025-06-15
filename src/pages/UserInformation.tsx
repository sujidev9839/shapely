
import { Card, Col, Container, Form, Row } from "react-bootstrap"
import { localStrings, userInfoInputList } from "../utils/Constants"
import { BiCalendarAlt } from "react-icons/bi";
import ButtonComponent from "../components/Button";
import { CiCircleQuestion } from "react-icons/ci";
import { LuPartyPopper } from "react-icons/lu";
import { FaCheck } from "react-icons/fa6";
import ContactDetails from "../components/ContactDetails";
import { CallSchedulerContext } from "../context/CallSchedulerContext";
import { useContext, useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import {
    useMutation,
    gql,
    useQuery
}
    from "@apollo/client";
import { DateTime } from 'luxon';
import { validateAllFields } from "../utils/validateAllFields";
import useAppointmentTypes from "../hooks/useAppointmentTypes";
import { useElements, useStripe, CardElement } from "@stripe/react-stripe-js";
import Skeleton from "react-loading-skeleton";

const COMPLETE_BOOKING = gql`
  mutation completeCheckout(
    $appointment_location_id: String,
    $appointment_type_id: String,
    $contact_type: String,
    $date: String,
    $first_name: String,
    $last_name: String,
    $email: String,
    $phone_number: String,
    $provider_id: String,
    $timezone: String,
    $offering_id: String,
    $token: String
  ) {
    completeCheckout(
      input: {
        appointment_location_id: $appointment_location_id,
        appointment_type_id: $appointment_type_id,
        contact_type: $contact_type,
        date: $date,
        timezone: $timezone,
        first_name: $first_name,
        last_name: $last_name,
        email: $email,
        phone_number: $phone_number,
        provider_id: $provider_id,
        offering_id: $offering_id,
        token: $token
      }
    ) {
      appointment {
        provider {
          id
          full_name
        }
        id
        date
        start
        end
        location
        contact_type
        add_to_gcal_link
        appointment_type {
          id
          name
          length
        }
      }
      messages {
        field
        message
      }
    }
  }
`;

export const GET_OFFERING_DETAILS = gql`
  query GetOfferingDetails($offering_id: ID!) {
    offering(id: $offering_id) {
     id
      name
      price
      currency
      description
      repeat_times
      can_be_gifted
      first_time_payment
      offering_image_url
      frequency_times_string
      billing_frequency
      ask_for_cc
      video_url
      show_offering
      show_price
      includes_ended_fixed_course
      under_purchase_cap
      embed_question_form_id
      living_plate_meal_plan_name
      visibility_status
      charge_immediately
      initial_payment_amount
      initial_price_with_taxes
      offering_lab_options {
        id
        # Add more fields if needed
      }
      offering_courses {
        id
        # Add more fields if needed
      }
      offering_includes {
        id
        quantity
        is_repeating
        required_appointment_type
        appointment_type {
          id
          name
          clients_can_book
        }
      }
      offering_products {
        id
        # Add more fields if needed
      }
    }
  }
`;


const validationRules = {
    email: { required: true, type: 'email' },
    first_name: { required: true, minLength: 3 },
    last_name: { required: true, minLength: 3 },
    phone_number: { required: true, minLength: 10 }
};

function UserInformation() {
    const [formData, setFormData] = useState<any>({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: ""
    })
    const [loading, setLoading] = useState(false)
    const [dateTime, setDateTime] = useState({
        time: "",
        date: ""
    })
    const [errors, setErrors] = useState<any>({
        first_name: false,
        last_name: false,
        email: false,
        phone_number: false
    })
    const stripe: any = useStripe();
    const elements: any = useElements();
    const context = useContext(CallSchedulerContext);
    if (!context) {
        return;
    }
    const { setStep, selectedSlots, setBookedAppointment, timezone, provider_id, first_name, last_name, email, phone_number, offering_id } = context;

    const { appointmentType } = useAppointmentTypes(provider_id);

    useEffect(() => {
        const userTimeZone = timezone;
        const parsed: any = selectedSlots?.date
            ? DateTime.fromFormat(selectedSlots?.date, "yyyy-MM-dd HH:mm:ss ZZZ", { zone: timezone })
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
    }, [selectedSlots]);

    const { data: offerId, loading: offeringLoading } = useQuery(GET_OFFERING_DETAILS, {
        variables: { offering_id },
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: false })
    };


    const [completeBooking] = useMutation(COMPLETE_BOOKING);

    const submitForm = async () => {
        const newErrors = validateAllFields(formData, validationRules);
        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) {
            return;
        }
        setLoading(true)
        const cardElement = elements.getElement(CardElement);
        const { token } = await stripe.createToken(cardElement);

        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: `${formData.first_name} ${formData.last_name}`,
                email: formData.email,
                phone: formData.phone_number,
            },
        });

        if (result?.error) {
            setLoading(false)
            alert(result?.error?.message)
            return;
        }
        const slot = selectedSlots;
        const convertedValues = {
            ...formData,
            date: slot?.date,
            provider_id: slot?.user_id,
            appointment_type_id: appointmentType?.id,
            contact_type: appointmentType?.available_contact_types[0],
            timezone: timezone,
            offering_id: offering_id,
            token: "tok_visa"
        };

        try {
            const { data } = await completeBooking({
                variables: convertedValues,
                context: { noAuth: true }
            });

            const payload = data?.completeCheckout;

            if (!payload?.messages && payload?.appointment) {
                setBookedAppointment(payload.appointment);
                setStep("onboardSteps")
                return;
            } else {
                const error = payload?.messages ? payload.messages[0] : null;
                if (error?.message) {
                    alert(error.message);
                    return;
                } else {
                    alert(payload?.messages);
                    return;
                }
            }
        } catch (error) {
            alert("Booking failed. Please try again.");
            console.error("Booking error:", error);
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        setFormData({
            first_name: first_name ?? "",
            last_name: last_name ?? "",
            email: email ?? "",
            phone_number: phone_number ?? ""
        })
    }, [first_name, last_name, email, phone_number])

    return (
        <>
            <h1 className="!text-3xl mb-3 flex gap-2 !font-bold">
                <span className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer mt-1 bg-white shadow-md"
                    onClick={() => setStep("dateTime")}
                >
                    <IoIosArrowBack className="text-xl" />
                </span>
                {localStrings.CONFIRM_YOUR_INFO}</h1>
            <Container>
                <Row className="userInfo">
                    <Col>
                        <Card className="p-3 mb-3 flex !rounded-lg !flex-row gap-3">
                            <div className="w-8 h-8 rounded-md flex justify-center items-center" style={{ background: "#eceaed" }}>
                                <BiCalendarAlt className="text-lg" />
                            </div>
                            <div>
                                <h4 className="!font-semibold">
                                    {localStrings.APPOINTMENT}
                                </h4>
                                <h6 className="mb-1">{dateTime?.time}</h6>
                                <h6>{dateTime?.date}</h6>
                            </div>
                        </Card>
                        <Card>
                            <h4 className="!font-semibold p-3 pb-0 mb-0">
                                {localStrings.YOUR_INFO}
                            </h4>
                            <Form className="px-3 pt-2 pb-0">
                                <Row>
                                    {userInfoInputList.map((userInput) => (
                                        <Col md={6} key={userInput.name}>
                                            <Form.Group className="mb-2" controlId={userInput.name}>
                                                <Form.Label className="text-base" style={{ marginBottom: "2px" }}>{userInput.label}</Form.Label>
                                                <Form.Control value={formData[userInput.name]} style={{ border: errors[userInput.name] ? "1px solid #aa182c" : "" }} type={userInput.type} onChange={(e) => handleChange(e)} name={userInput.name} />
                                            </Form.Group>
                                            {errors[userInput.name] &&
                                                <div>
                                                    <p className="text-base" style={{ color: "#aa182c" }}>{errors[userInput.name]}</p>
                                                </div>}
                                        </Col>
                                    ))}
                                </Row>
                            </Form>
                            <hr className="mb-0" />
                            <div className="paymentInfo p-3">
                                <h4 className="!font-semibold flex">{localStrings.PAYMENT_INFO}
                                    <CiCircleQuestion className="text-lg ms-2" />
                                </h4>
                                <CardElement className="stripeElement" />
                                <Col className="flex justify-center mb-3">
                                    <ButtonComponent loading={loading} disabled={loading} buttonText={localStrings.SIGN_UP} handleButtonClick={submitForm} className="border-0 mx-auto px-5 min-h-12" style={{ background: "#ff769a", borderRadius: "100px" }} />
                                </Col>
                                <Col className="gap-2 flex lg:ms-20 md:ms-20 sm:ms-0">
                                    <span className="text-sm border-r pe-2" style={{ color: "#999" }}>
                                        {localStrings.POWERED_BY}
                                        <b className="ps-1">{localStrings.STRIPE}</b>
                                    </span>
                                    <a href="https://www.getshapely.com/terms-of-use" target="_blank" className="text-sm !font-normal pe-2 border-r" style={{ color: "#999" }}>
                                        {localStrings.TERMS}
                                    </a>
                                    <a href="https://www.getshapely.com/privacy-policy" target="_blank" className="text-sm !font-normal" style={{ color: "#999" }}>
                                        {localStrings.PRIVACY}
                                    </a>
                                </Col>
                            </div>
                        </Card>
                    </Col>
                    <Col>
                        {offeringLoading ?
                            <Skeleton height={"100%"} width={"100%"} borderRadius={8} /> :
                            <Card className="p-3 text-center mb-4 membershipCard">
                                <h4 className="!font-semibold mb-4 flex gap-3 justify-center">
                                    <LuPartyPopper />
                                    {localStrings.MEMBERSHIP}
                                </h4>
                                <span className="text-2xl mb-4">
                                    <span className="pe-2 !font-semibold">
                                        Just ${Math.round(offerId?.offering?.first_time_payment)} for the first month -
                                    </span>
                                    then ${Math.round(offerId?.offering?.price)}/month
                                </span>
                                <ul>
                                    {localStrings.MEMBERSHIP_BENEFITS.map((benefit) =>
                                        <li className="text-start text-lg font-medium flex gap-3 mb-2" key={benefit}>
                                            <span className="w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center"
                                                style={{ background: "#ff769a" }}
                                            ><FaCheck className="text-base" style={{ color: "#fff" }} /></span>
                                            {benefit}
                                        </li>)}
                                </ul>
                            </Card>}
                        <ContactDetails className="desktopView" />
                    </Col>
                </Row>
                <ContactDetails className="mobileView" />
            </Container>
        </>
    )
}

export default UserInformation