import styled from 'styled-components';
import React from 'react'


function ListOfText({ data, render }) {
	return (
		<div>
			{data.items.map( plain_text => {
				return <p>{plain_text.text}</p>
			})}	
		</div>
	)
}

export default ListOfText
