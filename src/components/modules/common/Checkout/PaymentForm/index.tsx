/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import MyButton from "@/components/ui/MyButton/MyButton";
import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { Copy, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type TPaymentFormProps = {
  handleNextStep: (paymentMethodId: string) => Promise<void>;
};

const PaymentForm = ({
  handleNextStep,
}: TPaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardHolderName, setCardHolderName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
console.log("hello");
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe is not initialized.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);
    if (!cardElement) {
      setError("Card details not entered.");
      setLoading(false);
      return;
    }

    // Create a PaymentMethod
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name: cardHolderName },
    });

    if (error) {
      setError(error.message as string);
      setLoading(false);
    } else {
      if (paymentMethod && paymentMethod.id) {
        setPaymentMethodId(paymentMethod?.id);
        if (paymentMethod?.id) {
          handleNextStep(paymentMethod.id);
        }
      }
      // Reset form fields after successful payment
      setCardHolderName("");
      cardElement.clear();
      elements.getElement(CardExpiryElement)?.clear();
      elements.getElement(CardCvcElement)?.clear();

      // console.log('PaymentMethod Created:', paymentMethod);
      setLoading(false);
      // Send paymentMethod.id to your backend for further processing
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 md:gap-6">
      <div className=" flex flex-col gap-3">
        <label className="block font-semibold">Cardholder Name</label>
        <input
          type="text"
          value={cardHolderName}
          // defaultValue={"Mahdi Hasan"}
          onChange={(e) => setCardHolderName(e.target.value)}
          className="w-full border p-[12px] rounded-md"
          placeholder="John Doe"
          required
        />
      </div>

      <div className=" flex flex-col gap-3">
        <label className="block font-semibold">Card Number</label>
        <div className="flex items-center gap-2">
          <span>Test: 4242 4242 4242 4242</span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText("4242 4242 4242 4242");
              toast.info("Copied to clipboard");
            }}
            className="text-primary underline"
          >
            <Copy className="h-5 w-5" />
          </button>
        </div>
        <div className="border p-4 rounded-md">
          <CardNumberElement className="w-full" />
        </div>
      </div>

      <div className="flex gap-3">
        <div className="w-1/2 flex flex-col gap-3">
          <label className="block font-semibold">Expiry Date</label>
          <div className="border p-4 rounded-md">
            <CardExpiryElement className="w-full" />
          </div>
        </div>

        <div className="w-1/2 flex flex-col gap-3">
          <label className="block font-semibold">CVV</label>
          <div className="border p-4 rounded-md">
            <CardCvcElement className="w-full" />
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {/* Security Note */}
      <div className="flex justify-between items-center">
        <div className="flex-1 flex items-center space-x-2 text-sm text-gray-600">
          <Lock className="w-4 h-4" />
          <span>Secure payment processing</span>
        </div>

        {/* Complete Payment Button */}
        <div className="flex items-center justify-center">
          <MyButton type="submit" label="Complete Payment" isArrow />
        </div>
      </div>

      {/* {paymentMethodId && (
        <p className="text-green-500 mt-2">
          Payment Method Created: {paymentMethodId}
        </p>
      )} */}
    </form>
  );
};

export default PaymentForm;
