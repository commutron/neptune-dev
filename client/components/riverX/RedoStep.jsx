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
                    ( x.type === 'inspect' || x.type === 'test') );
  
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
  
  function checkAccess(tbranchKey) {
    const brObj = brancheS.find( b => b.brKey === tbranchKey ) || null;
	  const reqUL = brObj ? brObj.reqUserLock === true : null;
		const reqKey = reqUL ? ( 'BRK' + tbranchKey ) : null;
  	return !reqUL ? true : Roles.userIsInRole(Meteor.userId(), reqKey);
  }
  
  if(reSteps.length === 0) {
    return null;
  }
  
  return(
    <div className='dmargin stoneForm'>
      <div className='fakeFielset centreText medBig cap'
        >Repeat Inspection {reSteps.find(re=> re.type === 'test') && ' or Test'}</div>
      
      <div className='fakeFielset'>
        <label htmlFor='redoCommField' className='wideStone'>
          <textarea 
            id='redoCommField'
            defaultValue={redoCommTxt}
            onInput={(e)=>redoCommSet(e.target.value)}
            required>
          </textarea>Repetition Reason
        </label>
          
      {redoCommTxt.trim().length < 3 ? null :
        reSteps.map( (st, index)=> {
          const tstep = app.trackOption.find( x => x.key === st.key );
          if(st.type === 'test') {
  	        const isTest = (tstep ? checkAccess(tstep.branchKey) : true) && isTester;
            return(
              <div key={index} className='wideStone reStep medBig cap'
                >{!tstep && `${Pref.rapidExd} `}{st.step} Test
                <span>
                  <button
                	  className='reTest'
            				name={'Pass '+ st.step}
            				id={st.key+'redopass'}
            				onClick={()=>passT(st.key, st.step, st.type, 'redone', false)}
            				disabled={lock || !isTest}>
            				<label>Pass</label>
          				</button>
          				<button
                	  className='reFail'
            				name={'Fail '+ st.step}
            				id={st.key+'redofail'}
            				onClick={()=>passT(st.key, st.step, st.type, false, false)}
            				disabled={lock || !isTest}>
            				<label>Fail</label>
          				</button>
          				<button
                	  className='reBy'
            				name={'Bypass '+ st.step}
            				id={st.key+'redobypass'}
            				onClick={()=>passT(st.key, st.step, st.type, 'redone', true)}
            				disabled={lock || !isTest}>
            				<label>Bypass</label>
          				</button>
        				</span>
      				</div>
  		      );
          }else{
  	        const isInst = (tstep ? checkAccess(tstep.branchKey) : true) && isInspect;
            return(
              <div key={index} className='wideStone reStep medBig cap'
                >{!tstep && `${Pref.rapidExd} `}{st.step} Inspect
                <span>
          				<button
                	  className='reInspect'
            				name={st.step + ' inspect'}
            				id={st.key+'redook'}
            				onClick={()=>passS(st.key, st.step, st.type, 'redone')}
            				disabled={lock || !isInst}>
            				<label>OK</label>
          				</button>
          				<button
                	  className='reFail'
            				name={st.step + ' fail'}
            				id={st.key+'redong'}
            				onClick={()=>passS(st.key, st.step, st.type, false)}
            				disabled={lock || !isInst}>
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