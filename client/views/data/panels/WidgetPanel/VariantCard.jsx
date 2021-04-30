import React, { useState } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import CreateTag from '/client/components/tinyUi/CreateTag';
import TagsModule from '/client/components/bigUi/TagsModule';
import NotesModule from '/client/components/bigUi/NotesModule';

import VariantLive from '/client/components/forms/VariantLive';
import Remove from '/client/components/forms/Remove';

import AssemblyList from './AssemblyList';

const VariantCard = ({ 
  variantData, widgetData, 
  groupData, batchRelated, 
  app, user
})=> {
  
  const v = variantData;
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});

  return(
    <div className='min300 max300'>
      <div className='comfort'>
        
        <div className='wordBr vmarginhalf middle'>
          <span className='gap'>
            <VariantLive
              vId={v._id}
              vKey={v.versionKey}
              vState={v.live}
              noText={false}
              primeTopRight={false} />
          </span>
          <span className='big gap'>{v.variant}</span>
        </div>
      
        <div className='centreRow vmarginhalf'>
          {batchRelated.length === 0 ?
            <Remove
              action='variant'
              title={variantData.variant}
              check={variantData.createdAt.toISOString()}
              entry={variantData}
              lockOut={variantData.live === true} 
            />
          : null}
            
        </div>
          
      </div>
      
      <div className='vmarginhalf'>
        
        <span className='min200'>   
          
          <TagsModule
            action='variant'
            id={v._id}
            tags={v.tags}
            vKey={v.versionKey}
            tagOps={app.tagOption} />
          
          <InlineForm
            widgetData={widgetData}
            variantData={variantData} />
        
          <NotesModule
            sourceId={v._id}
            noteObj={v.notes}
            editMethod='setVariantNote'
            cal={calFunc} />
            
          <AssemblyList
            variantData={variantData}
            widgetData={widgetData}
            groupData={groupData} />
        
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

export default VariantCard;

const InlineForm = ({ widgetData, variantData })=> {
  
  const [ editState, editSet ] = useState(false);
  
  function handleFunc(e) {
    e.preventDefault();
    
    const wId = widgetData._id;
    const vId = variantData._id;
    
    const variant = this.rev.value.trim();
    const wiki = this.wikdress.value.trim();
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
  
  const editAuth = Roles.userIsInRole(Meteor.userId(), 'edit');
  
  
  if(!editState) {
    return(
      <div className='readlines'>
        <p className='numFont'>default units: {variantData.runUnits}</p>
          
        <p className='max250' >
          <a 
            className='clean wordBr' 
            href={variantData.instruct} 
            target='_blank'
          >{variantData.instruct}</a>
        </p>
    
        <span className='rightRow'>
          <button
            className='miniAction gap'
            onClick={()=>editSet(!editState)}
            disabled={!variantData.live || !editAuth}
          ><i className='fas fa-edit'></i> edit</button>
        </span>
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
          pattern='[A-Za-z0-9 \._-]*'
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
          type='url'
          id='wikdress'
          className='interInput'
          defaultValue={variantData.instruct}
          placeholder='Full Address' />
      </p>
          
      <span className='rightRow'>
        <button
          type='button'
          className='miniAction gap'
          onClick={()=>editSet(false)}
        ><i className='far fa-edit'></i> cancel</button>
      
        <button
          type='submit'
          className='miniAction gap greenLineHover'
        ><i className='fas fa-check'></i> save</button>
      </span>
    </form>
  );
};

/*
  totalI(mData) {
    let items = Array.from(mData.batchInfo, x => x.items);
    let quantities = Array.from(mData.batchInfoX, x => x.quantity);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    let totalX = quantities.length > 0 ? quantities.reduce((x,y)=>x+y) : 0;
    return total + totalX;
  }
  */
  
  /*
  avgNC(mData) {
    let items = Array.from(mData.batchInfo, x => x.items);
    let quantities = Array.from(mData.batchInfoX, x => x.quantity);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    let totalX = quantities.length > 0 ? quantities.reduce((x,y)=>x+y) : 0;
    
    let ncs = Array.from(mData.batchInfo, x => x.nonCons);
    let ncsX = Array.from(mData.batchInfoX, x => x.nonCons);
    
    let allNCs = ncs.length > 0 ? ncs.reduce((x,y)=>x+y) : 0;
    let allNCsX = ncsX.length > 0 ? ncsX.reduce((x,y)=>x+y) : 0;
    
    let perI = (allNCs / ( total > 0 ? total : 1));
    let perIX = (allNCsX / ( totalX > 0 ? totalX : 1) );
    const perItem = ( perI + perIX ).toFixed(1);
    
    let perW = (allNCs / (ncs.length > 0 ? ncs.length : 1) );
    let perWX = (allNCsX / (ncsX.length > 0 ? ncsX.length : 1) );
    const perWOrder = ( perW + perWX ).toFixed(1);
    
    return { perItem, perWOrder };
  }
  */