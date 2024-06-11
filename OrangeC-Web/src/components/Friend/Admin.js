import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import FriendApi from '../../apis/FriendApi';
import { fetchFriends } from '../../redux/friendSilce';

const { Text } = Typography;

export default function Admin() {
    const scrollRef = useRef(null);
    const [keyword, setKeyword] = useState("");
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const resultSearch = useSelector(state => state.friend.resultSearch);
    const listFriends = useSelector(state => state.friend.listFriends);
    const [listFriendRequests, setListFq] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            dispatch(fetchFriends(user._id));
            const res = await FriendApi.getAllFriendRequests();
            setListFq(res.data);
            console.log(res.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const handleLockUnlock = (userId) => {
        // Xử lý chức năng khóa/mở khóa người dùng ở đây
    };

    return (
        <div style={{ width: '100%', height: '100%', background: '#242424' }}>
            <Row justify="space-between" style={{ padding: '20px' }}>
                <Col>
                    <Button>
                        <Link to="/adminlogin">Thoát</Link>
                    </Button>
                    <Button style={{ marginLeft: '10px' }}>
                        <Link to="/sticker">Sticker</Link>
                    </Button>
                    <Button style={{ marginLeft: '10px' }}>
                        <Link to="/adminma">Người dùng</Link>
                    </Button>
                </Col>
                <Col>
                    {/* Any additional buttons or content can go here */}
                </Col>
            </Row>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#242424' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd', background: '#242424', color: '#F24E1E' }}>Avatar</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd', background: '#242424', color: '#F24E1E' }}>Name</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd', background: '#242424', color: '#F24E1E' }}>Email</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd', background: '#242424', color: '#F24E1E' }}>Phone Number</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd', background: '#242424', color: '#F24E1E' }}>Trạng thái</th>
                        <th style={{ padding: '10px', borderBottom: '1px solid #ddd', background: '#242424', color: '#F24E1E' }}>Actions</th>
                    </tr>
                </thead>
                <tbody ref={scrollRef} style={{ display: 'block', maxHeight: '400px', overflowY: 'auto' }}>
                    {/* Replace this example row with dynamic content */}
                    {listFriends.map((friend, index) => (
                        <tr key={index} style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                                <img src={friend.avatar} style={{ height: '50px', width: '50px', borderRadius: '50%' }} alt='avatar' />
                            </td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center', color: 'white' }}>{friend.name}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center', color: 'white' }}>{friend.email}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center', color: 'white' }}>{friend.phoneNumber}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center', color: 'white' }}>{friend.status}</td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'center', color: 'white' }}>
                                <Button style={{ marginRight: '5px' }} onClick={() => handleLockUnlock(friend.id)}>Khóa</Button>
                                <Button onClick={() => handleLockUnlock(friend.id)}>Mở khóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
