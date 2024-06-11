import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import i18next from 'i18next';
import Colors from '../themes/Colors';

const NotificationRemove = (props) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical:8
      }}>
      <Text
        style={{
          color: Colors.white,
          fontSize: 12,
          textAlign: 'center',
        }}>
        {props.item.senderId.name} {i18next.t('thongBaoXoa')}
      </Text>
    </View>
  );
};

export default NotificationRemove;

const styles = StyleSheet.create({});
