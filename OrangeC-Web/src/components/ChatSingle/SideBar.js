import { Col, Row, Typography } from 'antd'
import React from 'react'
import Find from './Find';
import ChatList from './ChatList';

const { Text, Title } = Typography;

export default function SideBar() {
    return (
        <Row style={{height: '90vh'}}>
            <Col span={24} style={{ borderColor: '#2E2E2E', border: '1px solid #2E2E2E', height: '15%'}}><Find/></Col>
            <Col span={24} style={{ borderColor: '#2E2E2E', border: '1px solid #2E2E2E', height: '85%'}}><ChatList/></Col>
        </Row>
    )
}
