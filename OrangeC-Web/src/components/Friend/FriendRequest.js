import { Button, Col, Row, Typography } from "antd";

import { MdDelete } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

import { FaCheck } from "react-icons/fa";
import React, { useCallback, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { CiBoxList, CiSearch } from "react-icons/ci";
import { IoPersonAddOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
// import { addFriendRequests, deleteFriendRequest, fetchFriendRequests } from '../../redux/friendSlice';
import FriendApi from "../../apis/FriendApi";
import connectSocket from "../../server/ConnectSocket";
import {
  addFriendRequests,
  deleteFriendRequest,
  fetchFriendRequests,
} from "../../redux/friendSilce";
// import connectSocket from './../../server/connectSocket';

const { Text, Title } = Typography;

export default function FriendsRequest() {
  const user = useSelector((state) => state.authLogin.user);
  console.log(user._id);
  const dispatch = useDispatch();
  // const [friendsRequest, setFriendsRequest] = useState([]);

  // useEffect(() => {
  //     const fetchFriendsRequestData = async () => {
  //         try {
  //             const friendsRequestData = await FriendApi.getFriendRequests({ userId: user._id });
  //             setFriendsRequest(friendsRequestData.data);
  //         } catch (error) {
  //             console.log('Error fetching friends:', error);
  //         }
  //     };

  //     if (user && user._id) {
  //         fetchFriendsRequestData();
  //     }
  // }, [user]);
  // console.log('FriendsRequest:', friendsRequest);
  const listFriendRequests = useSelector(
    (state) => state.friend.listFriendRequests
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(fetchFriendRequests(user._id));
        console.log(listFriendRequests);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //   useEffect(() => {
  //     connectSocket.on("newFriendRequest", (data) => {
  //       console.log("aaa");
  //       dispatch(addFriendRequests(data));
  //     });
  //     connectSocket.on("rejectFriendRequest", (data) => {
  //       console.log("bbb");
  //       if (data) dispatch(deleteFriendRequest(data._id));
  //     });
  //   }, []);

  useEffect(() => {
    connectSocket.on("newFriendRequest", (data) => {
      console.log("data: " + data);
      dispatch(addFriendRequests(data));
    });
    connectSocket.on("rejectFriendRequest", (data) => {
      console.log(data);
      if (data) dispatch(deleteFriendRequest(data._id));
    });
  }, []);

  return (
    <Row style={{ width: "100vw", height: "90vh", background: "#242424" }}>
      <Col
        span={6}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #2E2E2E",
        }}
      >
        {/* 
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#36373A', paddingLeft: '10px', width: '90%', borderRadius: '8px', marginTop: '40px' }}>
                    <IoIosSearch style={{ fontSize: '18', color: '#FFF' }} />
                    <input type='text' placeholder='Tìm kiếm' style={{ width: '90%', height: '40px', background: '#36373A', marginLeft: '5px', border: 'hidden', outline: 'none', color: '#FFF', borderRadius: '10px' }}></input>
                </div> */}

        <Button
          style={{
            display: "flex",
            border: "2px solid #2E2E2E",
            width: "90%",
            height: "10%",
            background: "#242424",
            padding: "20px",
            alignItems: "center",
            justifyContent: "space-evenly",
            marginTop: "20px",
          }}
        >
          <Link to={"/Friend"} style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <CiBoxList style={{ fontSize: "20", color: "#FFF" }} />
              <Text
                style={{ marginLeft: "20px", color: "white", fontSize: "20px" }}
              >
                Danh sách bạn bè
              </Text>
            </div>
            <div style={{ width: "100%" }}></div>
          </Link>
        </Button>
        <Button
          style={{
            display: "flex",
            border: "2px solid #2E2E2E",
            width: "90%",
            height: "10%",
            background: "#242424",
            padding: "20px",
            alignItems: "center",
            justifyContent: "space-evenly",
            marginTop: "10px",
          }}
        >
          <Link to={"/FriendRequest"} style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <IoPersonAddOutline style={{ fontSize: "20", color: "#FFF" }} />
              <Text
                style={{ marginLeft: "20px", color: "white", fontSize: "20px" }}
              >
                Lời mời kết bạn
              </Text>
            </div>
            <div style={{ width: "100%" }}></div>
          </Link>
        </Button>
        <Button
          style={{
            display: "flex",
            border: "2px solid #2E2E2E",
            width: "90%",
            height: "10%",
            background: "#242424",
            padding: "20px",
            alignItems: "center",
            justifyContent: "space-evenly",
            marginTop: "20px",
          }}
        >
          <Link to={"/FriendSearch"} style={{ width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <CiSearch style={{ fontSize: "20", color: "#FFF" }} />
              <Text
                style={{ marginLeft: "20px", color: "white", fontSize: "20px" }}
              >
                Tìm kiếm bạn bè
              </Text>
            </div>
            <div style={{ width: "100%" }}></div>
          </Link>
        </Button>
      </Col>

      <Col
        span={18}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #2E2E2E",
        }}
      >
        <header
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#FFF",
            arginLeft: "30px",
            marginTop: "30px",
            marginBottom: "20px",
          }}
        >
          Lời mời kết bạn
        </header>
        {Array.isArray(listFriendRequests) &&
          listFriendRequests?.map((friends, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                width: "90%",
                background: "#242424",
                padding: "20px",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "10px",
                marginLeft: "30px",
                border: "2px solid #2E2E2E",
                borderRadius: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={friends.senderId.image}
                  style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                  alt="image"
                ></img>
                <Text
                  style={{
                    marginLeft: "20px",
                    color: "white",
                    fontSize: "20px",
                  }}
                >
                  {friends.senderId.name}
                </Text>
              </div>
              <div style={{ display: "flex" }}>
                <Button
                  style={{
                    display: "flex",
                    width: "50px",
                    height: "50px",
                    background: "#36373A",
                    borderRadius: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "hidden",
                  }}
                  onClick={() => {
                    connectSocket.emit("reject friend request", friends);
                    dispatch(deleteFriendRequest(friends._id));
                  }}
                >
                  <MdDelete style={{ fontSize: "40", color: "#FFF" }} />
                </Button>
                <Button
                  style={{
                    display: "flex",
                    width: "50px",
                    height: "50px",
                    background: "#36373A",
                    borderRadius: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "hidden",
                    marginLeft: "10px",
                  }}
                  onClick={() => {
                    connectSocket.emit("accept friend request", friends);
                    dispatch(deleteFriendRequest(friends._id));
                  }}
                >
                  <FaCheck style={{ fontSize: "40", color: "#FFF" }} />
                </Button>
              </div>
            </div>
          ))}
      </Col>
    </Row>
  );
}
