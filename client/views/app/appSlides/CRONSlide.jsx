import React from 'react';
import moment from 'moment';
import 'moment-timezone';

const CRONSlide = ()=> {
  
  const local = moment.tz.guess();
  const isLocal = (t)=> moment.utc(t, "H:mm").tz(local).format('h:mm A');
  
  return(
    <div className='space3v'>
      <h2 className='cap'>CRON Jobs - Scheduled Tasks</h2>
      
      <p>Enabled by the <code>littledata:synced-cron</code> and <code>Later.js</code> packages.</p>
      
      <p>No frontend interface. Configured in source at <code>server/cronOps.js</code>.</p>
      
      <table className='vmargin w100 centreText'>
        <thead>
          <tr>
            <th>Frequency</th>
            <th>UTC</th>
            <th>{local}</th>
            <th>Function</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Everyday</td>
            <td>6:00</td>
            <td>{isLocal('6:00')}</td>
            <td>PIN Change</td>
          </tr>
          <tr>
            <td>Everyday</td>
            <td>6:01</td>
            <td>{isLocal('6:01')}</td>
            <td>Clear 90+ Day Message Log</td>
          </tr>
          <tr>
            <td>Everyday</td>
            <td>6:02</td>
            <td>{isLocal('6:02')}</td>
            <td>Maintenance Auto-Scheduler</td>
          </tr>
          <tr>
            <td>Weekdays</td>
            <td>6:05 & 18:00</td>
            <td>{isLocal('6:05')} & {isLocal('18:00')}</td>
            <td>Trace Priority</td>
          </tr>
          <tr>
            <td>Weekdays</td>
            <td>6:07</td>
            <td>{isLocal('6:07')}</td>
            <td>Time Overrun Check</td>
          </tr>
          <tr>
            <td>Weekdays</td>
            <td>6:10</td>
            <td>{isLocal('6:10')}</td>
            <td>Done Target By Month, Done Target By Week</td>
          </tr>
          <tr>
            <td>Saturday</td>
            <td>6:15</td>
            <td>{isLocal('6:15')}</td>
            <td>Batch Lock Check</td>
          </tr>
          <tr>
            <td>Saturday</td>
            <td>6:20</td>
            <td>{isLocal('6:20')}</td>
            <td>Average Day Time</td>
          </tr>
          <tr>
            <td>Saturday</td>
            <td>6:25</td>
            <td>{isLocal('6:25')}</td>
            <td>Widget Averages</td>
          </tr>
          <tr>
            <td>1st of the Month</td>
            <td>6:30</td>
            <td>{isLocal('6:30')}</td>
            <td>NonCon Time Report</td>
          </tr>
        </tbody>
      </table>
      
    </div>
  );
};

export default CRONSlide;