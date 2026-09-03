import React, { useState, Fragment } from 'react';
// import Pref from '/public/pref.js';
import { toast } from 'react-toastify';
import ModelInline from '/client/layouts/Models/ModelInline';
import ModelNative, { OpenModelNative } from '/client/layouts/Models/ModelNative';

// import { CountDownNum } from '/client/components/smallUi/ClockString';

const ServiceDock = ({ maintData, serve
  // tideKey
})=> {
  
  const not = maintData.status === 'notrequired';
  const willnot = maintData.status === 'willnotrequire';
  const noReq = not || willnot;
  
  const [ work, setWork ] = useState( false );
  const [ notes, setNotes ] = useState( maintData.notes );
  const [ photo, setPhoto ] = useState( '' );
  
  function notReq() {
    Meteor.call('serveNoReqSet', maintData._id, noReq, (error)=>{
			if(error) {
		    console.log(error);
		    toast.error('Server Error');
			}
		});
  }
  
  const cllbk = (err)=> {
    setWork(false);
    if(err) {
	    console.log(err);
	    toast.error('Server Error');
		}
  };
  
  function doCheck(task, state, index) {
    setWork(index);
    if(!state || state === 'false') {
  		Meteor.apply('serveNotCheck', [ maintData._id, task ],
  		{wait: true},
  		(err)=> cllbk(err)
  		);
    }else{
      const isDone = serve.tasks.every( t => {
        let tx = Array.isArray(t) ? t[0] : t;
        if(task === tx || maintData.checklist.find( c => c.task === tx )) {
          return true;
        }else{
          return false;
        }
      });
  		Meteor.apply('serveCheck', [ maintData._id, task, isDone ],
  		{wait: true},
  		(err)=> cllbk(err)
  		);
    }
	}
	
	function saveNotes() {
    Meteor.call('serveNotesSet', maintData._id, notes, (error)=>{
			if(error) {
		    console.log(error);
		    toast.error('Server Error');
			}
		});
	}
  
  return(
    <Fragment>
      
      <ModelNative
        dialogId='service_card_checklist_model'
        title=''
        icon=''
        colorT='blueT'>
        <img 
          style={{ maxWidth: '100%', maxHeight: '80%'}}
          // src="https://static.clideo.com/assets/images/landing/cut-audio-2x.png" 
          src={photo}
          alt='Link to photo is not found'
         />
      </ModelNative>
        
      <div className='fakeFielset centreText'>
        <div className='beside gapminC'>
          <i className='fa-solid fa-hourglass-start fa-fw' style={{color:'var(--emerald)'}}></i>
          <span><n-num>{serve.qtTime || 0}</n-num> Minutes Quoted</span>
        </div>
        {/*<div>{serve.qtTime && <CountDownNum dur={serve.qtTime * 60} peers={1} />} Remaining</div>*/}
      </div>
      
      {!noReq &&
  			<div className='fakeFielset overscroll'>
    			<div className='checkboxList'>
            {serve.tasks.map( (m, index)=> (
              <ChecklistItem
                key={index}
                index={index}
                m={m}
                maintData={maintData}
                doCheck={doCheck}
                work={work}
                setPhoto={setPhoto}
              />
            ))}
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
			
			{not ?
        <div className='fakeFielset beside gapminC'>
          <n-fa1><i className="fa-solid fa-ban fa-3x orangeT"></i></n-fa1>
          <p className='big vmarginquarter centreText'>Service is Not Required</p>
          <p className='nomargin centreText'>Marked by Employee</p>
        </div>
        :
        willnot &&
        <div className='fakeFielset beside gapminC'>
          <n-fa2><i className="fa-solid fa-ban fa-3x orangeT"></i></n-fa2>
          <p className='big vmarginquarter centreText'>Service is Not Required</p>
          <p className='nomargin centreText'>Marked by Neptune</p>
        </div>
      }
			
			{maintData.status !== 'complete' &&
  			<div className='fakeFielset vmargin'>
          <ModelInline 
            title='Service Not Required'
            color='wet' 
            border='borderOrange'
            icon='fa-solid fa-ban'
            open={willnot}
          >
            <div className='centre'>
              <button
                type='button'
                id='noneed'
                title='Service Not Required'
                className='action orangeSolid'
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

const ChecklistItem = ({ index, m, maintData, doCheck, work, setPhoto })=> {
  
  let mK = Array.isArray(m);
  let txt = mK ? m[0] : m;
  let chk = maintData.checklist.find( c => c.task === txt ) ? true : false;
  
  return(
    <div className='margin5 borderGray noCopy'>         
      <label htmlFor={'tsk'+index} className='beside'>
        <input
          id={'tsk'+index}
          type='checkbox'
          checked={chk}
          onChange={()=>doCheck(txt, !chk, index)}
          disabled={work === index}
        />
        <i className='line15x'>{mK ? m[0] : m}</i>
      </label>
      <span>
        {mK && m[1] ? 
          <a target='_blank' href={m[1]}><n-fa0><i className="fa-solid fa-paperclip fa-lg"></i></n-fa0></a>
        : null}
        {mK && m[2] ? 
        
          <OpenModelNative 
            dialogId='service_card_checklist_model'
            title=''
            icon='fa-solid fa-image'
            colorB='transparent wetSolid smallAction nospace nomargin'
            colorT='nT'
            pre={()=>setPhoto(m[2])}
          />
        : null}
      </span>
  </div>  
  );
};