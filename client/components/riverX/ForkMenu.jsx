import React from 'react';

import { PopContextButton, PopContextMenu } from '/client/layouts/Models/Popover';

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
    <div className='riverPath cap liteTip nottall' data-tip='Set Alt Flow'>
      {Roles.userIsInRole(Meteor.userId(), ['verify', 'run']) &&
        <PopContextButton
  				targetid={serial+'pathChange'}
  				extraClass='moreStepAction centre inherit'
  				icon='fas fa-directions fa-fw fa-lg'
  			/>}
  		
      <PopContextMenu targetid={serial+'pathChange'} extraClass='popDark'>
        <div className='popTitle'>Use Alternative Flow</div>
        {wFlowOps.map( (entry, index)=>{
          if(wFlowNow === entry.flowKey) {
            if(altIs) {
              return(
                <button
                  key={index}
                  onClick={()=>handleNoAlt(altIs.river)}
                ><em>Return to </em>{entry.title}</button>
             );
            }else{ return null }
          }else{
            return(
              <button 
                key={index}
                disabled={altIs && altIs.river === entry.flowKey}
                onClick={()=>handleAlt(entry.flowKey)}
              >{entry.title}</button>
            );
          }
        })}
      </PopContextMenu>
    </div>
  );
};

export default ForkMenu;