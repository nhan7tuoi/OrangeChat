import React, { useState, useEffect } from "react";
import { Button, Col, Row, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import authApi from "../../apis/authApi";
import i18next from "../../i18n/i18n";

const { Text, Title } = Typography;

export default function Register() {
  let navigate = useNavigate();
  const location = useLocation();

  const values = location.state?.values;
  const [valuesRegister, setValuesRegister] = useState(values);

  useEffect(() => {
    if (values) {
      setValuesRegister(values);
    }
  }, [values]);

  const checkInfo = async (values) => {
    console.log(values);
    try {
      const response = await authApi.checkInfo({
        email: values.email,
      });

      console.log("response", response);
      if (response.message === "email") {
        alert(i18next.t("emailDaTonTai"));
      } else {
        localStorage.setItem("userEmail", values.email);
        handleSendCode(values);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSendCode = async (values) => {
    const username = values.email;
    console.log(values);
    try {
      const response = await authApi.verifycation({ username: username });
      console.log("response", response);
      navigate("/registerverifi", {
        state: {
          valuesRegister: values,
          code: response.data.code,
        },
      });
    } catch (error) {
      console.log("error", error);
    }
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

      <div style={{ padding: 80 }}>
        <Row justify="center">
          <Col span={14}>
            <img
              src="./images/Hello.svg"
              style={{ height: "600px", width: "100%" }}
              alt="Hello"
            />
          </Col>

          <Col span={8}>
            <Title
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                fontWeight: "800",
              }}
            >
              Đăng ký
            </Title>

            <Formik
              initialValues={{ email: "" }}
              validationSchema={Yup.object({
                email: Yup.string()
                .matches(
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|vn)$/,
                  i18next.t('diaChiEmailKhongHopLe')
                )
                  .required(i18next.t("khongDuocBoTrong")),
              })}
              validateOnMount={true}
              onSubmit={(values) => {
                console.log("values", values);
                checkInfo(values);
              }}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                isValid,
              }) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div className="email" style={{ width: "100%" }}>
                    <input
                      name="email"
                      type="email"
                      placeholder="Email"
                      style={{
                        backgroundColor: "#2E2E2E",
                        width: "100%",
                        height: "60px",
                        borderRadius: "10px",
                        marginTop: "30px",
                        fontSize: "18px",
                        padding: "15px",
                        color: "#FFF",
                      }}
                      onChange={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      error={errors.email && touched.email}
                    />
                    {errors.email && touched.email && (
                      <Text style={{ color: "#FFF", fontSize: 12 }}>
                        {errors.email}
                      </Text>
                    )}
                  </div>

                  <Button
                    disabled={!isValid}
                    onClick={handleSubmit}
                    style={
                      isValid
                        ? {
                            width: "60%",
                            height: "60px",
                            fontSize: "24px",
                            fontWeight: "800",
                            color: "#FFFFFF",
                            backgroundColor: "#F24E1E",
                            borderColor: "#F24E1E",
                            marginTop: "80px",
                            fontWeight: "600",
                          }
                        : {
                            width: "60%",
                            height: "60px",
                            fontSize: "24px",
                            fontWeight: "800",
                            color: "#FFFFFF",
                            backgroundColor: "gray",
                            borderColor: "#F24E1E",
                            marginTop: "80px",
                            fontWeight: "600",
                          }
                    }
                  >
                    Tiếp tục
                  </Button>
                </div>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    </div>
  );
}
