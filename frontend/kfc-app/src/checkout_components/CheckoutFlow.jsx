import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import RightSide from "../cart_components/RightSide";
import { getCart } from "../redux/action";
import api from "../utils/api";
import ContactInfo from "./ContactInfo";
import DeliveryInfo from "./DeliveryInfo";
import DeliveryOpt from "./DeliveryOpt";
import "./Checkout.css";

const CheckoutFlow = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    instructions: "",
  });
  const [donation, setDonation] = useState(0);
  const [loadingCart, setLoadingCart] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    let active = true;
    api.get("/api/productcart/cart")
      .then(({ data }) => {
        if (active) dispatch(getCart(Array.isArray(data) ? data : data.items || []));
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || "Could not load your cart.");
      })
      .finally(() => {
        if (active) setLoadingCart(false);
      });

    return () => {
      active = false;
    };
  }, [dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loadingCart || submitting || !cart.length) return;

    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post("/api/orders", { ...form, donation });
      setOrder(data.order);
      dispatch(getCart([]));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout_container">
      <h1>CHECKOUT</h1>
      {order ? (
        <section role="status" aria-live="polite">
          <h2>Order received</h2>
          <p>Order number: {order.id}</p>
          <p>Total: {order.currency} {order.total}</p>
          <p>Payment method: Cash on delivery</p>
          <Link to="/menu">Continue ordering</Link>
        </section>
      ) : (
        <>
          {loadingCart && <p>Loading your cart...</p>}
          {error && <p role="alert">{error}</p>}
          {!loadingCart && !cart.length && (
            <p>Your cart is empty. <Link to="/menu">Browse the menu</Link></p>
          )}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(17rem, 0.75fr)", gap: "2rem", alignItems: "start" }}>
              <div>
                <ContactInfo values={form} onChange={handleChange} />
                <DeliveryInfo address={form.address} onAddressChange={handleChange} />
                <DeliveryOpt instructions={form.instructions} onInstructionsChange={handleChange} />
              </div>
              <div>
                <RightSide onDonationChange={setDonation} submitting={submitting || loadingCart} />
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CheckoutFlow;