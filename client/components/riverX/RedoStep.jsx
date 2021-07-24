import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

const RedoStep = ({ 
  batchId, seriesId, itemData,
  brancheS, app, close 
})=> {
  
  const isInspect = Roles.userIsInRole(Meteor.userId(), 'inspect');
  const isTester = Roles.userIsInRole(Meteor.userId(), 'test');
  
  const [ redoCommTxt, redoCommSet ] = useState("");
  const [ lock, lockSet ] = useState(false);
  
  const reSteps = itemData.history.filter( x => x.good === true &&
              x.type !== 'finish' && x.type !== 'nest' && x.type !== 'first' );
  
  function passT(sKey, step, type, pass, shipFail) {
    lockSet(true);
    if(redoCommTxt.trim() === "") {
    	document.getElementById("redoCommField").reportValidity();
    }else{
    	const more = shipFail ? 'ship a failed test' : false;
      const comm = 'Redone: ' + redoCommTxt;
      
			Meteor.call('addTestX', batchId, seriesId, itemData.serial,
			  sKey, step, type, comm, pass, more, 
			(error, reply)=>{
		    error && console.log(error);
				reply === true ? close() :
			    toast.warning('Insufficient Permissions');
			});
    }
  }
  
  function passS(sKey, step, type, pass) {
    lockSet(true);
    if(redoCommTxt.trim() === "") {
    	document.getElementById("redoCommField").reportValidity();
    }else{
      const comm = 'Redone: ' + redoCommTxt;
      
  		Meteor.call('addHistoryX', batchId, seriesId, itemData.serial,
  		  sKey, step, type, comm, pass, 
  			(error, reply)=>{
  	    error && console.log(error);
  				reply === true ? close() :
  			    toast.warning('Insufficient Permissions');
  		});
    }
  }
  
  function checkAccess(tstep, type) {
    const tbrKey = tstep ? tstep.branchKey : null;
    const brObj = brancheS.find( b => b.brKey === tbrKey ) || null;
	  const reqUL = brObj ? brObj.reqUserLock === true : null;
		const reqKey = reqUL ? ( 'BRK' + tbrKey ) : null;
  	const stepClr = !reqUL ? true : Roles.userIsInRole(Meteor.userId(), reqKey);
  	const typeClr = type === 'inspect' ? isInspect : type === 'test' ? isTester : true;
    return stepClr && typeClr;
  }
  
  if(reSteps.length === 0) {
    return null;
  }
  
  const types = _.uniq(Array.from(reSteps, x => x.type)).join(' or ');
  
  return(
    <div className='dmargin stoneForm'>
      <div className='vmarginhalf centreText medBig cap'
        >Repeat {types}</div>
      
      <div className='fakeFielset'>
        <label htmlFor='redoCommField' className='wideStone'>
          <textarea 
            id='redoCommField'
            defaultValue={redoCommTxt}
            onInput={(e)=>redoCommSet(e.target.value)}
            required>
          </textarea>Repetition Reason
        </label>
          
      {redoCommTxt.trim().length < 5 ? null :
        reSteps.map( (st, index)=> {
          const tstep = app.trackOption.find( x => x.key === st.key );
          const isAuth = checkAccess(tstep, st.type);
          if(st.type === 'test') {
            return(
              <div key={index} className='wideStone reStep medBig cap'
                >{!tstep && `${Pref.rapidExd} `}{st.step} Test
                <span>
                  <button
                	  className='reTest'
            				name={'Pass '+ st.step}
            				id={st.key+'redopass'}
            				onClick={()=>passT(st.key, st.step, st.type, 'redone', false)}
            				disabled={lock || !isAuth}>
            				<label>Pass</label>
          				</button>
          				<button
                	  className='reFail'
            				name={'Fail '+ st.step}
            				id={st.key+'redofail'}
            				onClick={()=>passT(st.key, st.step, st.type, false, false)}
            				disabled={lock || !isAuth}>
            				<label>Fail</label>
          				</button>
          				<button
                	  className='reBy'
            				name={'Bypass '+ st.step}
            				id={st.key+'redobypass'}
            				onClick={()=>passT(st.key, st.step, st.type, 'redone', true)}
            				disabled={lock || !isAuth}>
            				<label>Bypass</label>
          				</button>
        				</span>
      				</div>
  		      );
          }else{
            return(
              <div key={index} className='wideStone reStep medBig cap'
                >{!tstep && `${Pref.rapidExd} `}{st.step} {st.type}
                <span>
          				<button
                	  className='reInspect'
            				name={`${st.step}  ${st.type}`}
            				id={st.key+'redook'}
            				onClick={()=>passS(st.key, st.step, st.type, 'redone')}
            				disabled={lock || !isAuth}>
            				<label>OK</label>
          				</button>
          				<button
                	  className='reFail'
            				name={st.step + ' fail'}
            				id={st.key+'redong'}
            				onClick={()=>passS(st.key, st.step, st.type, false)}
            				disabled={lock || !isAuth}>
            				<label>NG</label>
          				</button>
        				</span>
      				</div>
            );
          }
      })}
      </div>
    </div>
  );
};

export default RedoStep;