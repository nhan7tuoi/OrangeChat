import React, { useEffect, useState } from "react";
import { Button, Col, Row, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import authApi from "../../apis/authApi";
import i18next from "../../i18n/i18n";

const { Text, Title } = Typography;

const URL_IMAGE_MALE =
  "https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/man-user-circle-icon.png";
const URL_IMAGE_FEMALE =
  "https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/woman-user-circle-icon.png";

export default function Register() {
  let navigate = useNavigate();
  const location = useLocation();

  const [countdown, setCountdown] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [txtCode, setTxtCode] = useState("");
  const valuesRegister = location.state?.valuesRegister;
  const valueInfo = location.state?.valueInfo;
  const code = location.state?.code;
  const dateOfBirth = location.state?.dateOfBirth;
  const [isComfirm, setIsComfirm] = useState(false);

  // console.log(valuesRegister);
  // console.log(valueInfo);
  console.log("dob", dateOfBirth);

  useEffect(() => {
    if (txtCode !== "" && txtCode.length == 6) {
      setIsComfirm(true);
    }
  }, [txtCode]);

  const handleRegister = async () => {
    const userData = {
      // name: valueInfo.fullName,
      // phone: valuesRegister.phoneNumber,
      email: valuesRegister.email,
      // username: valuesRegister.email,
      // password: valuesRegister.password,
      // dateOfBirth: dateOfBirth["$d"],
      // image: valueInfo.gender == 'male' ? URL_IMAGE_MALE : URL_IMAGE_FEMALE,
      // gender: valueInfo.gender
    };
    console.log(userData);
    try {
      // const response = await authApi.register({ ...userData });
      // console.log(response);
      // alert('Đăng ký thành công!');

      navigate("/registerinf");
    } catch (error) {
      alert("err", error.message);
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

  const handleResend = () => {
    setIsResendEnabled(false);
    setCountdown(60);
  };

  return (
    <div style={{ background: "#1D1D1D", width: "100vw", height: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          to="/"
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
          to="/login"
          style={{ fontSize: 17, fontWeight: 800, color: "#FFF", padding: 50 }}
        >
          Đăng nhập
        </Link>
      </header>

      <body style={{ padding: 80 }}>
        <Row justify="center" style={{ width: "100%" }}>
          <Col span={14} style={{ alignItems: "center" }}>
            <img
              src="./images/Hello.svg"
              style={{ height: "600px", width: "100%" }}
            ></img>
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
                Mã xác nhận đã được gửi đến bạn
              </Title>

              <Text style={{ color: "white", marginTop: "30px" }}>
                Vui lòng điền mã OTP
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
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
                    marginLeft: "10px",
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
                    disabled={!isComfirm}
                    style={
                      isComfirm
                        ? {
                            width: "80%",
                            height: "60px",
                            fontSize: "24px",
                            fontWeight: "800px",
                            color: "#FFFFFF",
                            backgroundColor: "#F24E1E",
                            borderColor: "#F24E1E",
                            marginTop: "100px",
                            fontWeight: "600",
                          }
                        : {
                            width: "80%",
                            height: "60px",
                            fontSize: "24px",
                            fontWeight: "800px",
                            color: "#FFFFFF",
                            backgroundColor: "gray",
                            borderColor: "#F24E1E",
                            marginTop: "100px",
                            fontWeight: "600",
                          }
                    }
                    onClick={() => {
                      if (txtCode == code) {
                        handleRegister();
                      } else {
                        alert("Mã xác nhận không đúng");
                      }
                    }}
                  >
                    Xác nhận
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
                      display: "flex",
                      width: "70%",
                      height: 60,
                      backgroundColor: isResendEnabled ? "#F24E1E" : "gray",
                      borderRadius: 30,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                    onClick={() => {
                      if (isResendEnabled) {
                        handleResend();
                      }
                    }}
                  >
                    <Text
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "#FFF",
                        fontSize: 20,
                        fontWeight: "bold",
                        width: "100%",
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
      </body>
    </div>
  );
}
