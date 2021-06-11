import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import TideMultiBatchBar from '/client/components/charts/Tides/TideMultiBatchBar.jsx';
import { round1Decimal } from '/client/utility/Convert';

const WTimeTab = ({ 
  widgetData, batchIDs, 
  app
})=> {
  
  const mounted = useRef(true);
  
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
  const [ result, resultSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('oneWidgetTurnAround', widgetData._id, (err, reply)=>{
      err && console.log(err);
      reply && mounted.current ? 
        resultSet(reply) : null;
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
          <td>{ result['relAvg'] && `${round1Decimal(result['relAvg'])} days`}</td>
          <td>{ result['stAvg'] && `${round1Decimal(result['stAvg'])} days`}</td>
          {/*<td>{ result['endAvg'] && `${round1Decimal(result['endAvg'])} days`}</td>*/}
          <td>{ result['compAvg'] && `${round1Decimal(result['compAvg'])} days`}</td>
        </tr>
      </tbody></table>
      <p className='small rightText fadeMore'
        >{Pref.xBatchs} mean, counting scheduled work days</p>
     
      <TideMultiBatchBar 
        batchIDs={batchIDs}
        app={app} />
        
    </div>
  );
};

export default WTimeTab;