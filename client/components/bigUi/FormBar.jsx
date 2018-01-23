import React from 'react';

import NCAdd from '../river/NCAdd.jsx';
import MultiItemForm from '../forms/MultiItemForm.jsx';

const FormBar = ({ batchData, itemData, versionData, app, action})=> (
  <div className='dashAction'>
    <div className='footLeft'>
      {batchData && 
  	    action === 'batchBuild' &&
  	      batchData.items
  	        .filter( x => x.history.length < 1 )
	            .length < 1 ?
    	  <MultiItemForm
          id={batchData._id}
          items={batchData.items}
          more={batchData.finishedAt === false}
          unit={versionData.units}
          app={app} />
      :null}
    </div>
    <div className='footCent'>
      {batchData && itemData ?
        <NCAdd 
          id={batchData._id}
          barcode={itemData.serial}
          app={app} />
        :null}
    </div>
    <div className='footRight'></div>
  </div>
);

export default FormBar;