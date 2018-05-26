import React from 'react';
import ReactDOM from 'react-dom';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import InOutWrap from '/client/components/tinyUi/InOutWrap.jsx';
import Pref from '/client/global/pref.js';

const Shortfalls = ({ id, shortfalls, expand })=> {
  
  /*
  
  function handleEdit(ncKey, com) {
    Meteor.call('commentNC', id, ncKey, com, (error)=> {
      if(error)
        console.log(error);
		});
  }
  */
  
  return(
    <InOutWrap type='ncTrans' add='shortGrid'>
      {shortfalls.map( (entry)=>{
        return (
          <ShortLine
            key={entry.key}
            entry={entry}
            expand={expand}
            //doFix={()=> handleFix(entry.key)}
          />
        )})}
    </InOutWrap>
  );
};

const ShortLine = ({ entry, expand, })=>{

  return(
    <ContextMenuTrigger id={entry.key} 
      attributes={ {className:'shortRow orange'} }>
        <div className='shortCell up noCopy' title={entry.comm}>
          {entry.partNum}
        </div>
        <div className='shortCell' title={entry.comm}>
          {entry.refs}
        </div>
        <div className='shortCell'>
          {/*
              <i><i className='fas fa-clock fa-lg'></i></i>
              :
              <b><i className='fas fa-truck fa-lg'></i></b>
          */}
        </div>
      <ContextMenu id={entry.key}>
        {/*
        <MenuItem onClick={doUnSkip} disabled={!skip}>
          Activate
        </MenuItem>
        */}
      </ContextMenu>
    </ContextMenuTrigger>
  );
};


export default Shortfalls;