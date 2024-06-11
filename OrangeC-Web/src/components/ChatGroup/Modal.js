import React, { useEffect, useRef, useState } from 'react';
import '../../css/Modal.css'; // File CSS cho modal
import { IoIosSearch } from "react-icons/io";
import { Button, Col, Row, Typography } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addFriend, deleteFriend, fetchFriends, searchUsers, setFriends } from '../../redux/friendSilce';
import FriendApi from '../../apis/FriendApi';
import connectSocket from '../../server/ConnectSocket';
import { MdDelete } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import i18next from '../../i18n/i18n';
import { addMember, removeMember, setCoversation, setMembers } from '../../redux/conversationSlice';
import messageApi from '../../apis/messageApi';
import { formatOneConversation } from '../../utils/formatOneConverstation';

const { Text, Title } = Typography;

function Modal({ isOpen, toggleModal }) {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [nameGroup, setNameGroup] = useState('');
    const members = useSelector(state => state.conversation.members);
    const [avatarGroup, setAvatarGroup] = useState('https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/group-user-circle.png');
    const [groupName, setGroupName] = useState('');
    const [temp, setTemp] = useState([]);
    const scrollRef = useRef(null);
    const [keyword, setKeyword] = useState("");
    const user = useSelector((state) => state.authLogin.user);
    const dispatch = useDispatch();
    const resultSearch = useSelector(state => state.friend.resultSearch);
    const listFriends = useSelector(state => state.friend.listFriends);

    useEffect(() => {
        if (keyword === '') {
            fetchData();
            dispatch(setMembers([]));
        } else {
            const resultSearch = temp.filter(
                f => f.name.includes(keyword) || f.phone.includes(keyword),
            );
            console.log(resultSearch);
            dispatch(setFriends(resultSearch));
        }
    }, [keyword]);

    const fetchData = async () => {
        try {
            dispatch(fetchFriends(user._id));
            const friends = await FriendApi.getFriends({ userId: user._id });
            setTemp(friends.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        connectSocket.on('newConversationGroup', data => {
            try {
                if (data.administrators.includes(user._id)) {
                    const fConversation = formatOneConversation({
                        conversation: data,
                        userId: user._id,
                    });

                    dispatch(setCoversation(fConversation));
                }
            } catch (error) {
                console.error('Đã xảy ra lỗi khi chuyển đến màn hình trò chuyện:', error);
            }
        });
    }, []);

    const handleAddMember = member => {
        dispatch(addMember(member));
        setSelectedMembers([...selectedMembers, member]);
        const updatedList = listFriends.map(f => {
            if (f._id === member._id) {
                return { ...f, addStatus: true };
            }
            return f;
        });
        dispatch(setFriends(updatedList));
    };

    const handleRemoveMember = member => {
        dispatch(removeMember(member._id));
        setSelectedMembers(selectedMembers.filter(m => m._id !== member._id));
        const updatedList = listFriends.map(f => {
            if (f._id === member._id) {
                return { ...f, addStatus: false };
            }
            return f;
        });
        dispatch(setFriends(updatedList));
    };

    const handleCreateGroup = () => {
        if (selectedMembers.length < 2) {
            alert('Nhóm phải có ít nhất 3 thành viên');
            return;
        }
        let tempMembers = selectedMembers.map(m => m._id);
        tempMembers = [...tempMembers, user._id];
        connectSocket.emit('create new conversation', {
            nameGroup: groupName,
            isGroup: true,
            administrators: [user._id],
            members: tempMembers,
            image: avatarGroup,
        });
        console.log(members);
        console.log("avt", avatarGroup);
         console.log(tempMembers);
        // Reset selected members and group name
        setSelectedMembers([]);
        setGroupName('');
        // Reset avatar to default
        setAvatarGroup('https://uploadfile2002.s3.ap-southeast-1.amazonaws.com/group-user-circle.png');
        toggleModal(); // Close the modal after creating the group
    };
    

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const localUrl = URL.createObjectURL(file);
            setAvatarGroup(localUrl); // Update avatar with local URL

            const formData = new FormData();
            formData.append('image', file);
            try {
                const uploadResponse = await messageApi.uploadFile(formData);
                const avatarUrl = uploadResponse.data;
                setAvatarGroup(avatarUrl); // Update avatar with server URL
            } catch (error) {
                console.error('Error uploading avatar:', error);
            }
        }
    };

    return (
        <>
            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal" style={{ backgroundColor: '#242424' }}>
                        <div className="modal-content" style={{ width: '500px', height: '600px', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'column' }}>
                            <Text style={{ fontSize: '24px', fontWeight: 600, color: 'white', marginBottom: '20px' }}>Tạo nhóm</Text>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '450px', alignItems: 'center' }}>
                                <Button style={{ border: 'none', background: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <img src={avatarGroup} style={{ height: '30px', width: '30px', borderRadius: '50%', marginLeft: '5px' }} alt='avatar'></img>
                                    <input type="file" style={{ display: 'none' }} id="avatarUpload" accept="image/*" onChange={handleAvatarChange} />
                                    <label htmlFor="avatarUpload" style={{ cursor: 'pointer', marginLeft: '10px', color: 'white' }}>Chọn ảnh</label>
                                </Button>

                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#36373A', paddingLeft: '10px', width: '400px', borderRadius: '8px' }}>
                                    <input type='text' placeholder={i18next.t('datTenNhom')} onChange={(evt) => setGroupName(evt.target.value)} style={{ width: '100%', height: '40px', background: '#36373A', marginLeft: '5px', border: 'hidden', outline: 'none', color: '#FFF', borderRadius: '10px' }}></input>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#36373A', paddingLeft: '10px', width: '450px', borderRadius: '8px', marginTop: '10px' }}>
                                <IoIosSearch style={{ fontSize: '18', color: '#FFF' }} />
                                <input type='text' placeholder={i18next.t('nhapSoDienThoaiHoacTen')} onChange={(evt) => setKeyword(evt.target.value)} style={{ width: '100%', height: '40px', background: '#36373A', marginLeft: '5px', border: 'hidden', outline: 'none', color: '#FFF', borderRadius: '10px' }}></input>
                            </div>
                            <div style={{ width: '100%', height: '380px' }}>
                                <div ref={scrollRef} style={{ overflowY: 'auto', background: '#242424', width: '100%', height: '100%' }}>
                                    {Array.isArray(listFriends) && listFriends.map((user, index) => (
                                        <div key={index} style={{ display: 'flex', width: '90%', background: '#242424', padding: '5px', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', marginLeft: '25px', border: '2px solid #2E2E2E', borderRadius: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img src={user.image} style={{ height: '30px', width: '30px', borderRadius: '50%', marginLeft: '5px' }} alt='user'></img>
                                                <Text style={{ marginLeft: '20px', color: 'white', fontSize: '16px' }}>{user.name}</Text>
                                            </div>
                                            {!user.addStatus && (
                                                <Button style={{ display: 'flex', width: '40px', height: '40px', background: '#36373A', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden' }}
                                                    onClick={() => handleAddMember(user)}>
                                                    <IoMdAdd style={{ fontSize: '30', color: '#FFF' }} />
                                                </Button>
                                            )}
                                            {user.addStatus && (
                                                <Button style={{ display: 'flex', width: '40px', height: '40px', background: '#FF6347', borderRadius: '100%', justifyContent: 'center', alignItems: 'center', border: 'hidden' }}
                                                    onClick={() => handleRemoveMember(user)}>
                                                    <MdDelete style={{ fontSize: '30', color: '#FFF' }} />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div style={{ width: '470px', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                    <Button style={{ width: '100px', height: '40px' }} onClick={toggleModal}>
                                        <Text>Hủy</Text>
                                    </Button>
                                    <Button style={{ width: '100px', height: '40px', marginLeft: '10px', backgroundColor: '#36373A' }} onClick={handleCreateGroup}>
                                        <Text style={{ color: 'white' }}>Tạo nhóm</Text>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Modal;
