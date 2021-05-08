import React from 'react';
// import Pref from '/client/global/pref.js';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';


const ForkMenu = ({ seriesId, serial, wFlowOps, wFlowNow, altIs })=> {
  
  function handleAlt(altKey) {
	  Meteor.call('setInflowAltPath', seriesId, serial, altKey, (err)=>{
	    err && console.log(err);
	  });
	}
	
	function handleNoAlt(altKey) {
	  Meteor.call('unsetInflowAltPath', seriesId, serial, altKey, (err)=>{
	    err && console.log(err);
	  });
	}
  
  return(
    <div className='riverPath cap'>
      {Roles.userIsInRole(Meteor.userId(), ['verify', 'run']) &&
        <ContextMenuTrigger
  				id={serial+'pathChange'}
  				attributes={ {className:'moreStepAction centre'} }
  				holdToDisplay={1}
          renderTag='div'
          >
          <i className='fas fa-directions fa-fw fa-lg'></i>
  			</ContextMenuTrigger>}
  		
      <ContextMenu id={serial+'pathChange'}>
        <MenuItem disabled={true}><b>Use Alternative Flow</b></MenuItem>
        {wFlowOps.map( (entry, index)=>{
          if(wFlowNow === entry.flowKey) {
            if(altIs) {
              return(
                <MenuItem 
                  key={index}
                  onClick={()=>handleNoAlt(altIs.river)}
                ><em>Return to </em>{entry.title}</MenuItem>
             );
            }else{ return null }
          }else{
            return(
              <MenuItem 
                key={index} 
                disabled={altIs && altIs.river === entry.flowKey}
                onClick={()=>handleAlt(entry.flowKey)}
              >{entry.title}
              </MenuItem>
            );
          }
        })}
      </ContextMenu>
    </div>
  );
};

export default ForkMenu;