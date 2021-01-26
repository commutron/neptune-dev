import React from 'react';
import moment from 'moment';

const MiniHistory = ({ history })=> (
  <div className='mockTable miniHistory vgap'>
    {history.map( (hst, idx)=>{
  		return( 
  		  <div className='mockTableRow cap' key={idx}>
  		    <div className='mockTableCell'>{hst.type} {hst.step}</div>
  		    <div className='mockTableCell'>{moment(hst.time).calendar()}</div>
  		  </div>
  		)})}
  </div>
);
  
export default MiniHistory;
