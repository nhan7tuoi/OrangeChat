import React, { useState } from "react";
import { Button, Col, Flex, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import i18next from "../../i18n/i18n";
import { useDispatch, useSelector } from "react-redux";
import authApi from "../../apis/authApi";
import { logout } from "../../redux/authLogin";
// import { Link, useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

export default function ChangePass() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const changePassword = async (values) => {
    try {
      const response = await authApi.changePassword({
        userId: user._id,
        oldpassword: values.oldpassword,
        password: values.password,
      });
      console.log("response", response);
      if (response.message === "ok") {
        alert(i18next.t("doiMatKhauThanhCong"));
        navigate("/login");
      } else if (response.message === "sai") {
        alert(i18next.t("matKhauCuKhongDung"));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div style={{ background: "#1D1D1D", width: "100vw", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#F24E1E",
            padding: 50,
          }}
        >
          OrangeC
        </Text>
        <Link
          to="/profile"
          style={{ fontSize: 17, fontWeight: 800, color: "#FFF", padding: 50 }}
        >
          Quay lại
        </Link>
      </div>

      <div>
        <div style={{ padding: 80 }}>
          <div name="form">
            <Row justify="center">
              <Col span={12} style={{ alignItems: "center" }}>
                <img
                  src="./images/Hello.svg"
                  style={{ height: "500px", width: "100%" }}
                ></img>
              </Col>

              <Col span={12} style={{ alignItems: "center" }}>
                <Title
                  style={{
                    color: "#FFFFFF",
                    textAlign: "center",
                    fontWeight: "800",
                    fontSize: "24px",
                  }}
                >
                  Đổi mật khẩu
                </Title>

                <Formik
                  initialValues={{
                    oldpassword: "",
                    password: "",
                    repassword: "",
                  }}
                  validationSchema={Yup.object({
                    oldpassword: Yup.string()
                      .min(6, i18next.t("matKhauPhaiCoItNhat6KyTu"))
                      .required(i18next.t("khongDuocBoTrong")),
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
                  validateOnMount={true}
                  onSubmit={(values) => {
                    changePassword(values);
                    // console.log(user);
                    dispatch(logout());
                    navigate("/login");
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
                      <input
                        name="password"
                        type="text"
                        placeholder="Mật khẩu cũ"
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
                        onChange={handleChange("oldpassword")}
                        onBlur={handleBlur("oldpassword")}
                        value={values.oldpassword}
                        error={errors.oldpassword && touched.oldpassword}
                      />
                      {errors.oldpassword && touched.oldpassword && (
                        <Text style={{ color: "#FFF", fontSize: 12 }}>
                          {errors.oldpassword}
                        </Text>
                      )}

                      <input
                        name="newpassword"
                        type="password"
                        placeholder="Mật khẩu mới"
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
                        error={errors.password && touched.password}
                      />
                      {errors.password && touched.password && (
                        <Text style={{ color: "#FFF", fontSize: 12 }}>
                          {errors.password}
                        </Text>
                      )}

                      <input
                        name="reppassword"
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
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
                        error={errors.repassword && touched.repassword}
                      />
                      {errors.repassword && touched.repassword && (
                        <Text style={{ color: "#FFF", fontSize: 12 }}>
                          {errors.repassword}
                        </Text>
                      )}

                      <Row justify="center">
                        <Col
                          span={12}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexDirection: "column",
                            alignItems: "center",
                          }}
                        >
                          <Button
                            disabled={!isValid}
                            onClick={handleSubmit}
                            style={
                              isValid
                                ? {
                                    width: "470px",
                                    height: "60px",
                                    fontSize: "24px",
                                    fontWeight: "800px",
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
                                    fontWeight: "800px",
                                    color: "#FFFFFF",
                                    backgroundColor: "gray",
                                    borderColor: "#F24E1E",
                                    marginTop: "50px",
                                    fontWeight: "600",
                                  }
                            }
                          >
                            Xác nhận
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  )}
                </Formik>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
