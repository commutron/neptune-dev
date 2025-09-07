import { Random } from 'meteor/random'
import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
import BigTideTask from '/client/components/tide/TideControl/BigTideTask';

const TideMulti = ({ user, app, brancheS, plainBatchS })=> (
	<ModelNative
    dialogId='multiprojdialog'
    title={`Multiple ${Pref.xBatch} Mode`}
    icon='fa-solid fa-layer-group'
    colorT='tealT'
    dark={true}
    >
      <TideMultiCore
        user={user}
        app={app}
        brancheS={brancheS}
        plainBatchS={plainBatchS}
      />
  </ModelNative>
);

export default TideMulti;

const TideMultiCore = ({ user, app, brancheS, plainBatchS })=> {
  
  const thingMounted = useRef(true);
  
  const eng = user?.engaged;
  const mltiON = eng?.task === 'MLTI';
  
  useEffect(() => {
    return () => {
      thingMounted.current = false;
    };
  }, []);
  
  const [ actionIDOne, setActionIDOne ] = useState( Random.id() );
  const [ batchStateOne, batchSetOne ] = useState( "" );
  const [ taskStateOne, taskSetOne ] = useState( false );
  const [ subtStateOne, subtSetOne ] = useState( false );
  
  const [ actionIDTwo, setActionIDTwo ] = useState( Random.id() );
  const [ batchStateTwo, batchSetTwo ] = useState( "" );
  const [ taskStateTwo, taskSetTwo ] = useState( false );
  const [ subtStateTwo, subtSetTwo ] = useState( false );
  
  const [ lockTaskState, lockTaskSet ] = useState(false);
  const [ working, setWorking ] = useState(false);
  
  const valid = batchStateOne && batchStateTwo && 
  							batchStateOne !== batchStateTwo &&
  							taskStateOne && taskStateTwo && 
  							subtStateOne !== false && 
		        	  subtStateTwo !== false;
	
  const replyCallback = (error, re)=> {
    if(error) {
      console.log(error);
      toast.error('Rejected by Server');
      if(thingMounted.current) {
	      setWorking(false);
	  		lockTaskSet(false);
	    }
    }
    if(re === true) {
      if(thingMounted.current) {
        setActionIDOne(Random.id());
        setActionIDTwo(Random.id());
        setWorking(false);
  			Meteor.setTimeout( ()=> lockTaskSet(false), 5000);
      }
    }
  };
  
  const handleStart = ()=> {
		setWorking(true);
    lockTaskSet && lockTaskSet(true);
    
  	let matchO = plainBatchS.find( x => x === batchStateOne);
  	!matchO && toast.warning('please choose from the list');
  	
  	let matchI = plainBatchS.find( x => x === batchStateTwo);
  	!matchI && toast.warning('please choose from the list');
  	
  	if( valid && matchO && matchI ) {

	  	Meteor.apply('startMultiTideTask', [ 
	  		batchStateOne, actionIDOne, taskStateOne, subtStateOne, 
	  		batchStateTwo, actionIDTwo, taskStateTwo, subtStateTwo
	    ],
	    {wait: true},
	    (error, re)=> replyCallback(error, re) );

  	}else{
  		setWorking(false);
    	lockTaskSet && lockTaskSet(false);
  	}
  };
  
  const handleStop = ()=> {
  	lockTaskSet && lockTaskSet(true);
  	
  	const engNow = user?.engaged;
  	const mltiONnow = engNow?.task === 'MLTI';
  	
  	if(mltiONnow) {
  		const tkeys = engNow.tKey;
  		
  		Meteor.apply('stopMultiTideTask', [ tkeys[0], tkeys[1] ],
	    {wait: true},
	    (error, re)=> replyCallback(error, re) );
	    
  	}else{
  		lockTaskSet && lockTaskSet(false);
  	}
  };
  
  const goclose = (batch)=> {
  	Session.set('now', batch);
  	const dialog = document.getElementById('multitask_time');
    dialog?.close();
  };
  
  if( eng && eng.task !== 'MLTI' ) {
  	return(
  		<div className='min400 spacehalf vmargin centreText med'>
  			<p className='med'>Multiple {Pref.xBatch} mode is unavailable.</p>
  			<p className='med'>Stop recording time on other projects first.</p>
  		</div>
  	);
  }
  
  return(
    <div className='min600 vmargin centre'>

      {!mltiON ?
	      <div className='balance w100 cap'>
	      
	      	<div className='space margin5'>
	      		<h3>{Pref.xBatch} 1</h3>
	      		
	      		<input
      		    type='text'
      		    id='setbatchone'
      		    list='livebatches'
      		    title='Project 1' 
      		    className='vmarginhalf'
      		    minLength='5'
      		    maxLength='5'
      		    onChange={(e)=>batchSetOne(e.target.value)}
      		    defaultValue={batchStateOne}
      		    disabled={lockTaskState}
      		    required
      		  />
      		    
			      <BigTideTask
			      	id='multitaskselectONE'
			      	key='multitaskselectONE'
			        ctxLabel='Set A Task'
			        app={app}
			        brancheS={brancheS} 
			        taskState={taskStateOne}
			        subtState={subtStateOne}
			        lockTaskState={lockTaskState}
			        taskSet={taskSetOne}
			        subtSet={subtSetOne} />
			        
			    </div>
		    
			    <div className='space margin5'>
	      		<h3>{Pref.xBatch} 2</h3>
	      	
            <input
      		    type='text'
      		    id='setbatchtwo'
      		    list='livebatches'
      		    title='Project 2' 
      		    className='vmarginhalf'
      		    minLength='5'
      		    maxLength='5'
      		    onChange={(e)=>batchSetTwo(e.target.value)}
      		    defaultValue={batchStateTwo}
      		    disabled={lockTaskState}
      		    required
      		  />
          
			      <BigTideTask
			      	id='multitaskselectTWO'
			      	key='multitaskselectTWO'
			        ctxLabel='Set A Task'
			        app={app}
			        brancheS={brancheS} 
			        taskState={taskStateTwo}
			        subtState={subtStateTwo}
			        lockTaskState={lockTaskState}
			        taskSet={taskSetTwo}
			        subtSet={subtSetTwo} />
			        
			    </div>
			    
          <datalist id='livebatches'>
            {plainBatchS.map( (entry)=>( 
               <option key={entry} value={entry}>{entry}</option> 
            ))}
          </datalist>
			    
			  </div>
			  :
			  <div className='vmargin space'>
			  	<h3>Recording time on two {Pref.xBatchs}</h3>
			  	<div className='balancer vmarginhalf'>
				  	{(eng.tName || []).map( (batch)=>(
				  		<button 
		            key={batch}
		            className='medBig action whiteSolid margin5 letterSpaced'
		            onClick={()=>goclose(batch)}
		          >{batch}</button>
	          ))}
				  </div>
				</div>
      }
      
      {!mltiON ?
			  <div className='w100 vmargin'>
			  	<button
			  		type='button'
		        title={`START ${Pref.xBatchs}`}
		        className={`big centreRow spacehalf tideIn ${working ? 'startWork' : ''}`}
		        onClick={()=>handleStart()}
		        disabled={!valid || lockTaskState}
		      >
		      <b>
		        <span className='fa-stack tideIcon'>
		          <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
		          <i className="fas fa-play fa-stack-1x" data-fa-transform="shrink-1 right-2"></i>
		        </span>
		      </b>START</button>
			  </div>
		  :
		  	<div className='w100 vmargin'>
		  		<button
		  			type='button'
		        aria-label={`STOP ${Pref.xBatchs}`}
		        className='big centreRow spacehalf tideOut'
		        onClick={()=>handleStop()}
		        disabled={lockTaskState}
		      >
			      <em>
			        <span className='fa-stack tideIcon'>
			          <i className="fas fa-circle-notch fa-stack-2x fa-spin tideIndicate"></i>
			          <i className="fas fa-stop fa-stack-1x" data-fa-transform="shrink-1"></i>
			        </span> 
			      </em>STOP</button>
      	</div>
      }
            
      
    </div>
  );
};

