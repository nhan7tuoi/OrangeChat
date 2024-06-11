import React from 'react';
import PropTypes from 'prop-types';
// import './style.scss';
import "../../css/Sticker.css";
import './../../';
import { Tabs } from 'antd';
import { GiftOutlined } from '@ant-design/icons'; // Import biểu tượng
// import ListSticker từ '../ListSticker'; // Import thành phần ListSticker

// Định nghĩa PropTypes
Sticker.propTypes = {
    data: PropTypes.array, // data nên là một mảng
    onClose: PropTypes.func, // onClose nên là một hàm
    onScroll: PropTypes.func, // onScroll nên là một hàm
};

// Giá trị mặc định cho props
Sticker.defaultProps = {
    data: [], // data mặc định là mảng rỗng
    onClose: null, // onClose mặc định là null
    onScroll: null, // onScroll mặc định là null
};

function Sticker({ data, onClose, onScroll }) {

    // Hàm xử lý đóng
    const handleOnClose = () => {
        if (onClose) {
            onClose(); // Gọi onClose nếu nó tồn tại
        }
    };

    const { TabPane } = Tabs; // Giải cấu trúc TabPane từ Tabs

    // Hàm xử lý thay đổi tab (hiện tại không làm gì)
    function handleOnChange() {
        // Xử lý thay đổi tab nếu cần
    }

    return (
        <div id='sticker'>
            <Tabs defaultActiveKey="1" onChange={handleOnChange}>
                <TabPane
                    tab={
                        <span className='menu-item'><GiftOutlined /> STICKER</span>
                    }
                    key="1"
                >
                    <ListSticker
                        data={data}
                        onClose={handleOnClose}
                        onScroll={onScroll}
                    />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Sticker;
