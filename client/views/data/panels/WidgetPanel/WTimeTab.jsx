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
          <th>Sales Start → Production Start</th>
          <th>Sales Start → First Finished Item*</th>
          <th>Sales Start → Complete</th>
        </tr>
      </thead><tbody>
        <tr className='centreText'>
          <td>{ result['relAvg'] && `${round1Decimal(result['relAvg'])} days`}</td>
          <td>{ result['stAvg'] && `${round1Decimal(result['stAvg'])} days`}</td>
          <td>{ result['ffinAvg'] && `${round1Decimal(result['ffinAvg'])} days`}</td>
          <td>{ result['compAvg'] && `${round1Decimal(result['compAvg'])} days`}</td>
        </tr>
      </tbody></table>
      {result['qtyAvg'] &&
        <p className='small rightText fade'
          >Based on an average quantity of <n-num>{result['qtyAvg']}</n-num> per {Pref.xBatch}
        </p>
      }
      <p className='small rightText fadeMore'
        >Counts completed {Pref.xBatchs} and scheduled work days
      </p>
      <p className='small rightText fadeMore'
        >* Only applicable to {Pref.xBatchs} that include serialized items
      </p>
     
      <TideMultiBatchBar 
        batchIDs={batchIDs}
        app={app} />
        
    </div>
  );
};

export default WTimeTab;