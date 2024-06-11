import React, { useEffect, useRef, useState } from "react";
import "../../css/Modal.css"; // File CSS cho modal
import { IoIosSearch } from "react-icons/io";
import { Button, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../redux/friendSilce";
import connectSocket from "../../server/ConnectSocket";
import { IoMdAdd } from "react-icons/io";
import i18next from "../../i18n/i18n";
import { setCoversation } from "../../redux/conversationSlice";
import { formatOneConversation } from "../../utils/formatOneConverstation";

const { Text } = Typography;

function ModalAddMemberGroup({ isOpen, toggleModal }) {
  const conversation = useSelector((state) => state.conversation.conversation);
  const scrollRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const user = useSelector((state) => state.authLogin.user);
  const dispatch = useDispatch();
  const listFriends = useSelector((state) => state.friend.listFriends);
  const [newList, setNewList] = useState([]);
  const [connect, setConnect] = useState(false);

  useEffect(() => {
    // if (!connect) {
      fetchData();
      // connectSocket.initSocket(user._id);
    //   setConnect(true);
    // }
  }, []);

  useEffect(() => {
    // if (connect) {
      fetchData();
      setNewList(
        listFriends?.filter(
          (f) => !conversation?.members?.some((m) => m._id === f._id)
        )
      );
      fetchData();
    // }
  }, []);

  // Hàm lấy danh sách bạn bè của người dùng
  const fetchData = async () => {
    try {
      dispatch(fetchFriends(user._id)); // Lấy danh sách bạn bè từ API
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Xử lý khi người dùng muốn thêm thành viên vào nhóm
  const handleAddMember = (member) => {
    // if (connect) {
      connectSocket.emit("add member to group", {
        conversation: conversation,
        member: member,
      });
    // }
  };

  useEffect(() => {
    // Lắng nghe sự kiện khi có phản hồi từ server sau khi thêm thành viên vào nhóm
    // if (connect) {
      connectSocket.on("respondAdd", (data) => {
        const fConversation = formatOneConversation({
          conversation: data,
          userId: user._id,
        });
        dispatch(setCoversation(fConversation));
      });
    // }
  }, []);

  useEffect(() => {
    // Lọc danh sách bạn bè chưa có trong nhóm khi danh sách bạn bè hoặc conversation thay đổi
    setNewList(
      listFriends?.filter(
        (f) => !conversation?.members?.some((m) => m._id === f._id)
      )
    );
  }, [listFriends, conversation]);

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" style={{}}>
          <div className="modal" style={{ backgroundColor: "#242424" }}>
            <div
              className="modal-content"
              style={{
                width: "500px",
                height: "600px",
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Text
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "white",
                  marginBottom: "20px",
                }}
              >
                Thêm thành viên
              </Text>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "#36373A",
                  paddingLeft: "10px",
                  width: "450px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                <IoIosSearch style={{ fontSize: "18", color: "#FFF" }} />
                <input
                  type="text"
                  placeholder={i18next.t("nhapSoDienThoaiHoacTen")}
                  onChange={(evt) => setKeyword(evt.target.value)}
                  style={{
                    width: "100%",
                    height: "40px",
                    background: "#36373A",
                    marginLeft: "5px",
                    border: "hidden",
                    outline: "none",
                    color: "#FFF",
                    borderRadius: "10px",
                  }}
                ></input>
              </div>
              <div style={{ width: "100%", height: "380px" }}>
                <div
                  ref={scrollRef}
                  style={{
                    overflowY: "auto",
                    background: "#242424",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {Array.isArray(newList) &&
                    newList.map((user, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          width: "90%",
                          background: "#242424",
                          padding: "5px",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginTop: "10px",
                          marginLeft: "25px",
                          border: "2px solid #2E2E2E",
                          borderRadius: "10px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <img
                            src={user.image}
                            style={{
                              height: "30px",
                              width: "30px",
                              borderRadius: "50%",
                              marginLeft: "5px",
                            }}
                            alt="image"
                          ></img>
                          <Text
                            style={{
                              marginLeft: "20px",
                              color: "white",
                              fontSize: "16px",
                            }}
                          >
                            {user.name}
                          </Text>
                        </div>
                        <Button
                          style={{
                            display: "flex",
                            width: "40px",
                            height: "40px",
                            background: "#36373A",
                            borderRadius: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            border: "hidden",
                          }}
                          onClick={() => handleAddMember(user)}
                        >
                          <IoMdAdd style={{ fontSize: "30", color: "#FFF" }} />
                        </Button>
                      </div>
                    ))}
                </div>
                <div
                  style={{
                    width: "470px",
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    style={{ width: "100px", height: "40px" }}
                    onClick={toggleModal}
                  >
                    <Text>Xong</Text>
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

export default ModalAddMemberGroup;
