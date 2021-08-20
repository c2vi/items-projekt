import React, { useState } from 'react'
import styled from 'styled-components'
import { useDrag } from 'react-dnd'
import RenderItem from './render_item'
import { Redirect, useHistory, Link } from 'react-router-dom'

function Folder_Item({item, site}) {

	const test = useHistory();
	// const handleOnClick = (id) => history.push('/'+id);

	const Frame = styled.div`
		background: #ededed;
		border-radius: 7px;
		border: 3px solid #a1a1a1;
		margin: 10px;
		min-height: 100px;
		display: flex;
		align-items: center;
		justify-content: center;
	`

	const [ { isDragging }, drag ] = useDrag({
		type: 'folder_item',
		collect: monitor => ({
			isDragging: !!monitor.isDragging()
		})
	});

	// if (site.redirect) {
	// 	return <Redirect to={"/"+item._id} />
	// }

	return (
			<Frame onDoubleClick={ (e) => { if (e.target.type != "submit") {site.redirect_to(item._id);} } } ref={drag}>
				<RenderItem site={site} item={item} render="in_folder" />
			</Frame>
	)
}

export default Folder_Item

