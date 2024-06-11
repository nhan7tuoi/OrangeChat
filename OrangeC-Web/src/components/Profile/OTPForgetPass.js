import React, { useEffect, useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import i18next from "../../i18n/i18n";
import authApi from "../../apis/authApi"; // Ensure this is correctly imported

const { Text, Title } = Typography;

export default function OTPForgetPass() {
  const navigate = useNavigate();
  const location = useLocation();

  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [txtCode, setTxtCode] = useState("");
  const [isConfirm, setIsConfirm] = useState(false);

  const valuesPass = location.state?.valuesPass;
  const code = location.state?.code;

  useEffect(() => {
    if (txtCode.length === 6) {
      setIsConfirm(true);
    } else {
      setIsConfirm(false);
    }
  }, [txtCode]);

  const handlePass = async () => {
    try {
      // Assuming email was passed from the previous component
      console.log("aaaaaaaaaa");
      navigate("/newpass");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  useEffect(() => {
    let interval;
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setIsResendEnabled(true);
    }

    return () => clearInterval(interval);
  }, [countdown]);

  const handleResend = async () => {
    setIsResendEnabled(false);
    setCountdown(60);

    // Resend OTP API call
    try {
      const response = await authApi.resendOTP({ email: valuesPass.email });
      if (response.message === "ok") {
        alert(i18next.t("otpDaDuocGuiLai"));
      } else {
        alert(i18next.t("guiLaiOtpThatBai"));
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div style={{ background: "#1D1D1D", width: "100vw", height: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          to="/welcome"
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#F24E1E",
            padding: 50,
            textDecoration: "none",
          }}
        >
          OrangeC
        </Link>
        <Link
          to="/"
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#FFF",
            padding: 50,
            textDecoration: "none",
          }}
        >
          {i18next.t("dangNhap")}
        </Link>
      </header>

      <div style={{ padding: 80 }}>
        <Row justify="center" style={{ width: "100%" }}>
          <Col span={14} style={{ alignItems: "center" }}>
            <img
              src="./images/Hello.svg"
              alt="Hello"
              style={{ height: "600px", width: "100%" }}
            />
          </Col>

          <Col span={8} style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Title
                style={{
                  color: "#FFFFFF",
                  textAlign: "center",
                  fontWeight: "800",
                  fontSize: 22,
                }}
              >
                {i18next.t("Đã gửi OTP đến email !")}
              </Title>

              <Text style={{ color: "white", marginTop: "30px" }}>
                {i18next.t("Nhập OTP")}
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <input
                  name="verifi"
                  type="text"
                  style={{
                    backgroundColor: "#2E2E2E",
                    width: "80%",
                    height: "60px",
                    borderRadius: "10px",
                    marginTop: "30px",
                    fontSize: "18px",
                    padding: "15px",
                    color: "#FFF",
                    textAlign: "center",
                  }}
                  value={txtCode}
                  onChange={(e) => setTxtCode(e.target.value)}
                />
              </div>

              <Row justify="center" style={{ width: "100%" }}>
                <Col
                  span={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    disabled={!isConfirm}
                    style={{
                      width: "80%",
                      height: "60px",
                      fontSize: "24px",
                      color: "#FFFFFF",
                      backgroundColor: isConfirm ? "#F24E1E" : "gray",
                      borderColor: "#F24E1E",
                      marginTop: "100px",
                      fontWeight: "600",
                    }}
                    onClick={() => {
                      if (txtCode == code) {
                        handlePass();
                      } else {
                        alert(i18next.t("maXacNhanKhongDung"));
                      }
                    }}
                  >
                    {i18next.t("xacNhan")}
                  </Button>

                  <Text
                    style={{
                      color: "#FFF",
                      fontSize: 20,
                      textAlign: "center",
                      marginTop: 20,
                    }}
                  >
                    {i18next.t("chuaNhanDuocMaXacNhan")}
                  </Text>

                  <Button
                    style={{
                      width: "70%",
                      height: "60px",
                      backgroundColor: isResendEnabled ? "#F24E1E" : "gray",
                      borderRadius: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                    onClick={handleResend}
                    disabled={!isResendEnabled}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        fontSize: 20,
                        fontWeight: "bold",
                      }}
                    >
                      {isResendEnabled
                        ? i18next.t("guiLai")
                        : `${i18next.t("guiLai")} (${countdown}s)`}
                    </Text>
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
