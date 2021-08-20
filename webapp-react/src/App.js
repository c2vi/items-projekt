import styled from 'styled-components';
import react, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useHistory, Link, Redirect, BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css'

import RenderItem from './components/render_item.js'

const SOCKET_URL = "/"
const API_URL = "/api"

const AppFrame =styled.div`
 font-family: 'arial';
`



function App() {

    // useEffect( () => {console.log("url changed")}, window.location.pathname)
    if ( window.location.pathname == "/"){
      window.location.replace("main")
    }

    const [shown_item, set_shown_item] = useState({_id:"loading...",_typeid:"loading"});
    const socketRef = useRef();
    console.log(shown_item)
    const history = useHistory();
    const id = window.location.pathname.slice(1)

    function redirect_to(id) {
      history.push(id)
      window.location.replace(id)
    }

    // function update_item(data){

    // };


    const site = {
      redirect_to: redirect_to,
      test: history,
      socket:socketRef.current,
    }

    // useEffect( () => {set_redirect(true)}, [redirect_id])



    useEffect(() => {
      console.log("on mount");

      //##SocketIO-------------------------------
      socketRef.current = io.connect(SOCKET_URL);
      // socketRef.current.emit("load_item", "main")

      socketRef.current.on("update", item => {
        console.log("update event: "+id)
        fetchShownItem(id).then(response => {
        set_shown_item(response)
        })
      })
      // socketRef.current.on("id", id => {
      //   setYourID(id);
      // })

      fetchShownItem(id).then(response => {
        set_shown_item(response)
      })


    }, [])

    const fetchShownItem = async (id) => {
      const res = await fetch(API_URL + "/" + id)
      const data = await res.json()
      return data
    };

  return (
    <>
        <DndProvider backend={HTML5Backend}>
          <AppFrame>
            <RenderItem site={site} item={shown_item} render="open" />
          </AppFrame>
        </DndProvider>
    </>


  );
};

export default App;
