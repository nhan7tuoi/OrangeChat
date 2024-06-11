import React from "react";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import ChatWelcome from "./ChatWelcome";

export default function Chat() {
  const conversation = useSelector((state) => state.conversation.conversation);
  const currentPage = useSelector((state) => state.current.currentPage1);
  console.log("crr", currentPage);
  return (
    <Row style={{ width: "100%", height: "100%", background: "#242424" }}>
      <Col span={6}>
        <SideBar />
      </Col>
      {/* {currentPage === 'ChatWelcome' &&<Col span={18}>  <ChatWelcome /></Col>}
      {currentPage === 'ChatWindow' &&<Col span={18}>  <ChatWindow /></Col>} */}

      {conversation != {} && currentPage === "ChatWindow" ? (
        <Col span={18}>
          <ChatWindow />
        </Col>
      ) : (
        <Col span={18}>
          <ChatWelcome />
        </Col>
      )}

      {/* {conversation == {} ?
        currentPage === 'ChatWelcome' && <Col span={18}>  <ChatWelcome /></Col>
        :
        currentPage === 'ChatWindow' && <Col span={18}>  <ChatWindow /></Col>
      } */}
    </Row>
  );
}
