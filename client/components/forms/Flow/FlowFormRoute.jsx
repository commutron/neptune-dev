import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
import FlowBuilder from '/client/components/bigUi/ArrayBuilder/FlowBuilder';
import InUseCheck from './InUseCheck';

const FlowFormRoute = ({ 
  id, app, imods, existFlows, preFillKey, access, clearOnClose
})=> {
  
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
      baseSet(false);
      flowSet(false);
    }else{
      const fill = existFlows.find( f => f.flowKey === preFillKey );
      fill ? baseSet(fill) : null;
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
          <InUseCheck
            flowtitle={fTitle}
            preFillKey={preFillKey}
          />
        </form>
        
        <FlowBuilder
          app={app}
          options={app.trackOption}
          defaultEnd={app.lastTrack}
          imods={imods}
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