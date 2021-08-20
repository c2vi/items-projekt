import styled from 'styled-components';
import react , { useState, useEffect, useRef } from 'react';

//importing all item-components
import Folder from './items/folder';
import PlainText from './items/plain_text';
import NumberInt from './items/number_int';
import SimpleCounter from './items/simple_counter';
import ListOfText from './items/list_of_text';


function switch_item(item, render, site){

    if (item == "loading..."){
        return "loading..."
    }

    switch(item._typeid) {
        case "folder":
            return <Folder site={site} render={render} data={item}/>
            break;
        case "plain_text":
            return <PlainText site={site} render={render} data={item}/>
            break;
        case "number_int":
            return <NumberInt site={site} render={render} data={item}/>
            break;
        case "simple_counter":
            return <SimpleCounter site={site} render={render} data={item}/>
            break;
        case "list_of_text":
            return <ListOfText site={site} render={render} data={item}/>
            break;
        case "loading":
            return <h3>Loading...</h3>
            break;
        default:
            return "item-type not found"
        } 
}

export default function Render_Item({ item, render, site }){

    // useEffect( () => {
    //     console.log("render_item component mounted",item)
    // })
    return(
        <>
        {
            switch_item(item, render, site)
        }
        </>
    )

}

