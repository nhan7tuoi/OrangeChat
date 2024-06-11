import { Button, Col, Row, Typography, Form, Input, Radio, Upload } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
// import {  setUser } from '../../redux/authSlice'
import authApi from '../../apis/authApi';
import { PlusOutlined } from '@ant-design/icons';
import messageApi from '../../apis/messageApi';
import userApi from '../../apis/userApi';
import { setAvt, setUser } from '../../redux/authLogin';

const { Text, Title } = Typography;

function ModalInformation({ isOpen, toggleModal, user, onUserUpdate }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [image, setImage] = useState(user?.image || '');
  const fileImageRef = useRef(null);

  useEffect(() => {
    if (user && isOpen) {
      form.setFieldsValue({
        name: user.name || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().substring(0, 10) : '',
        gender: user.gender || '',
        image: user.image || ''
      });
      setImage(user.image || '');
    }
  }, [user, isOpen, form]);

  // const handleImageChange = ({ file }) => {
  //   if (file && file.originFileObj) {
  //     const reader = new FileReader();
  //     reader.onload = () => {
  //       setImage(reader.result);
  //     };
  //     reader.readAsDataURL(file.originFileObj);
  //     console.log("url:", image);
  //   }
  // };

  const handleImageChange = async (event) => {
    const file = event?.target?.files[0];
    console.log("evbent", event);
    console.log("Selected image: ", file);

    try {
      const formData = new FormData();
      formData.append("image", file);
      console.log("formData", formData);

      let uploadResponse = await messageApi.uploadImage(formData);

      console.log("File Type: ", file.type);

      const mediaUrl = uploadResponse.data;
      console.log("Uploaded media URL: ", mediaUrl);

      if (mediaUrl) {
        setImage(mediaUrl);
        const response = await userApi.uploadAvatar({ userId: user._id, image: mediaUrl });
              // console.log('response', response);
              dispatch(setAvt(mediaUrl));
              console.log("URL",mediaUrl);
        // console.log("ImageURL:", image);
      } else {
        console.log("No media URL returned, message not sent.");
      }
    } catch (error) {
      console.error("Error processing media:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      const response = await authApi.editProfile({
        userId: user._id,
        ...values,
        image
      });
      if (response.message === 'ok') {
        alert('Sửa thông tin thành công');
        dispatch(setUser(response.user));
        toggleModal();
        onUserUpdate(response.user); // Call the callback with updated user data
      } else {
        alert('Sửa thông tin thất bại');
      }
    } catch (error) {
      console.error('Error editing profile:', error);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{ width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal-overlay" onClick={toggleModal} >
        <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#242424', padding: '50px', borderRadius: '20px' }}>
          <Title style={{ fontSize: '24px', fontWeight: '700', color: '#FFF', padding: '20px' }}>Chỉnh sửa thông tin</Title>
          <input
            type="file"
            multiple
            ref={fileImageRef}
            onChange={handleImageChange}
            // style={{ display: "none" }} // Ẩn input file
            accept="image/*" // 
          />
          <Form
            form={form}
            initialValues={{
              name: user.name,
              dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().substring(0, 10) : '',
              gender: user.gender,
              image: user.image
            }}
            onFinish={handleSubmit}
            // layout="vertical"
            style={{ width: '100%' }}
          >
            <Form.Item
              name="image"
              label={<Text style={{ color: '#FFF' }}></Text>}
            >
              <Upload
                name="avatar"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={() => false}
                // ref={fileImageRef}
                // onChange={handleImageChange}
              >
                {image ? (
                  <img src={image} alt="avatar" style={imageStyle} />
                ) : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Form.Item
              name="name"
              label={<Text style={{ color: '#FFF' , width:'100px', textAlign:'left'}}>Tên</Text>}
              rules={[{ required: true, message: '' }]}
            >
              <Input style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="dateOfBirth"
              label={<Text style={{ color: '#FFF', width:'100px', textAlign:'left'}}>Ngày sinh</Text>}
            >
              <Input type="date" style={{ width: '300px' }} />
            </Form.Item>
            <Form.Item
              name="gender"
              label={<Text style={{ color: '#FFF' }}>Giới tính</Text>}
            >
              <Radio.Group style={{ color: 'white', width: '100%' }}>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={<Text style={{ color: '#FFF', width:'100px', textAlign:'left' }}>Số điện thoại</Text>}
            >
              <Text style={displayTextStyle}>{user.phone}</Text>
            </Form.Item>
            <Form.Item
              label={<Text style={{ color: '#FFF' , width:'100px', textAlign:'left'}}>Email</Text>}
            >
              <Text style={displayTextStyle}>{user.email}</Text>
            </Form.Item>
            <Form.Item>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={toggleModal} style={{ ...cancelButtonStyle, marginLeft: '10px' }}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" style={submitButtonStyle}>
                  Lưu
                </Button>
               
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );

}

const inputStyle = {
  backgroundColor: '#2E2E2E',
  color: '#FFF',
  borderRadius: '5px',
  border: '1px solid #2E2E2E',
  padding: '10px'
};

const submitButtonStyle = {
  backgroundColor: '#F24E1E',
  color: '#FFF',
  border: 'none',
  marginLeft: '20px'
};

const cancelButtonStyle = {
  backgroundColor: '#36373A',
  color: '#FFF',
  border: 'none'
};

const imageStyle = {
  width: '58px',
  height: '58px',
  borderRadius: '50%',
  objectFit: 'cover'
};

const displayTextStyle = {
  color: '#FFF',
  backgroundColor: '#2E2E2E',
  borderRadius: '5px',
  padding: '10px',
  display: 'block'
};

export default ModalInformation;
