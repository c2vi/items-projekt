import io from "socket.io-client";
import styled from 'styled-components';
import react , { useState, useEffect, useRef } from 'react';
import RenderItem from "../render_item";
import { useDrop, useDrag } from "react-dnd";
import Folder_Item from "../folder-item"


const Folder_Frame = styled.div`
    background: white;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    
`

const Folder_Header = styled.div`
    background: #a1a1a1;
    padding: 5px;
    margin-bottom: 5px;
    height: 50px;
   
`

export default function Folder({ data, render, site }) {

	const [ { isOver }, drop ] = useDrop({
		accept: "folder_item",
		drop: (item) => console.log(item.id),
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
	});

	const DropBox = styled.div`
		height: 200px;
		width: 500px;
	`
	
	// useEffect( () => {
	// 	socket = io.connect("/") 
	// 	socket.emit("load_items", JSON.stringify(data.items))

	// 	socket.on("set_items", items => {
	// 		setItems(JSON.parse(items))
	// 	})
		
	// },[]);

	if ( render == "open"){
		return( 
			<>
		<Folder_Header>
			hello from header
			{/* <Board id="board-1" className="board">
				<Card id="card-1" className="card" draggable="true">
					<p>Card one</p>
				</Card>
				<Card id="card-2" className="card" draggable="true">
					<p>Card two</p>
				</Card>
			</Board> */}
		</Folder_Header>
		<Folder_Frame>


			{
			data.items.map( item => {
				return (
					<Folder_Item site={site} key={item._id} item={item}>
					</Folder_Item>
				)
			})
			}
		</Folder_Frame>
		{/* <DropBox style={{background: isOver ? "green" : "red"}} ><div ref={drop} ></div></DropBox> */}
		</>)

	} else if ( render == "in_folder"){
		return(<>
			<img src="https://image.flaticon.com/icons/png/512/992/992667.png" width="50" height="50" />
			{data.folder_name}
		
		</>)

	} else {
		return(<p>unknown render_type</p>)
	}
}
