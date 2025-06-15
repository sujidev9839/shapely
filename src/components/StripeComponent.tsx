import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ onSubmit }: any) => {
    const stripe: any = useStripe();
    const elements: any = useElements();

    const handleSubmit = async (event: any) => {
        event.preventDefault();

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            throw new Error("Card element not found");
        }

        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: "card",
            card: cardElement, 
        });

        console.log(paymentMethod)


        if (error) {
            console.error(error);
        } else {
            onSubmit(paymentMethod.id);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit">Pay $15</button>
        </form>
    );
};

export default CheckoutForm