export const MultiRunning = ({ lock })=> {
	
	const openMutiTide = ()=> {
    const dialog = document.getElementById('multiprojdialog');
    dialog?.showModal();
  };
  
  return(
    <button
      aria-label='Multi Projects Running'
      className='tideMulti'
      onClick={()=>openMutiTide()}
      disabled={lock}
    >
      <i>
        <span className='fa-stack tideIcon'>
          <i className="fa-solid fa-circle-notch fa-stack-2x fa-spin tideIndicate"></i>
          <i className="fa-solid fa-layer-group fa-stack-1x" data-fa-transform="shrink-1"></i>
        </span>
      </i>
    </button>
  );
};

export const MultiDivert = ({ lock })=> {
	
	const openMutiTide = ()=> {
    const dialog = document.getElementById('multiprojdialog');
    dialog?.showModal();
  };
  
  return(
    <n-tide-task>
	    <button
	      title='Multiple Projects'
	      className='tideMulti'
	      onClick={()=>openMutiTide()}
	      disabled={lock}
	    >
	    <b>
	      <span className='fa-stack tideIcon'>
	        <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
	        <i className="fa-solid fa-layer-group fa-stack-1x" data-fa-transform="shrink-1"></i>
	      </span>
	    </b>Multi</button>
    </n-tide-task>
  );
};