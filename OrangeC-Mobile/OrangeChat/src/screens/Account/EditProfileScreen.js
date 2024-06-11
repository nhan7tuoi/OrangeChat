import React, { useState } from 'react';
import { View, Text, Image, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../themes/Colors';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput } from 'react-native-paper';
import i18next from '../../i18n/i18n';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RadioButton } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import Icons from '../../themes/Icons';
import { launchImageLibrary } from 'react-native-image-picker';
import messageApi from '../../apis/messageApi';
import authApi from '../../apis/authApi';
import { setAvt, setUser } from '../../redux/authSlice';
import userApi from '../../apis/userApi';





const EditProfileScreen = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  // const [name, setName] = useState(user.name);
  const [date, setDate] = useState(user.dateOfBirth ? new Date(user.dateOfBirth) : new Date());
  const [open, setOpen] = useState(false);

  const onSelectAvatar = async () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 }, async (response) => {
      if (!response.didCancel) {
        const selectedImage = response.assets[0];
        try {
          const formData = new FormData();
          formData.append('image', {
            uri: selectedImage.uri,
            type: selectedImage.type,
            name: selectedImage.fileName
          });

          try {
            const uploadResponse = await messageApi.uploadFile(formData);
            const avatarUrl = uploadResponse.data;
            if (avatarUrl) {
              console.log('avatarUrl', avatarUrl);
              const response = await userApi.uploadAvatar({ userId: user._id, image: avatarUrl });
              console.log('response', response);
              dispatch(setAvt(avatarUrl));
              console.log(user.image);
            }
          } catch (error) {
            console.error('Error uploading avatar:', error);
          }
        } catch (error) {
          console.error('Error processing image:', error);
        }
      }
    });
  };
  const onEditProfile = async (value) => {
    try {
      const response = await authApi.editProfile({ userId: user._id, name: value.name,dateOfBirth:date,gender:value.gender});
      if(response.message === 'ok'){
        Alert.alert('Sửa thông tin thành công');
        dispatch(setUser(response.user));
      }else {
        Alert.alert('Sửa thông tin thất bại');
      }
    }
    catch (error) {
      console.error('Error editing profile:', error);
    }
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.backgroundChat, padding: 10 }}>
      <View style={{ padding: 10, flexDirection: 'row' }}>
        <View>
          <Image style={{ width: 150, height: 150, borderRadius: 75, borderWidth: 2, borderColor: Colors.primary }} source={{ uri: user.image }} />
          <Pressable
            onPress={() => {
              onSelectAvatar();
            }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              position: 'absolute',
              right: -5,
              bottom: -20
            }}>
            {Icons.Icons({ name: 'edit', width: 32, height: 32 })}
          </Pressable>
        </View>
      </View>
      <View style={{justifyContent:'space-around',height:150}}>
        <TextInput style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
        label={i18next.t('email')}
        value={user.email}
        disabled={true}
        />
        <TextInput style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }} 
        label={i18next.t('phone')}
        value={user.phone}
        disabled={true}
        />
      </View>
      <Formik
        initialValues={{ name: user.name, gender: user.gender }}
        validationSchema={Yup.object({
          name: Yup.string().required(i18next.t('khongDuocBoTrong')),
        })}
        validateOnMount={true}

        onSubmit={(values) => {
          console.log('send');
          onEditProfile(values);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={{ justifyContent: 'space-around', height: "50%" }}>
            <View>
              <TextInput
                style={{ backgroundColor: Colors.white, height: 50, fontSize: 16, fontWeight: 'bold' }}
                label={i18next.t('ten')}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                error={errors.name && touched.name}
              />
              {errors.fullName && touched.fullName && <Text style={{ color: Colors.white, fontSize: 12 }}>{errors.fullName}</Text>}
            </View>
            <View>
              <RadioButton.Group
                onValueChange={(newValue) => handleChange('gender')(newValue)}
                value={values.gender}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value='male' />
                  <Text style={{ color: Colors.white }}>{i18next.t('nam')}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RadioButton value="female" />
                  <Text style={{ color: Colors.white }}>{i18next.t('nu')}</Text>
                </View>
              </RadioButton.Group>
            </View>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable onPress={() => setOpen(true)}
                  style={{
                    width: 120,
                    height: 30,
                    backgroundColor: Colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 10
                  }} >
                  <Text style={{ color: Colors.white, fontSize: 12 }}>{i18next.t('chonNgaySinh')}</Text>
                </Pressable>
                <DatePicker
                  mode='date'
                  modal
                  open={open}
                  date={user.dateOfBirth ? new Date(user.dateOfBirth) : new Date()}
                  onConfirm={(date) => {
                    setOpen(false)
                    setDate(date)
                    console.log('date', date);
                  }}
                  onCancel={() => {
                    setOpen(false)
                  }}
                />
                <Text style={{ color: Colors.white, fontSize: 20, alignSelf: 'center' }}>{date.toLocaleDateString()}</Text>
              </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Pressable
                onPress={
                  handleSubmit
                }
                style={
                  { height: 50, width: 200, backgroundColor: Colors.primary, padding: 10, alignItems: 'center', justifyContent: 'center', borderRadius: 20 }
                }>
                <Text style={{ color: Colors.white, fontSize: 20 }}>{i18next.t('luu')}</Text>
              </Pressable>
            </View>
          </View>

        )}
      </Formik>
    </SafeAreaView>
  );
}

export default EditProfileScreen;
