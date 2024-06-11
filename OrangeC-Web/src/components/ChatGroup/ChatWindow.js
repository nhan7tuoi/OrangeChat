import { Col, Row, Typography, Button, Alert } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import { LuPhone, LuSticker } from "react-icons/lu";
import { BsCameraVideo, BsImage } from "react-icons/bs";
import { FaRegSquarePlus, FaUserLarge } from "react-icons/fa6";
import { MdSend } from "react-icons/md";
import { FaSmile, FaFile, FaReply } from "react-icons/fa";
import conversationApi from "../../apis/conversationApi";
import connectSocket from "../../server/ConnectSocket";
import { useSelector, useDispatch } from "react-redux";
import {
  setConversationGroups,
  setConversations,
  setCoversation,
} from "../../redux/conversationSlice";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";
import messageApi from "../../apis/messageApi";
import "../../css/chatWindow.css";
import { IoMdMore } from "react-icons/io";
import { TbMessageCircleX } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { RiShareForwardFill } from "react-icons/ri";
import { MdOutlineGroups3 } from "react-icons/md";
import { MdOutlineCloseFullscreen } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

import ModalManageGroup from "./ModalManageGroup";
import ModalAddMemberGroup from "./ModalAddMemberGroup";
import i18next from "../../i18n/i18n";
import { formatOneConversation } from "../../utils/formatOneConverstation";
import ForwardModal from "../ChatSingle/ForwardModal";
import currentSlice, { setCurrentPage2 } from "../../redux/currentSlice";
import Icons from "../../themes/Icons";
import { setSticker } from "../../redux/stickerSlice";
import stickerApi from "../../apis/stickerApi";
import { formatConversation } from "../../utils/formatConverstation";

const { Text } = Typography;

