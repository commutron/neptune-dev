import React, { useState, Fragment } from 'react';
import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
import { toast } from 'react-toastify';
import Pref from '/public/pref.js';

import ContactForm from '/client/components/forms/Equip/ContactForm';
import ActionFunc from '/client/components/tinyUi/ActionFunc';

const Nameplate = ({ equipData, users, liveUsers, isEqSup, isEdit, app })=> {
  
  const [ ctctKey, ctctKeySet ] = useState(false);
  
  const openAction = (cID)=> {
    ctctKeySet(cID);
    document.getElementById('multi_eqip_contact_form')?.showModal();
  };
  
  const doCopy = (cliptext)=> {
    if(navigator.clipboard !== undefined) {
      toast(`"${cliptext}" copied`, {autoClose: 1000});
      navigator.clipboard.writeText(cliptext);
    }
  };
  
  const eq = equipData;
  const fx = (link)=> link && link.indexOf('http') === -1 ? true : false;

  return(
    <Fragment>
      <div className='w100'>
        <p className='w100 vmarginhalf capFL wordBr max875'>
          {Pref.premaintain} {Pref.instruct}: <a 
            className='clean wordBr' 
            href={fx(eq.instruct) ? app.instruct + eq.instruct : eq.instruct} 
            target='_blank'
          >{eq.instruct}</a>
        </p>
        
        <p className='w100 vmarginhalf capFL wordBr max875'>
          Repair documents: <a 
            className='clean wordBr' 
            href={fx(eq.library) ? app.instruct + eq.library : eq.library} 
            target='_blank'
          >{eq.library}</a>
        </p>
        
        <div className='gapsC' style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))'}}>
        
          <dl className='min300 max400'>
            <DataLine l='Model' n={eq.model} />
            <DataLine l='Manufacture Serial' n={eq.mfserial} />
            <DataLine l='Manufacture Year' n={eq.mfyear} />
            <DataLine l='Warranty Expiration' n={eq.mfwrnty ? moment(eq.mfwrnty).tz('UTC').format('MMM D YYYY') : ''} />
          </dl>
          
          <dl className='max300'>
            <DataLine l={`${Pref.steward}s`} />
            {(eq.stewards || []).map( (uID, index)=> ( 
              <dd key={index} className='cap'
              >{liveUsers.find( u => u._id === uID )?.username?.replace('.', ' ')?.replace('_', ' ')}</dd>
            ))}
          </dl>
        </div>
      
      </div>
    <div className='w100'>
      <ContactForm 
        ctctKey={ctctKey} 
        equipData={equipData}
        clearOnClose={()=>ctctKeySet(false)} 
      />
      
      <div className='flexRR'>
        <ActionFunc
          doFunc={()=>openAction(false)}
          title='Add Contact'
          icon='fa-solid fa-address-book'
          color='blackT'
          lockOut={!isEqSup}
        />
      </div>
      
      <div className='vmargin autoFlex gapsC'>
      {equipData.contacts?.map( (c)=>(
        <dl key={c.key} className='readlines max300'>
          <dt>{c.prime && <n-fa1><i className='fa-solid fa-star gapR'></i></n-fa1>}{c.source}</dt>
          <CRMLine icon='fa-building' data={c.company} />
          <CRMLine icon='fa-briefcase' data={c.department} />
          <CRMLine icon='fa-user' data={c.name} />
          <CRMCopy icon='fa-at' data={c.email} doCopy={doCopy} />
          <CRMCopy icon='fa-phone' data={c.phone} doCopy={doCopy} />
          <CRMLine icon='fa-dollar-sign' data={c.cost} />
          <CRMLine icon='fa-note-sticky' data={c.notes} />
          {isEqSup || isEdit ? 
            <dd><button onClick={()=>openAction(c.key)} className='small'><i className="fa-solid fa-square-pen fa-fw gapR"></i>Edit Contact</button></dd>
          : null}
        </dl>
      )) || null}
      </div>
    </div>
    </Fragment>
  );
};

export default Nameplate;

const DataLine = ({ l, n })=>( 
  <p className='split cap'>{l}: <n-num>{n}</n-num></p>
);

const CRMLine = ({ icon, data })=> {
  if(data) {
    return(
      <dd><n-fa0><i className={`fa-solid ${icon} fa-fw gapR`}></i></n-fa0>{data}</dd>
    );
  }
};
const CRMCopy = ({ icon, data, doCopy })=> {
  if(data) {
    return( 
      <dd><n-fa0><i className={`fa-solid ${icon} fa-fw gapR`}></i></n-fa0><CopyLink text={data} doCopy={doCopy} /></dd>
    );
  }
};

const CopyLink = ({text, doCopy})=> (
  <a onClick={()=>doCopy(text)} className='textLinkButton'>{text}{text && <i className="fa-regular fa-copy gapL onlyHover"></i>}</a>
);