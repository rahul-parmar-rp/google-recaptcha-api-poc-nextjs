import React, { useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";
// automation test keys by google
// Site key: 6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
// Secret key: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

async function clientSideVerify(captchaCode) {
  const requestOptions = {
    method: "post"
  };

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?response=${captchaCode}&secret=${"6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"}`,
    requestOptions
  );

  const t = response.json();
  console.log(t);
}

function serverSideVerify(captchaCode) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reCaptchaToken: captchaCode })
  };

  // fetch("http://localhost:3000/api/verify-captcha", requestOptions)
  fetch(`${window.origin}/api/verify-captcha`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data?.verified); // true or false
      if (data?.verified) {
        alert("captcha verified");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const recaptchaRef = React.useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onCaptchaChange = async (captchaCode) => {
    console.log("recaptcha token", captchaCode);
    // recaptchaRef.current.reset();
    // clientSideVerify(captchaCode);
    serverSideVerify(captchaCode);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can perform some action with the form data here
    recaptchaRef.current.execute();
  };

  return (
    <div>
      <h2>Simple Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Submit</button>
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
          onChange={onCaptchaChange}
        />
      </form>
    </div>
  );
};
export default SimpleForm;
