import React from "react";
import "./DeliverInfo.css";

const DeliveryInfo = ({ address, onAddressChange }) => {
  return (
    <div className="delivery_info_container">
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%" }}>
          <h3>DELIVERY INFO</h3>
        </div>
        <div>
          <label htmlFor="checkout-address">Delivery address*</label>
          <input id="checkout-address" name="address" className="input_style"
            type="text"
            placeholder="Street, building, apartment, city"
            value={address}
            onChange={onAddressChange}
            autoComplete="street-address"
            required
          />
          <p>We will deliver your order to this address.</p>
          <div style={{display: "flex"}}>
            <img src="https://online.kfc.co.in/static/media/WatchLater.3ca73ea2.svg" alt="" />
            <h4 style={{marginLeft: "20px"}}>ASAP</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryInfo;
