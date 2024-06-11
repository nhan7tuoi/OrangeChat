import { Button, Col, Row, Typography } from 'antd';
import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { IoIosLock } from "react-icons/io";
import { FaLanguage } from "react-icons/fa6";
import { LuPhone } from "react-icons/lu";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import connectSocket from '../../server/ConnectSocket';
import { removeAuth } from '../../redux/authSlice';
import ModalInformation from "./ModalInformation";
import { logout } from '../../redux/authLogin';

const { Text, Title } = Typography;

export default function Profile() {
    let navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.authLogin.user);

    const [isOpenInformation, setIsOpenInformation] = useState(false);
    const [updatedUser, setUpdatedUser] = useState(user);

    const toggleInformationModal = () => {
        setIsOpenInformation(!isOpenInformation);
    };

    const handleUserUpdate = (newUser) => {
        setUpdatedUser(newUser);
    };

    return (
        <Row style={{ width: '100vw', height: '90vh', background: '#242424' }}>
            <Col span={10} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', border: '1px solid #2E2E2E' }}>
                <Button style={{width: '350px', height: '350px', borderRadius: '100%', backgroundColor: '#242424', border: 'hidden'}} onClick={toggleInformationModal}>
                    <img src={updatedUser.image} style={{ height: '350px', width: '350px', borderRadius: '100%' }} alt='avatar'></img>
                    <ModalInformation
                        isOpen={isOpenInformation}
                        toggleModal={toggleInformationModal}
                        user={updatedUser}
                        onUserUpdate={handleUserUpdate}
                    />
                </Button>

                <Text style={{ fontSize: '40px', fontWeight: '700', color: '#FFF' }}>{updatedUser.name}</Text>

                <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '70%', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Link to='/changepass'>
                            <Button style={{ display: 'flex', width: '60px', height: '60px', background: '#36373A', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden' }}>
                                <IoIosLock style={{ fontSize: '30', color: '#FFF' }} />
                            </Button>
                        </Link>
                        <Text style={{ color: 'white', marginTop: '20px' }}>Đổi mật khẩu</Text>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Button
                            onClick={()=>{
                                console.log('logout');
                                dispatch(removeAuth());
                                console.log('user', user);
                                connectSocket.emit('logout', user._id);
                                navigate("/");
                                localStorage.clear();
                                dispatch(logout());
                              }}
                            style={{ display: 'flex', width: '60px', height: '60px', background: '#36373A', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden' }}>
                                <FaUser style={{ fontSize: '25', color: '#FFF' }} />
                            </Button>
                        <Text style={{ color: 'white', marginTop: '20px' }}>Chuyển tài khoản</Text>
                    </div>
                </div>
            </Col>

            <Col span={14} style={{ border: '1px solid #2E2E2E' }}>
                <header>
                    <Title style={{ fontSize: '32px', fontWeight: '700', color: '#FFF', padding: '30px' }}>Cài đặt</Title>
                </header>
                <body style={{ marginLeft: '30px' }}>
                    <Button style={{ display: 'flex', border: 'hidden', width: '100%', height: '100%', background: '#242424', padding: '10px', alignItems: 'center', justifyContent: 'space-evenly' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', width: '50px', height: '50px', background: '#0084FE', borderRadius: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <LuPhone style={{ fontSize: '20', color: '#FFF' }} />
                            </div>
                            <Text style={{ marginLeft: '20px', color: 'white' }}>Điện thoại</Text>
                        </div>
                        <div style={{ width: '100%' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text style={{ marginLeft: '20px', color: 'white' }}>{updatedUser.phone}</Text>
                            <Button style={{ display: 'flex', marginLeft: 10, border: 'hidden', width: '100%', height: '100%', background: '#242424', padding: '10px', alignItems: 'center', justifyContent: 'center' }}>
                                <img src='./images/ArrowRight.svg' style={{ height: '10px', width: '' }} alt='avatar'></img>
                            </Button>
                        </div>
                    </Button>
                    <Button style={{ display: 'flex', border: 'hidden', width: '100%', height: '100%', background: '#242424', padding: '10px', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', width: '50px', height: '50px', background: '#FE294D', borderRadius: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <FaLanguage style={{ fontSize: '30', color: '#FFF' }} />
                            </div>
                            <Text style={{ marginLeft: '20px', color: 'white' }}>Ngôn ngữ</Text>
                        </div>
                        <div style={{ width: '100%' }}></div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Text style={{ marginLeft: '20px', color: 'white' }}>Tiếng Việt</Text>
                            <Button style={{ display: 'flex', marginLeft: 10, border: 'hidden', width: '100%', height: '100%', background: '#242424', padding: '10px', alignItems: 'center', justifyContent: 'center' }}>
                                <img src='./images/ArrowRight.svg' style={{ height: '10px', width: '' }} alt='avatar'></img>
                            </Button>
                        </div>
                    </Button>
                    <br style={{ backgroundcolor: "white" }} />
                </body>
            </Col>
        </Row>
    );
}
