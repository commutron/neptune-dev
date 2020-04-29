import React, { useState, useLayoutEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium.jsx';
import MultiSelect from "react-multi-select-component";
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
  const [ ncOptions, ncOptionsSet ] = useState([]);
  const [ ncLists, ncListSet ] = useState([]);
  
  useLayoutEffect( ()=> {
    const ncCombo = Array.from(app.nonConTypeLists, x => { 
                      return { 
                        label: x.listPrefix +". "+ x.listName, 
                        value: x.key 
                      } } );
    ncOptionsSet(ncCombo);
    
    const optn = preFill;
    if(!optn) {
      fillSet(false);
    }else{
      if(optn.type === 'plus') {
        const ncDefault = ncCombo.filter( x => 
                            optn.ncLists.find( y => y === x.value ));
        ncListSet(ncDefault);
      }
      fillSet(optn.flowKey);
      Meteor.call('activeFlowCheck', optn.flowKey, (error, reply)=>{
        error && console.log(error);
        warnSet(reply);
      });
    }
  }, [id, preFill, app]);
  
  
  function save(e) {
    e.preventDefault();
    this.go.disabled = true;
    const widgetId = id;
    
    const flowTitle = this.flwttl.value.trim().toLowerCase();
    const ncPlainList = Array.from(ncLists, u => u.value);

    // edit existing
    const f = fill;
    const edit = f ? existFlows.find( x => x.flowKey === f ) : false;
    const editId = edit ? edit.flowKey : false;
    
    if(editId) {
      Meteor.call('setBasicPlusFlowHead', widgetId, editId, flowTitle, ncPlainList, (error)=>{
        if(error)
          console.log(error);
        toast.success('Saved');
        selfclose();
      });
    }else{
      Meteor.call('pushBasicPlusFlow', widgetId, flowTitle, ncPlainList, (error)=>{
        error && console.log(error);
        toast.success('Saved');
        selfclose();
      });
    }
  }
    
  const f = fill;
  const e = f ? existFlows.find( x => x.flowKey === f ) : false;
  
  const eN = e ? e.title : '';

  return(
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
        <label htmlFor='List Options'>
          <MultiSelect
            options={ncOptions}
            value={ncLists}
            onChange={ncListSet}
            labelledBy={"List Options"}
            hasSelectAll={false}
            disableSearch={true}
        />List Options</label>
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
