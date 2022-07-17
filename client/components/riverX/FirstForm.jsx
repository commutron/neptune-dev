import React, { useState, useLayoutEffect, Fragment } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';
import { MultiSelect } from "react-multi-select-component";

const FirstForm = ({ 
  batchId, seriesId, serial,
  sKey, sStep, sBranch,
  repeatOp,
  handleVerify,
  app, users
})=> {
  
  const [ inspectCombo, inspectComboSet ] = useState( false );
  const [ userCombo, userComboSet ] = useState( [] );
  const [ buildCombo, buildComboSet ] = useState( [] );
  
  const [ howIState, howISet ] = useState( false );
  const [ whoBState, whoBSet ] = useState( false );
  const [ howBState, howBSet ] = useState( false );
  const [ wthBState, wthBSet ] = useState( false );
  
  const [ ngState, ngSet ] = useState('');
  
  useLayoutEffect( ()=>{
    const inspectOps = sBranch?.inspectMethods || [];
    const iCombo = Array.from(inspectOps, x => { 
                    let icon = x.toLowerCase().includes('eye') ? 'fa-eye' :
                               x.toLowerCase().includes('camera') ? 'fa-camera' :
                               x.toLowerCase().includes('video') ? 'fa-video' :
                               x.toLowerCase().includes('x-ray') ? 'fa-x-ray' :
                               x.toLowerCase().includes('micro') ? 'fa-microscope' :
                               x.toLowerCase().includes('aoi') ? 'fa-chalkboard' :
                               'fa-search';
                    return { name: x, icon: icon } } );
    if(iCombo.length === 1 ) { howISet( iCombo[0].name ) }
    inspectComboSet( iCombo );
    
    const uCombo = Array.from(users, x => { return { label: x.username, value: x._id } } );
    userComboSet( uCombo );
    
    const buildMethods = sBranch?.buildMethods || [];
    const bCombo = Array.from(buildMethods, x => { return { label: x, value: x } } );
    buildComboSet( bCombo );
    
  }, [sBranch]);
  
  
  function consume() {
    let val = this.consume.value.trim();
    if(!val || val === '') {
      null;
    }else{
      wthBSet( val );
    }
  }
  function flaw() {
    let val = this.issue.value.trim();
    if(!val || val === '') {
      null;
    }else{
      ngSet( val );
    }
  }
  
  function notgood() {
    this.goBad.disabled = true;
    pass(false);
  }
  
  function pass(goodness) {
    this.goFform.disabled = true;
    
    const stepKey = sKey;
		const stepName = sStep;
      
    const howI = howIState;
    const whoB = Array.from(whoBState, u => u.value);
    const howB = Array.from(howBState, u => u.value);
    const wthB = wthBState;
    
    const good = goodness;
    const diff = repeatOp;
    const ng = ngState;
    
    const fresh = !repeatOp;
    
		Meteor.call('addFirstX', 
		  batchId, seriesId, serial, stepKey, stepName, 
		  good, whoB, howB, wthB, howI, 
		  diff, ng, fresh, 
		(error, reply)=>{
			if(error) {
		    console.log(error);
		    toast.error('Server Error');
			}
		  if(reply === true) {
				document.getElementById('lookup').focus();
     	  handleVerify(null);
			}else{
				toast.warning('Insufficient Permissions');
		  }
		});
	}
  
  const noNG = !howIState || !whoBState || !howBState;
  
  const second = whoBState && Array.from(whoBState, u => u.value)
                                .includes(Meteor.userId());
  const noG = !noNG && !second ? false : true;
  
  return(
    <Fragment>
      <div className='fakeFielset centreText big cap'>{sStep}</div>
      
      {inspectCombo && inspectCombo.length > 1 ?
        <div className='fakeFielset balancer'>
          {inspectCombo.map( (obj, ix)=>{
            return(
              <Fragment key={ix}>
                <input
                  id={obj.name+ix}
                  type='radio'
                  name='howInspect'
                  onChange={()=>howISet( obj.name )}
                  required />
                <label
                  htmlFor={obj.name+ix}
                  className='roundRadioSelect onblueHover'>
                  <i className={`fas ${obj.icon} fa-2x fa-fw gapR`}></i>{obj.name}
                </label>
              </Fragment>
          )})}
        </div>
      : null}

      <div className='fakeFielset'>
        {userCombo ?
          <label htmlFor='Builder'>
            <MultiSelect
              options={userCombo}
              value={whoBState || []}
              onChange={(e)=>whoBSet(e.length > 0 ? e : false)}
              labelledBy="Builder"
              hasSelectAll={false}
              disableSearch={true}
          />{Pref.builder}</label>
        : null}
      
        {buildCombo ?
          <label htmlFor='Method'>
            <MultiSelect
              options={buildCombo}
              value={howBState || []}
              onChange={(e)=>howBSet(e.length > 0 ? e : false)}
              labelledBy="Method"
              hasSelectAll={false}
              disableSearch={true}
          />{Pref.method}</label>
        : null}
        
        {sBranch.reqConsumable ?
          <label htmlFor='consume' className='vtop wideStone w100'>
            <textarea
    			    type='text'
    			    id='consume'
    			    onChange={(e)=>consume(e)}
    			    required>
    			</textarea>{Pref.consume}</label>
        : null}
      </div>
			
      <div className='fakeFielset'> 
        <label htmlFor='issue' className='wideStone'>
          <textarea
  			    type='text'
  			    id='issue'
  			    onChange={(e)=>flaw(e)}>
  			</textarea>{Pref.outIssue}</label>
			</div>
			
			<div className='balancer overscroll'>
        <button
          type='button'
          id='goBad'
          title={`No Good, repeat ${Pref.trackFirst}`}
          className='roundActionIcon dbblRound firstBad'
          disabled={noNG}
          onClick={()=>notgood()}
        ><i className="fas fa-times fa-3x"></i>
        <br /><i className='medBig whiteT'>NG</i></button>

        <button
          type='button'
          id='goFform'
          title={`OK ${Pref.trackFirst}, continue process`}
          className='roundActionIcon dbblRound firstGood'
          disabled={noG}
          onClick={()=>pass(true)}
        ><i className="fas fa-check-double fa-3x"></i>
        <br /><i className='medBig whiteT'>OK</i></button>
      </div>
      

    </Fragment>
  );
};

export default FirstForm;