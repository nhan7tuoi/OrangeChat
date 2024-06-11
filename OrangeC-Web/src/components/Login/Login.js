import { Button, Col, Row, Typography } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../../apis/authApi";
import { useDispatch, useSelector } from "react-redux";
import "./Login.css";
import { setAuth } from "../../redux/authLogin";
import { setCurrentPage1 } from "../../redux/currentSlice";
// import i18next from "../../i18n/i18n"

const { Text, Title } = Typography;

export default function Login() {
  const token = useSelector((state) => state.authLogin.token);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [data, setData] = useState({
    username: "admin@orange.com",
    password: "admin123",
  });

  let navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await authApi.login({
        username: data.username,
        password: data.password,
      });
      if (response.message == "ok") {
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("token", JSON.stringify(response.accessToken));
        //luu vao redux
        dispatch( 
          setAuth({
            user: response.user,
            accessToken: response.accessToken,
          })
        );
        console.log("response: ", token);
        navigate("/chat");
        dispatch(setCurrentPage1("ChatWelcome"));
      } else if (response.message == "email") {
        setError("Email chưa được đăng ký");
      } else if (response.message == "password") {
        setError("Sai mật khẩu");
      }
    } catch (error) {
      setError("Đăng nhập thất bại. Tài khoản mật khẩu không chính xác!");
    }
  };

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div
      className="container"
      style={{ background: "#1D1D1D", width: "100vw", height: "100vh" }}
    >
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
          to="/register"
          style={{ fontSize: 17, fontWeight: 800, color: "#FFF", padding: 50 }}
        >
          Đăng ký
        </Link>
      </header>
      <body style={{ padding: 80 }}>
        <div className="form">
          <Row justify="center">
            <Col span={8} style={{ alignItems: "center" }}>
              <Title style={{ color: "#FFFFFF", textAlign: "center" }}>
                Đăng nhập
              </Title>

              <input
                value={data.username}
                onChange={changeHandler}
                type="text"
                placeholder="Số điện thoại"
                name="username"
                style={{
                  backgroundColor: "#2E2E2E",
                  width: "100%",
                  height: 60,
                  borderRadius: "10px",
                  fontSize: "18px",
                  marginTop: "80px",
                  padding: "15px",
                  color: "#FFF",
                }}
              ></input>

              <input
                value={data.password}
                onChange={changeHandler}
                type="password"
                name="password"
                placeholder="Mật khẩu"
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
              ></input>

              <Text style={{ color: "red", fontSize: "18px" }}>{error}</Text>

              <Button
                onClick={handleLogin}
                style={{
                  width: "100%",
                  height: "60px",
                  fontSize: "24px",
                  fontWeight: "800px",
                  color: "#FFFFFF",
                  backgroundColor: "#F24E1E",
                  borderColor: "#F24E1E",
                  marginTop: "30px",
                }}
              >
                Đăng nhập
              </Button>

              <div
                style={{
                  marginTop: "30px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    style={{ color: "#F24E1E", borderColor: "#F24E1E" }}
                  ></input>
                  <Text style={{ color: "#FFFFFF59", fontSize: "18px" }}>
                    Ghi nhớ thông tin
                  </Text>
                </div>

                <Link
                  to={"/forgotpassword"}
                  style={{ color: "#FFFFFF59", fontSize: "18px" }}
                >
                  Quên mật khẩu ?
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </body>
    </div>
  );
}
