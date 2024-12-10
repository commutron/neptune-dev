import React, { useState, Fragment } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import CreateTag from '/client/components/tinyUi/CreateTag';
import TagsModule, { RadFlag } from '/client/components/bigUi/TagsModule';
import NotesModule from '/client/components/bigUi/NotesModule';

import VariantLive from '/client/components/forms/VariantLive';
import Remove from '/client/components/forms/Remove';

import AssemblyList from './AssemblyList';

import { OpenModelNative } from '/client/layouts/Models/ModelNative';
import { cleanURL } from '/client/utility/Convert';

const VariantCard = ({ 
  variantData, widgetData, 
  groupData, batchRelated, 
  app, user, canRun, canRmv
})=> {
  
  const v = variantData;
  
  const calString = "ddd, MMM D /YY, h:mm A";
  const calFunc = (d)=> moment(d).calendar(null, {sameElse: calString});
  
  return(
    <div className='min300 max400'>
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
        
          {v.radioactive ?
            <RadFlag
              vKey={v.versionKey}
              rad={v.radioactive}
              canRun={canRun}
            />
          : null}
          
          {batchRelated.length === 0 && variantData.live === false ?
            <Fragment>
              <Remove
                action='variant'
                title={variantData.variant}
                check={variantData.createdAt.toISOString()}
                entry={variantData}
                access={!variantData.live && canRmv} 
              />
              <OpenModelNative  
                dialogId={'variant_multi_delete_form'}
                title='Delete'
                icon='fa-solid fa-minus-circle'
                colorT='blackT'
                colorB='redSolid'
                lock={!canRmv}
              />
            </Fragment>
          : null}
         
        </div>
          
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
            variantData={variantData}
            rootURL={app.instruct}
          />
        
          <NotesModule
            sourceId={v._id}
            noteObj={v.notes}
            editMethod='setVariantNote'
            cal={calFunc}
            pocket={true} 
            lines={15}
          />
          
          {app.partsGlobal &&
            <AssemblyList
              variantData={variantData}
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

export default VariantCard;

const InlineForm = ({ widgetData, variantData, rootURL })=> {
  
  const [ editState, editSet ] = useState(false);
  
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
  
  const editAuth = Roles.userIsInRole(Meteor.userId(), 'edit');
  const shrtI = variantData.instruct && !variantData.instruct.includes('http');
  
  if(!editState) {
    return(
      <div className='readlines'>
        <p className='numFont'>default units: {variantData.runUnits}</p>
          
        <p className='max250 wordBr'>
          {shrtI ? rootURL : null}
          <a 
            className='clean wordBr' 
            href={shrtI ? rootURL + variantData.instruct : variantData.instruct} 
            target='_blank'
          >{variantData.instruct}</a>
        </p>
        
        <span className='rightRow'>
          <button
            title={!editAuth ? Pref.norole : !variantData.live ? 'not open' : ''}
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
          className='interInput'
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