import React from "react";
import caNhan from "../assets/svgs/caNhan.svg";
import caNhan2 from "../assets/svgs/caNhan2.svg";
import danhBa from "../assets/svgs/danhBa.svg";
import danhBa2 from "../assets/svgs/danhBa2.svg";
import friends from "../assets/svgs/friends.svg";
import iconBack from "../assets/svgs/iconBack.svg";
import iconCall from "../assets/svgs/iconCall.svg";
import iconFile from "../assets/svgs/iconFile.svg";
import iconIcon from "../assets/svgs/iconIcon.svg";
import iconImage from "../assets/svgs/iconImage.svg";
import iconOther from "../assets/svgs/iconOther.svg";
import iconSend from "../assets/svgs/iconSend.svg";
import iconVideoCall from "../assets/svgs/iconVideoCall.svg";
import nhom from "../assets/svgs/nhom.svg";
import nhom2 from "../assets/svgs/nhom2.svg";
import  taiKhoan from "../assets/svgs/taiKhoan.svg";
import taiKhoan2 from "../assets/svgs/taiKhoan2.svg";
import search from "../assets/svgs/search.svg";
import iconTym from "../assets/svgs/iconTym.svg";
import haha from "../assets/svgs/haha.svg";
import like from "../assets/svgs/like.svg";
import love from "../assets/svgs/love.svg";
import sad from "../assets/svgs/sad.svg";
import wow from "../assets/svgs/wow.svg";
import angry from "../assets/svgs/angry.svg";
import edit from "../assets/svgs/edit.svg";
import check from "../assets/svgs/check.svg";
import deleteReact from "../assets/svgs/deleteReact.svg";
import replyMsg from "../assets/svgs/replyMsg.svg";
import deleteMsg from "../assets/svgs/deleteMsg.svg";
import removeMsg from "../assets/svgs/removeMsg.svg";
import shareMsg from "../assets/svgs/shareMsg.svg";
import denied from "../assets/svgs/denied.svg";
import userCheck from "../assets/svgs/userCheck.svg";
import userPlus from "../assets/svgs/userPlus.svg";
import bin from "../assets/svgs/bin.svg";
import mess from "../assets/svgs/mess.svg";
import camera from "../assets/svgs/camera.svg";
import createGroup from "../assets/svgs/createGroup.svg";
import addMember from "../assets/svgs/addMember.svg";
import fileGroup from "../assets/svgs/fileGroup.svg";
import group from "../assets/svgs/group.svg";
import leaveGroup from "../assets/svgs/leaveGroup.svg";
import removeGroup from "../assets/svgs/removeGroup.svg";
import { ReactSVG } from 'react-svg';
const SVGs = {
    caNhan,
    caNhan2,
    danhBa,
    danhBa2,
    friends,
    iconBack,
    iconCall,
    iconFile,
    iconIcon,
    iconImage,
    iconOther,
    iconSend,
    iconVideoCall,
    nhom,
    nhom2,
    taiKhoan,
    taiKhoan2,
    search,
    iconTym,
    haha,
    like,
    love,
    sad,
    wow,
    angry,
    edit,
    check,
    deleteReact,
    replyMsg,
    deleteMsg,
    removeMsg,
    shareMsg,
    denied,
    userCheck,
    userPlus,
    bin,
    mess,
    camera,
    createGroup,
    addMember,
    fileGroup,
    group,
    leaveGroup,
    removeGroup
}

// export default {
//     Icons: ({ name = "", width, height }) => {
//         if(name in SVGs) {
//             const Icons = SVGs[name]
//             return <Icons width={width} height={height} />
//         }else {
//             return null;
//         }
//     }
// }

const Icons = ({ name, width, height }) => {
    const SvgIcon = SVGs[name];
    if (!SvgIcon) {
      return null;
    }
    return (
      <ReactSVG
        src={SvgIcon}
        beforeInjection={(svg) => {
          svg.setAttribute('style', `width: ${width}; height: ${height};`);
        }}
      />
    );
  };
  
  export default Icons;