import React from 'react'
import { IoIosSearch } from "react-icons/io";
import { BsPersonAdd  } from "react-icons/bs";
import { AiOutlineUsergroupAdd } from "react-icons/ai";

export default function Find() {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#36373A', paddingLeft: '10px', width: '380px', borderRadius: '8px' }}>
                <IoIosSearch style={{fontSize: '18', color: '#FFF'}} />
                <input type='text' placeholder='Tìm kiếm' style={{ width: '90%', height: '40px', background: '#36373A', marginLeft: '5px', border: 'hidden', outline: 'none', color: '#FFF' , borderRadius:'10px'}}></input>
            </div>

            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}> 
                <BsPersonAdd style={{fontSize: "24", color: '#FFF'}} />
                <AiOutlineUsergroupAdd style={{fontSize: 24, color: '#FFF', margin: '10px'}} />
            </div>
        </div>
    )
}
