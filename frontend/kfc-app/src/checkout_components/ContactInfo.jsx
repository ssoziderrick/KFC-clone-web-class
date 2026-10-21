import React from "react";

export const ContactInfo = ({ values, onChange }) => {
  return (
    <div className="delivery_info_container">
      <div style={{ display: "flex" }}>
        <div style={{ width: "40%" }}>
          <h3>CONTACT INFORMATION</h3>
        </div>
        <div style={{width: "60%"}}>
            <TextInput id="checkout-firstname" name="firstname" label="First name*" value={values.firstname} onChange={onChange} />
            <TextInput id="checkout-lastname" name="lastname" label="Last name*" value={values.lastname} onChange={onChange} />
            <TextInput id="checkout-email" name="email" type="email" label="Email*" value={values.email} onChange={onChange} />
            <TextInput id="checkout-phone" name="phone" type="tel" label="Phone number*" value={values.phone} onChange={onChange} />
          <div style={{ display: "flex", marginTop: "20px" }}>
          <input  type="checkbox" />
          <label style={{marginLeft: "10px"}} htmlFor="">
            I want to know about the cool stuff at KFC on Email & SMS (I know I
            can unsubscribe anytime).
          </label>
        </div>
        </div>
       
      </div>
    </div>
  );
};
function TextInput({ id, name, type = "text", label, value, onChange }) {
  return (
    <div className="input-container">
      <input id={id} name={name} type={type} value={value} onChange={onChange} autoComplete={name} required />
      <label className={value ? "filled" : ""} htmlFor={id}>{label}</label>
    </div>
  );
}

export default ContactInfo;
