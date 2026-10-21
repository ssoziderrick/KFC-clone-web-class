import React, { useState } from "react";

const DeliveryOpt = ({ instructions, onInstructionsChange }) => {
  const [show, setShow] = useState(false);

  const handleClickTrue = () => {
    setShow(true);
  };
  const handleClickFalse = () => {
    setShow(false);
  };
  return (
    <div className="delivery_info_container">
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%" }}>
          <h3>DELIVERY OPTIONS</h3>
        </div>
        <div style={{ width: "60%" }}>
          <div style={{ display: "flex" }}>
            <input id="leave-at-door" name="leaveit" type="radio" onChange={handleClickFalse} />
            <label style={{marginLeft: "10px"}} htmlFor="leave-at-door">
              Leave at my door
            </label>
          </div>
          <p>
            To protect you and our team, we practice contactless delivery. Your
            driver will leave the order at your door, knock, step away, and wait
            at a safe distance for you to collect your food.
          </p>
          <div style={{ display: "flex" }}>
            <input id="hand-it-to-me" type="radio" onChange={handleClickTrue} name="leaveit" />
            <label style={{marginLeft: "10px"}} htmlFor="hand-it-to-me">Hand it to me</label>
          </div>
          <hr />
          {show ? (
            <input
              className="jaduInput"
              value={instructions}
              onChange={onInstructionsChange}
              name="instructions"
              type="text"
              placeholder="Delivery instructions (optional)"
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryOpt;
