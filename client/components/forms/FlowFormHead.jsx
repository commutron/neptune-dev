import React, { useState, useLayoutEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import { MatchButton } from '/client/layouts/Models/Popover';
import ModelNative from '/client/layouts/Models/ModelNative';

import { MultiSelect } from "react-multi-select-component";

const FlowFormHead = ({ id, preFillKey, existFlows, app, access, clearOnClose })=> {
  
  const [ warn, warnSet ] = useState(false);
  const [ base, baseSet ] = useState(false);
  
  const [ flowInput, flowInputSet ] = useState('');
  const [ ncOptions, ncOptionsSet ] = useState([]);
  const [ ncLists, ncListSet ] = useState([]);
  
  useLayoutEffect( ()=> {
    if(!access) { 
      null;
    }else{
      const fill = existFlows.find( f => f.flowKey === preFillKey ) || null;
      baseSet(fill);
      flowInputSet(fill?.title || '');
    
      const ncCombo = Array.from(app.nonConTypeLists, x => { 
                        return { 
                          label: x.listPrefix +". "+ x.listName, 
                          value: x.key,
                          dfOn: x.defaultOn
                        } } );
      const ncComboSort = ncCombo.sort((n1, n2)=>
              n1.label < n2.label ? -1 : n1.label > n2.label ? 1 : 0 );
      ncOptionsSet(ncComboSort);
      
      if(!fill) {
        const ncDefault = ncCombo.filter( x => x.dfOn === true );
        ncListSet(ncDefault);
        warnSet(false);
      }else{
        if(fill.type === 'plus') {
          const ncDefault = ncCombo.filter( x => fill.ncLists.find( y => y === x.value ));
          ncListSet(ncDefault);
        }
        Meteor.call('activeFlowCheck', fill.flowKey, (error, reply)=>{
          error && console.log(error);
          warnSet(reply);
        });
      }
    }
  }, [id, preFillKey, app]);
  
  function save() {
    this.goFloH.disabled = true;
    const widgetId = id;
    
    const flowTitle = flowInput.trim().toLowerCase();
    const ncPlainList = Array.from(ncLists, u => u.value);

    const editId = base ? base.flowKey : false;
    
    if(editId) {
      Meteor.call('setBasicPlusFlowHead', widgetId, editId, flowTitle, ncPlainList, 
      (error)=>{
        error && console.log(error);
        toast.success('Saved');
        this.goFloH.disabled = false;
      });
    }else{
      Meteor.call('pushBasicPlusFlow', widgetId, flowTitle, ncPlainList, 
      (error)=>{
        error && console.log(error);
        toast.success('Saved');
        this.goFloH.disabled = false;
      });
    }
  }

  return(
    <ModelNative
      dialogId={`${id}_flowhead_form`}
      title={preFillKey ? 'Edit Flow' : 'New Flow'}
      icon='fa-solid fa-project-diagram'
      colorT='blueT'
      closeFunc={()=>clearOnClose()}>
    
      <div className='overscroll2x space'>
        <form
          id='flowSave'
          className='centre'
          onSubmit={(e)=>save(e)}
        >
        
          <div className='centre'>
            <p>{warn ? <span><b>{flowInput}</b> is or has been used by a {Pref.xBatch}</span> : null}</p>
          </div>
        
          <em className='small'>duplicate {Pref.flow} names are ill advised but not blocked</em>
          <p>
            <input
              type='text'
              id='flwttl'
              value={flowInput}
              onChange={(e)=>flowInputSet(e.target.value)}
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
            formMethod='dialog'
            id='goFloH'
            form='flowSave'
            className='action nSolid'>SAVE</button>
          <br />
        </div>
      </div>
    </ModelNative>
  );
};

export default FlowFormHead;

export const FlowRemove = ({ id, fKey, access })=>	{
  
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

  const title = access ? 'delete process flow if not in use' : Pref.norole;
    
  return(
    <MatchButton 
      title={title}
      text='Delete Flow' 
      icon='fa-solid fa-minus-circle'
      doFunc={pull}
      lock={!access}
    />
  );
};