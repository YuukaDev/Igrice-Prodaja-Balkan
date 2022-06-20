import { useState } from "react";
import commerce from "../../lib/commerce";
import useShop from "../../utils/StoreContext";
import CheckoutItems from "./CheckoutItems";
import { PayPalButtons } from "@paypal/react-paypal-js";
import Spinner from "../../components/Spinner/Spinner";

export default function CheckoutForm({ token, loading, paymentID }) {
  const { line_items, subtotal } = useShop();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [paidFor, setPaidFor] = useState(false);
  const isEmpty = line_items.length === 0;
  const value = token.live?.total.raw;

  if (isEmpty) {
    return <div>Your cart is empty go shop!</div>;
  }

  if (paidFor) {
    alert("Thank you for your purchase!");
  }

  if (error) {
    console.log("error", error);
  }

  const handleApprove = (orderID, paymentID) => {
    setPaidFor(true);
  };

  const captureCheckout = (payerID) => {
    commerce.checkout
      .capture(token.id, {
        customer: {
          firstname: "John",
          lastname: "Doe",
          email: "buyer@example.com",
        },
        shipping: {
          name: "John Doe",
          country: "US",
          street: "123 Fake St",
          town_city: "San Francisco",
          county_state: "CA",
          postal_zip_code: "94103",
        },
        fulfillment: {
          shipping_method: "ship_7RyWOwmK5nEa2V",
        },
        billing: {
          name: "John Doe",
          country: "US",
          street: "123 Fake St",
          town_city: "San Francisco",
          county_state: "CA",
          postal_zip_code: 94103,
        },
        payment: {
          gateway: "paypal",
          paypal: {
            action: "capture",
            payment_id: paymentID,
            payer_id: payerID,
          },
        },
      })
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (loading) {
    return <Spinner loading={loading} />;
  }

  return (
    <div className="flex justify-center items-center gap-20 mt-32">
      <form className="w-full max-w-lg" onSubmit={captureCheckout}>
        <h1 className="mb-5 text-lg tracking-wide">Billing adress</h1>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block tracking-wide text-gray-700 text-xs font-semibold mb-3"
              htmlFor="grid-first-name"
            >
              Full Name
            </label>
            <input
              required
              className="w-full bg-gray-100 text-gray-500 border-2 border-logoGreen rounded py-3 px-4 mb-3 focus:outline-none"
              id="grid-first-name"
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block tracking-wide text-gray-700 text-xs font-semibold mb-3"
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            <input
              required
              className="w-full bg-gray-100 text-gray-500 border-2 border-logoGreen rounded py-3 px-4 mb-3 focus:outline-none"
              id="grid-last-name"
              type="text"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="w-full px-3">
            <label
              className="block tracking-wide text-gray-700 text-xs font-semibold mb-3"
              htmlFor="email-adress"
            >
              Email adress
            </label>
            <input
              required
              className="w-full bg-gray-100 text-gray-500 border-2 border-logoGreen rounded py-3 px-4 mb-3 focus:outline-none"
              id="email-adress"
              type="text"
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <PayPalButtons
          onClick={(data, actions) => {
            const hasAlreadyBoughtCourse = false;
            if (hasAlreadyBoughtCourse) {
              setError("You Already bough this course");
              return actions.reject();
            } else {
              actions.resolve();
            }
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: value,
                  },
                },
              ],
            });
          }}
          onApprove={(data, action) => {
            captureCheckout(data?.payerID);
            handleApprove(data.orderID);
          }}
          onCancel={() => {}}
          onError={(err) => {
            setError(err);
            console.log("PayPal Checkout onError", err);
          }}
        />
      </form>
    </div>
  );
}

