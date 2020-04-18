import React, { useState, useLayoutEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium.jsx';
// requires
// id = widget ID
// existFlows = existing flows
// options = buildStep options from the app settings
// end = lastStep from app settings

const FlowFormHeadWrapper = ({
  id, app,
  existFlows, edit, preFill, 
  noText, lock
})=> {
  const name = edit ? 'Edit' : 'New Flow';
  
  return(
    <ModelMedium
      button={name}
      title={name}
      color='greenT'
      icon='fa-project-diagram'
      lock={!Roles.userIsInRole(Meteor.userId(), 'edit') || lock}
      noText={noText}
    >
      <FlowFormHead
        id={id}
        existFlows={existFlows}
        preFill={preFill}
        app={app}
      />
      
    </ModelMedium>
  );
};

export default FlowFormHeadWrapper;



const FlowFormHead = ({ id, existFlows, preFill, app, selfclose })=> {

  const [ fill, fillSet ] = useState(false);
  const [ warn, warnSet ] = useState(false);
  const [ ncLists, ncListSet ] = useState([]);
  

  function setNCList(e) {
    let input = e.target.value;
    let tempList = ncLists;
    let ncOn = tempList.find( x => x === input );
    if(ncOn) { 
      tempList.pop(input);
    }else{
      tempList.push(input);
    }
    ncListSet(tempList);
  }
  
  
  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const widgetId = id;
    
    const flowTitle = this.flwttl.value.trim().toLowerCase();
    
    // edit existing
    const f = fill;
    const edit = f ? existFlows.find( x => x.flowKey === f ) : false;
    const editId = edit ? edit.flowKey : false;
    
    if(editId) {
      Meteor.call('setBasicPlusFlowHead', widgetId, editId, flowTitle, ncLists, (error)=>{
        if(error)
          console.log(error);
        toast.success('Saved');
        selfclose();
      });
    }else{
      Meteor.call('pushBasicPlusFlow', widgetId, flowTitle, ncLists, (error)=>{
        error && console.log(error);
        toast.success('Saved');
        selfclose();
      });
    }
  }
  
  useLayoutEffect( ()=> {
    const optn = preFill;
    if(!optn) {
      fillSet(false);
    }else{
      fillSet(optn.flowKey);
      optn.type === 'plus' && ncListSet(optn.ncLists);
      Meteor.call('activeFlowCheck', optn.flowKey, (error, reply)=>{
        error && console.log(error);
        warnSet(reply);
      });
    }
  }, []);
    
  const f = fill;
  const e = f ? existFlows.find( x => x.flowKey === f ) : false;
  
  const eN = e ? e.title : '';

  return (
      <div>
        <div className=''>
          <form
            id='flowSave'
            className='centre'
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
            <em className='small'>duplicate {Pref.flow} names are ill advised but not blocked</em>
            <p>
              <input
                type='text'
                id='flwttl'
                defaultValue={eN}
                placeholder='descriptive title'
                required />
              <label htmlFor='flwttl'>{Pref.flow} title</label>
            </p>
          </form>
        </div>
        
        <hr />
        
        <h2 className='cap'>{Pref.nonCon} lists</h2>
        
        <div>
          {app.nonConTypeLists.map( (entry, index)=>{
            let ncOn = ncLists.find( x => x === entry.key );
            return(
            <label key={entry.key+index}>
              <input 
                type='checkbox'
                className='bigCheck'
                value={entry.key}
                onChange={(e)=>setNCList(e)}
                defaultChecked={ncOn} />
              {entry.listPrefix}. {entry.listName}</label>
          )})}
          <p><em>If none are chosen the Legacy List will be used</em></p>
        </div>
        
        <hr />

        <div className='space centre'>
          <button
            type='submit'
            id='go'
            form='flowSave'
            className='action clearGreen'>SAVE</button>
          <br />
        </div>
      </div>
  );
};


export const FlowRemove = ({ id, fKey })=>	{
  
  function pull() {
    Meteor.call('pullFlow', id, fKey, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply === 'inUse') {
        toast.warning('Cannot be removed, is currently in use');
      }else if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
  }
    
  return(
    <span>
      <button
        title='delete process flow *if not in use'
        className='transparent'
        onClick={()=>pull()}
        disabled={!Roles.userIsInRole(Meteor.userId(), 'edit')}>
        <label className='navIcon actionIconWrap'>
          <i className={'fas fa-minus-circle fa-lg fa-fw redT'}></i>
          <span className={'actionIconText redT'}>Delete</span>
        </label>
      </button>
    </span>
  );
};
