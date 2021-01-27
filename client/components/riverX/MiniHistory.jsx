import React from 'react';
import moment from 'moment';

const MiniHistory = ({ history })=> (
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
);
  
export default MiniHistory;
