import React, { useState } from 'react';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import ContactForm from '/client/components/forms/Equip/ContactForm';
import ActionFunc from '/client/components/tinyUi/ActionFunc';

const Nameplate = ({ equipData, users, isDebug, isEqSup })=> {
  
  const [ ctctKey, ctctKeySet ] = useState(false);
  
  const openAction = (cID)=> {
    ctctKeySet(cID);
    document.getElementById('multi_eqip_contact_form')?.showModal();
  };
  
  const eq = equipData;

  return(
    <div className='w100'>
      <ContactForm 
        ctctKey={ctctKey} 
        equipData={equipData}
        clearOnClose={()=>ctctKeySet(false)} 
      />
      
      <ActionFunc
        doFunc={()=>openAction(false)}
        title='Add Contact'
        icon='fa-solid fa-address-book'
        color='blackT'
        lockOut={!isEqSup}
      />
      
      <dl className='max300'>
        <DataLine l='Model' n={eq.model} />
        <DataLine l='Manufacture Serial' n={eq.mfserial} />
        <DataLine l='Manufacture Year' n={eq.mfyear} />
        <DataLine l='Warranty Expiration' n={eq.mfwrnty ? moment(eq.mfwrnty).tz('UTC').format('MMM D YYYY') : ''} />
      </dl>
      
      <dl className='vmarginhalf'>
        <DataLine l={`${Pref.steward}s`} />
        {(eq.stewards || []).map( (uID, index)=> ( 
          <dd key={index} className='cap'
          >{users.find( u => u._id === uID )?.username?.replace('.', ' ')?.replace('_', ' ')}</dd>
        ))}
      </dl>
      
      {equipData.contacts?.map( (c, index)=>(
        <dl key={index}>
          <dt>{c.prime && <i className='fa-solid fa-star gapR'></i>}{c.source}</dt>
          <dd><i className="fa-solid fa-building fa-fw gapR"></i>{c.company}</dd>
          <dd><i className="fa-solid fa-briefcase fa-fw gapR"></i>{c.department}</dd>
          <dd><i className="fa-solid fa-user fa-fw gapR"></i>{c.name}</dd>
          <dd><i className="fa-solid fa-at fa-fw gapR"></i>{c.email}</dd>
          <dd><i className="fa-solid fa-phone fa-fw gapR"></i>{c.phone}</dd>
          <dd><i className="fa-solid fa-dollar-sign fa-fw gapR"></i>{c.cost}</dd>
          <dd><i className="fa-solid fa-note-sticky fa-fw gapR"></i>{c.notes}</dd>
        </dl>
      )) || null}
    </div>
  );
};

export default Nameplate;

const DataLine = ({ l, n })=>( 
  <p className='split cap'>{l}: <n-num>{n}</n-num></p>
);