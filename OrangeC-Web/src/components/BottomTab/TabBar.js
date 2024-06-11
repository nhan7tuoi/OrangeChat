import React from 'react';
import { BsChatFill } from "react-icons/bs";
import { HiUsers } from "react-icons/hi2";
import { FaPhoneSquareAlt, FaUser } from "react-icons/fa";
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { setCurrentPage1, setCurrentPage2 } from '../../redux/currentSlice';

const theme = createTheme({
    palette: {
        primary: {
            main: "#F24E1E",
        },
        secondary: {
            main: "#36373A",
        }
    },
});

export default function TabBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [value, setValue] = React.useState('chat');

    return (
        <ThemeProvider theme={theme}>
            <BottomNavigation
                showLabels={true}
                sx={{ width: '100%', height: '10%', position: 'absolute', bottom: 0, background: '#1B1B1B' }}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >

                <BottomNavigationAction
                    label="Cá nhân"
                    value="chat"
                    onClick={() => {
                        navigate("/chat");
                        dispatch(setCurrentPage1("ChatWelcome"));
                    }}
                    icon={<BsChatFill
                        style={{
                            fontSize: '32px',
                            margin: '10px',
                            color: value === 'chat' ? '#F24E1E' : '#36373A'
                        }} />}
                />

                <BottomNavigationAction
                    label="Nhóm"
                    value="chatGroup"
                    onClick={() => {
                        navigate("/chatGroup");
                        dispatch(setCurrentPage2("ChatWelcome"));
                    }}
                    icon={<HiUsers
                        style={{
                            fontSize: '35px',
                            margin: '10px',
                            color: value === 'chatGroup' ? '#F24E1E' : '#36373A'
                        }} />}
                />

                <BottomNavigationAction
                    label="Danh bạ"
                    value="friend"
                    onClick={() => navigate("/friend")}
                    icon={<FaPhoneSquareAlt
                        style={{
                            fontSize: '35px',
                            margin: '10px',
                            color: value === 'friend' ? '#F24E1E' : '#36373A'
                        }} />}
                />

                <BottomNavigationAction
                    label="Tài khoản"
                    value="profile"
                    onClick={() => navigate("/profile")}
                    icon={<FaUser
                        style={{
                            fontSize: '35px',
                            margin: '10px',
                            color: value === 'profile' ? '#F24E1E' : '#36373A'
                        }} />}
                />
            </BottomNavigation>
        </ThemeProvider>
    );
}
