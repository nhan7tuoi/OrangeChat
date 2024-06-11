import React from "react";
import { Button, Col, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

export default function Home() {
  let navigate = useNavigate();
  return (
    <div
      className="container"
      style={{
        background: "#1D1D1D",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        src="./images/Group 15app.svg"
        style={{ height: "200px", width: "100%" }}
      ></img>
      <Text
        style={{
          color: "white",
          fontSize: "24px",
          marginTop: "50px",
          marginBottom: "50px",
          fontWeight: 800,
        }}
      >
        Chào mừng bạn đến với OrangeC Web
      </Text>
      <Button
        style={{
          width: "600px",
          height: "80px",
          backgroundColor: "#F24E1E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          border: "hidden",
          fontSize: 30,
          fontWeight: 800,
          color: "#FFF",
        }}
        onClick={() => navigate("/login")}
      >
        Đăng nhập
      </Button>
      <Button
        style={{
          width: "600px",
          height: "80px",
          backgroundColor: "#242424",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
          border: "hidden",
          fontSize: 30,
          fontWeight: 800,
          color: "#FFF",
          marginTop: "30px",
        }}
        onClick={() => navigate("/register")}
      > 
        Đăng ký
      </Button>
    </div>
  );
}