export default function ChatWindow() {
  const stickerData = useSelector((state) => state.sticker.stickers);
  const user = useSelector((state) => state.authLogin.user);
  const conversation1 = useSelector((state) => state.conversation.conversation);
  console.log("conver", conversation1);
  const receiverId = conversation1?.members?.filter(
    (member) => member._id !== user._id
  );
  const conversationId = useSelector(
    (state) => state.current.conversationReload
  );

  const conversationRef = useRef(conversation1);


  const userId = user._id;
  const [isOpenAddMember, setIsOpenAddMember] = useState(false);
  const [isOpenManageGroup, setIsOpenManageGroup] = useState(false);
  const [isShowReCall, setIsShowReCall] = useState(false);
  const [selectedPack, setSelectedPack] = useState(stickerData[0]);
  const [showReactionIndex, setShowReactionIndex] = useState(-1);
  const [openStiker, setOpenSticker] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [reactionMsg, setReactionMsg] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchStickers() {
      try {
        const stickers = await stickerApi.getSticker();
        dispatch(setSticker(stickers));
        console.log("sticerfetch");
      } catch (error) {
        console.error("Error fetching stickers:", error);
      }
    }

    fetchStickers();
  }, [dispatch]);

  useEffect(() => {
    getLastMessage();
    console.log("fetch message");
  }, [conversationId]);

  useEffect(() => {
    fetchData();
  }, []);

  const [listFriend, setListFriends] = useState([]);

  const fetchData = async () => {
    try {
      const response = await conversationApi.getAllConversation({
        userId: user._id,
      });
      if (response) {
        const fConversation = formatConversation({
          data: response.data,
          userId: user._id,
        });
        setListFriends(fConversation);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const toggleAddMemberModal = () => {
    setIsOpenAddMember(!isOpenAddMember);
  };

  const toggleManageGroupModal = () => {
    setIsOpenManageGroup(!isOpenManageGroup);
  };

  const scrollRef = useRef(null);
  // const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  // const [itemSelected, setItemSelected] = useState({});
  const [inputMessage, setInputMessage] = useState("");
  const fileImageRef = useRef(null);
  const fileRef = useRef(null);

  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };

  useEffect(() => {
    conversationRef.current = conversation1;
    getLastMessage();
    console.log("fetch message");
  }, [conversationId]);

  const getLastMessage = async () => {
    const response = await messageApi.getMessage({
      conversationId: conversationRef.current._id,
    });
    if (response) {
      setMessages(response.data);
    }
  };

  useEffect(() => {
    // Lấy phần tử div bên trong
    const scrollElement = scrollRef.current;
    // Nếu có phần tử và đã có tin nhắn mới, cuộn xuống dưới cùng của phần tử
    if (scrollElement && messages?.length > 0) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  const handleInputText = (text) => {
    setInputMessage(text);
  };
  //- gửi tin nhắn lên Socket
  const sendMessage = (message) => {
    connectSocket.emit("chat message", message);
    getConversation();
  };
  //- gửi tin nhắn TEXT
  const onSend = () => {
    // console.log("text item",itemSelected);
    if (!inputMessage.trim()) {
      return;
    }
    const newMessage = {
      conversationId: conversation1._id,
      senderId: userId,
      receiverId: receiverId,
      type: "text",
      contentMessage: inputMessage,
      urlType: "",
      createAt: new Date(),
      isDeleted: false,
      reaction: [],
      isSeen: false,
      isReceive: false,
      isSend: false,
      isRecall: false,
      reply: itemSelected != null ? itemSelected : null,
    };
    console.log("Chat text: ", newMessage);
    setInputMessage("");
    sendMessage(newMessage);
    setItemSelected(null);
    setRepSelected(null);
    // console.log("reply",newMessage.reply);
  };

  const onSendSticker = (url) => {
    const newMessage = {
      conversationId: conversation1._id,
      senderId: userId,
      receiverId: receiverId,
      type: "sticker",
      urlType: url,
      createAt: new Date(),
      deleteBy: [],
      reaction: [],
      isSeen: false,
      isReceive: false,
      isSend: false,
      isRecall: false,
      reply: itemSelected != null ? itemSelected : null,
    };
    sendMessage(newMessage);
    setItemSelected(null);
    setRepSelected(null);
  };

  //

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    console.log("Selected image: ", file);

    try {
      const formData = new FormData();
      formData.append("image", file);

      let uploadResponse = await messageApi.uploadImage(formData);

      console.log("File Type: ", file.type);

      const mediaUrl = uploadResponse;
      console.log("Uploaded media URL: ", mediaUrl);

      if (mediaUrl) {
        const newMessage = {
          conversationId: conversation1._id,
          senderId: userId,
          receiverId: conversation1.members,
          type: file.type.startsWith("image/") ? "image" : "video",
          urlType: mediaUrl.data,
          createAt: new Date(),
          isDeleted: false,
          reaction: [],
          isSeen: false,
          isReceive: false,
          isSend: false,
          reply: itemSelected != null ? itemSelected : null,
        };
        console.log("Chat media message: ", newMessage);
        if (mediaUrl !== null) {
          sendMessage(newMessage);
          setItemSelected(null);
          setRepSelected(null);
        }
      } else {
        console.log("No media URL returned, message not sent.");
      }
    } catch (error) {
      console.error("Error processing media:", error);
    }
  };

  const onSelectFile = async (event) => {
    try {
      const file = event.target.files[0]; // Lấy tệp từ sự kiện
      console.log("file: ", file);
      const formData = new FormData();
      formData.append("image", file);
      console.log("Get all: ", formData.getAll("image"));

      const fileUrl = await messageApi.uploadFile(formData);
      console.log("File URL: ", fileUrl);
      const newMessage = {
        conversationId: conversation1._id,
        senderId: userId,
        receiverId: conversation1.members,
        type: "file",
        urlType: fileUrl.data,
        createAt: new Date(),
        isDeleted: false,
        reaction: [],
        isSeen: false,
        isReceive: false,
        isSend: false,
        typeFile: file.type,
        fileName: file.name,
        reply: itemSelected != null ? itemSelected : null,
      };
      sendMessage(newMessage);
      setItemSelected(null);
      setRepSelected(null);
      console.log("file message: ", newMessage);
    } catch (err) {
      console.log("Lỗi khi chọn tệp: " + err);
    }
  };

  //- show recall
  const showReCall = (isShowReCall) => {
    setIsShowReCall(isShowReCall);
  };

  // Thu hồi tin nhắn
  const recallMessage = (messageId) => {
    console.log("recall message", itemSelected);
    connectSocket.emit("recall message", {
      messageId: messageId,
      conversationId: conversation1._id,
    });
    getConversation();
  };

  const deleteMessage = (messageId) => {
    console.log("deleting", itemSelected);
    connectSocket.emit("delete message", {
      messageId: messageId,
      conversationId: conversation1._id,
      userDelete: user._id,
    });
    getConversation();
  };

  // Xử lý tin nhắn reply
  const replyMessage = (message) => {
    setItemSelected(message);
    console.log("Rep mess:", message);
  };

  // Reaction message
  //- Lấy index message
  const toggleReaction = (index) => {
    if (showReactionIndex === index) {
      setShowReactionIndex(-1);
    } else {
      setShowReactionIndex(index);
    }
  };
  //- send reaction lên socket
  const onSelectReaction = (index, reaction) => {
    connectSocket.emit("reaction message", {
      messageId: index,
      userId: user._id,
      reactType: reaction,
      receiverId: receiverId,
      conversationId: conversation1._id,
    });
    setShowReactionIndex(-1);
  };

  //get conversation
  const getConversation = async () => {
    try {
      const res = await conversationApi.getConversationGroups({
        userId: user._id,
      });
      if (res) {
        const fConversation = formatConversation({
          data: res.data,
          userId: user._id,
        });
        // setConversations(fConversation);
        dispatch(setConversationGroups(fConversation));
      }
    } catch (error) {
      console.error("Error fetching data a:", error);
    }
  };

  // Update data từ Socket gửi về
  useEffect(() => {
    // connectSocket.initSocket(user._id);
    // console.log("connect", user._id);

    connectSocket.on("chat message", (msg) => {
      getConversation();
      if (msg.conversationId === conversationRef.current._id) {
        console.log("new message", msg);
        setMessages((preMessage) => [...preMessage, msg]);
      }
    });
    connectSocket.on("reaction message", async (reaction) => {
      console.log("reaction message", reaction.messageId, reaction.reactType);
      const newMessages = messages.map((message) => {
        if (message._id === reaction.messageId) {
          message.reaction = [{ type: reaction.reactType }];
        }
        return message;
      });
      getLastMessage();
      // getConversation();
    });
    connectSocket.on("recall message", (msg) => {
      console.log("recall message", msg);
      if (msg.conversationId === conversationRef.current._id) {
        const newMessages = messages?.map((message) => {
          if (message._id === msg.messageId) {
            message.isRecall = true;
          }
          return message;
        });
        getLastMessage();
      }
      // getConversation();
    });
    connectSocket.on("delete message", (msg) => {
      console.log("delete message", msg);
      if (msg.conversationId === conversationRef.current._id) {
        const newMessages = messages.map((message) => {
          if (message._id === msg.messageId) {
            message.deleteBy = [{ userDelete: msg.userDelete }];
          }
          return message;
        });
        getLastMessage();
      }
      // getConversation();
    });

    // connectSocket.on("removeMember", (data) => {
    //   console.log('cc');
    //   setMessages((preMessage) => [...preMessage, data.notification]);
    //   getConversation();
    // });
    connectSocket.on("addMember", (data) => {
      setMessages((preMessage) => [...preMessage, data]);
      getConversation();
    });
    connectSocket.on("deletedMember", (data) => {
      if (conversationRef.current._id === data._id) {
        alert("Thông báo", "bạn đã bị xoá khỏi nhóm", [
          {
            text: "Đồng ý",
            onPress: () => {
              if (conversationRef.current.isGroup) 
                dispatch(setCurrentPage2("ChatWelcome"));
            },
          },
        ]);
      }
      getConversation();
    });
    connectSocket.on("disbandGroup", (data) => {
      if (data._id === conversationRef.current._id) {
        alert("Thông báo", "Nhóm không còn tồn tại", [
          {
            text: "Đồng ý",
            style: "cancel",
          },
        ]);
        // dispatch(setCoversation({}));
        dispatch(setCurrentPage2("ChatWelcome"));
        getConversation();
      }
    });
    connectSocket.on("deletedMember", (data) => {
      getConversation();
    });
    connectSocket.on("newConversationGroup", (data) => {
      getConversation();
    });
    connectSocket.on("addToGroup", (data) => {
      getConversation();
    });
    connectSocket.on("newConversationGroup", (data) => {
      getConversation();
    });
  }, []);

  const handleImageClick = () => {
    fileImageRef.current.click(); // Kích hoạt input file khi button được nhấn
    // console.log("fileInput: ", fileImageRef.current);
  };

  const handleFileClick = () => {
    fileRef.current.click(); // Kích hoạt input file khi button được nhấn
    // console.log("fileInput: ", fileInputRef.current);
  };

  const selectStickerPack = (pack) => {
    setSelectedPack(pack);
  };

  const StickerModal = () => {
    return (
      <div
        style={{
          height: "300px",
          width: "380px",
          backgroundColor: "#36373A",
          display: "flex",
          flexDirection: "column",
          // justifyContent: "flex-end",
          padding: "10px",
          borderTopWidth: "0.5px",
          border: "hidden",
          position: "absolute",
          borderRadius: "5%",
          bottom: "50px",
          right: "5%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "blue",
          }}
        >
          {stickerData.map((pack) => (
            <div
              key={pack.id}
              onClick={() => selectStickerPack(pack)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "0 10px",
                cursor: "pointer",
              }}
            >
              <img
                src={pack.data[0].url}
                alt="sticker"
                style={{ width: "35px", height: "35px" }}
              />
            </div>
          ))}
        </div>

        <div
          ref={scrollRef}
          style={{
            height: "260px",
            overflowY: "auto",
          }}
        >
          <h3
            style={{
              fontSize: "20px",
              color: "#FFF",
              fontWeight: "bold",
              paddingLeft: "10px",
            }}
          >
            {selectedPack.title}
          </h3>
          {selectedPack && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {selectedPack.data.map((item, index) => (
                <div
                  onClick={() => onSendSticker(item.url)}
                  key={index}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    margin: "5px", // Add margin to create spacing between stickers
                  }}
                >
                  <img
                    src={item.url}
                    // alt={`sticker-${index}`}
                    style={{ width: "80px", height: "80px" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const toggleStickerModal = () => {
    setOpenSticker(!openStiker);
  };

  const [isOpenReactionViewModel, setisOpenReactionViewModel] = useState(false);

  const toggleOpenReactionModal = () => {
    setisOpenReactionViewModel(!isOpenReactionViewModel);
  };

  const ReactionViewModel = ({ item }) => {
    return (
      <div>
        {isOpenReactionViewModel && (
          <div
            style={{
              width: "200px",
              position: "absolute",
              bottom: 0,
              backgroundColor: "grey",
              borderRadius: "5px",
              left: 60,
              display: isOpenReactionViewModel ? "block" : "none",
            }}
          >
            <div
              style={{
                borderBottom: "1px solid",
                borderColor: "#FFF",
                height: 40,
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 20,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Tất cả: {reactionMsg?.reaction?.length}
              </Text>
            </div>
            <div
              ref={scrollRef}
              style={{
                width: "100%",
                height: 100,
                overflowY: "auto",
                padding: 10,
              }}
            >
              {reactionMsg?.reaction?.map((item, index) =>
                item.type === "delete" ? null : (
                  <div
                    key={index}
                    style={{
                      width: "100%",
                      height: 60,
                      padding: 10,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <img
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          marginRight: 15,
                        }}
                        src={item?.userId?.image}
                        alt={item?.userId?.name}
                      />
                      <Text
                        style={{
                          color: "#FFF",
                          fontSize: 20,
                          fontWeight: "bold",
                          textAlign: "center",
                        }}
                      >
                        {item?.userId?.name}
                      </Text>
                    </div>
                    <div
                      style={{
                        width: "30%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {item?.type === "like"
                        ? Icons.Icons({ name: "like", width: 32, height: 32 })
                        : item?.type === "love"
                        ? Icons.Icons({ name: "love", width: 32, height: 32 })
                        : item?.type === "angry"
                        ? Icons.Icons({ name: "angry", width: 32, height: 32 })
                        : item?.type === "sad"
                        ? Icons.Icons({ name: "sad", width: 32, height: 32 })
                        : item?.type === "wow"
                        ? Icons.Icons({ name: "wow", width: 32, height: 32 })
                        : item?.type === "haha"
                        ? Icons.Icons({ name: "haha", width: 32, height: 32 })
                        : null}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const Reaction = ({ item, onSelectReaction }) => {
    const [isOpenReaction, setIsOpenReaction] = useState(false);

    const toggleOpenReaction = () => {
      setIsOpenReaction(!isOpenReaction);
    };
    return (
      <div style={{ position: "absolute" }}>
        <div
          style={{
            borderRadius: "100%",
            width: 18,
            height: 18,
            justifyContent: "center",
            alignItems: "center",
            // top: 10
          }}
          onClick={() => {
            toggleOpenReaction();
            // if (item.reaction.length > 0) {
            //   toggleOpenReactionModal();
            // }
          }}
        ></div>
        {isOpenReaction && item?.senderId._id !== userId && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              zIndex: 10,
              // marginTop: "30px",
              // marginLeft: "250px",
            }}
          >
            <div
              style={{ position: "absolute", width: 30, height: 30 }}
              onClick={() => onSelectReaction(item._id, "like")}
            >
              {Icons({ name: "like", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, left: 30 }}
              onClick={() => onSelectReaction(item._id, "love")}
            >
              {Icons({ name: "love", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, left: 60 }}
              onClick={() => onSelectReaction(item._id, "haha")}
            >
              {Icons({ name: "haha", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, left: 90 }}
              onClick={() => onSelectReaction(item._id, "wow")}
            >
              {Icons({ name: "wow", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, left: 120 }}
              onClick={() => onSelectReaction(item._id, "sad")}
            >
              {Icons({ name: "sad", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, left: 150 }}
              onClick={() => onSelectReaction(item._id, "angry")}
            >
              {Icons({ name: "angry", width: "100%", height: "100%" })}
            </div>
            <div
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                left: -40,
              }}
            >
              <div onClick={() => onSelectReaction(item._id, "delete")}>
                {Icons({ name: "deleteReact", width: "100%", height: "100%" })}
              </div>
            </div>
          </div>
        )}

        {isOpenReaction && item?.senderId._id == userId && (
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              width: "100%",
              zIndex: 10,
              // marginTop: "30px",
              // marginLeft: "250px",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                right: 150,
              }}
              onClick={() => onSelectReaction(item._id, "like")}
            >
              {Icons({ name: "like", width: "100%", height: "100%" })}
            </div>
            <div
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                right: 120,
              }}
              onClick={() => onSelectReaction(item._id, "love")}
            >
              {Icons({ name: "love", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, right: 90 }}
              onClick={() => onSelectReaction(item._id, "haha")}
            >
              {Icons({ name: "haha", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, right: 60 }}
              onClick={() => onSelectReaction(item._id, "wow")}
            >
              {Icons({ name: "wow", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, right: 30 }}
              onClick={() => onSelectReaction(item._id, "sad")}
            >
              {Icons({ name: "sad", width: "100%", height: "100%" })}
            </div>
            <div
              style={{ position: "absolute", width: 30, height: 30, right: 0 }}
              onClick={() => onSelectReaction(item._id, "angry")}
            >
              {Icons({ name: "angry", width: "100%", height: "100%" })}
            </div>
            <div
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                right: 190,
              }}
            >
              <div onClick={() => onSelectReaction(item._id, "delete")}>
                {Icons({ name: "deleteReact", width: "100%", height: "100%" })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const [isOpenShare, setIsOpenShare] = useState(false);

  const MessageWithIcons = ({ itemSelected }) => {
    const [showIcons, setShowIcons] = useState(false);

    const toggleIcons = () => {
      setShowIcons((prevShowIcons) => !prevShowIcons);
    };

    const handleActionClick = (action) => {
      action(itemSelected.messageId);
      setShowIcons(false);
    };

    const toggleForwardModal = () => {
      setIsOpenShare(!isOpenShare);
    };

    return (
      <div
        className="message"
        id="message-1"
        style={{ display: "flex", alignItems: "center" }}
      >
        <IoMdMore
          style={{ fontSize: "20px", color: "#F24E1E", cursor: "pointer" }}
          onClick={() => {
            toggleIcons();
            setItemSelected(itemSelected);
            localStorage.setItem("itemSelected", JSON.stringify(itemSelected));
            // console.log("MSSelected:", itemSelected);
          }}
        />
        <div
          className="icons"
          style={{ display: showIcons ? "block" : "none" }}
        >
          {itemSelected?.senderId._id === userId && (
            <Button
              style={{ background: "transparent" }}
              onClick={() => {
                handleActionClick(() => recallMessage(itemSelected._id));
                setItemSelected(null);
              }}
            >
              <TbMessageCircleX
                style={{ fontSize: "20px", color: "#F24E1E" }}
              />
            </Button>
          )}

          <Button
            style={{ background: "transparent" }}
            onClick={() =>
              handleActionClick(() => {
                console.log("itemSelected", itemSelected);
                // setMsgReply(itemSelected);
                // const repSelected = JSON.parse(localStorage.getItem('itemSelected'));
                // setMsgReply(x);
                // console.log("rep", x);
                replyMessage(itemSelected);
                setRepSelected(itemSelected);
                console.log("repSelected", repSelected);
                // setItemSelected(itemSelected);
              })
            }
          >
            <FaReply style={{ fontSize: "20px", color: "#F24E1E" }} />
          </Button>

          <Button
            style={{ background: "transparent" }}
            onClick={() => {
              handleActionClick(() => deleteMessage(itemSelected._id));
              setItemSelected(null);
            }}
          >
            <MdDelete style={{ fontSize: "20px", color: "#F24E1E" }} />
          </Button>
          <Button
            style={{ background: "transparent" }}
            onClick={() => {
              toggleForwardModal();
              setItemSelected(null);
            }}
          >
            <RiShareForwardFill
              style={{ fontSize: "20px", color: "#F24E1E" }}
            />
          </Button>
        </div>
        {isOpenShare && (
          <ForwardModal
            listFriend={listFriend}
            isOpen={isOpenShare}
            toggleForwardModal={toggleForwardModal}
          />
        )}
      </div>
    );
  };

  useEffect(() => {
    connectSocket.on("updateConversation", (data) => {
      if (conversationRef.current._id === data._id) {
        const temp = formatOneConversation({
          conversation: data,
          userId: user._id,
        });
        dispatch(setCoversation(temp));
      }
    }); 
    connectSocket.on("removeMember", (data) => {
      setMessages((preMessage) => [...preMessage, data.notification]);
      console.log("nhanm",data);
      if (conversationRef.current._id === data.conversation._id) {
        const temp = formatOneConversation({
          conversation: data.conversation,
          userId: user._id,
        });
        console.log("test remove");
        dispatch(setCoversation(temp));
        // if(data.conversation.members.find(m => m._id))
      }
      
    });
  }, []);

  const handleLeave = () => {
    if (
      conversation1.administrators?.length > 1 ||
      !conversation1.administrators?.includes(user._id)
    ) {
      if (
        (window.confirm(i18next.t("thongBao") + "\n" + i18next.t("xacNhanRoi")),
        dispatch(setCurrentPage2("ChatWelcome")))
        
      ) {

        connectSocket.emit("remove member", {
          conversation: conversation1,
          member: user,
        });
        getConversation();
      }
    } else {
      if (
        window.confirm(i18next.t("thongBao") + "\n" + i18next.t("dieuKienRoi"))
      ) {
      }
    }
  };
  const handleDisband = () => {
    // Hiển thị cửa sổ xác nhận giải tán nhóm
    if (window.confirm(i18next.t("xacNhanGiaiTan"))) {
      // Gửi yêu cầu giải tán nhóm đến server
      connectSocket.emit("disband the group", conversation1);
    }
  };

  const [inputEmoji, setInputEmoji] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiClick = (emojiObject) => {
    // setInputEmoji(e => e + emojiObject.emoji);
    // // setShowPicker(false);
    // console.log("emoji: ", emojiObject.emoji);
    setInputMessage(inputMessage + emojiObject.emoji);
  };

  const handleShowPicker = () => {
    setShowPicker((show) => !show);
  };

  const [repSelected, setRepSelected] = useState(itemSelected);

  const getLastWord = (text) => {
    const words = text.split(" ");
    const last = words[words.length - 1];
    return last;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "100%",
      }}
    >
      <Row style={{ height: "100%", width: "100%" }}>
        <Col span={18}>
          <div
            style={{
              borderColor: "#2E2E2E",
              border: "1px solid #2E2E2E",
              width: "100%",
              height: "90vh",
            }}
          >
            <div
              style={{
                display: "flex",
                margin: "20px",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex" }}>
                <div
                  style={{ width: "65px", height: "7vh", position: "relative" }}
                >
                  <img
                    src={conversation1?.image}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "100%",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      width: "10px",
                      height: "10px",
                      backgroundColor: "#F24E1E",
                      borderRadius: "100%",
                      bottom: 0,
                      right: 10,
                      borderColor: "#FFF",
                      border: "1px solid #FFF",
                    }}
                  ></div>
                </div>

                <div
                  style={{
                    marginLeft: "10px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "20px",
                      fontWeight: "800px",
                      color: "#FFF",
                      width: "100%",
                    }}
                  >
                    {conversation1?.nameGroup}
                  </Text>
                </div>
              </div>
              <div>
                <IoSearchSharp
                  style={{ fontSize: "20", margin: "10", color: "#FFF" }}
                />
                <LuPhone
                  style={{ fontSize: "20", margin: "10", color: "#FFF" }}
                />
                <BsCameraVideo
                  style={{ fontSize: "20", margin: "10", color: "#FFF" }}
                />
                <FaRegSquarePlus
                  style={{ fontSize: "20", margin: "10", color: "#FFF" }}
                />
              </div>
            </div>

            <div style={{ width: "100%", height: "640px" }}>
              <div
                ref={scrollRef}
                style={{
                  overflowY: "auto",
                  background: "#1B1B1B",
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Render message */}
                {messages?.map((item, index) => {
                  // console.log("item: ", item);
                  if (item.type === "first") {
                    return (
                      <div
                        key={index}
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#FFF",
                            fontSize: "16px",
                            fontWeight: "700",
                            textAlign: "center",
                            width: "100%",
                          }}
                        >
                          Chào mừng bạn đến với OrangeC - Nơi gắn kết bạn bè
                          online
                        </Text>
                      </div>
                    );
                  }
                  // Thông báo xóa nhóm
                  if (item.type === "notificationRemove") {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px 30px",
                        }}
                      >
                        <p
                          style={{
                            color: "#FFF",
                            fontSize: "12px",
                            textAlign: "center",
                          }}
                        >
                          {item.senderId.name} {i18next.t("thongBaoXoa")}
                        </p>
                      </div>
                    );
                  }
                  // Thông báo rời nhóm
                  if (item.type === "notificationLeave") {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px 30px",
                        }}
                      >
                        <p
                          style={{
                            color: "#FFF",
                            fontSize: "12px",
                            textAlign: "center",
                          }}
                        >
                          {item.senderId.name} {i18next.t("thongBaoRoi")}
                        </p>
                      </div>
                    );
                  }

                  // Thông báo thêm thành viên
                  if (item.type === "notificationAdd") {
                    return (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: "8px 30px",
                        }}
                      >
                        <p
                          style={{
                            color: "#FFF",
                            fontSize: "12px",
                            textAlign: "center",
                          }}
                        >
                          {item.senderId.name} {i18next.t("thongBaoThem")}
                        </p>
                      </div>
                    );
                  }
                  // Hiển thị text
                  if (
                    item.type === "text" &&
                    (item.deleteBy?.length == 0 ||
                      item.deleteBy?.find((f) => f !== user._id))
                  ) {
                    // console.log("item", item);
                    return (
                      <div
                        key={index}
                        style={
                          item?.senderId._id === userId
                            ? {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                              }
                            : {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                              }
                        }
                      >
                        {item?.senderId._id !== userId && (
                          <div>
                            <img
                              src={item.senderId.image}
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "16px",
                              }}
                            />
                            <div>
                              <Text
                                style={{
                                  fontSize: 12,
                                  paddingHorizontal: 2,
                                  color: "grey",
                                  // textAlign: "center",
                                  // position: "relative",
                                  // left: "10%",
                                  // top: 0,
                                }}
                              >
                                {getLastWord(item?.senderId.name)}
                              </Text>
                            </div>
                          </div>
                        )}

                        <Button
                          style={{
                            backgroundColor: "#F24E1E",
                            maxWidth: "60%",
                            padding: "2px",
                            borderRadius: "10px",
                            margin: "10px",
                            minWidth: "15%",
                            border: "hidden",
                            height: "100%",
                            marginTop: "20px",
                          }}
                        >
                          {item?.reply !== null && item.isReCall === false && (
                            <div
                              key={item._id}
                              style={{
                                width: "100%",
                                backgroundColor: "#FF6633",
                                padding: 10,
                                borderRadius: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text style={{ fontWeight: "bold" }}>
                                {item?.reply?.senderId?.name}
                              </Text>
                              {(item?.reply?.type === "text" && (
                                <Text
                                  style={{
                                    fontSize: 12,
                                    padding: 3,
                                    color: "grey",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.reply?.contentMessage}
                                </Text>
                              )) ||
                                (item?.reply?.type === "image" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                )) ||
                                (item?.reply?.type === "file" && (
                                  <Text
                                    // numberOfLines={3}
                                    style={{
                                      color: "#FFF",
                                      fontSize: 12,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item?.reply?.fileName}
                                  </Text>
                                )) ||
                                (item?.reply?.type === "video" && (
                                  <video
                                    src={item?.reply?.urlType[0]}
                                    resizeMode="contain"
                                    controls={false}
                                    fullscreen={false}
                                    paused={false}
                                    style={{
                                      width: 50,
                                      height: 50,
                                    }}
                                  ></video>
                                )) ||
                                (item?.reply?.type === "sticker" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                ))}
                            </div>
                          )}
                          <Text
                            style={{
                              fontSize: "14px",
                              padding: "3px",
                              color: "#FFF",
                              fontWeight: "600",
                            }}
                          >
                            {item.isReCall === true
                              ? "Đã thu hồi"
                              : item.contentMessage}

                            {item.isReCall === false && (
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <div>
                                  <Text
                                    style={
                                      item?.senderId === userId
                                        ? {
                                            textAlign: "right",
                                            fontSize: "12px",
                                            padding: "2px",
                                          }
                                        : {
                                            textAlign: "left",
                                            fontSize: "12px",
                                            padding: "2px",
                                          }
                                    }
                                  >
                                    {formatTime(item.createAt)}
                                  </Text>
                                </div>

                                <div
                                  onClick={() => {
                                    // toggleReaction(item._id);
                                    setReactionMsg(item);
                                    if (item.reaction.length > 0) {
                                      toggleOpenReactionModal();
                                    }
                                  }}
                                  style={
                                    item?.senderId === userId
                                      ? {
                                          position: "absolute",
                                          width:
                                            item.reaction.length > 0 ? 20 : 18,
                                          height: 18,
                                          borderRadius: "100px",
                                          backgroundColor: "grey",
                                          display: "flex",
                                          // flexDirection: "row",
                                          alignItems: "center",
                                          left: 5,
                                          bottom: -5,
                                          cursor: "pointer",
                                        }
                                      : {
                                          position: "absolute",
                                          width:
                                            item.reaction.length > 0 ? 20 : 18,
                                          height: 18,
                                          borderRadius: "100px",
                                          backgroundColor: "grey",
                                          display: "flex",
                                          // flexDirection: "row",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          right: 5,
                                          bottom: -5,
                                          cursor: "pointer",
                                        }
                                  }
                                >
                                  <div
                                    style={{
                                      borderRadius: "100%",
                                      width: 18,
                                      height: 18,
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "absolute",
                                    }}
                                    // onClick={() => toggleOpenReaction()}
                                  >
                                    {/* {item?.senderId === userId (
                                      
                                    )} */}
                                    <Icons
                                      name={
                                        item?.reaction.length === 0 ||
                                        item?.reaction[0]?.type === "delete"
                                          ? "iconTym"
                                          : item?.reaction[0]?.type
                                      }
                                      width={18}
                                      height={18}
                                    />

                                    {item?.reaction.length > 1 && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          left: -10,
                                          top: 0,
                                        }}
                                      >
                                        <Icons
                                          name={item?.reaction[1]?.type}
                                          width={18}
                                          height={18}
                                        />
                                        <ReactionViewModel item={item} />
                                      </div>
                                    )}
                                  </div>

                                  {/* {showReactionIndex == item._id && ( */}
                                  <Reaction
                                    onSelectReaction={onSelectReaction}
                                    item={item}
                                  />

                                  {/* )} */}
                                </div>
                              </div>
                            )}
                          </Text>
                        </Button>
                        <MessageWithIcons itemSelected={item} />
                      </div>
                    );
                  }

                  // Hiển thị Sticker
                  if (
                    item.type === "sticker" &&
                    (item.deleteBy?.length == 0 ||
                      item.deleteBy?.find((f) => f !== user._id))
                  ) {
                    return (
                      <div
                        key={index}
                        setItemSelected={setItemSelected}
                        showReCall={showReCall}
                        isShowReCall={isShowReCall}
                        style={
                          item?.senderId._id === userId
                            ? {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                              }
                            : {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                              }
                        }
                      >
                        {item?.senderId !== userId && (
                          <src
                            source={item.senderId.image}
                            style={{ width: 32, height: 32, borderRadius: 16 }}
                          />
                        )}

                        <Button
                          style={{
                            backgroundColor: "#F24E1E",
                            maxWidth: "20%",
                            height: "100%",
                            padding: "2px",
                            borderRadius: "10px",
                            margin: "10px",
                            minWidth: "10%",
                            border: "hidden",
                          }}
                        >
                          {item?.reply !== null && item.isReCall === false && (
                            <div
                              key={item._id}
                              style={{
                                width: "100%",
                                backgroundColor: "#FF6633",
                                padding: 10,
                                borderRadius: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text style={{ fontWeight: "bold" }}>
                                {item?.reply?.senderId?.name}
                              </Text>
                              {(item?.reply?.type === "text" && (
                                <Text
                                  style={{
                                    fontSize: 12,
                                    padding: 3,
                                    color: "grey",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.reply?.contentMessage}
                                </Text>
                              )) ||
                                (item?.reply?.type === "image" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                )) ||
                                (item?.reply?.type === "file" && (
                                  <Text
                                    // numberOfLines={3}
                                    style={{
                                      color: "#FFF",
                                      fontSize: 12,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item?.reply?.fileName}
                                  </Text>
                                )) ||
                                (item?.reply?.type === "video" && (
                                  <video
                                    src={item?.reply?.urlType[0]}
                                    resizeMode="contain"
                                    controls={false}
                                    fullscreen={false}
                                    paused={false}
                                    style={{
                                      width: 50,
                                      height: 50,
                                    }}
                                  ></video>
                                )) ||
                                (item?.reply?.type === "sticker" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                ))}
                            </div>
                          )}

                          {item.isReCall === false ? (
                            <div>
                              <img
                                src={item.urlType[0]}
                                alt="Sticker"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "10px",
                                  // margin: "10px",
                                  // minWidth: "10%",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <div>
                                  <Text
                                    style={
                                      item?.senderId === userId
                                        ? {
                                            textAlign: "right",
                                            fontSize: "12px",
                                            padding: "2px",
                                          }
                                        : {
                                            textAlign: "left",
                                            fontSize: "12px",
                                            padding: "2px",
                                          }
                                    }
                                  >
                                    {formatTime(item.createAt)}
                                  </Text>
                                </div>

                                <div
                                  // onClick={() => toggleOpenReaction()}

                                  style={
                                    item?.senderId === userId
                                      ? {
                                          position: "absolute",
                                          width:
                                            item.reaction.length > 0 ? 20 : 18,
                                          height: 18,
                                          borderRadius: "100px",
                                          backgroundColor: "grey",
                                          display: "flex",
                                          // flexDirection: "row",
                                          alignItems: "center",
                                          left: 5,
                                          bottom: -5,
                                          cursor: "pointer",
                                        }
                                      : {
                                          position: "absolute",
                                          width:
                                            item.reaction.length > 0 ? 20 : 18,
                                          height: 18,
                                          borderRadius: "100px",
                                          backgroundColor: "grey",
                                          display: "flex",
                                          // flexDirection: "row",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          right: 5,
                                          bottom: -5,
                                          cursor: "pointer",
                                        }
                                  }
                                >
                                  <div
                                    style={{
                                      borderRadius: "100%",
                                      width: 20,
                                      height: 20,
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "absolute",
                                    }}
                                    // onClick={() => toggleOpenReaction()}
                                  >
                                    {/* {item?.senderId === userId (
                                      
                                    )} */}
                                    <Icons
                                      name={
                                        item?.reaction.length === 0 ||
                                        item?.reaction[0]?.type === "delete"
                                          ? "iconTym"
                                          : item?.reaction[0]?.type
                                      }
                                      width={18}
                                      height={18}
                                    />

                                    {item?.reaction.length > 1 && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          left: -10,
                                          top: 0,
                                        }}
                                      >
                                        <Icons
                                          name={item?.reaction[1]?.type}
                                          width={18}
                                          height={18}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* {showReactionIndex == item._id && ( */}
                                  <Reaction
                                    onSelectReaction={onSelectReaction}
                                    item={item}
                                  />
                                  {/* )} */}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Text
                              style={{
                                fontSize: "14px",
                                padding: "3px",
                                color: "#FFF",
                                fontWeight: "600",
                              }}
                            >
                              Đã thu hồi
                            </Text>
                          )}
                        </Button>
                        <MessageWithIcons itemSelected={item} />
                      </div>
                    );
                  }
                  // Hiển thị Image
                  if (
                    item.type === "image" &&
                    (item.deleteBy?.length == 0 ||
                      item.deleteBy?.find((f) => f !== user._id))
                  ) {
                    return (
                      <div
                        key={index}
                        setItemSelected={setItemSelected}
                        showReCall={showReCall}
                        isShowReCall={isShowReCall}
                        style={
                          item?.senderId._id === userId
                            ? {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                              }
                            : {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                              }
                        }
                      >
                        {item?.senderId !== userId && (
                          <src
                            source={item.senderId.image}
                            style={{ width: 32, height: 32, borderRadius: 16 }}
                          />
                        )}

                        <Button
                          style={{
                            backgroundColor: "#F24E1E",
                            maxWidth: "30%",
                            height: "40%",
                            padding: "2px",
                            borderRadius: "10px",
                            margin: "10px",
                            minWidth: "10%",
                            border: "hidden",
                          }}
                        >
                          {item?.reply !== null && item.isReCall === false && (
                            <div
                              key={item._id}
                              style={{
                                width: "100%",
                                backgroundColor: "#FF6633",
                                padding: 10,
                                borderRadius: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text style={{ fontWeight: "bold" }}>
                                {item?.reply?.senderId?.name}
                              </Text>
                              {(item?.reply?.type === "text" && (
                                <Text
                                  style={{
                                    fontSize: 12,
                                    padding: 3,
                                    color: "grey",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.reply?.contentMessage}
                                </Text>
                              )) ||
                                (item?.reply?.type === "image" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                )) ||
                                (item?.reply?.type === "file" && (
                                  <Text
                                    // numberOfLines={3}
                                    style={{
                                      color: "#FFF",
                                      fontSize: 12,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item?.reply?.fileName}
                                  </Text>
                                )) ||
                                (item?.reply?.type === "video" && (
                                  <video
                                    src={item?.reply?.urlType[0]}
                                    resizeMode="contain"
                                    controls={false}
                                    fullscreen={false}
                                    paused={false}
                                    style={{
                                      width: 50,
                                      height: 50,
                                    }}
                                  ></video>
                                )) ||
                                (item?.reply?.type === "sticker" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                ))}
                            </div>
                          )}

                          {item.isReCall === false ? (
                            <div>
                              <img
                                src={item.urlType[0]}
                                alt="Sticker"
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  borderRadius: "10px",
                                  // margin: "10px",
                                  // minWidth: "10%",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <div>
                                  <Text
                                    style={
                                      item?.senderId === userId
                                        ? {
                                            textAlign: "right",
                                            fontSize: "12px",
                                            padding: "2px",
                                          }
                                        : {
                                            textAlign: "left",
                                            fontSize: "12px",
                                            padding: "2px",
                                          }
                                    }
                                  >
                                    {formatTime(item.createAt)}
                                  </Text>
                                </div>

                                <div
                                  // onClick={() => toggleOpenReaction()}

                                  style={
                                    item?.senderId === userId
                                      ? {
                                          position: "absolute",
                                          width:
                                            item.reaction.length > 0 ? 20 : 18,
                                          height: 18,
                                          borderRadius: "100px",
                                          backgroundColor: "grey",
                                          display: "flex",
                                          // flexDirection: "row",
                                          alignItems: "center",
                                          left: 5,
                                          bottom: -5,
                                          cursor: "pointer",
                                        }
                                      : {
                                          position: "absolute",
                                          width:
                                            item.reaction.length > 0 ? 20 : 18,
                                          height: 18,
                                          borderRadius: "100px",
                                          backgroundColor: "grey",
                                          display: "flex",
                                          // flexDirection: "row",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          right: 5,
                                          bottom: -5,
                                          cursor: "pointer",
                                        }
                                  }
                                >
                                  <div
                                    style={{
                                      borderRadius: "100%",
                                      width: 20,
                                      height: 20,
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "absolute",
                                    }}
                                    // onClick={() => toggleOpenReaction()}
                                  >
                                    {/* {item?.senderId === userId (
                                      
                                    )} */}
                                    <Icons
                                      name={
                                        item?.reaction.length === 0 ||
                                        item?.reaction[0]?.type === "delete"
                                          ? "iconTym"
                                          : item?.reaction[0]?.type
                                      }
                                      width={18}
                                      height={18}
                                    />

                                    {item?.reaction.length > 1 && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          left: -10,
                                          top: 0,
                                        }}
                                      >
                                        <Icons
                                          name={item?.reaction[1]?.type}
                                          width={18}
                                          height={18}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* {showReactionIndex == item._id && ( */}
                                  <Reaction
                                    onSelectReaction={onSelectReaction}
                                    item={item}
                                  />
                                  {/* )} */}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Text
                              style={{
                                fontSize: "14px",
                                padding: "3px",
                                color: "#FFF",
                                fontWeight: "600",
                              }}
                            >
                              Đã thu hồi
                            </Text>
                          )}
                        </Button>
                        <MessageWithIcons itemSelected={item} />
                      </div>
                    );
                  }
                  // Hiển thị File
                  if (
                    item.type === "file" &&
                    (item.deleteBy?.length == 0 ||
                      item.deleteBy?.find((f) => f !== user._id))
                  ) {
                    return (
                      <div
                        key={index}
                        setItemSelected={setItemSelected}
                        showReCall={showReCall}
                        isShowReCall={isShowReCall}
                        style={
                          item?.senderId._id === userId
                            ? {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                              }
                            : {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                              }
                        }
                      >
                        {item?.senderId._id !== userId && (
                          <src
                            source={conversation1.receiverImage}
                            style={{ width: 32, height: 32, borderRadius: 16 }}
                          />
                        )}

                        <Button
                          style={{
                            backgroundColor: "#F24E1E",
                            maxWidth: "30%",
                            height: "40%",
                            padding: "2px",
                            borderRadius: "10px",
                            margin: "10px",
                            minWidth: "10%",
                            border: "hidden",
                          }}
                        >
                          {item?.reply !== null && item.isReCall === false && (
                            <div
                              key={item._id}
                              style={{
                                width: "100%",
                                backgroundColor: "#FF6633",
                                padding: 10,
                                borderRadius: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text style={{ fontWeight: "bold" }}>
                                {item?.reply?.senderId?.name}
                              </Text>
                              {(item?.reply?.type === "text" && (
                                <Text
                                  style={{
                                    fontSize: 12,
                                    padding: 3,
                                    color: "grey",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.reply?.contentMessage}
                                </Text>
                              )) ||
                                (item?.reply?.type === "image" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                )) ||
                                (item?.reply?.type === "file" && (
                                  <Text
                                    // numberOfLines={3}
                                    style={{
                                      color: "#FFF",
                                      fontSize: 12,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item?.reply?.fileName}
                                  </Text>
                                )) ||
                                (item?.reply?.type === "video" && (
                                  <video
                                    src={item?.reply?.urlType[0]}
                                    resizeMode="contain"
                                    controls={false}
                                    fullscreen={false}
                                    paused={false}
                                    style={{
                                      width: 50,
                                      height: 50,
                                    }}
                                  ></video>
                                )) ||
                                (item?.reply?.type === "sticker" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                ))}
                            </div>
                          )}

                          {item.isReCall === false ? (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                padding: "2px",
                                width: "100%",
                                height: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {/* <Button
                                onClick={() => {
                                  window.open(item.urlType, "_blank");
                                }}
                                style={{
                                  flexDirection: "row",
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: "#FFF",
                                  border: "hidden",
                                }}
                              > */}
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  // backgroundColor: "red",
                                }}
                              >
                                <div
                                  onClick={() => {
                                    window.open(item.urlType, "_blank");
                                  }}
                                >
                                  <FaFile
                                    style={{
                                      fontSize: "35",
                                      color: "#FFF",
                                    }}
                                  />

                                  <Text
                                    style={{
                                      fontSize: 14,
                                      color: "#36373A",
                                      fontWeight: "700",
                                      whiteSpace: "pre-wrap",
                                    }}
                                  >
                                    {item.fileName}
                                  </Text>
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                  }}
                                >
                                  <div>
                                    <Text
                                      style={
                                        item?.senderId === userId
                                          ? {
                                              textAlign: "right",
                                              fontSize: "12px",
                                              padding: "2px",
                                            }
                                          : {
                                              textAlign: "left",
                                              fontSize: "12px",
                                              padding: "2px",
                                            }
                                      }
                                    >
                                      {formatTime(item.createAt)}
                                    </Text>
                                  </div>

                                  <div
                                    // onClick={() => toggleOpenReaction()}

                                    style={
                                      item?.senderId === userId
                                        ? {
                                            position: "absolute",
                                            width:
                                              item.reaction.length > 0
                                                ? 20
                                                : 18,
                                            height: 18,
                                            borderRadius: "100px",
                                            backgroundColor: "grey",
                                            display: "flex",
                                            // flexDirection: "row",
                                            alignItems: "center",
                                            left: 5,
                                            bottom: -5,
                                            cursor: "pointer",
                                          }
                                        : {
                                            position: "absolute",
                                            width:
                                              item.reaction.length > 0
                                                ? 20
                                                : 18,
                                            height: 18,
                                            borderRadius: "100px",
                                            backgroundColor: "grey",
                                            display: "flex",
                                            // flexDirection: "row",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            right: 5,
                                            bottom: -5,
                                            cursor: "pointer",
                                          }
                                    }
                                  >
                                    <div
                                      style={{
                                        borderRadius: "100%",
                                        width: 20,
                                        height: 20,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        position: "absolute",
                                      }}
                                      // onClick={() => toggleOpenReaction()}
                                    >
                                      {/* {item?.senderId === userId (
                                      
                                    )} */}
                                      <Icons
                                        name={
                                          item?.reaction.length === 0 ||
                                          item?.reaction[0]?.type === "delete"
                                            ? "iconTym"
                                            : item?.reaction[0]?.type
                                        }
                                        width={18}
                                        height={18}
                                      />

                                      {item?.reaction.length > 1 && (
                                        <div
                                          style={{
                                            position: "absolute",
                                            left: -10,
                                            top: 0,
                                          }}
                                        >
                                          <Icons
                                            name={item?.reaction[1]?.type}
                                            width={18}
                                            height={18}
                                          />
                                        </div>
                                      )}
                                    </div>

                                    {/* {showReactionIndex == item._id && ( */}
                                    <Reaction
                                      onSelectReaction={onSelectReaction}
                                      item={item}
                                    />
                                    {/* )} */}
                                  </div>
                                </div>
                              </div>
                              {/* </Button> */}
                            </div>
                          ) : (
                            <Text
                              style={{
                                fontSize: "14px",
                                padding: "3px",
                                color: "#FFF",
                                fontWeight: "600",
                              }}
                            >
                              Đã thu hồi
                            </Text>
                          )}
                        </Button>
                        <MessageWithIcons itemSelected={item} />
                      </div>
                    );
                  }
                  // Hiển thị Video
                  if (
                    item.type === "video" &&
                    (item.deleteBy?.length == 0 ||
                      item.deleteBy?.find((f) => f !== user._id))
                  ) {
                    return (
                      <div
                        key={index}
                        setItemSelected={setItemSelected}
                        showReCall={showReCall}
                        isShowReCall={isShowReCall}
                        style={
                          item?.senderId._id === userId
                            ? {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-end",
                                justifyContent: "flex-end",
                              }
                            : {
                                display: "flex",
                                flexDirection: "row",
                                paddingLeft: "10px",
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                              }
                        }
                      >
                        {item?.senderId._id !== userId && (
                          <src
                            source={conversation1.receiverImage}
                            style={{ width: 32, height: 32, borderRadius: 16 }}
                          />
                        )}
                        <Button
                          style={{
                            backgroundColor: "#F24E1E",
                            maxWidth: "30%",
                            height: "40%",
                            padding: "2px",
                            borderRadius: "10px",
                            margin: "10px",
                            minWidth: "10%",
                            border: "hidden",
                          }}
                        >
                          {item?.reply !== null && item.isReCall === false && (
                            <div
                              key={item._id}
                              style={{
                                width: "100%",
                                backgroundColor: "#FF6633",
                                padding: 10,
                                borderRadius: 10,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                              }}
                            >
                              <Text style={{ fontWeight: "bold" }}>
                                {item?.reply?.senderId?.name}
                              </Text>
                              {(item?.reply?.type === "text" && (
                                <Text
                                  style={{
                                    fontSize: 12,
                                    padding: 3,
                                    color: "grey",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item?.reply?.contentMessage}
                                </Text>
                              )) ||
                                (item?.reply?.type === "image" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                )) ||
                                (item?.reply?.type === "file" && (
                                  <Text
                                    // numberOfLines={3}
                                    style={{
                                      color: "#FFF",
                                      fontSize: 12,
                                      fontWeight: 600,
                                    }}
                                  >
                                    {item?.reply?.fileName}
                                  </Text>
                                )) ||
                                (item?.reply?.type === "video" && (
                                  <video
                                    src={item?.reply?.urlType[0]}
                                    resizeMode="contain"
                                    controls={false}
                                    fullscreen={false}
                                    paused={false}
                                    style={{
                                      width: 50,
                                      height: 50,
                                    }}
                                  ></video>
                                )) ||
                                (item?.reply?.type === "sticker" && (
                                  <img
                                    src={item?.reply?.urlType[0]}
                                    style={{
                                      width: 50,
                                      height: 50,
                                      borderRadius: 5,
                                    }}
                                  />
                                ))}
                            </div>
                          )}

                          {item.isReCall === false ? (
                            <div>
                              <video
                                src={item.urlType[0]}
                                controls
                                muted
                                style={{
                                  maxWidth: "95%",
                                  maxHeight: "95%",
                                  borderRadius: "10px",
                                  // margin: "10px",
                                  backgroundColor: "#F24E1E",
                                }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "flex-start",
                                }}
                              >
                                <div>
                                  <Text
                                    style={
                                      item?.senderId === userId
                                        ? {
                                            textAlign: "right",
                                            fontSize: "12px",
                                            padding: "2px",
                                          }
                                        : {
                                            textAlign: "left",
                                            fontSize: "12px",
                                            padding: "2px",
                                          }
                                    }
                                  >
                                    {formatTime(item.createAt)}
                                  </Text>
                                </div>

                                <div
                                  // onClick={() => toggleOpenReaction()}

                                  style={
                                    item?.senderId === userId
                                      ? {
                                          position: "absolute",
                                          width:
                                            item.reaction.length > 0 ? 20 : 18,
                                          height: 18,
                                          borderRadius: "100px",
                                          backgroundColor: "grey",
                                          display: "flex",
                                          // flexDirection: "row",
                                          alignItems: "center",
                                          left: 5,
                                          bottom: -5,
                                          cursor: "pointer",
                                        }
                                      : {
                                          position: "absolute",
                                          width:
                                            item.reaction.length > 0 ? 20 : 18,
                                          height: 18,
                                          borderRadius: "100px",
                                          backgroundColor: "grey",
                                          display: "flex",
                                          // flexDirection: "row",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          right: 5,
                                          bottom: -5,
                                          cursor: "pointer",
                                        }
                                  }
                                >
                                  <div
                                    style={{
                                      borderRadius: "100%",
                                      width: 20,
                                      height: 20,
                                      justifyContent: "center",
                                      alignItems: "center",
                                      position: "absolute",
                                    }}
                                    // onClick={() => toggleOpenReaction()}
                                  >
                                    {/* {item?.senderId === userId (
                                      
                                    )} */}
                                    <Icons
                                      name={
                                        item?.reaction.length === 0 ||
                                        item?.reaction[0]?.type === "delete"
                                          ? "iconTym"
                                          : item?.reaction[0]?.type
                                      }
                                      width={18}
                                      height={18}
                                    />

                                    {item?.reaction.length > 1 && (
                                      <div
                                        style={{
                                          position: "absolute",
                                          left: -10,
                                          top: 0,
                                        }}
                                      >
                                        <Icons
                                          name={item?.reaction[1]?.type}
                                          width={18}
                                          height={18}
                                        />
                                      </div>
                                    )}
                                  </div>

                                  {/* {showReactionIndex == item._id && ( */}
                                  <Reaction
                                    onSelectReaction={onSelectReaction}
                                    item={item}
                                  />
                                  {/* )} */}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <Text
                              style={{
                                fontSize: "14px",
                                padding: "3px",
                                color: "#FFF",
                                fontWeight: "600",
                              }}
                            >
                              Đã thu hồi
                            </Text>
                          )}
                        </Button>
                        <MessageWithIcons itemSelected={item} />
                      </div>
                    );
                  }
                })}
              </div>
            </div>

            {repSelected !== null && (
              <div
                style={{
                  height: "50px",
                  width: "100%",
                  backgroundColor: "#36373A",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderTopWidth: "0.5px",
                  borderColor: "#F24E1E",
                  borderStyle: "solid",
                  position: "absolute",
                  bottom: "13%",
                }}
              >
                <div style={{ width: "90%" }}>
                  <span style={{ color: "yellow" }}>
                    Đang trả lời{" "}
                    {repSelected?.senderId?._id === user._id
                      ? " chính bạn"
                      : repSelected?.senderId?.name}
                  </span>
                  <div
                    style={{
                      color: "gray",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {repSelected?.type === "text"
                      ? repSelected?.contentMessage
                      : repSelected?.type === "image"
                      ? "Hình ảnh"
                      : repSelected?.type === "File"
                      ? "Tệp"
                      : "Sticker"}
                  </div>
                </div>
                <div
                  style={{
                    width: "10%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <button
                    // onClick={() => setItemSelected(null)}
                    onClick={() => setRepSelected(null)}
                    style={{
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "red",
                      borderRadius: "10px",
                      marginTop: "5px",
                      // marginRight: "10px",
                      border: "none",
                      color: "#FFF",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                borderColor: "#2E2E2E",
                border: "1px solid #2E2E2E",
              }}
            >
              <div>
                <input
                  type="file"
                  onChange={onSelectFile}
                  ref={fileRef}
                  style={{ display: "none" }} // Ẩn input file
                  accept="*/*"
                />
                <Button
                  onClick={handleFileClick}
                  style={{
                    display: "flex",
                    margin: "5px",
                    background: "#242424",
                    border: "hidden",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FaFile style={{ fontSize: "30px", color: "#F24E1E" }} />
                </Button>
              </div>

              <div>
                <input
                  type="file"
                  multiple
                  ref={fileImageRef}
                  onChange={handleImageChange}
                  style={{ display: "none" }} // Ẩn input file
                  accept="image/*,video/*" // Chấp nhận cả ảnh và video
                />
                <Button
                  onClick={handleImageClick}
                  style={{
                    display: "flex",
                    marginLeft: "5px",
                    background: "#242424",
                    border: "hidden",
                    justifyContent: "center", // Thêm để căn giữa icon trong button
                    alignItems: "center", // Thêm để căn giữa icon trong button
                  }}
                >
                  <BsImage style={{ fontSize: "30px", color: "#F24E1E" }} />
                </Button>
              </div>

              <Button
                style={{
                  display: "flex",
                  background: "#242424",
                  border: "hidden",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                onClick={() => {
                  handleShowPicker();
                }}
              >
                <FaSmile style={{ fontSize: "30px", color: "#F24E1E" }} />
                {showPicker && (
                  <EmojiPicker
                    style={{
                      position: "absolute",
                      bottom: "40px",
                      left: "20px",
                    }}
                    onEmojiClick={handleEmojiClick}
                  />
                )}
              </Button>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  background: "#36373A",
                  borderRadius: "25px",
                  justifyContent: "space-between",
                  alignaItems: "center",
                  width: "100%",
                  margin: "10px",
                  height: "50px",
                }}
              >
                <input
                  value={inputMessage}
                  // value={inputEmoji}
                  onChange={(e) => {
                    handleInputText(e.target.value);

                    setInputEmoji(e.target.value);
                  }}
                  type="text"
                  placeholder="Nhập tin nhắn"
                  style={{
                    background: "#36373A",
                    border: "hidden",
                    fontSize: "18px",
                    outline: "none",
                    marginLeft: "20px",
                    color: "#FFF",
                    width: "100%",
                    borderRadius: "25px",
                  }}
                />
              </div>
              <Button
                style={{
                  display: "flex",
                  marginLeft: "10px",
                  background: "#242424",
                  border: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LuSticker
                  style={{ fontSize: "40", color: "#F24E1E" }}
                  onClick={toggleStickerModal}
                />
                {openStiker && <StickerModal />}
              </Button>

              <Button
                style={{
                  display: "flex",
                  marginLeft: "10px",
                  background: "#242424",
                  border: "hidden",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => {
                  onSend();
                }}
              >
                <MdSend style={{ fontSize: "40", color: "#F24E1E" }} />
              </Button>
            </div>
          </div>
        </Col>

        <Col
          span={6}
          style={{ display: "flex", flexDirection: "column", height: "90vh" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
              height: "100%",
              borderColor: "#2E2E2E",
              border: "1px solid #2E2E2E",
            }}
          >
            <img
              src={conversation1?.image}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "100%",
                marginTop: "30px",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: "800px",
                  color: "#FFF",
                  width: "100%",
                  marginTop: "20px",
                  fontWeight: "600",
                }}
              >
                {conversation1?.nameGroup}
              </Text>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "",
                width: "100%",
                marginTop: "30px",
              }}
            >
              <Button
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                  alignItems: "center",
                  marginTop: "30px",
                  background: "none",
                  border: "none",
                  height: "50px",
                }}
                onClick={toggleAddMemberModal}
              >
                <AiOutlineUsergroupAdd
                  style={{ fontSize: 24, color: "#FFF", margin: "10px" }}
                />
                <Text style={{ color: "#FFF", fontSize: "18px" }}>
                  Thêm thành viên
                </Text>
              </Button>
              <ModalAddMemberGroup
                isOpen={isOpenAddMember}
                toggleModal={toggleAddMemberModal}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <Button
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                  alignItems: "center",
                  marginTop: "0px",
                  background: "none",
                  border: "none",
                  height: "50px",
                }}
                onClick={toggleManageGroupModal}
              >
                <MdOutlineGroups3
                  style={{ fontSize: 24, color: "#FFF", margin: "10px" }}
                />
                <Text style={{ color: "#FFF", fontSize: "18px" }}>
                  Thành viên
                </Text>
              </Button>
              <ModalManageGroup
                isOpen={isOpenManageGroup}
                toggleModal={toggleManageGroupModal}
              />
            </div>
            {conversation1.administrators?.includes(user._id) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <Button
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    alignItems: "center",
                    marginTop: "10px",
                    background: "none",
                    border: "none",
                    height: "50px",
                  }}
                  onClick={() => {
                    if (
                      conversation1?.administrators?.find((m) => m === user._id)
                    ) {
                      handleDisband();
                    }
                  }}
                >
                  <MdOutlineCloseFullscreen
                    style={{ fontSize: 24, color: "#FFF", margin: "10px" }}
                  />
                  <Text style={{ color: "#FFF", fontSize: "18px" }}>
                    Giải tán nhóm
                  </Text>
                </Button>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                width: "100%",
                marginTop: "10px",
              }}
            >
              <Button
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  width: "100%",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  height: "50px",
                  marginTop: "10px",
                }}
                onClick={() => {
                  handleLeave();
                }}
              >
                <CiLogout
                  style={{ fontSize: 24, color: "#FFF", margin: "10px" }}
                />
                <Text style={{ color: "#FFF", fontSize: "18px" }}>
                  Rời nhóm
                </Text>
              </Button>
            </div>
          </div>

          {/* <div
            style={{
              paddingLeft: "5px",
              borderColor: "#2E2E2E",
              border: "1px solid #2E2E2E",
              height: "20%",
              padding: "20%",
            }}
          >
            <Text
              style={{ color: "#FFF", fontSize: "20px", fontWeight: "700" }}
            >
              File, phương tiện và liên kết
            </Text>
          </div> */}
        </Col>
      </Row>
    </div>
  );
}
