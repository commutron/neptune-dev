import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '../smallUi/ModelLarge.jsx';
import FlowBuilder from '/client/components/bigUi/ArrayBuilder/FlowBuilder.jsx';
// requires
// id = widget ID
// existFlows = existing flows

const FlowFormRouteWrapper = ({ 
  id, app,
  existFlows, edit, preFill,
  noText, lock
})=> (
  <ModelLarge
    button='Change Flow'
    title={`Change ${Pref.flow}`}
    color='blueT'
    icon='fa-stream'
    lock={!Roles.userIsInRole(Meteor.userId(), 'edit') || lock}
    noText={noText}
  >
    <FlowFormRoute
      id={id}
      app={app}
      existFlows={existFlows}
      edit={edit}
      preFill={preFill}
    />
  </ModelLarge>
);

export default FlowFormRouteWrapper;
  
const FlowFormRoute = ({ 
  id, app,
  existFlows, edit, preFill,
  selfclose
})=> {
  
  const [ warn, warnSet ] = useState(false);
  const [ flow, flowSet ] = useState(false);
  
  function setFlow(recSet) {
    let input = recSet;
    if(!input) {
      flowSet(false);
    }else{
      flowSet(input);
    }
  }
  
  function save(e) {
    e.preventDefault();
    this.goFlow.disabled = true;
    const widgetId = id;
    const flowObj = flow;
    
    // edit existing
    const editId = preFill ? preFill.flowKey : false;
    
    if(!flowObj) {
      toast.warning("Can't Save, missing flow");
    }else if(editId) {
      Meteor.call('setBasicPlusFlowRoute', widgetId, editId, flowObj, (error)=>{
        if(error)
          console.log(error);
        toast.success('Saved');
        selfclose();
      });
    }else{
      toast.warning('Error, key not found');
    }
  }
  
  useEffect( ()=> {
    const optn = preFill;
    if(!optn) {
      null;
    }else{
      Meteor.call('activeFlowCheck', optn.flowKey, (error, reply)=>{
        error && console.log(error);
        warnSet(reply);
      });
    }
  }, []);
  
  const fTitle = preFill ? preFill.title : '';
  const fFlow = preFill ? preFill.flow : false;

  return(
    <div>
      <form
        id='flowSave'
        className=''
        onSubmit={(e)=>save(e)}
      >
      {warn ?
        <div className='centre'>
          <p><b>{fTitle}</b> is in used by</p>
          {warn === 'liveRiver' ?
            <h3>An Active {Pref.batch} as the {Pref.buildFlow}</h3>
          : warn === 'liveAlt' ?
            <h3>An Active {Pref.batch} as the {Pref.buildFlowAlt}</h3>
          : warn === 'liveAlt' ?
            <h3>An Inactive {Pref.batch} as the {Pref.buildFlow}</h3>
          : warn === 'liveAlt' ?
            <h3>An Inactive {Pref.batch} as the {Pref.buildFlowAlt}</h3>
          :
            <p>something</p>}
        </div>
      : null}
      </form>
      
      <FlowBuilder
        app={app}
        options={app.trackOption}
        defaultEnd={app.lastTrack}
        baseline={fFlow}
        onClick={(e)=>setFlow(e)} />
        
      <hr />

      <div className='space centre'>
        <button
          type='submit'
          id='goFlow'
          className='medBig'
          disabled={!flow}
          form='flowSave'
          className='action clearGreen'>SAVE</button>
        <br />
      </div>
    </div>
  );
};