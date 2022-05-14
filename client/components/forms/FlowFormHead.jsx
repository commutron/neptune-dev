import React, { useState, useLayoutEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelMedium from '/client/components/smallUi/ModelMedium';
import MultiSelect from "react-multi-select-component";

const FlowFormHeadWrapper = ({
  id, app,
  existFlows, edit, preFill, 
  noText
})=> {
  const name = edit ? 'Edit' : 'New Flow';
  const access = Roles.userIsInRole(Meteor.userId(), 'edit');
  const aT = !access ? Pref.norole : '';
  const title = access ? name : aT;
  return(
    <ModelMedium
      button={name}
      title={title}
      color='blueT'
      icon='fa-project-diagram gap'
      lock={!access}
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
                        value: x.key,
                        dfOn: x.defaultOn
                      } } );
    const ncComboSort = ncCombo.sort((n1, n2)=>
            n1.label < n2.label ? -1 : n1.label > n2.label ? 1 : 0 );
      
    ncOptionsSet(ncComboSort);
    
    const optn = preFill;
    if(!optn) {
      fillSet(false);
      const ncDefault = ncCombo.filter( x => x.dfOn === true );
      ncListSet(ncDefault);
    }else{
      if(optn.type === 'plus') {
        const ncDefault = ncCombo.filter( x => optn.ncLists.find( y => y === x.value ));
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

    const f = fill;
    const edit = f ? existFlows.find( x => x.flowKey === f ) : false;
    const editId = edit ? edit.flowKey : false;
    
    if(editId) {
      Meteor.call('setBasicPlusFlowHead', widgetId, editId, flowTitle, ncPlainList, 
      (error)=>{
        error && console.log(error);
        toast.success('Saved');
        selfclose();
      });
    }else{
      Meteor.call('pushBasicPlusFlow', widgetId, flowTitle, ncPlainList, 
      (error)=>{
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
    <div className='overscroll2x space'>
      <form
        id='flowSave'
        className='centre'
        onSubmit={(e)=>save(e)}
      >
      {warn ?
        <div className='centre'>
          <p><b>{eN}</b> is or has been used by a {Pref.xBatch}</p>
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
      
      <div className='centre vmarginquarter'>
        <label htmlFor='List Options' className='multiSelectContain flowForm'>
          <MultiSelect
            options={ncOptions}
            value={ncLists}
            onChange={ncListSet}
            labelledBy={"List Options"}
            className='multi-select'
            hasSelectAll={false}
            disableSearch={true}
        />{Pref.nonCon} List Options</label>
        <p><em>If none are chosen the Legacy List will be used</em></p>
      </div>
  
      <div className='space centre'>
        <button
          type='submit'
          id='go'
          form='flowSave'
          className='action nSolid'>SAVE</button>
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
  
  const access = Roles.userIsInRole(Meteor.userId(), 'edit');
  const title = access ? 'delete process flow if not in use' : Pref.norole;
    
  return(
    <span>
      <button
        title={title}
        className='transparent'
        onClick={()=>pull()}
        disabled={!access}>
        <label className='navIcon actionIconWrap'>
          <i className={'fas fa-minus-circle fa-lg fa-fw redT'}></i>
          <span className='actionIconText redT'>Delete</span>
        </label>
      </button>
    </span>
  );
};