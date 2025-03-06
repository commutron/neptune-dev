import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import CreateTag from '/client/components/tinyUi/CreateTag';
import TagsModule from '/client/components/bigUi/TagsModule';
import NotesModule from '/client/components/bigUi/NotesModule';

import Remove from '/client/components/forms/Remove';

import AssemblyList from './AssemblyList';

import { MatchButton } from '/client/layouts/Models/Popover';

import { cleanURL } from '/client/utility/Convert';

const VariantCards = ({ 
  variantData, widgetData, 
  batchRelated, 
  app, canEdt, canRun, canRmv
})=> {
  
  const [ selectedVar, selectedVarSet ] = useState(false);
  
  const openVarActions = (dialogId, ventry)=> {
    selectedVarSet(ventry);
    document.getElementById(dialogId)?.showModal();
  };
  
  function handleVive(vId, vKey, vState) {
    Meteor.call('changeVive', vId, vKey, vState, (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.warning(`Not changed. Live ${Pref.xBatchs} found`,
        { autoClose: false });
      }
    });
  }
  
  function toggleRad(vKey, rad) {
    if(rad) {
      Meteor.call('setVRad', vKey, rad, (err)=>{
        err && console.log(err);
      });
    }else{
      Meteor.call('cutVRad', vKey, (err)=>{
        err && console.log(err);
      });
    }
  }
  
  const varS = variantData.sort((v1, v2)=> v1.createdAt > v2.createdAt ? -1 : v1.createdAt < v2.createdAt ? 1 : 0 );
  
  return(
    <div className='rowWrap cardify'>
      {canRmv ?
        <Remove
          action='variant'
          title={selectedVar?.variant}
          check={selectedVar?.createdAt?.toISOString()}
          entry={selectedVar}
          access={canRmv} 
          clearOnClose={()=>selectedVarSet(false)}
        />
      : null}
      
      {varS.map( (ventry, index)=> {
        return(  
          <VentryCard
            key={ventry._id+index}
            ventry={ventry}
            widgetData={widgetData} 
            batchRelated={batchRelated}
            app={app}
            openVarActions={openVarActions}
            canEdt={canEdt}
            canRun={canRun}
            canRmv={canRmv}
            handleVive={handleVive}
            toggleRad={toggleRad}
          />
      )})}
    </div>
  );
};
      
export default VariantCards;  
        
const VentryCard = ({ 
  ventry, widgetData, batchRelated,
  app, openVarActions, canEdt, canRun, canRmv,
  handleVive, toggleRad
})=> {
  
  const [ editState, editSet ] = useState(false);
  
  const v = ventry;
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});

  const doRad = v.radioactive && canRun;  
  const doCmp = app.partsGlobal && ventry.live && canEdt;
  const vbatchRel = batchRelated.filter(b=> b.versionKey === v.versionKey);
  const doRmv = vbatchRel.length === 0 && v.live === false && canRmv;
  
  return(
    <div className='startSelf space' style={{width: 'clamp(250px, 25vw, 350px)'}}>
      <div className='split gapsC'>
        <h2 className='cap wordBr'><strong>{v.variant}</strong></h2>
        
        <div className='centreText rowWrapR gapsC'>
          {v.radioactive ? 
            <n-faX><i className='fa-solid fa-burst fa-fw darkOrangeT'></i>{Pref.radio.toUpperCase()}: {v.radioactive}</n-faX>
            : null
          }
        
          {v.live ? 
            <n-fa0><i className='fas fa-folder-open blueT fa-fw'></i>Open</n-fa0>
            :
            <n-fa1><i className='fas fa-folder grayT fa-fw'></i>Closed</n-fa1>
          }
        </div>
      </div>
          
      <div className='floattaskbar shallow light'>
        <MatchButton 
          text='Edit'
          icon='fa-solid fa-cube fa-rotate-90'
          doFunc={()=>editSet(!editState)}
          lock={!ventry.live || !canEdt}
        />
        {doRad &&
          <MatchButton 
            text={`Remove ${Pref.radio.toUpperCase()}`}
            icon='fa-solid fa-burst'
            doFunc={()=>toggleRad(v.versionKey)}
            lock={!doRad}
          />
        }
        {canEdt &&
          <MatchButton 
            text={v.live ? 'Archive' : 'Re-activate'}
            icon='fa-solid fa-folder'
            doFunc={()=>handleVive(v._id, v.versionKey, v.live)}
            lock={!canEdt}
          />
        }
        {doRmv &&
          <MatchButton 
            text='Delete'
            icon='fa-solid fa-minus-circle'
            doFunc={()=>openVarActions('variant_multi_delete_form', v)}
            lock={!doRmv}
          />
        }
      </div>
      
      <div className='vmarginhalf'>
        
        <span className='min200'>   
          
          <TagsModule
            key={v.id+v.versionKey}
            action='variant'
            id={v._id}
            tags={v.tags}
            vKey={v.versionKey}
            tagOps={app.tagOption}
            rad={v.radioactive}
            canRun={canRun}
          />
          
          <InlineForm
            widgetData={widgetData}
            variantData={ventry}
            rootURL={app.instruct}
            editState={editState}
            editSet={editSet}
          />
        
          <NotesModule
            sourceId={v._id}
            noteObj={v.notes}
            editMethod='setVariantNote'
            cal={calFunc}
            lines={10}
          />
          
          {app.partsGlobal && 
            <AssemblyList 
              variantData={ventry}
              doCmp={doCmp}
              canRmv={canRmv}
            /> 
          }
        
          <CreateTag
            when={v.createdAt}
            who={v.createdWho}
            whenNew={v.updatedAt}
            whoNew={v.updatedWho}
            dbKey={v.versionKey} />
        </span>
      </div>
    </div>
  );
};

