import React, { useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import TideMultiBatchBar from '/client/components/charts/Tides/TideMultiBatchBar.jsx';
import { round1Decimal } from '/client/utility/Convert';
// import { min2hr, flipArray } from '/client/utility/Convert';

const WTimeTab = ({ 
  widgetData, batchIDs, 
  app
})=> {
  
  const [ result, resultSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('oneWidgetTurnAround', widgetData._id, (err, reply)=>{
      err && console.log(err);
      reply && resultSet(reply);
    });
  }, []);
  
  return(
    <div className='space' key={widgetData._id+'times'}>
        
      <table className='wide'><thead>
        <tr className='cap'>
          <th>Sales Start → {Pref.kitting} Release</th>
          <th>Sales Start → First Timer Start</th>
          {/*<th>Sales Start → Sales End</th>*/}
          <th>Sales Start → Complete</th>
        </tr>
      </thead><tbody>
        <tr className='centreText'>
          <td>{ result[1] && `${round1Decimal(result[1])} days`}</td>
          <td>{ result[2] && `${round1Decimal(result[2])} days`}</td>
          {/*<td>{ result[3] && `${round1Decimal(result[3])} days`}</td>*/}
          <td>{ result[4] && `${round1Decimal(result[4])} days`}</td>
        </tr>
      </tbody></table>
      <p className='small rightText'
        >{Pref.batches} mean average, counting scheduled work days</p>
     
      <TideMultiBatchBar 
        batchIDs={batchIDs}
        app={app} />
        
    </div>
  );
};

export default WTimeTab;