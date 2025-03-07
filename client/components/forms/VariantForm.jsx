import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';
import { MultiSelect } from "react-multi-select-component";

const VariantForm = ({ widgetData, users, app })=> {
  
  const [ eList, eListSet ] = useState( [] );
  const [ emailState, emailSet ] = useState( [] );
  const [ instState, instSet ] = useState(false);
  const [ docState, docSet ] = useState(false);
  
  useEffect( ()=>{
    const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') && 
                                        !Roles.userIsInRole(x._id, 'readOnly') );
    
    const listUsers = Array.from(liveUsers, x => { return { label: x.username, value: x._id } } );
    eListSet(listUsers);
  }, []);
  
  useEffect( ()=> {
    if(instState) { 
      const root = app.instruct || '';
      const http = instState.slice(0,4) === 'http' ? instState + ".json" : 
                   instState.slice(0,1) === '/' ? root + instState + ".json" :
                   root + '/' + instState + ".json";
      if(http) {
        try {
          fetch(http, {})
          .catch( ()=> {
            docSet(false);
          })
          .then( (response)=> {
            if(response?.ok) { return response.json(); }
          })
          .then( (articles)=> {
            if(articles) { docSet(articles) }
          });
        } catch(e) {
          null;
        }
      }
    }else{
      docSet(false);
    }
  }, [instState]);
  
  function save() {
    this.gonewvar.disabled = true;
    
    const wId = widgetData._id;
    const gId = widgetData.groupId;
    
    const variant = this.revNew.value.trim();
    
    const url = this.wikdressNew.value.trim();
    const http = url.slice(0,4) === 'http' ? url : 
                 url.slice(0,1) === '/' ? url :
                 '/' + url;
    const wiki = http.slice(-1) === '/' ? http.slice(0,-1) : http;
    
    const unit = this.unitNew.value.trim();
    
    const emailUsers = app.emailGlobal ? Array.from(emailState, u => u.value) : [];
    
    Meteor.call('addNewVariant', wId, gId, variant, wiki, unit, emailUsers,
    (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
        this.revNew.value = '';
        this.wikdressNew.value = '';
        this.unitNew.value = '';
        this.gonewvar.disabled = false;
      }else{
        toast.error('Server Error');
        this.gonewvar.disabled = false;
      }
    });
  }

  return(
    <ModelNative
      dialogId={widgetData._id+'_newvar_form'}
      title={`new ${Pref.variant}`}
      icon='fa-solid fa-cube fa-rotate-90'
      colorT='blueT'>
      
    <div className='split overscroll'>

      <div className='half space'>
        <h2 className='up'>{widgetData.widget}</h2>
        <h3>{widgetData.describe}</h3>
        
        <form onSubmit={(e)=>save(e)}>
          <p className='rowWrap gapsC'>
            <label htmlFor='rev'>
              <input
                type='text'
                id='revNew'
                placeholder='1a'
                pattern='[A-Za-z0-9 \._\-]*'
                className='miniIn18'
                required 
              /><br />{Pref.variant}
            </label>
          
            <label htmlFor='unit'>
              <input
                type='number'
                id='unitNew'
                pattern='[0000-9999]*'
                maxLength='4'
                minLength='1'
                max={Pref.unitLimit}
                min='1'
                placeholder={`1-${Pref.unitLimit}`}
                inputMode='numeric'
                className='miniIn12'
                required 
              /><br />{Pref.unit} Quantity
            </label>
          </p>
          
          <p>
            <input
              type='text'
              id='wikdressNew'
              onChange={(e)=>instSet(e.target.value)}
              placeholder='Full Address'
              className='wide' />
            <label htmlFor='wikdress'>Work Instructions</label>
          </p>
          
          {app.emailGlobal &&
            <span>
              <div className='vmargin'>
                <label htmlFor='userNotify' className='emailForm'>
                  <MultiSelect
                    id='userNotify'
                    options={eList}
                    value={emailState}
                    onChange={(e)=>emailSet(e)}
                    labelledBy='Select people to email'
                    className='multi-select'
                    hasSelectAll={false}
                    disableSearch={false}
                />Notify People by Email</label>
              </div>
              
              <p className='small grayT nospace'
                >If a person does not have a email address set, they will be sent an internal Neptune message.
              </p>
            </span>
          }
          
          <p>
            <button
              type='submit'
              formMethod="dialog"
              className='action nSolid'
              id='gonewvar'
              disabled={false}
            >SAVE</button>
          </p>
        </form>
      </div>

      <div className='half spacehalf min300 max300'>
        {docState &&
          <div>
            <p>Dcoument Found:</p>
            <dl>
              <dt>{docState.title}</dt>
              {docState.modules.map( (m, ix)=>(<dd key={ix}>{m.module}</dd>) )}
            </dl>
          </div>
        }
      </div>
      
    </div>
    </ModelNative>
  );
};

export default VariantForm;