/*
<span>
  <MenuItem divider />
  <MenuItem onClick={null} disabled={true} className='noFade'>
    <input 
      type='text' 
      id={vKey+'addnewrad'}
      maxLength='24'
      className='wide black whiteT' 
      onChange={(e)=>newRadSet(this[vKey+'addnewrad'].value)} />
  </MenuItem>
  <MenuItem onClick={()=>addRadFlag(newRad)} disabled={!newRad} className='cap'>
    <n-faX>
      <i className='fa-solid fa-burst fa-fw fa-lg gapR darkOrangeT'></i>
    </n-faX>Add {Pref.radio.toUpperCase()}
  </MenuItem>
</span>
*/

const InlineForm = ({ widgetData, variantData, rootURL, editState, editSet })=> {
  
  function handleFunc(e) {
    e.preventDefault();
    
    const wId = widgetData._id;
    const vId = variantData._id;
    
    const variant = this.rev.value.trim();
    
    const url = this.wikdress.value.trim();
    const wiki = cleanURL(url, rootURL);
    
    const unit = this.unit.value.trim();
    
    Meteor.call('editVariant', wId, vId, variant, wiki, unit, (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
      }else{
        toast.error('Server Error');
      }
    });
    editSet(false);
  }
  
  const shrtI = variantData.instruct && !variantData.instruct.includes('http');
  
  if(!editState) {
    return(
      <div className='readlines'>
        <p className='numFont'>default units: {variantData.runUnits}</p>
        <p className='max750 wordBr'>
          {shrtI ? rootURL : null}
          <a 
            className='clean wordBr' 
            href={shrtI ? rootURL + variantData.instruct : variantData.instruct} 
            target='_blank'
          >{variantData.instruct}</a>
        </p>
      </div>
    );
  }
  
  return(
    <form 
      id='varInfoForm'
      className='interForm'
      onSubmit={(e)=>handleFunc(e)}
    >
      <p className='cap'>{Pref.variant}
        <input
          type='text'
          id='rev'
          className='interInput'
          defaultValue={variantData.variant}
          placeholder='1a'
          pattern='[A-Za-z0-9 \._\-]*'
          required />
      </p>       
          
      <p className='cap'>{Pref.unit} Quantity
        <input
          type='number'
          id='unit'
          className='interInput'
          pattern='[0-999]*'
          maxLength='3'
          minLength='1'
          max='100'
          min='1'
          defaultValue={variantData.runUnits}
          placeholder='1-100'
          inputMode='numeric'
          required />
      </p>
  
      <p>Work Instructions
        <textarea
          type='text'
          id='wikdress'
          className='interInput'
          defaultValue={variantData.instruct}
          placeholder='Full Address'></textarea>
      </p>
          
      <span className='rightRow'>
        <button
          title='cancel'
          type='button'
          className='miniAction gap'
          onClick={()=>editSet(false)}
        ><i className='far fa-edit'></i> cancel</button>
      
        <button
          title='save'
          type='submit'
          className='miniAction gap greenLineHover'
        ><i className='fas fa-check'></i> save</button>
      </span>
    </form>
  );
};