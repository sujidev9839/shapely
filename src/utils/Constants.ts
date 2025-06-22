export const localStrings = {
    GREET_MEET_YOUR_SHAPELY_PROVIDER: "Great! Let's get you scheduled to meet with your Shapely provider!",
    WHAT_TIME_WORKS_BEST: "What time works best for your video session?",
    SELECT_DATE_TIME: "Select Date and Time",
    TIMEZONE: "Timezone:",
    MORNING: "Morning",
    AFTERNOON: "Afternoon",
    EVENING: "Evening",
    NO_AVAILABLE_SLOTS: "No available time slots",
    SELECT_ANOTHER_DATE: "Select another date or try other options:",
    GO_TO_NEXT_AVAILABILITY: "Go to next availability",
    CONFIRM_DATE_TIME: "Confirm Date and Time",
    CONFIRM_YOUR_INFO: "Awesome! Let's confirm your information to complete your sign-up",
    APPOINTMENT: "Appointment",
    YOUR_INFO: "Your Information",
    FIRST_NAME: "First Name",
    LAST_TIME: "Last Name",
    EMAIL: "Email",
    PHONE_NUMBER: "Phone Number",
    PAYMENT_INFO: "Payment Information",
    CARD_NUMBER: "Card number",
    EXPIRY_DATE: "Expiry Date",
    SIGN_UP: "Sign Up",
    POWERED_BY: "Powered by",
    STRIPE: "Stripe",
    TERMS: "Terms",
    PRIVACY: "Privacy",
    MEMBERSHIP: "Your Shapely Membership",
    JUST_ONE_MONTH: "Just $49 for the first month -",
    THEN_99_MONTH: "then $99/month",
    MEMBERSHIP_BENEFITS: ["Monthly video visits with provider", "Affordable access to weight loss medications", "App and provide chat"],
    ANY_QUESTIONS: "Any questions?",
    HERE_TO_HELP: "We're here to help!",
    CALL_US: "Call us at :",
    NUMBER: "(424) 600-8360",
    EMAIL_US_AT: "Email us at :",
    EMAIL_ID: "hello@getshapely.com",
    EXCITED_TO_MEET: `You're all set! We're excited to meet you for your first visit!\n Here are next steps:`,
    STEPS: (date: string) => [
        {
            HEADING: "Sign in to your Healthie account",
            SUBHEADING: "with the email you just received. We use Healthie as our secure patient portal."
        },
        {
            HEADING: "Complete the questionnaire and consent forms before your first visit.",
            SUBHEADING: "This will allow for a smooth and easy visit with your Shapely provider."
        },
        {
            HEADING: "Get ready for your video visit!",
            LIST: [`Your appointment is scheduled for ${date}`, "You'll receive a secure video link via email to join your video visit. Please join 5 minutes early to ensure everything is working properly."]
        },
    ],
    SELECT_APPOINTMENT_TYPE: "Select Appointment Type"
}

export const userInfoInputList = [
    {
        label: localStrings.FIRST_NAME,
        name: "first_name",
        type: "text"
    },
    {
        label: localStrings.LAST_TIME,
        name: "last_name",
        type: "text"
    },
    {
        label: localStrings.EMAIL,
        name: "email",
        type: "email"
    },
    {
        label: localStrings.PHONE_NUMBER,
        name: "phone_number",
        type: "text"
    },
]