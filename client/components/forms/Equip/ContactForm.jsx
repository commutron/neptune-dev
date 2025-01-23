import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const ContactForm = ({ ctctKey, equipData, clearOnClose })=> {
  
  const ct = !ctctKey ? null : equipData.contacts?.find( (c)=> c.key === ctctKey) || false;
  const df_prime = ct?.prime || '';
  const df_source = ct?.source || '';
  const df_compy = ct?.company || '';
  const df_dpmt =  ct?.department || '';
  const df_name = ct?.name || '';
    
  const df_phone = ct?.phone || '';
  const df_email = ct?.email || '';
  const df_cost = ct?.cost || '';
  const df_notes = ct?.notes || '';

  const handleContact = (e)=> {
    // e.preventDefault();
    this.eqcontactGo.disabled = true;
    
    const eqid = equipData._id;
    
    const prim = e.target.newprime.checked;
    const sorc = e.target.newsource.value;
    const comp = e.target.newcomp.value;
    const dpmt = e.target.newdprt.value;
    const name = e.target.newname.value;
    
    const phon = e.target.newphone.value;
    const emal = e.target.newemail.value;
    const cost = e.target.newcost.value;
    const nots = e.target.newnotes.value;
    
    Meteor.call("setEqContact", eqid, ctctKey, prim, sorc, comp, dpmt, name, phon, emal, cost, nots,
    (error, reply)=>{
      error && console.log(error);
      if(reply) {
        this.eqcontactGo.disabled = false;
        
        e.target.newprime.checked= df_prime;
        e.target.newsource.value= df_source;
        e.target.newcomp.value = df_compy;
        e.target.newdprt.value= df_dpmt;
        e.target.newname.value = df_name;
        e.target.newphone.value = df_phone;
        e.target.newemail.value = df_email;
        e.target.newcost.value = df_cost;
        e.target.newnotes.value = df_notes;
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
          req={true}
        />
        <ContactInput 
          inid='newname'
          label='Contact Person'
          dfval={df_name}
        />
        </p>
        
        <p className='rowWrap gapsC'>
        <ContactInput 
          inid='newcomp'
          label='Company'
          dfval={df_compy}
        />
        <ContactInput 
          inid='newdprt'
          label='Department'
          dfval={df_dpmt}
        />
        </p>
        
        <p className='rowWrap gapsC'>
        <ContactInput 
          inid='newphone'
          label='Phone'
          type='tel'
          dfval={df_phone}
        />
        <ContactInput 
          inid='newemail'
          label='Email'
          type='email'
          dfval={df_email}
        />
        </p>
        
        <p className='rowWrap gapsC'>
          <ContactInput 
            inid='newcost'
            label='Pricing'
            dfval={df_cost}
          />
          <ContactInput 
            inid='newprime'
            type='checkbox' 
            cls='minlineRadio'
            label='Priority'
            dfval={df_prime}
          />
        </p>
        <p className='centre'>
          <span>
            <label htmlFor='newnotes'>Notes<br />
            <textarea 
              id='newnotes' 
              className='max250'
              defaultValue={df_notes}
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

const ContactInput = ({ inid, type, cls, label, dfval, req })=> (
  <span>
    <label htmlFor={inid}>{label}<br />
    <input 
      id={inid} 
      className={cls || 'miniIn24'}
      type={type || 'text'}
      defaultValue={dfval || ''}
      defaultChecked={type === 'checkbox' ? dfval : null}
      required={req || false}
    /></label>
  </span>
);

// const phoneinput = ()=> (
//   <label>Phone
//     <span className='flexRow'>
//     <input id='intCode' />
//     <input id='areaCode' />
//     <input id='locCode' />
//     </span>
//   </label>
  
// );