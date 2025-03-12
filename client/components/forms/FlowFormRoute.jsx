import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
import FlowBuilder from '/client/components/bigUi/ArrayBuilder/FlowBuilder';

const FlowFormRoute = ({ 
  id, app, existFlows, preFillKey, access, clearOnClose
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
  
  function handleSaveFlowRoute() {
    this[id+'goFlow'].disabled = true;
    const widgetId = id;
    const flowObj = flow;
    
    // edit existing
    const editId = preFillKey ? preFillKey : false;
    
    if(!flowObj) {
      toast.warning("Can't Save, missing flow");
    }else if(editId) {
      Meteor.call('setBasicPlusFlowRoute', widgetId, editId, flowObj, (error)=>{
        error && console.log(error);
        toast.success('Saved');
        clearOnClose();
      });
    }else{
      toast.warning('Error, key not found');
    }
  }
  
  useEffect( ()=> {
    if(!preFillKey) {
      warnSet(false);
      baseSet(false);
      flowSet(false);
    }else{
      const fill = existFlows.find( f => f.flowKey === preFillKey );
      fill ? baseSet(fill) : null;
      
      Meteor.call('activeFlowCheck', preFillKey, (error, reply)=>{
        error && console.log(error);
        warnSet(reply);
      });
    }
  }, [preFillKey]);

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
          id='flowRouteSave'
          onSubmit={(e)=>handleSaveFlowRoute(e)}
        >
          <div className='centre centreText'>
            <p className='cap nomargin nospace'>{fTitle}</p>
            <p className='nomargin nospace'>
            {!warn ? <em>Not In Use</em> :
              warn === 'liveRiver' ?
              <b>In use by an Active {Pref.xBatch} as the {Pref.buildFlow}</b>
            : warn === 'liveAlt' ?
              <b>In use by an Active {Pref.xBatch} as the {Pref.buildFlowAlt}</b>
            : warn === 'offRiver' ?
              <b>In use by an Inactive {Pref.xBatch} as the {Pref.buildFlow}</b>
            : warn === 'offAlt' ?
              <b>In use by an Inactive {Pref.xBatch} as the {Pref.buildFlowAlt}</b>
            :
              <b>In use by ~unknown~</b>}
            </p>
          </div>
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
            id={id+'goFlow'}
            disabled={!flow || !access}
            form='flowRouteSave'
            className='action nSolid'>SAVE</button>
          <br />
        </div>
        </div>
      }
    </ModelNative>
  );
};

export default FlowFormRoute;