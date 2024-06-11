import React, { useRef } from "react";
import { Typography } from "antd";
import "../../css/Modal.css";
import Icons from "../../themes/Icons";

const { Text } = Typography;

export default function ReactionModal({
  isOpen,
  toggleReactionModal,
  reactionMsg,
}) {
  const scrollRef = useRef(null);

  return (
    <>
      {isOpen && (
        <div className="modal-overlay" style={{}}>
          <div className="modal" style={{ backgroundColor: "#242424" }}>
            <div
              className="modal-content"
              style={{
                width: "400px",
                height: "400px",
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
                Cảm xúc
              </Text>

              <Text
                style={{
                  position: "absolute",
                  color: "#FFF",
                  right: "40%",
                  cursor: "pointer",
                  top: "29%",
                  fontSize: "20px",
                  borderRadius: "100%",
                  width: "20px",
                  height: "20px",
                }}
                onClick={() => {
                  toggleReactionModal();
                  // setSelectedMembers([]);
                }}
              >
                X
              </Text>

              <div style={{ width: "100%", height: "380px" }}>
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
                <div
                  ref={scrollRef}
                  style={{
                    overflowY: "auto",
                    background: "#242424",
                    width: "100%",
                    height: "90%",
                  }}
                >
                  {reactionMsg?.reaction?.map((item, index) => 
                    // console.log("reaction:", reactionMsg)
                    item.type === "delete" ? null : (
                      <div
                        key={index}
                        style={{
                          width: "100%",
                          height: 60,
                          padding: 10,
                          display: 'flex',
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: 'center'
                        }}
                      >
                        <div
                          style={{
                            width: "70%",
                            display: 'flex',
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <img
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 25,
                              marginRight: 15,
                            }}
                            src={item?.userId?.image}
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
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {item?.type == "like"
                            ? Icons({
                                name: "like",
                                width: 32,
                                height: 32,
                              })
                            : item?.type == "love"
                            ? Icons({
                                name: "love",
                                width: 32,
                                height: 32,
                              })
                            : item?.type == "angry"
                            ? Icons({
                                name: "angry",
                                width: 32,
                                height: 32,
                              })
                            : item?.type == "sad"
                            ? Icons({
                                name: "sad",
                                width: 32,
                                height: 32,
                              })
                            : item?.type == "wow"
                            ? Icons({
                                name: "wow",
                                width: 32,
                                height: 32,
                              })
                            : item?.type == "haha"
                            ? Icons({
                                name: "haha",
                                width: 32,
                                height: 32,
                              })
                            : null}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
