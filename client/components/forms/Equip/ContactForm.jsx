import React from 'react';
import Pref from '/client/global/pref.js';
import { toast } from 'react-toastify';

import ModelNative from '/client/layouts/Models/ModelNative';

const ContactForm = ({ ctctKey, equipData, clearOnClose })=> {
  
  const addNewContact = (e)=> {
    e.preventDefault();
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
    
    Meteor.call('addEqContact', eqid, prim, sorc, comp, dpmt, name, phon, emal, cost, nots,
    (error, reply)=>{
      error && console.log(error);
      if(reply) {
        this.eqcontactGo.disabled = false;
      }else{
        toast.error('Server Error');
        this.eqcontactGo.disabled = false;
      }
    });
    
  };
  
  const ct = !ctctKey ? null : equipData.contacts?.find( (c)=> c.key === ctctKey) || false;

  return(
    <ModelNative
      dialogId={'multi_eqip_contact_form'}
      title='New Contact'
      icon='fa-solid fa-address-book'
      colorT='blackT'
      closeFunc={clearOnClose}>
      
      <form className='space' onSubmit={(e)=>addNewContact(e)}>
        
        <p className='rowWrap gapsC'>
        <ContactInput 
          inid='newsource'
          label='Support Type'
          req={true}
        />
        <ContactInput 
          inid='newname'
          label='Contact Person'
        />
        </p>
        
        <p className='rowWrap gapsC'>
        <ContactInput 
          inid='newcomp'
          label='Company'
        />
        <ContactInput 
          inid='newdprt'
          label='Department'
        />
        </p>
        
        <p className='rowWrap gapsC'>
        <ContactInput 
          inid='newphone'
          label='Phone'
          type='tel'
        />
        <ContactInput 
          inid='newemail'
          label='Email'
          type='email'
        />
        </p>
        
        <p className='rowWrap gapsC'>
          <ContactInput 
            inid='newcost'
            label='Pricing'
          />
          <ContactInput 
            inid='newprime'
            type='checkbox' 
            cls='minlineRadio'
            label='Priority'
          />
        </p>
        <p className='centre'>
          <span>
            <label htmlFor='newnotes'>Notes<br />
            <textarea 
              id='newnotes' 
              className='max250'
              defaultValue=''
            ></textarea></label>
          </span>
        </p>
       
        <p className='centre'>
          <button
            id='eqcontactGo'
            type='submit' 
            className='action nSolid'
          >SAVE</button>
        </p>
        
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