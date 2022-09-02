import React, { useState } from 'react';
import Pref from '/client/global/pref.js';

import { toCap } from '/client/utility/Convert';
import { RapidInfoCreate } from '/client/components/forms/Rapid/RapidInfo';

const RapidExtendCreate = ({ rOpenid, batchData, app, editAuth, cal })=> {
  
  const [ createState, createSet ] = useState(false);
  
  return(
    <div>
      <button
        className={`centreRow miniAction ${createState ? 'vmarginhalf' : ''}`}
        onClick={()=>createSet(!createState)}
        disabled={!editAuth || rOpenid || batchData.lock}
      >
        <span>
          <i className='fas fa-sitemap fa-2x darkOrangeT'></i>
        </span>
        <span className={`${createState ? 'big' : 'medBig'} gapR`}>{toCap(Pref.rapidEx)}</span>
      </button>
      
      {!createState && rOpenid ? <small>Only 1 open {Pref.rapidExn} permitted</small> : null}
        
      {createState &&
        <div className='vmargin'>
          <RapidInfoCreate 
            batchId={batchData._id}
            groupId={batchData.groupId}
            exBatch={batchData.batch}
            allQ={batchData.quantity}
            rSetItems={0}
            rootURL={app.instruct}
            cal={cal}
            cancelFunc={()=>createSet(false)} />
        </div>
      }
    </div>
  );
};

export default RapidExtendCreate;