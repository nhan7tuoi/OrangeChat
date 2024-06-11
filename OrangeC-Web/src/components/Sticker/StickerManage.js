import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'antd';
import { Link } from 'react-router-dom';
import { CloseOutlined } from '@ant-design/icons';
// import stickerApi from './stickerApi'; // Đường dẫn đúng đến file chứa API
import StickerApi from '../../apis/stickerApi';

export default function StickerManage() {
    const [stickerSets, setStickerSets] = useState([]);
    const [selectedStickerSetIndex, setSelectedStickerSetIndex] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await StickerApi.getSticker();
            setStickerSets(response);
        } catch (error) {
            console.error('Error fetching stickers:', error);
        }
    };

    const handleStickerSetClick = (index) => {
        if (selectedStickerSetIndex === index) {
            setSelectedStickerSetIndex(null); // Đóng bộ sticker nếu đã mở
        } else {
            setSelectedStickerSetIndex(index); // Mở bộ sticker tương ứng
        }
    };

    const handleDeleteStickerSet = (index) => {
        const updatedStickerSets = stickerSets.filter((_, i) => i !== index);
        setStickerSets(updatedStickerSets);
    };

    return (
        <div style={{ width: '100%', height: '100vh', background: '#242424', display: 'flex', flexDirection: 'column' }}>
            <Row justify="space-between" style={{ padding: '20px' }}>
                <Col>
                    <Button>
                        <Link to="/adminlogin">Thoát</Link>
                    </Button>
                    <Button style={{ marginLeft: '10px' }}>
                        <Link to="/sticker">Sticker</Link>
                    </Button>
                    <Button style={{ marginLeft: '10px' }}>
                        <Link to="/adminma">Người dùng</Link>
                    </Button>
                </Col>
                <Col>
                    <Button style={{ marginLeft: '10px' }}>
                        Thêm bộ sticker
                    </Button>
                </Col>
            </Row>
            <div style={{ height: '30%', display: 'flex', justifyContent: '', alignItems: 'center', padding: '20px' }}>
                {/* Hiển thị các button cho các bộ sticker */}
                {stickerSets.map((set, index) => (
                    <div key={set._id} style={{ position: 'relative', margin: '20px' }}>
                        <img
                            src={set.data[0]?.url} // Giả sử mỗi sticker có thuộc tính 'url' chứa đường dẫn ảnh
                            alt={`sticker-set-${index}`}
                            style={{ width: '100px', height: '100px', borderRadius: '10px', cursor: 'pointer' }}
                            onClick={() => handleStickerSetClick(index)}
                        />
                        <CloseOutlined
                            style={{ position: 'absolute', top: '0', right: '0', cursor: 'pointer', color: 'red', background: 'black', borderRadius: '50%', padding: '5px' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteStickerSet(index);
                            }}
                        />
                    </div>
                ))}
            </div>
            <div style={{ height: '70%', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', padding: '20px', border: '0.5px solid white' }}>
                {/* Hiển thị các sticker trong bộ nếu đã được chọn */}
                {selectedStickerSetIndex !== null && Array.isArray(stickerSets[selectedStickerSetIndex].data) && stickerSets[selectedStickerSetIndex].data.map((sticker, idx) => (
                    <img
                        key={idx}
                        src={sticker.url}
                        alt={`sticker-${selectedStickerSetIndex}-${idx}`}
                        style={{ width: '200px', height: '200px', objectFit: 'cover', margin: '20px' }}
                    />
                ))}
            </div>
        </div>
    );
}
