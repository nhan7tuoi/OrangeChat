import React from "react";
import { Button, Col, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import i18next from "../../i18n/i18n";
import authApi from "../../apis/authApi";

const { Text, Title } = Typography;

export default function NewPass() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  const changePassword = async (values) => {
    try {
      const response = await authApi.changePassword1({
        email: userEmail,
        password: values.password,
      });
      if (response.message === "ok") {
        alert(i18next.t("doiMatKhauThanhCong"));

        navigate("/");
      } else {
        alert(i18next.t("doiMatKhauThatBai"));
      }
    } catch (error) {
      console.error("Change Password Error:", error);
      alert(i18next.t("doiMatKhauThatBai"));
    }
  };

  return (
    <div style={{ background: "#1D1D1D", width: "100vw", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
          {i18next.t("Quay lại")}
        </Link>
      </div>

      <div style={{ padding: 80 }}>
        <Row justify="center">
          <Col span={12}>
            <img
              src="./images/Hello.svg"
              alt="Hello"
              style={{ height: "500px", width: "100%" }}
            />
          </Col>
          <Col span={12}>
            <Title
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                fontWeight: "800",
                fontSize: "24px",
              }}
            >
              {i18next.t("doiMatKhau")}
            </Title>

            <Formik
              initialValues={{ password: "", repassword: "" }}
              validationSchema={Yup.object({
                password: Yup.string()
                  .min(6, i18next.t("matKhauPhaiCoItNhat6KyTu"))
                  .required(i18next.t("khongDuocBoTrong")),
                repassword: Yup.string()
                  .oneOf(
                    [Yup.ref("password"), null],
                    i18next.t("matKhauKhongTrungKhop")
                  )
                  .required(i18next.t("khongDuocBoTrong")),
              })}
              onSubmit={(values) => {
                changePassword(values);
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
                <form
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <input
                    name="password"
                    type="password"
                    placeholder={i18next.t("Mật khẩu mới")}
                    style={{
                      backgroundColor: "#2E2E2E",
                      width: "60%",
                      height: "60px",
                      borderRadius: "10px",
                      marginTop: "30px",
                      fontSize: "18px",
                      padding: "15px",
                      color: "#FFF",
                    }}
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                  />
                  {errors.password && touched.password && (
                    <Text style={{ color: "#FFF", fontSize: 12 }}>
                      {errors.password}
                    </Text>
                  )}

                  <input
                    name="repassword"
                    type="password"
                    placeholder={i18next.t("Nhập lại mật khẩu mới")}
                    style={{
                      backgroundColor: "#2E2E2E",
                      width: "60%",
                      height: "60px",
                      borderRadius: "10px",
                      marginTop: "30px",
                      fontSize: "18px",
                      padding: "15px",
                      color: "#FFF",
                    }}
                    onChange={handleChange("repassword")}
                    onBlur={handleBlur("repassword")}
                    value={values.repassword}
                  />
                  {errors.repassword && touched.repassword && (
                    <Text style={{ color: "#FFF", fontSize: 12 }}>
                      {errors.repassword}
                    </Text>
                  )}

                  <Button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    style={
                      isValid
                        ? {
                            width: "470px",
                            height: "60px",
                            fontSize: "24px",
                            color: "#FFFFFF",
                            backgroundColor: "#F24E1E",
                            borderColor: "#F24E1E",
                            marginTop: "50px",
                            fontWeight: "600",
                          }
                        : {
                            width: "470px",
                            height: "60px",
                            fontSize: "24px",
                            color: "#FFFFFF",
                            backgroundColor: "gray",
                            borderColor: "#F24E1E",
                            marginTop: "50px",
                            fontWeight: "600",
                          }
                    }
                  >
                    {i18next.t("xacNhan")}
                  </Button>
                </form>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    </div>
  );
}
