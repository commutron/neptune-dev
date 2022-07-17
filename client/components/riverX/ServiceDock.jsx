import React, { useState, Fragment } from 'react';
// import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import ModelInline from '/client/components/smallUi/ModelInline';

const ServiceDock = ({ maintData, eqId, serve })=> {
  
  const noReq = maintData.status === 'notrequired';
  
  const [ notes, setNotes ] = useState( maintData.notes );

  function notReq() {
    Meteor.call('serveNoReqSet', eqId, maintData.serveKey, noReq, (error)=>{
			if(error) {
		    console.log(error);
		    toast.error('Server Error');
			}
		});
  }
  
  function doCheck(task, state) {
    if(!state || state === 'false') {
  		Meteor.apply('serveNotCheck', [ eqId, maintData.serveKey, task ],
  		{wait: true, noRetry: true},
  		(err)=>{
  			if(err) {
  		    console.log(err);
  		    toast.error('Server Error');
  			}
  		});
    }else{
      const isDone = serve.tasks.every( (m)=> task === m ||
              maintData.checklist.find( c => c.task === m ) );
              
  		Meteor.apply('serveCheck', [ eqId, maintData.serveKey, task, isDone ],
  		{wait: true, noRetry: true},
  		(err)=>{
  			if(err) {
  		    console.log(err);
  		    toast.error('Server Error');
  			}
  		});
    }
	}
	
	function saveNotes() {
    Meteor.call('serveNotesSet', eqId, maintData.serveKey, notes, (error)=>{
			if(error) {
		    console.log(error);
		    toast.error('Server Error');
			}
		});
	}
  
  return(
    <Fragment>
    
      {noReq &&
        <div className='fakeFielset beside'>
          <p><i className="fa-solid fa-ban fa-4x orangeT"></i></p>
          <p className='bigbig centreText'>Service is Not Required</p>
        </div>
      }
      
      {!noReq &&
  			<div className='fakeFielset overscroll'>
    			<div className='checkboxList'>
            {serve.tasks.map( (m, ix)=> {
              let chk = maintData.checklist.find( c => c.task === m ) ? true : false;
              return(
                <label key={ix} htmlFor={'tsk'+ix} className='beside margin5 line15x borderGray noCopy'>
                  <input
                    id={'tsk'+ix}
                    type='checkbox'
                    defaultChecked={chk}
                    onClick={()=>doCheck(m, !chk)}
                  />
                  <i>{m}</i>
                </label>
            )})}
          </div>
        </div>
      }
      
      <div className='fakeFielset'> 
        <label htmlFor='svnote' className='wideStone' style={{width: '100%'}}>
          <textarea
  			    type='text'
  			    id='svnote'
  			    defaultValue={notes}
  			    onChange={(e)=>setNotes(e.target.value)}
  			    rows='4'
  			    style={{
  			      backgroundColor: maintData.notes === notes ? 'rgb(52, 73, 94)' : 'white',
  			      color: maintData.notes === notes ? 'white' : 'black',
  			    }}>
  			  </textarea>
    			<span className='comfort'>
      			<i>Notes</i>
      			<button
              title='save note'
              className='smallAction wetHover'
              onClick={()=>saveNotes(true)}
            >Save</button>
          </span>
        </label>
			</div>
			
			{maintData.status !== 'complete' &&
  			<div className='fakeFielset vmargin'>
          <ModelInline 
            title='Service Not Required'
            color='orange' 
            border='borderOrange'
            icon='fa-solid fa-ban'
          >
            <div className='centre'>
              <button
                type='button'
                id='noneed'
                title='Service Not Required'
                className='action wetSolid'
                disabled={false}
                onClick={()=>notReq()}
              >{noReq ? 'Yes, Service Is Required' : 'No, Service is Not Required'}</button>
            </div>
          </ModelInline>
        </div>
			}
    </Fragment>
  );
};

export default ServiceDock;