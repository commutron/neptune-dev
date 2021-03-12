import React, { useState } from 'react';

import { RapidInfoCreate } from '/client/components/forms/Rapid/RapidInfo';

const RapidExtendCreate = ({ rOpenid, batchData, editAuth, cal, cancelFunc })=> {
  
  const [ createState, createSet ] = useState(false);
  
  return(
    <div>
      <button
        className={`centreRow miniAction ${createState ? 'vmarginhalf' : ''}`}
        onClick={()=>createSet(!createState)}
        disabled={!editAuth || rOpenid}
      >
        <span>
          <i className='fas fa-sitemap fa-2x darkOrangeT'></i>
        </span>
        <span className={`${createState ? 'big' : 'medBig'} gapR`}>Extend</span>
      </button>
      
      {!createState && rOpenid ? <small>Only 1 open extension permitted</small> : null}
        
      {createState &&
        <div className='vmargin'>
          <RapidInfoCreate 
            batchId={batchData._id}
            groupId={batchData.groupId}
            exBatch={batchData.batch}
            allQ={batchData.quantity}
            rSetItems={0}
            editAuth={editAuth}
            cal={cal}
            cancelFunc={()=>createSet(false)} />
        </div>
      }
    </div>
  );
};

export default RapidExtendCreate;