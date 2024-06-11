import { Col, Row, Typography } from 'antd'
import React from 'react'

const { Text, Title } = Typography;

export default function ChatWelcome() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
            <img src='./images/Hello.svg' style={{ height: '300px', width: '100%' }}></img>
            <Text style={{fontSize: '32px', fontWeight: '700', color: '#F24E1E'}}>Chào mừng đến với OrangeC Web</Text>
            <Text style={{fontSize: '20px', fontWeight: '700px', color: '#FFF', textAlign: 'center'}}>Khám phát những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân, bạn bè được tối ưu hóa cho máy tính của bạn.</Text>
        </div>
    )
}
