import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
import FlowBuilder from '/client/components/bigUi/ArrayBuilder/FlowBuilder';

const FlowFormRoute = ({ 
  id, app, existFlows, preFill, access, clearOnClose
})=> {
  
  const [ warn, warnSet ] = useState(false);
  const [ base, baseSet ] = useState(false);
  
  const [ flow, flowSet ] = useState(false);
  
  function setFlow(recSet) {
    let input = recSet;
    if(!input) {
      flowSet(false);
    }else{
      flowSet(input);
    }
  }
  
  function save() {
    this.goFlow.disabled = true;
    const widgetId = id;
    const flowObj = flow;
    
    // edit existing
    const editId = preFill ? preFill.flowKey : false;
    
    if(!flowObj) {
      toast.warning("Can't Save, missing flow");
    }else if(editId) {
      Meteor.call('setBasicPlusFlowRoute', widgetId, editId, flowObj, (error)=>{
        error && console.log(error);
        toast.success('Saved');
      });
    }else{
      toast.warning('Error, key not found');
    }
  }
  
  useEffect( ()=> {
    if(!preFill) {
      warnSet(false);
      baseSet(false);
      flowSet(false);
    }else{
      const fill = existFlows.find( f => f.flowKey === preFill );
      fill ? baseSet(fill) : null;
      
      Meteor.call('activeFlowCheck', preFill, (error, reply)=>{
        error && console.log(error);
        warnSet(reply);
      });
    }
  }, [preFill]);

  const fTitle = base ? base.title : '';
  const fFlow = base ? base.flow : false;

  return(
    <ModelNative
      dialogId={id+'_flowroute_form'}
      title={`Change ${Pref.flow}`}
      icon='fa-solid fa-stream'
      colorT='blueT'
      closeFunc={()=>clearOnClose()}>
      
      {!base ?
        <div><em>Building Flow...</em></div>
        :
        <div>
        <form
          id='flowSave'
          onSubmit={(e)=>save(e)}
        >
        {warn ?
          <div className='centre centreText'>
            <p><b>{fTitle}</b> is in use by:
            {warn === 'liveRiver' ?
              <b> an Active {Pref.xBatch} as the {Pref.buildFlow}</b>
            : warn === 'liveAlt' ?
              <b> an Active {Pref.xBatch} as the {Pref.buildFlowAlt}</b>
            : warn === 'liveAlt' ?
              <b> an Inactive {Pref.xBatch} as the {Pref.buildFlow}</b>
            : warn === 'liveAlt' ?
              <b> an Inactive {Pref.xBatch} as the {Pref.buildFlowAlt}</b>
            :
              <b> an unknown something</b>}
            </p>
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
            formMethod='dialog'
            id='goFlow'
            className='medBig'
            disabled={!flow || !access}
            form='flowSave'
            className='action nSolid'>SAVE</button>
          <br />
        </div>
        </div>
      }
    </ModelNative>
  );
};

export default FlowFormRoute;