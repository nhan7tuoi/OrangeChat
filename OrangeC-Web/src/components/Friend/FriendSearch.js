import { Button, Col, Row, Typography } from 'antd';

import { MdDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

import { FaCheck } from "react-icons/fa";
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import friendApi from '../../apis/FriendApi';
import { CiSearch } from "react-icons/ci";
// import StateButton from '../components/stateButton';
import { CiBoxList } from "react-icons/ci";
import { IoPersonAddOutline } from "react-icons/io5";
// import { Link, Navigate, useNavigate } from 'react-router-dom';
// import { fetchFriends, setFriends, searchUsers } from '../../redux/friendSlice';
import { Link } from 'react-router-dom';
import FriendRequest from './FriendRequest';
import FriendSearch from './FriendSearch';
import FriendApi from '../../apis/FriendApi';
import i18next from '../../i18n/i18n';
import StateButton from './stateButton';
import { fetchFriends, searchUsers } from '../../redux/friendSilce';
import connectSocket from '../../server/ConnectSocket';

// import { IoPersonAddOutline } from "react-icons/io5";




const { Text, Title } = Typography;

export default function FriendsSearch() {
    const scrollRef = useRef(null);
    const [keyword, setKeyword] = useState("");
    const user = useSelector((state) => state.authLogin.user);
    const dispatch = useDispatch();
    const resultSearch = useSelector(state => state.friend.resultSearch);
    const listFriends = useSelector(state => state.friend.listFriends);
    // const friend = useSelector((state) => state.current.userId);

    const [listFriendRequests, setListFq] = useState([]);
    useEffect(() => {
        dispatch(searchUsers(user._id, keyword));
        fetchData();
      }, [keyword]);
    
      const fetchData = async () => {
        try {
          dispatch(fetchFriends(user._id));
          const res = await FriendApi.getAllFriendRequests({userId: user._id});
          setListFq(res.data);
          // dispatch(fetchFriendRequests(user._id));
        } catch (error) {
          console.error('Error fetching friends:', error);
        }
      };

    useEffect(() => {
        connectSocket.on('rejectFriendRequest', data => {
          console.log('rjdata', data);
          if (data) fetchData();
        });
        connectSocket.on('acceptFriendRequest', data => {
          console.log('accdata', data);
          if (data) fetchData();
        });
        connectSocket.on('responseSendFriendRequest', data => {
          if (data) fetchData();
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

                <header style={{ fontSize: '32px', fontWeight: '700', color: '#FFF', arginLeft: '30px', marginTop: '30px', marginBottom: '20px' }}>Tìm kiếm bạn bè</header>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#36373A', paddingLeft: '10px', width: '90%', borderRadius: '8px', marginTop: '40px' }}>
                    <IoIosSearch style={{ fontSize: '18', color: '#FFF' }} />
                    <input type='text' placeholder={i18next.t('nhapSoDienThoaiHoacTen')} onChange={(evt) => setKeyword(evt.target.value)} style={{ width: '90%', height: '40px', background: '#36373A', marginLeft: '5px', border: 'hidden', outline: 'none', color: '#FFF', borderRadius: '10px' }}></input>
                </div>
                <div style={{ width: '100%', height: '500px', alignItems: 'center', justifyContent: 'center', marginTop: '40px' }}>
                    <div ref={scrollRef} style={{ overflowY: 'auto', background: '#242424', width: '100%', height: '100%' }}>
                        {Array.isArray(resultSearch) && resultSearch.map((user, index) => (
                            <div key={index} style={{ display: 'flex', width: '91%', background: '#242424', padding: '20px', alignItems: 'center', justifyContent: 'space-between', border: '2px solid #2E2E2E', borderRadius: '10px', marginTop: '10px', marginLeft: '60px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={user.image} style={{ height: '50px', width: '50px', borderRadius: '50%' }} alt='image'></img>
                                    <Text style={{ marginLeft: '20px', color: 'white', fontSize: '20px' }}>{user.name}</Text>
                                </div>
                                <div style={{ display: 'flex' }}>
                                    <StateButton
                                        itemId={user._id}
                                        onPressButton={() => fetchData()}
                                        listFriends={listFriends}
                                        listFriendRequests={listFriendRequests}
                                    />
                                    {/* <Button style={{ display: 'flex', width: '50px', height: '50px', background: '#36373A', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden' }}
                                onClick={() => {

                                }}
                            >

                                <IoPersonAddOutline style={{ fontSize: '40', color: '#FFF' }} />
                            </Button> */}
                                    {/* <Button style={{ display: 'flex', width: '50px', height: '50px', background: '#36373A', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden', marginLeft: '10px' }}
                                onClick={() => {
                                   
                                }}
                            >
                                <FaCheck style={{ fontSize: '40', color: '#FFF' }} />
                            </Button> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Col>
        </Row>
    )
}
