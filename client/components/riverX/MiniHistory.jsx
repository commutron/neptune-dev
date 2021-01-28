import React, { Fragment } from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';

const MiniHistory = ({ history })=> (
  <Fragment>
    {history.length > 0 ?
      <n-mock-table className='miniHistory vgap'>
        {history.map( (hst, idx)=>{
        		return( 
        		  <n-mock-table-row className='cap' key={idx}>
        		    <n-mock-table-cell>
        		      {hst.good ? <i className='fas fa-check fa-fw greenT'></i>
        		                : <i className='fas fa-times fa-fw redT'></i>}
        		      {hst.type} {hst.step}</n-mock-table-cell>
        		    <n-mock-table-cell
        		      >{moment(hst.time).calendar()}
        		    </n-mock-table-cell>
        		  </n-mock-table-row>
        )})}
      </n-mock-table>
      : <h3 className='centreText'>{Pref.Item} Unstarted</h3> }
  </Fragment>
);
  
export default MiniHistory;
