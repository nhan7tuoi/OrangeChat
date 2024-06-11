import React, { useState } from "react";
import { Button, Col, DatePicker, Row, Typography } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import authApi from "../../apis/authApi";
import i18next from "../../i18n/i18n";
import { setAuth } from "../../redux/authSlice";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from "react-redux";
import connectSocket from "../../server/ConnectSocket";
import moment from "moment";

const { Text, Title } = Typography;

const calculateAge = (date) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const isFutureDate = (date) => {
  const today = new Date();
  return new Date(date) > today;
};
export default function Register() {
  let navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null); // Initial date as null
  const location = useLocation();
  const dispatch = useDispatch();
  const URL_IMAGE_MALE =
    "https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/man-user-circle-icon.png";
  const URL_IMAGE_FEMALE =
    "https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/woman-user-circle-icon.png";

  const userEmail = localStorage.getItem("userEmail");

  const handleRegister = async (userData) => {
    try {
      const response = await authApi.register({ ...userData });

      console.log("response", response);
      if (response.message === "ok") {
        await localStorage.setItem("accessToken", response.accessToken);

        localStorage.setItem("user", JSON.stringify(response.userRespones));
        if (response.conversation) {
          localStorage.setItem(
            "conversation",
            JSON.stringify(response.conversation)
          );
        }

        dispatch(
          setAuth({
            user: response.userRespones,
            accessToken: response.accessToken,
          })
        );
        connectSocket.initSocket(response.userRespones._id);
      } else {
        alert("Đăng ký thất bại");
      }
      console.log(response);
      alert("Đăng ký thành công!");
      navigate("/chat");
    } catch (error) {
      console.error("Đăng ký thất bại", error);
      alert("Đăng ký thất bại", error.message);
    }
  };

  return (
    <div style={{ background: "#1D1D1D", width: "100vw", height: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
      </div>

      <div style={{ padding: 20 }}>
        <Row justify="center">
          <Col
            span={12}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "start",
            }}
          >
            <img
              src="./images/Hello.svg"
              style={{ height: "500px", width: "500px" }}
              alt="Hello"
            />
          </Col>

          <Col span={8} style={{ alignItems: "center" }}>
            <Title
              style={{
                color: "#FFFFFF",
                textAlign: "center",
                fontWeight: "800",
                fontSize: "24px",
              }}
            >
              Thông tin cá nhân
            </Title>

            <Formik
              initialValues={{
                fullName: "",
                password: "",
                repassword: "",
                gender: "",
                phoneNumber: "",
                dateOfBirth: null,
              }}
              validationSchema={Yup.object({
                fullName: Yup.string().required(i18next.t("khongDuocBoTrong")),
                password: Yup.string()
                  .min(6, i18next.t("matKhauPhaiCoItNhat6KyTu"))
                  .required(i18next.t("khongDuocBoTrong")),
                repassword: Yup.string()
                  .oneOf(
                    [Yup.ref("password"), null],
                    i18next.t("matKhauKhongTrungKhop")
                  )
                  .required(i18next.t("khongDuocBoTrong")),
                phoneNumber: Yup.string()
                  .matches(
                    /^(0\d{9}|84\d{9})$/,
                    i18next.t("soDienThoaiKhongHopLe")
                  )
                  .required(i18next.t("khongDuocBoTrong")),
                dateOfBirth: Yup.date()
                  .nullable()
                  .required(i18next.t("khongDuocBoTrong"))
                  .test("dob", i18next.t("phaiDu16Tuoi"), function (value) {
                    return calculateAge(value) >= 16;
                  })
                  .test(
                    "dob",
                    i18next.t("ngaySinhKhongHopLe"),
                    function (value) {
                      return !isFutureDate(value);
                    }
                  ),
              })}
              onSubmit={(values) => {
                const userData = {
                  email: userEmail,
                  name: values.fullName,
                  password: values.password,
                  repassword: values.repassword,
                  gender: values.gender,
                  dateOfBirth: date ? date.toISOString() : null,
                  phone: values.phoneNumber,
                  image:
                    values.gender == "male" ? URL_IMAGE_MALE : URL_IMAGE_FEMALE,
                };
                console.log(userData);
                handleRegister(userData);
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
                setFieldValue,
              }) => (
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <div className="full-name" style={{ width: "100%" }}>
                      <input
                        name="fullName"
                        type="text"
                        placeholder="Họ và Tên"
                        style={{
                          backgroundColor: "#2E2E2E",
                          width: "100%",
                          height: "60px",
                          borderRadius: "10px",
                          marginTop: "15px",
                          fontSize: "18px",
                          padding: "15px",
                          color: "#FFF",
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.fullName}
                      />
                      {errors.fullName && touched.fullName && (
                        <Text style={{ color: "#FFF", fontSize: 12 }}>
                          {errors.fullName}
                        </Text>
                      )}

                      <input
                        name="password"
                        type="password"
                        placeholder="Mật khẩu"
                        style={{
                          backgroundColor: "#2E2E2E",
                          width: "100%",
                          height: "60px",
                          borderRadius: "10px",
                          marginTop: "15px",
                          fontSize: "18px",
                          padding: "15px",
                          color: "#FFF",
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                        placeholder="Nhập lại mật khẩu"
                        style={{
                          backgroundColor: "#2E2E2E",
                          width: "100%",
                          height: "60px",
                          borderRadius: "10px",
                          marginTop: "15px",
                          fontSize: "18px",
                          padding: "15px",
                          color: "#FFF",
                        }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.repassword}
                      />
                      {errors.repassword && touched.repassword && (
                        <Text style={{ color: "#FFF", fontSize: 12 }}>
                          {errors.repassword}
                        </Text>
                      )}
                      <input
                        name="phoneNumber"
                        type="tel"
                        placeholder="Số điện thoại"
                        style={{
                          backgroundColor: "#2E2E2E",
                          width: "100%",
                          height: "60px",
                          borderRadius: "10px",
                          marginTop: "15px",
                          fontSize: "18px",
                          padding: "15px",
                          color: "#FFF",
                        }}
                        onChange={handleChange("phoneNumber")}
                        onBlur={handleBlur("phoneNumber")}
                        value={values.phoneNumber}
                        error={errors.phoneNumber && touched.phoneNumber}
                      />
                      {errors.phoneNumber && touched.phoneNumber && (
                        <Text style={{ color: "#FFF", fontSize: 12 }}>
                          {errors.phoneNumber}
                        </Text>
                      )}
                    </div>

                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        height: "50px",
                        marginTop: "15px",
                      }}
                    >
                      <Button
                        onClick={() => setOpen(true)}
                        style={{
                          width: "30%",
                          height: "50px",
                          backgroundColor: "red",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "10px",
                        }}
                      >
                        <Text style={{ color: "#FFF", fontSize: 12 }}>
                          {i18next.t("chonNgaySinh")}
                        </Text>
                      </Button>
                      <DatePicker
                        style={{ width: "70%" }}
                        format="DD/MM/YYYY"
                        open={open}
                        value={date}
                        onChange={(date) => {
                          setOpen(false);
                          setDate(date);
                          setFieldValue("dateOfBirth", date); // Set Formik field value
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      marginTop: 20,
                      justifyContent: "center",
                      width: "200px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "200px",
                        alignItems: "start",
                      }}
                      onChange={(e) => handleChange("gender")(e)}
                      value={values.gender}
                    >
                      <div>
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={values.gender === "male"}
                          onChange={handleChange}
                        />
                        <Text style={{ color: "#FFFFFF59" }}>Nam</Text>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={values.gender === "female"}
                          onChange={handleChange}
                        />
                        <Text style={{ color: "#FFFFFF59" }}>Nữ</Text>
                      </div>
                    </div>
                  </div>

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
                                width: "440px",
                                height: "60px",
                                fontSize: "24px",
                                fontWeight: "800px",
                                color: "#FFFFFF",
                                backgroundColor: "#F24E1E",
                                borderColor: "#F24E1E",
                                marginTop: "80px",
                                fontWeight: "600",
                              }
                            : {
                                width: "440px",
                                height: "60px",
                                fontSize: "24px",
                                fontWeight: "800px",
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
                      <div
                        style={{
                          fontSize: 17,
                          color: "#FFF",
                          marginTop: "30px",
                        }}
                        onClick={() => navigate(-1)}
                      >
                        Quay lại
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Formik>
          </Col>
        </Row>
      </div>
    </div>
  );
}
