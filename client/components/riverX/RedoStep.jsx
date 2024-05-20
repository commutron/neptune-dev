import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import ButtonRedo from '/client/components/tinyUi/ButtonRedo';

const RedoStep = ({ 
  batchId, seriesId, itemData,
  brancheS, app, redoCommTxt, handleComm, close 
})=> {
  
  const isInspect = Roles.userIsInRole(Meteor.userId(), 'inspect');
  const isTester = Roles.userIsInRole(Meteor.userId(), 'test');
  
  // const [ intend, intendSet ] = useState(false);
  const [ lock, lockSet ] = useState(false);
  
  const reSteps = itemData.history.filter( x => x.good === true &&
                    ( x.type === 'build' || x.type === 'inspect' || 
                      x.type === 'test' || x.type === 'checkpoint' ));
  
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
    <div className='dBotGap stoneForm'>
      <div className='space1v centreText medBig cap'>Repeat {types}</div>
      {/*
      <button
        className='blue action blueSolid whiteT space1v layerOne centreText medBig clean lnht cap'
        onClick={()=>intendSet(!intend)}
      >Repeat {types}</button>
      
      {!intend ? null :
      */}
        <div className='fakeFielset'>
          <label htmlFor='redoCommField' className='wideStone'>
            <textarea 
              id='redoCommField'
              defaultValue={redoCommTxt}
              onInput={(e)=>handleComm(e.target.value)}
              rows={1}
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
            				<ButtonRedo
                      act='bypass'
                      ky={st.key}
                      step={st.step}
                      func={()=>passT(st.key, st.step, st.type, 'redone', true)}
                      lockout={lock || !isAuth}
                    />
                    <ButtonRedo
                      act='fail'
                      ky={st.key}
                      step={st.step}
                      func={()=>passT(st.key, st.step, st.type, false, false)}
                      lockout={lock || !isAuth}
                    />
                    <ButtonRedo
                      act='pass'
                      ky={st.key}
                      step={st.step}
                      func={()=>passT(st.key, st.step, st.type, 'redone', false)}
                      lockout={lock || !isAuth}
                    />
          				</span>
        				</div>
    		      );
            }else{
              return(
                <div key={index} className='wideStone reStep medBig cap'
                  >{!tstep && `${Pref.rapidExd} `}{st.step} {st.type}
                  <span>
            				<ButtonRedo
                      ky={st.key}
                      step={st.step}
                      func={()=>passS(st.key, st.step, st.type, false)}
                      lockout={lock || !isAuth}
                    />
                    <ButtonRedo
                      act='okay'
                      ky={st.key}
                      step={`${st.step}  ${st.type}`}
                      func={()=>passS(st.key, st.step, st.type, 'redone')}
                      lockout={lock || !isAuth}
                    />
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