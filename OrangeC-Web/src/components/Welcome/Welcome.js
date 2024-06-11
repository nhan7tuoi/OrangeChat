import React from 'react'
import { Button, Col, Row, Typography } from 'antd'

const { Text, Title } = Typography;

export default function Welcome() {
  return (
    <div className='container' style={{ background: '#1D1D1D', width: '100vw', height: '100vh', display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
        <img src='./images/Group 15app.svg' style={{ height: '200px', width: '100%' }}></img>
        <Text style={{color:'white', fontSize:'24px', marginTop:'50px', fontWeight:800}}>Chào mừng đến với OrangeC PC</Text>
      <Button style={{width:'400px', height:'80px', backgroundColor:'#F24E1E'}}>
        Đăng ký
      </Button>
      <Button>
        Đăng nhập
      </Button>
    </div>
  )
}
