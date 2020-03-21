import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import Model from '../smallUi/Model.jsx';
import FlowBuilder from '/client/components/bigUi/ArrayBuilder/FlowBuilder.jsx';
// requires
// id = widget ID
// existFlows = existing flows

const FlowFormRoute = ({ 
  id, app,
  existFlows, edit, preFill,
  small, noText, lock
})=> {

  const [ fill, fillSet ] = useState(false);
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
    this.go.disabled = true;
    const widgetId = id;
    const flowObj = flow;
    
    // edit existing
    const f = fill;
    const edit = f ? existFlows.find( x => x.flowKey === f ) : false;
    const editId = edit ? edit.flowKey : false;
    
    if(!flowObj) {
      toast.warning("Can't Save, missing flow");
    }else if(editId) {
      Meteor.call('setBasicPlusFlowRoute', widgetId, editId, flowObj, (error)=>{
        if(error)
          console.log(error);
        toast.success('Saved');
        fillSet(false);
        flowSet(false);
      });
    }else{
      toast.warning('Error, key not found');
    }
  }
  
  useEffect( ()=> {
    const optn = preFill;
    if(!optn) {
      fillSet(false);
    }else{
      Meteor.call('activeFlowCheck', optn.flowKey, (error, reply)=>{
        error && console.log(error);
        warnSet(reply);
        fillSet(optn.flowKey);
      });
    }
  }, []);

  
  const f = fill;
  const e = f ? existFlows.find( x => x.flowKey === f ) : false;
  
  const eN = e ? e.title : '';
  const eF = e ? e.flow : false;
  
  const name = edit ? 'Edit' : 'New Flow';

  return (
    <Model
      button={name}
      title={`${name} ${Pref.flow}`}
      color='greenT'
      icon='fa-stream'
      smIcon={small}
      lock={!Roles.userIsInRole(Meteor.userId(), 'edit') || lock}
      noText={noText}>
  
      <div>
        <form
          id='flowSave'
          className=''
          onSubmit={(e)=>save(e)}
        >
        {warn ?
          <div className='centre'>
            <p><b>{eN}</b> is in used by</p>
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
          end={app.lastTrack}
          baseline={eF}
          onClick={(e)=>setFlow(e)} />
          
        <hr />

        <div className='space centre'>
          <button
            type='submit'
            id='go'
            disabled={!flow}
            form='flowSave'
            className='action clearGreen'>SAVE</button>
          <br />
        </div>
      </div>
      
    </Model>
  );
};
  
export default FlowFormRoute;