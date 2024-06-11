import React, { useState } from 'react'
import { IoIosSearch } from "react-icons/io";
import { BsPersonAdd } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Button, Col, Row, Typography } from 'antd';
import Modal from './Modal';

const { Text, Title } = Typography;

export default function Find() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#36373A', paddingLeft: '10px', width: '380px', borderRadius: '8px', marginLeft: 15 }}>
                <IoIosSearch style={{ fontSize: '18', color: '#FFF' }} />
                <input type='text' placeholder='Tìm kiếm' style={{ width: '90%', height: '40px', background: '#36373A', marginLeft: '5px', border: 'hidden', outline: 'none', color: '#FFF', borderRadius: '10px' }}></input>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                <Button style={{ background: 'none', border: 'none' }}>
                    <BsPersonAdd style={{ fontSize: "24", color: '#FFF' }} />
                </Button>
                <div>
                    <Button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={toggleModal}
                    >
                        <AiOutlineUsergroupAdd style={{ fontSize: 24, color: '#FFF', margin: '10px' }} />


                    </Button>
                    <Modal isOpen={isOpen} toggleModal={toggleModal} />
                </div>
            </div>
        </div>
    )
}
