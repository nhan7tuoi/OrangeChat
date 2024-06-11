import { Button, Col, Row, Typography } from 'antd';

import { MdDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

import { FaCheck } from "react-icons/fa";
import React, { useCallback, useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import friendApi from '../../apis/FriendApi';
import { CiSearch } from "react-icons/ci";

import { CiBoxList } from "react-icons/ci";
import { IoPersonAddOutline } from "react-icons/io5";
// import { Link, Navigate, useNavigate } from 'react-router-dom';
// import { addFriend, deleteFriend, fetchFriends, setFriends } from '../../redux/friendSlice';
import { Link } from 'react-router-dom';
import FriendRequest from './FriendRequest';
// import connectSocket from '../../server/connectSocket';
import FriendApi from '../../apis/FriendApi';
import connectSocket from '../../server/ConnectSocket';
import { addFriend, deleteFriend, fetchFriends } from '../../redux/friendSilce';



const { Text, Title } = Typography;

export default function Friends() {

    const user = useSelector((state) => state.authLogin.user);
    const dispatch = useDispatch();
    const listFriends = useSelector(state => state.friend.listFriends);


   
    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchFriends(user._id));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    },[])


    useEffect(() => {
        connectSocket.on('acceptFriendRequest', data => {
            if (data) dispatch(addFriend(data));
          });
          connectSocket.on('responseDeleteFriend', data => {
            if (data) dispatch(deleteFriend(data.receiverId));
          });
          connectSocket.on('deleteFriend', data => {
            if (data) dispatch(deleteFriend(data.senderId));
          });
      }, []);

    return (


        <Row style={{ width: '100vw', height: '90vh', background: '#242424' }}>
            <Col span={6} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #2E2E2E' }}>

                <Button style={{ display: 'flex', border: '2px solid #2E2E2E', width: '90%', height: '10%', background: '#242424', padding: '20px', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '20px' }}>
                    <Link to={"/Friend"} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CiBoxList style={{ fontSize: '20', color: '#FFF' }} />
                            <Text style={{ marginLeft: '20px', color: 'white', fontSize: '20px' }}>Danh sách bạn bè</Text>
                        </div>
                        <div style={{ width: '100%' }}></div>
                    </Link>
                </Button>
                <Button style={{ display: 'flex', border: '2px solid #2E2E2E', width: '90%', height: '10%', background: '#242424', padding: '20px', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '10px' }}

                >
                    <Link to={"/FriendRequest"} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>

                            <IoPersonAddOutline style={{ fontSize: '20', color: '#FFF' }} />
                            <Text style={{ marginLeft: '20px', color: 'white', fontSize: '20px' }}>Lời mời kết bạn</Text>
                        </div>
                        <div style={{ width: '100%' }}></div>


                    </Link>
                </Button>
                <Button style={{ display: 'flex', border: '2px solid #2E2E2E', width: '90%', height: '10%', background: '#242424', padding: '20px', alignItems: 'center', justifyContent: 'space-evenly', marginTop: '20px' }}>
                    <Link to={"/FriendSearch"} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>

                            <CiSearch style={{ fontSize: '20', color: '#FFF' }} />
                            <Text style={{ marginLeft: '20px', color: 'white', fontSize: '20px' }}>Tìm kiếm bạn bè</Text>
                        </div>
                        <div style={{ width: '100%' }}></div>
                    </Link>
                </Button>
            </Col>

            <Col span={18} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #2E2E2E' }}>
                <header style={{ fontSize: '32px', fontWeight: '700', color: '#FFF', arginLeft: '30px', marginTop: '30px', marginBottom: '20px' }}>Danh sách bạn bè</header>

                {Array.isArray(listFriends) && listFriends.map((listFriends, index) => (
                    <div key={index} style={{ display: 'flex', width: '90%', background: '#242424', padding: '20px', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', marginLeft: '30px', border: '2px solid #2E2E2E', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={listFriends.image} style={{ height: '50px', width: '50px', borderRadius: '50%' }} alt='image'></img>
                            <Text style={{ marginLeft: '20px', color: 'white', fontSize: '20px' }}>{listFriends.name}</Text>
                        </div>
                        <Button style={{ display: 'flex', width: '50px', height: '50px', background: '#36373A', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden' }}
                            onClick={() => {
                               connectSocket.emit('delete friend', {
                                senderId: user._id,
                                receiverId: listFriends._id,
                                });
                                console.log(listFriends);
                                dispatch(deleteFriend(listFriends._id));
                            }}
                        >
                            <MdDelete style={{ fontSize: '40', color: '#FFF' }} />
                        </Button>
                    </div>
                ))}
            </Col>
        </Row>
    )
}
