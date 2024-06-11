import { Button, Col, Row, Typography } from 'antd';
import React from 'react';
import { FaUser } from 'react-icons/fa';
import { IoIosLock } from "react-icons/io";
import { FaLanguage } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const { Text, Title } = Typography;

export default function Information() {
    const user = useSelector((state) => state.auth.user);
    const dateOfBirth = new Date(user.dateOfBirth);

    // Trích xuất ngày, tháng và năm
    const day = dateOfBirth.getDate();
    const month = dateOfBirth.getMonth() + 1; // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
    const year = dateOfBirth.getFullYear();

    // Định dạng lại thành ngày tháng năm
    const formattedDateOfBirth = `${day}/${month}/${year}`;

    console.log(formattedDateOfBirth); 

    return (
        <Row style={{ width: '100vw', height: '88.7vh', background: '#242424' }}>
            <Col span={10} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', border: '1px solid #2E2E2E' }}>
                {/* <Button style={{width: '350px', height: '350px', borderRadius: '100%', backgroundColor: '#242424', border: 'hidden'}}> */}
                    <img src={user.image} style={{ height: '350px', width: '350px', borderRadius: '100%' }} alt='avatar'></img>
                {/* </Button> */}


                <Text style={{ fontSize: '40px', fontWeight: '700', color: '#FFF' }}>{user.name}</Text>

                {/* <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '70%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Link to='/changepass'>
                            <Button style={{ display: 'flex', width: '60px', height: '60px', background: '#36373A', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden' }}>
                                <IoIosLock style={{ fontSize: '30', color: '#FFF' }} />
                            </Button>
                        </Link>
                        <Text style={{ color: 'white', marginTop: '20px' }}>Đổi mật khẩu</Text>
                    </div>


                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Link to='/'>
                            <Button style={{ display: 'flex', width: '60px', height: '60px', background: '#36373A', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden' }}>
                                <FaUser style={{ fontSize: '25', color: '#FFF' }} />
                            </Button>
                        </Link>
                        <Text style={{ color: 'white', marginTop: '20px' }}>Chuyển tài khoản</Text>
                    </div>


                </div> */}
            </Col>

            <Col span={14} style={{ border: '1px solid #2E2E2E', height: '100%' }}>
                <header>
                    <Title style={{ fontSize: '32px', fontWeight: '700', color: '#FFF', padding: '30px' }}>Thông tin cá nhân</Title>
                </header>
                <body style={{ marginLeft: '30px', width: '100%' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: "100%" }}>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '20%' }}>Họ và tên:</Text>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '30%' }}>{user.name}</Text>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '20%' }}>Ngày sinh:</Text>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '30%' }}>{formattedDateOfBirth}</Text>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '20%' }}>Giới tính:</Text>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '30%' }}>{user.gender ? "Nam" : "Nữ"}</Text>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '20%' }}>Số điện thoại:</Text>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '30%' }}>{user.phone}</Text>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '20%' }}>Email:</Text>
                        <Text style={{ fontSize: '20px', color: '#FFF', width: '30%' }}>{user.email}</Text>
                    </div>

                    {/* <Button style={{ display: 'flex', border: 'hidden', width: '100%', height: '100%', background: '#242424', padding: '10px' }}>
                        <div style={{ display: 'flex', width: '50px', height: '50px', background: '#FE294D', borderRadius: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <FaLanguage style={{ fontSize: '30', color: '#FFF' }} />
                        </div>
                        <Text>Ngôn ngữ</Text>
                    </Button> */}
                    <br style={{ backgroundcolor: "white" }} />
                </body>
            </Col>
        </Row>
    )
}
