import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
// import { CgSpinner } from "react-icons/cg";
import Spinner from "react-bootstrap/Spinner";

import OtpInput from "otp-input-react";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../services/firebase.config";
import { useDispatch, useSelector } from "react-redux";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import {
  loginSuccess,
  logoutSuccess,
  setOtpVerified,
} from "../redux/slices/authSlice";
import "./pages.css";
import { addUserDetails } from "../redux/slices/userDetailsSlice";
import { fetchUserDetails } from "../services/fetchUserDetails";
import { updateWallet } from "../redux/slices/walletSlice";

const Signin = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [username, setUsername] = useState("user");
  const [userType, setUserType] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      dispatch(loginSuccess(storedUser));
    }
  }, [dispatch]);

  const onCaptchVerify = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onRegister();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  };
  const onCheckAndSignin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/validate-user", {
        method: "POST",

        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ mobileNumber: ph }),
      });
      const data = await response.json();
      if (data.success) {
        onCaptchVerify();

        const appVerifier = window.recaptchaVerifier;

        const formatPh = "+" + ph;
        signInWithPhoneNumber(auth, formatPh, appVerifier)
          .then((confirmationResult) => {
            window.confirmationResult = confirmationResult;
            setLoading(false);
            setShowOTP(true);
            toast.success("OTP sent successfully!");
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      } else {
        setShowRegistrationForm(true);
      }
      setLoading(false);
    } catch {}
  };
  const onRegister = () => {
    console.log(ph, username, userType);
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    // setShowRegistrationForm(false);
  };
  const verifyAndCreateUser = () => {
    setLoading(true);
    onCaptchVerify();

    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        try {
          const currentDate = new Date(); // Get the current date and time
          const formattedDate = currentDate.toISOString(); // Format date as string
          if (userType === "customer") {
            const response = await fetch(
              "http://localhost:3001/api/register-user",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  mobileNumber: ph,
                  name: username,
                  userType: userType,
                  timeOfRegistration: formattedDate,
                }),
              }
            );

            const data = await response.json();
            console.log(data);
            if (data.success) {
              // User registered successfully, proceed with OTP verification

              dispatch(loginSuccess(res.user));
              const userInfo = await fetchUserDetails(res.user.phoneNumber);
              dispatch(setOtpVerified(true));
              dispatch(addUserDetails(userInfo));
              dispatch(updateWallet(data.newWallet));
            } else {
              // Registration failed, handle accordingly
              toast.error(data.message || "User registration failed.");
            }
          }
          if (userType === "business") {
            console.log("business");

            const response = await fetch(
              "http://localhost:3001/api/register-business",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                },
                body: JSON.stringify({
                  mobileNumber: ph,
                  name: username,
                  userType: userType,
                  timeOfRegistration: formattedDate,
                }),
              }
            );

            const data = await response.json();

            if (data.success) {
              // User registered successfully, proceed with OTP verification

              dispatch(loginSuccess(res.user));
              const userInfo = await fetchUserDetails(res.user.phoneNumber);
              dispatch(setOtpVerified(true));
              dispatch(addUserDetails(userInfo));
              dispatch(updateWallet(data.newWallet));
            } else {
              // Registration failed, handle accordingly
              toast.error(data.message || "User registration failed.");
            }
          }
          setLoading(false);
        } catch (error) {
          console.error("Error registering user:", error);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    setShowRegistrationForm(false);
  };

  const onOTPVerify = () => {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        dispatch(loginSuccess(res.user));
        const userInfo = await fetchUserDetails(res.user.phoneNumber);
        dispatch(setOtpVerified(true));

        dispatch(addUserDetails(userInfo));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleUsername = (e) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z\s]{5,20}$/.test(value);

    if (isValid) {
      setUsername(value);
    } else {
      toast.error(
        "Invalid input. It should be 5-20 letters without integers or special characters."
      );
    }
  };

  return (
    <section className="d-flex align-items-center justify-content-center min-vh-100">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>
        {!user && (
          <div className="w-100 d-flex flex-column gap-4 rounded-lg ">
            <h1 className="text-center text-secondary font-medium fs-3 mb-6">
              Sign In to Mana City
            </h1>
            {showOTP ? (
              <>
                {showRegistrationForm ? (
                  <>
                    <VerifyOtpToRegister
                      data={{ ph, otp, setOtp, verifyAndCreateUser, loading }}
                    />
                  </>
                ) : (
                  <>
                    <VerifyOtpToSignIn
                      data={{ ph, otp, setOtp, onOTPVerify, loading }}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                {showRegistrationForm ? (
                  <>
                    <RegistrationForm
                      data={{
                        ph,
                        handleUsername,
                        setUserType,
                        userType,
                        onRegister,
                        username,
                        loading,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <PhoneNumberInput
                      data={{ ph, setPh, onCheckAndSignin, loading }}
                    />
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Signin;

const VerifyOtpToRegister = ({ data }) => {
  const { ph, otp, setOtp, verifyAndCreateUser, loading } = data;
  return (
    <>
      <div className="bg-secondary text-white  mx-auto p-4 rounded-circle">
        <BsFillShieldLockFill size={30} />
      </div>
      <label htmlFor="otp" className="font-weight-bold text-xl text-center">
        Enter your OTP - {ph}
      </label>
      <OtpInput
        value={otp}
        onChange={setOtp}
        OTPLength={6}
        otpType="number"
        disabled={false}
        autoFocus
        className="opt-container"
      ></OtpInput>
      <button
        onClick={verifyAndCreateUser}
        className="bg-primary w-100 d-flex gap-1 align-items-center justify-content-center py-2 text-white rounded-1 border border-1"
      >
        {loading && <Spinner animation="border" size="sm" />}
        <span>Verify OTP</span>
      </button>
    </>
  );
};
const VerifyOtpToSignIn = ({ data }) => {
  const { ph, otp, setOtp, onOTPVerify, loading } = data;
  return (
    <>
      <div className="bg-secondary text-white  mx-auto p-4 rounded-circle">
        <BsFillShieldLockFill size={30} />
      </div>
      <label htmlFor="otp" className="font-weight-bold text-xl text-center">
        Enter OTP recieved on - {ph}
      </label>
      <OtpInput
        value={otp}
        onChange={setOtp}
        OTPLength={6}
        otpType="number"
        disabled={false}
        autoFocus
        className="opt-container"
      ></OtpInput>
      <button
        onClick={onOTPVerify}
        className="bg-primary w-100 d-flex gap-1 align-items-center justify-content-center py-2 text-white rounded-1 border border-1"
      >
        {loading && <Spinner animation="border" size="sm" />}
        <span>Verify OTP</span>
      </button>
    </>
  );
};

const RegistrationForm = ({ data }) => {
  const {
    ph,
    handleUsername,
    setUserType,
    userType,
    onRegister,
    username,
    loading,
  } = data;
  return (
    <>
      <div className="">
        <h4 className="text-center text-bg-secondary mb-2">{ph}</h4>
        <label htmlFor="" className="font-16 text-center mb-1">
          Enter your name :
        </label>
        <input
          type="text"
          placeholder="ex:surname fullname"
          className="form-control shadow-none mb-3"
          onBlur={handleUsername}
          required
        />
        <div className="d-flex align-items-center">
          <input
            id="isBusinessCheckBox"
            type="checkbox"
            className=" me-2"
            onChange={(e) =>
              setUserType(e.target.checked ? "business" : "customer")
            }
            checked={userType === "business"}
          />
          <label htmlFor="isBusinessCheckBox">Own a Shop/Business</label>
        </div>
      </div>
      <button
        onClick={onRegister}
        className="btn btn-primary d-flex align-items-center justify-content-center w-100  py-2 "
        disabled={username == "user"}
      >
        {loading && <Spinner animation="border" size="sm" />}
        <span>Send code via SMS</span>
      </button>
    </>
  );
};

const PhoneNumberInput = ({ data }) => {
  const { ph, setPh, onCheckAndSignin, loading } = data;
  return (
    <>
      <div className="bg-secondary text-white mx-auto p-4 rounded-circle">
        <BsTelephoneFill size={30} />
      </div>
      <label htmlFor="" className="font-weight-bold text-center">
        Verify your phone number
      </label>
      <PhoneInput country={"in"} value={ph} onChange={setPh} />
      <button
        onClick={onCheckAndSignin}
        className="bg-primary w-100 d-flex gap-1 align-items-center justify-content-center py-2 text-white rounded-1 border border-1"
        disabled={loading}
      >
        {loading && <Spinner animation="border" size="sm" />}
        <span>Send code via SMS</span>
      </button>
    </>
  );
};
