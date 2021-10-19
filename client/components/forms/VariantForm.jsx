import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelLarge from '../smallUi/ModelLarge';
import MultiSelect from "react-multi-select-component";

const VariantModel = ({ widgetData, users, app, rootWI, lockOut })=> {
  
  let name = `new ${Pref.variant}`;
  const access = Roles.userIsInRole(Meteor.userId(), ['create', 'edit']);
  const aT = !access ? Pref.norole : '';
  const lT = lockOut ? `${Pref.group} is hibernated` : '';
  const title = access && !lockOut ? name : `${aT}\n${lT}`;
  
  return(
    <ModelLarge
      button={name}
      title={title}
      color='blueT'
      icon='fa-cube fa-rotate-90'
      lock={!access || lockOut}
    >
      <VariantForm
        widgetData={widgetData}
        users={users}
        app={app}
        rootWI={rootWI}
      />
    </ModelLarge>
  );
};
  
export default VariantModel;

const VariantForm = ({ widgetData, users, app, rootWI, selfclose })=> {
  
  const [ eList, eListSet ] = useState( [] );
  const [ emailState, emailSet ] = useState( [] );
  
  useEffect( ()=>{
    const liveUsers = users.filter( x => Roles.userIsInRole(x._id, 'active') && 
                                        !Roles.userIsInRole(x._id, 'readOnly') );
    
    const listUsers = Array.from(liveUsers, x => { return { label: x.username, value: x._id } } );
    eListSet(listUsers);
  }, []);
  
  function save(e) {
    e.preventDefault();
    this.gonewvar.disabled = true;
    
    const wId = widgetData._id;
    const gId = widgetData.groupId;
    
    const variant = this.rev.value.trim();
    const wiki = this.wikdress.value.trim();
    const unit = this.unit.value.trim();
    
    const emailUsers = app.emailGlobal ? Array.from(emailState, u => u.value) : [];
    
    Meteor.call('addNewVariant', wId, gId, variant, wiki, unit, emailUsers,
    (error, reply)=>{
      error && console.log(error);
      if(reply) {
        toast.success('Saved');
        selfclose();
      }else{
        toast.error('Server Error');
        this.go.disabled = false;
      }
    });
  }
  

  return(
    <div className='split overscroll'>

      <div className='half space'>
        <h2 className='up'>{widgetData.widget}</h2>
        <h3>{widgetData.describe}</h3>
        
        <form onSubmit={(e)=>save(e)}>
          <p className='rowWrap gapsC'>
            <label htmlFor='rev'>
              <input
                type='text'
                id='rev'
                placeholder='1a'
                pattern='[A-Za-z0-9 \._-]*'
                className='miniIn18'
                required 
              /><br />{Pref.variant}
            </label>
          
            <label htmlFor='unit'>
              <input
                type='number'
                id='unit'
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
              type='url'
              id='wikdress'
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
              className='action clearBlue'
              id='gonewvar'
              disabled={false}
            >SAVE</button>
          </p>
        </form>
      </div>

      <div className='half'>
        <iframe
          id='instructMini'
          src={app.instruct}
          height='600'
          width='100%' />
      </div>
      
    </div>
  );
};