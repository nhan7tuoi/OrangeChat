
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FiX } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";
import { LuUserCheck } from "react-icons/lu";
import { LuUserPlus2 } from "react-icons/lu";
import { FaRegMessage } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button, Col, Row, Typography } from 'antd';
// import { deleteFriendRequest } from '../../redux/friendSlice';
import connectSocket from '../../server/ConnectSocket';
import { deleteFriendRequest } from '../../redux/friendSilce';
// import connectSocket from '../../server/connectSocket';

const { Text, Title } = Typography;

const StateButton = props => {

    //   const user = useSelector(state => state.auth.user);
    //   const dispatch = useDispatch();

    //   const sendFriendRequest = receiverId => {
    //     console.log(receiverId);
    //     const requestData = {
    //       senderId: user._id,
    //       receiverId: receiverId,
    //     };
    //     connectSocket.emit('send friend request', requestData);
    //   };
    //   //render khi accept  or reject friend request
    //   useEffect(() => {
    //     connectSocket.on('rejectFriendFequest', data => {
    //       console.log(data);
    //       if (data) props.onPressButton();
    //     });
    //     connectSocket.on('acceptFriendRequest', data => {
    //       console.log(data);
    //       if (data) props.onPressButton();
    //     });
    //   }, []);

    //   if (!props.listFriends.find(f => f._id === props.itemId)) {
    //     if (props.listFriendRequests.find(fq => fq.senderId === props.itemId)) {
    //       return (

    //         <div
    //           style={{
    //             flexDirection: 'row',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             width: 30,
    //           }}>
    //             <Button
    //             onClick={() => {

    //               const fq = props.listFriendRequests.find(
    //                 fq => fq.senderId === props.itemId,
    //               );
    //               if (fq) {
    //                 // FriendApi.reject({friendRequestId: fq._id});
    //                 connectSocket.emit('reject friend request', fq);
    //                 dispatch(deleteFriendRequest(fq._id));
    //                 props.onPressButton();
    //               }
    //             }}>

    //              <FiX style={{ fontSize: '40', color: '#FFF' }}/>
    //           </Button>
    //           <Button
    //             onClick={() => {
    //               const fq = props.listFriendRequests.find(
    //                 fq => fq.senderId === props.itemId,
    //               );
    //               if (fq) {
    //                 // FriendApi.accept({friendRequestId: fq._id});
    //                 connectSocket.emit('accept friend request', fq);
    //                 connectSocket.emit('create new conversation', {
    //                   nameGroup: '',
    //                   isGroup: false,
    //                   members: [user._id, fq.senderId],
    //                 });
    //                 dispatch(deleteFriendRequest(fq._id));
    //                 props.onPressButton();
    //               }
    //             }}>

    //             <FaCheck style={{ fontSize: '40', color: '#FFF' }} />
    //           </Button>

    //         </div>
    //       );
    //     }
    //     if (
    //       props.listFriendRequests.find(
    //         fq => fq.senderId === user._id && fq.receiverId === props.itemId,
    //       )
    //     ) {
    //       return (
    //         <div
    //           style={{
    //             flexDirection: 'row',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //             width: 30,
    //           }}>
    //           <Button
    //             onClick={() => {
    //               const fq = props.listFriendRequests.find(
    //                 fq =>
    //                   fq.senderId === user._id && fq.receiverId === props.itemId,
    //               );
    //               if (fq) {
    //                 connectSocket.emit('reject friend request', fq);
    //                 props.onPressButton();
    //               }
    //             }}>

    //             <LuUserCheck style={{ fontSize: '40', color: '#FFF' }}/>


    //           </Button>
    //         </div>
    //       );
    //     }
    //     return (
    //       <div
    //         style={{
    //           flexDirection: 'row',
    //           justifyContent: 'space-between',
    //           alignItems: 'center',
    //           width: 30,
    //         }}>
    //         <Button
    //           onClick={() => {
    //             sendFriendRequest(props.itemId);
    //             props.onPressButton();
    //           }}>
    //           {/* {Icons.Icons({ name: 'userPlus', width: 32, height: 32 })}
    //            */}
    //               <LuUserPlus2 style={{ fontSize: '40', color: '#FFF' }}/>


    //         </Button>
    //       </div>
    //     );
    //   } else {
    //     return (
    //       <div
    //         style={{
    //           flexDirection: 'row',
    //           justifyContent: 'space-between',
    //           alignItems: 'center',
    //           width: 30,
    //         }}>
    //         <Button>

    //         <FaRegMessage style={{ fontSize: '40', color: '#FFF' }}/>
    //         </Button>
    //         <Button>
    //         <FaRegTrashAlt style={{ fontSize: '40', color: '#FFF' }}/>
    //         </Button>
    //       </div>
    //     );
    //   }
    const user = useSelector(state => state.authLogin.user);
    const dispatch = useDispatch();
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [isFriendDeleted, setIsFriendDeleted] = useState(false);
    // const sendFriendRequest = (receiverId) => {
    //     console.log(receiverId);
    //     const requestData = {
    //         senderId: user._id,
    //         receiverId: receiverId,
    //     };
    //     connectSocket.emit('send friend request', requestData);
    //     // Cập nhật trạng thái sau khi gửi yêu cầu thành công
    //     handleFriendRequestSent();
    // };
    const sendFriendRequest = receiverId => {
        console.log(receiverId);
        const requestData = {
          senderId: user._id,
          receiverId: receiverId,
        };
        connectSocket.emit('send friend request', requestData);
      };
    const handleFriendDelete = (receiverId) => {
        // Xóa bạn và cập nhật trạng thái sau khi xóa
        console.log(receiverId);
        connectSocket.emit('delete friend', {
            senderId: user._id,
            receiverId: receiverId,
          });
        //   dispatch(deleteFriend(receiverId));
        setIsFriendDeleted(true);
    };

    useEffect(() => {
        const rejectFriendRequestHandler = (data) => {
            console.log(data);
            if (data) props.onPressButton();
        };

        const acceptFriendRequestHandler = (data) => {
            console.log(data);
            if (data) props.onPressButton();
        };

        connectSocket.on('rejectFriendFequest', rejectFriendRequestHandler);
        connectSocket.on('acceptFriendRequest', acceptFriendRequestHandler);

        return () => {
            connectSocket.off('rejectFriendFequest', rejectFriendRequestHandler);
            connectSocket.off('acceptFriendRequest', acceptFriendRequestHandler);
        };
    }, []);

    if (!props.listFriends || !props.listFriendRequests) {
        return null; // Hoặc hiển thị một thông báo khác nếu cần
    }

    const isFriend = props.listFriends.some(f => f._id === props.itemId);
    const isFriendRequestSender = props.listFriendRequests.some(fq => fq.senderId === props.itemId);
    const isFriendRequestReceiver = props.listFriendRequests.some(fq => fq.senderId === user._id  && fq.receiverId === props.itemId);

    const handleRejectFriendRequest = (itemId) => {
        const fq = props.listFriendRequests.find(fq => fq.senderId === props.itemId);
        if (fq) {
            connectSocket.emit('reject friend request', fq);
            dispatch(deleteFriendRequest(fq._id));
            // props.onPressButton();
        }
        console.log(itemId);
    };

    const handleAcceptFriendRequest = (itemId) => {
        const fq = props.listFriendRequests.find(fq => fq.senderId === props.itemId);
        if (fq) {
            
            connectSocket.emit('accept friend request', fq);
            connectSocket.emit('create new conversation', {
                nameGroup: '',
                isGroup: false,
                members: [user._id, fq.senderId],
                
            });
           
            console.log(itemId);
            dispatch(deleteFriendRequest(fq._id));
            // props.onPressButton();
           
        }
    };
    const handleFriendRequestSent = () => {
        setIsRequestSent(true);
    };
    if (!isFriend) {
        if (isFriendRequestSender) {
            return (
                <div>
                    <Button onClick={() => handleRejectFriendRequest(props.itemId)} style={{ background: 'none', border: 'none' }}>
                        <FiX style={{ fontSize: '40', color: '#FFF' }} />
                    </Button>
                    <Button onClick={() => handleAcceptFriendRequest(props.itemId)} style={{ background: 'none', border: 'none' }}>    
                        <FaCheck style={{ fontSize: '40', color: '#FFF' }} />
                    </Button>
                    
                </div>
            );
        } else if (isFriendRequestReceiver) {
            return (
                <div>
                    <Button onClick={() => handleRejectFriendRequest(props.itemId)} style={{ background: 'none', border: 'none' }}>
                        <LuUserCheck style={{ fontSize: '40', color: '#FFF' }} />
                    </Button>
                </div>
            );
        } else {
            return (
                <div>
                    {!isRequestSent ? (
                        <Button onClick={() => { sendFriendRequest(props.itemId); handleFriendRequestSent(); }} style={{ background: 'none', border: 'none' }}>
                            <LuUserPlus2 style={{ fontSize: '40', color: '#FFF' }} />
                        </Button>
                    ) : (
                        // Icon hoặc thông báo khác nếu yêu cầu đã được gửi thành công
                        <FaCheck style={{ fontSize: '40', color: '#FFF' }} />
                    )}
                </div>
            );
        }
    } else {
        return (
            <div>
                 {!isFriendDeleted ? (
                    <Button onClick={() => handleFriendDelete(props.itemId)} style={{ background: 'none', border: 'none' }}>
                        <FaRegTrashAlt style={{ fontSize: '40', color: '#FFF' }} />
                    </Button>
                ) : (
                    // Icon hoặc thông báo khác nếu bạn đã bị xóa thành công
                    // <p>Friend deleted successfully!</p>
                    <LuUserPlus2 style={{ fontSize: '40', color: '#FFF' }} />
                )}
                <Button style={{ background: 'none', border: 'none' }}>
                    <FaRegMessage style={{ fontSize: '40', color: '#FFF' }} />
                </Button>
            </div>
        );
    }
};

export default StateButton;

// const styles = StyleSheet.create({});