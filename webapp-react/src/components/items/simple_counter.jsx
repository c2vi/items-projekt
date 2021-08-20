import React ,{ useEffect, useState } from 'react';
import styled from 'styled-components';

const Frame = styled.div`

    padding: 5px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
    justify-content: space-around;

`

const Button = styled.button`

   background: white;
   width: 50px;
   margin: 7px;
   padding: 10px;

`


function SimpleCounter({site, data}){

    const [count , set_count] = useState(data.value);

    // useEffect(() => {

    // },[count])

function decrement_count(){
    set_count(count - 1)
    let new_data = data
    new_data.value = count -1
    console.log(new_data)
    site.socket.emit("update", JSON.stringify(new_data))
}

function increment_count(){
    set_count(count + 1)
    let new_data = data
    new_data.value = count +1
    console.log(new_data)
    site.socket.emit("update", JSON.stringify(new_data))
}

return(
    <>
    <Frame>
        <h2>{count}</h2>
        <Button text="+" onClick={increment_count}>+</Button>
        <Button text="-" onClick={decrement_count}>-</Button>
    </Frame>
    </> 
)


};

export default SimpleCounter;