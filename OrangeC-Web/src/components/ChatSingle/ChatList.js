import React, { useEffect, useRef, useState } from "react";
import { Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import connectSocket from "../../server/ConnectSocket";
import conversationApi from "../../apis/conversationApi";
import {
  setConversationReload,
  setCurrentPage1,
} from "../../redux/currentSlice";
import { formatConversation } from "../../utils/formatConverstation";
import { setCoversation,setConversations } from "../../redux/conversationSlice";

const { Text } = Typography;

export default function ChatList() {
  // const user = JSON.parse(localStorage.getItem('user'));
  const user = useSelector((state) => state.authLogin.user);
  const dispatch = useDispatch();
  // const listConversations = JSON.parse(localStorage.getItem('conversations'));
  // const conversation = JSON.parse(localStorage.getItem("conversation"));
  // const [conversations, setConversations1] = useState([]);
  const conversations = useSelector((state) => state.conversation.conversations);
  const scrollRef = useRef(null);
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    if (!connect) {
      connectSocket.initSocket();
      setConnect(true);
    }
    getConversation();
  }, []);

  useEffect(() => {
    if (connect) {
      connectSocket.on("chat message", () => {
        console.log("conversation updated");
        getConversation();
      });
      connectSocket.on("recall message", () => {
        console.log("conversation updated");
        getConversation();
      });
      connectSocket.on("delete message", () => {
        console.log("conversation updated");
        getConversation();
      });
      
    }
  }, [connect]);

  const getConversation = async () => {
    try {
      const response = await conversationApi.getConversation({
        userId: user._id,
      });

      if (response) {
        const fmConversations = formatConversation({
          data: response.data,
          userId: user._id,
        });
        // setConversations(fmConversations);
        dispatch(setConversations(fmConversations));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleButtonClick = () => {
    dispatch(setCurrentPage1("ChatWindow"));
  };

  return conversations.map((item, index) => {
    const otherMember = item?.members.find((member) => member._id !== user._id);
    if (otherMember) {
      return (
        <div key={index} ref={scrollRef} style={{ overflowY: "auto" }}>
          <Button
            style={{
              display: "flex",
              width: "100%",
              height: "10%",
              background: "#242424",
              border: "hidden",
              marginTop: '10px'
            }}
            onClick={() => {
              dispatch(setCoversation(item));
              handleButtonClick();
              dispatch(setConversationReload(item._id));
            }}
          >
            <div>
              <img
                src={otherMember.image}
                style={{ width: "60px", height: "60px", borderRadius: "100%" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                marginLeft: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: "20px",
                    fontWeight: "700px",
                    color: "#FFF",
                  }}
                >
                  {otherMember.name}
                </Text>
                {/* <Text style={{ fontSize: '14px', fontWeight: '400px', color: '#666' }}>{item.time}</Text> */}
              </div>
              {item?.lastMessage?.senderId === user._id ? (
                  <Text
                    style={{
                      fontSize: "14px",
                      fontWeight: "400px",
                      color: "#666",
                      textAlign: "left",
                    }}
                  >
                    Bạn: {item?.lastMessage?.contentMessage}
                  </Text>
                ) : (
                <Text
                  style={{
                    fontSize: "14px",
                    fontWeight: "400px",
                    color: "#666",
                    textAlign: "left",
                  }}
                >
                  {item?.lastMessage?.contentMessage}
                </Text>
              )}
            </div>
          </Button>
        </div>
      );
    }
  });
}
