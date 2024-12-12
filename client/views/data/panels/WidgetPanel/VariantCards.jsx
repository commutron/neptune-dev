import React, { useState, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import TabsVert from '/client/components/smallUi/Tabs/TabsVert';
import CreateTag from '/client/components/tinyUi/CreateTag';
import TagsModule from '/client/components/bigUi/TagsModule';
import NotesModule from '/client/components/bigUi/NotesModule';

import Remove from '/client/components/forms/Remove';

import AssemblyList from './AssemblyList';

import { PopoverButton, PopoverMenu, PopoverAction, MatchButton } from '/client/layouts/Models/Popover';

import { cleanURL } from '/client/utility/Convert';

const VariantCards = ({ 
  variantData, widgetData, 
  groupData, batchRelated, 
  app, user, canEdt, canRun, canRmv, modelFunc
})=> {
  
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
  const varNames = varS.map((v)=>v.variant);

  return(
    <TabsVert tabs={varNames} extraClass='popSm'>
      {varS.map( (ventry, index)=> {
        return(  
          <VentryCard
            key={ventry._id+index}
            ventry={ventry}
            widgetData={widgetData} 
            groupData={groupData}
            batchRelated={batchRelated.filter(b=> b.versionKey === ventry.versionKey)} 
            app={app}
            user={user}
            modelFunc={modelFunc}
            canEdt={canEdt}
            canRun={canRun}
            canRmv={canRmv}
            handleVive={handleVive}
            toggleRad={toggleRad}
          />
      )})}
    </TabsVert>
  );
};
      
export default VariantCards;  
        
const VentryCard = ({ 
  ventry, widgetData, 
  groupData, batchRelated, 
  app, user, modelFunc, canEdt, canRun, canRmv,
  handleVive, toggleRad
})=> {
  
  const [ editState, editSet ] = useState(false);
  
  const v = ventry;
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});

  const doRad = v.radioactive && canRun;  
  const doRmv = batchRelated.length === 0 && ventry.live === false && canRmv;
  
  return(
    <div className='min300 space'>
      {doRmv ?
        <Remove
          action='variant'
          title={ventry.variant}
          check={ventry.createdAt.toISOString()}
          entry={ventry}
          access={!ventry.live && canRmv} 
        />
      : null}
          
      <div className='floattaskbar shallow light'>
        <MatchButton 
          text="Edit"
          icon='fa-solid fa-file-pen'
          doFunc={()=>editSet(!editState)}
          lock={!ventry.live || !canEdt}
        />
        <PopoverButton 
          targetid='actionspop'
          attach='actions'
          text='Actions'
          icon='fa-solid fa-star gapR'
        />
        <PopoverMenu targetid='actionspop' attach='actions'>
          <PopoverAction 
            doFunc={()=>handleVive(v._id, v.versionKey, v.live)}
            text={v.live ? `Archive ${Pref.variant}` : `Re-activate ${Pref.variant}`}
            icon='fa-solid fa-folder'
            lock={!canEdt}
          />
          <PopoverAction 
            doFunc={()=>toggleRad(v.versionKey)}
            text={`Remove ${Pref.radio.toUpperCase()}`}
            icon='fa-solid fa-burst'
            lock={!doRad}
          />
          <PopoverAction 
            doFunc={()=>modelFunc('variant_multi_delete_form')}
            text='Delete'
            icon='fa-solid fa-minus-circle'
            lock={!doRmv}
          />
        </PopoverMenu>

        <span className='flexSpace' />
        
        <span>
          {v.radioactive ? 
            <n-faX><i className='fa-solid fa-burst fa-fw darkOrangeT'></i>{Pref.radio.toUpperCase()}: {v.radioactive}</n-faX>
            : null
          }
        </span>
        
        <span>
          {v.live ? 
            <n-fa0><i className='fas fa-folder-open blueT fa-fw'></i>Open</n-fa0>
            :
            <n-fa1><i className='fas fa-folder grayT fa-fw'></i>Closed</n-fa1>
          }
        </span>
        
        <span className='cap wordBr'>{Pref.variant}: <strong>{v.variant}</strong></span>
        
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
              widgetData={widgetData}
              groupData={groupData}
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
        <input
          type='text'
          id='wikdress'
          className='interInput dbbleWide'
          defaultValue={variantData.instruct}
          placeholder='Full Address' />
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