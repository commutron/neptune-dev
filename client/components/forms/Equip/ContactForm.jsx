import React, { useState, useLayoutEffect } from 'react';
// import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const ContactForm = ({ ctctKey, equipData, clearOnClose })=> {
  
  const [ working, workSet ] = useState(false);
  const [ df_prime, set_prime ] = useState(false);
  const [ df_source, set_source ] = useState('');
  const [ df_compy, set_compy ] = useState('');
  const [ df_dpmt, set_dpmt ] = useState('');
  const [ df_name, set_name ] = useState('');
  const [ df_phone, set_phone] = useState('');
  const [ df_email, set_email  ] = useState('');
  const [ df_cost, set_cost ] = useState('');
  const [ df_notes, set_notes ] = useState('');
  
  useLayoutEffect( ()=> {
    const ct = !ctctKey ? null : equipData.contacts?.find( (c)=> c.key === ctctKey) || false;
    set_prime(ct?.prime || false);
    set_source(ct?.source || '');
    set_compy(ct?.company || '');
    set_dpmt(ct?.department || '');
    set_name(ct?.name || '');
    set_phone(ct?.phone || '');
    set_email(ct?.email || '');
    set_cost(ct?.cost || '');
    set_notes(ct?.notes || '');
  }, [ctctKey, working]);
  
  const handleContact = ()=> {
    workSet(true);
    this.eqcontactGo.disabled = true;
    
    const eqid = equipData._id;
    
    const prim = df_prime === true || df_prime === 'true' ? true : false;
    
    Meteor.call("setEqContact", 
      eqid, ctctKey, prim, 
      df_source, df_compy, df_dpmt, df_name, df_phone, df_email, df_cost, df_notes,
    (error, reply)=>{
      error && console.log(error);
      if(reply) {
        this.eqcontactGo.disabled = false;
        workSet(false);
      }else{
        toast.error('Server Error');
        this.eqcontactGo.disabled = false;
      }
    });
  };
  
  const removeAction = ()=> {
    Meteor.call("cutEqContact", equipData._id, ctctKey,
    (error, reply)=>{
      error && console.log(error);
      if(reply) {
        clearOnClose();
      }else{
        toast.error('Server Error');
        this.eqcontactGo.disabled = false;
      }   
    });
  };
  
  return(
    <ModelNative
      id={ctctKey || 'new_eq_contact'}
      dialogId={'multi_eqip_contact_form'}
      title={`${ctctKey ? 'Edit' : 'New'} Contact`}
      icon='fa-solid fa-address-book'
      colorT='blackT'
      closeFunc={clearOnClose}>
      
      <form className='space' onSubmit={(e)=>handleContact(e)}>
        
        <p className='rowWrap gapsC'>
          <ContactInput 
            inid='newsource'
            label='Support Type'
            dfval={df_source}
            setval={set_source}
            req={true}
          />
          <ContactInput 
            inid='newname'
            label='Contact Person'
            dfval={df_name}
            setval={set_name}
          />
        </p>
        
        <p className='rowWrap gapsC'>
          <ContactInput 
            inid='newcomp'
            label='Company'
            dfval={df_compy}
            setval={set_compy}
          />
          <ContactInput 
            inid='newdprt'
            label='Department'
            dfval={df_dpmt}
            setval={set_dpmt}
          />
        </p>
        
        <p className='rowWrap gapsC'>
        <ContactInput 
          inid='newphone'
          label='Phone'
          type='tel'
          dfval={df_phone}
          setval={set_phone}
        />
        <ContactInput 
          inid='newemail'
          label='Email'
          type='email'
          dfval={df_email}
          setval={set_email}
        />
        </p>
        
        <p className='rowWrap gapsC'>
          <ContactInput 
            inid='newcost'
            label='Pricing'
            dfval={df_cost}
            setval={set_cost}
          />
          <ContactInput 
            inid='newprime'
            type='checkbox' 
            cls='minlineRadio'
            label='Priority'
            dfval={df_prime}
            setval={set_prime}
          />
        </p>
        <p className='centre'>
          <span>
            <label htmlFor='newnotes'>Notes<br />
            <textarea 
              id='newnotes' 
              className='max250'
              value={df_notes}
              onChange={(e=>set_notes(e.target.value))}
            ></textarea></label>
          </span>
        </p>
       
        <p className='centreRow'>
          <button
            id='eqcontactGo'
            type='submit'
            formMethod="dialog"
            className='action nSolid'
          >SAVE</button>
        </p>
        
        {ctctKey ?
          <p className='centreRow dropCeiling topLine'>
            <button
              onClick={()=>removeAction()}
              type='button'
              formMethod="dialog"
              className='action redSolid'
            >REMOVE Contact</button>
          </p>
        : null}
        
      </form>
    </ModelNative>
  );
};

export default ContactForm;

const ContactInput = ({ inid, type, cls, label, dfval, setval, req })=> (
  <span>
    <label htmlFor={inid}>{label}<br />
    <input 
      id={inid} 
      className={cls || 'miniIn24'}
      type={type || 'text'}
      value={dfval || ''}
      onChange={type === 'checkbox' ? e=>setval(e.target.checked) : e=>setval(e.target.value)}
      checked={type === 'checkbox' ? dfval : null}
      required={req || false}
    /></label>
  </span>
);