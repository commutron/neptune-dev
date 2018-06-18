import React, {Component} from 'react';
//require('velocity-animate');
//require('velocity-animate/velocity.ui');
//import { VelocityComponent } from 'velocity-react';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import Pref from '/client/global/pref.js';

//import FirstForm from './FirstForm.jsx';
//import FoldInNested from './FoldInNested.jsx';
import StoneProgRing from './StoneProgRing.jsx';


function handle(id, bar, entry) {
  const flag = entry.key;
  const time = entry.time;
  let replace = entry;
  replace.good = false;
  Meteor.call('pullHistory', id, bar, flag, time, (error, reply)=> {
    if(error)
      console.log(error);
    if(reply) {
      Meteor.call('pushHistory', id, bar, replace, (error)=> {
        if(error)
          console.log(error);
      });
    }else{
      Bert.alert(Pref.blocked, 'danger');
    }
  });
}


const StoneComplete = ({
	id,
  barcode,
  sKey,
  step,
  type,
  allItems,
  isAlt,
  hasAlt,
  progCounts,
  compEntry
})=>	{

		let shape = '';
		let back = '';
		let prepend = type === 'build' || type === 'first' ?
		              <label>{type}</label> : null;
		let apend = type === 'inspect' ? 
									<label>{type}</label> : null;

	//// Style the Stone Accordingly \\\\
		if(type === 'first'){
			shape = 'doneStone iFirst';
			//back = 'doneFirst';
		}else if(type === 'inspect'){
			shape = 'doneStone iCheck';
			//back = 'doneCheck';
    }else if(type === 'build'){
			shape = 'doneStone iBuild';
			//back = 'doneBuild';
    }else if(type === 'checkpoint'){
			shape = 'doneStone iPoint';
			//back = 'donePoint';
    }else if(type === 'test'){
			shape = 'crackedTop iTest';
			//back = 'doneTest';
    }else if(type === 'finish'){
			shape = 'doneStone iFinish';
			//back = 'doneFinish';
    }else{
      null }
    
    const vw = (v)=> {
      var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      return (v * w) / 100;
    };
    const adaptiveWidth = vw(17) + "px";
    
    const stopmooving = { minHeight: vw(20) + "px" };
     

  return(
  	<div style={stopmooving} className={back + ' vspace noCopy'}>
      <StoneProgRing
				serial={barcode}
				allItems={allItems}
				isAlt={isAlt}
				hasAlt={hasAlt}
				sKey={sKey}
        step={step}
        type={type}
        progCounts={progCounts}
        adaptiveWidth={adaptiveWidth}>
				<ContextMenuTrigger
					id={barcode}
					attributes={ {className:'centre'} }>
					<div tabIndex={-1} className={shape}>
	  				{prepend}
						<i>{step}</i>
						{apend}
						<label>
							<i className='fas fa-check fa-lg fa-fw'></i>
						</label>
					</div>
				</ContextMenuTrigger>
			</StoneProgRing>
      <ContextMenu id={barcode}>
      	{compEntry &&
          <MenuItem onClick={()=>handle(id, barcode, compEntry)}>
            Undo Completed Step
          </MenuItem>}
      </ContextMenu>
    </div>
  );
};

export default StoneComplete;