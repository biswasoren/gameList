import React, { useState } from 'react';
import './App.css';
import GameConatiner from './components/GameConatiner'

const menuItems = {
  sort : {
    title: {label: 'Title'},
    score: {label: 'Score'},
    },
  group: {
    platform: {label: 'Platform'},
    genre: {label: 'Genre'},
  }

}


function Nav(props) {
  return (
    <div className="Nav"> 
    <div className="side-div">
      <div className="menu"> Sort By
        </div>
        {Object.entries(menuItems.sort).map(item =>  
        <div className={`menu-item ${props.data.sort_by === item[0] ? 'active' : null}`}
          onClick={() => {props.setProps({...props.data, sort_by: item[0]}
          )}}> 
        {item[1].label}
        </div>
        )}
        </div>
        <div className="side-div">
      <div className="menu"> Group By
          </div>
          {Object.entries(menuItems.group).map(item =>  
          <div className={`menu-item ${props.data.group_by === item[0] ? 'active' : null}`}
            onClick={() => {if (props.data.group_by === item[0]) {
              props.setProps({...props.data, group_by: null})
            } else {
              props.setProps({...props.data, group_by: item[0]})
            }}}> 
          {item[1].label}
          </div>
          )}
        
      </div>
      </div>
  )
}

function App() {
  const [props, setProps ] = useState({
    sort_by: 'title',
    group_by: null,
  })
  return (
    <div className="App">
      <div className="Header">
        Kingdom of Games
        </div>
        <div className="Container">
        <Nav data={props} setProps={setProps}>
          Hi
          </Nav>
          <GameConatiner filter={props}/>
          </div>
    </div>
  );
}

export default App;
