import React from 'react';
import { View, Text } from 'react-native';
import Colors from '../themes/Colors';
import i18next from 'i18next';


const FirstMessage = ({item,index}) => {
    return (
        <View key={index} style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
            <Text style={{ color: Colors.white, fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>{i18next.t("chaoMung")}</Text>
        </View>
    );
}

export default FirstMessage;
