const verifyCaptcha = async (req, res) => {
  if (req.method !== "POST") {
    // If the request method is not POST, return a 405 Method Not Allowed response
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { reCaptchaToken } = req.body;

  if (!reCaptchaToken) {
    // If the reCaptchaToken is missing, return a 400 Bad Request response
    return res.status(400).json({ message: "ReCaptcha Token is missing" });
  }

  let verified = false;
  let responseError = null;

  //   const queryParams = new URLSearchParams({
  //     secret: process.env.gReCaptchaVerificationKey, // Use process.env to access environment variables
  //     response: reCaptchaToken
  //   });

  //   const apiUrlWithParams = `${CAPTCHA_VERIFICATION_URL}?${queryParams.toString()}`;

  try {
    const requestOptions = {
      method: "post"
    };

    const response = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?response=${reCaptchaToken}&secret=${"6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"}`,
      requestOptions
    );

    const responseBody = await response.json();
    console.log("===========================responseBody", responseBody);

    verified = Boolean(responseBody?.success) || false;

    if (responseBody?.success && responseBody["error-codes"]) {
      const errorCodes = responseBody["error-codes"].toString();
      console.log("===========================errorCodes", errorCodes);
      responseError = responseBody;
    }
    console.log("===========================verified", verified);
  } catch (err) {
    // Handle the error, if needed
    console.log("Error", err);
    responseError = err;
  }

  // Return a JSON response with the verified flag
  res.json({ verified, responseError });
};
export default verifyCaptcha;
