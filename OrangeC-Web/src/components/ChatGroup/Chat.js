import React, { useEffect } from 'react';
import SideBar from './SideBar';
import ChatWindow from './ChatWindow';
import { Col, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import ChatWelcome from './ChatWelcome';

export default function ChatGroup() {
  const conversation = useSelector((state) => state.conversation.conversation);
  const currentPage = useSelector((state) => state.current.currentPage2);

  return (
    <Row style={{ width: '100%', height: '100%', background: '#242424' }}>
      <Col span={6}><SideBar /></Col>
      {/* {currentPage === 'ChatWelcome' &&<Col span={18}>  <ChatWelcome /></Col>}
      {currentPage === 'ChatWindow' &&<Col span={18}>  <ChatWindow /></Col>} */}

      {/* {conversation1 == null ?
        currentPage === 'ChatWelcome' && <Col span={18}>  <ChatWelcome /></Col>
        :
        currentPage === 'ChatWindow' && <Col span={18}>  <ChatWindow /></Col>
      } */}
      {conversation != {} && currentPage === "ChatWindow" ? (
        <Col span={18}>
          <ChatWindow />
        </Col>
      ) : (
        <Col span={18}>
          <ChatWelcome />
        </Col>
      )}
    </Row>
  )
}

