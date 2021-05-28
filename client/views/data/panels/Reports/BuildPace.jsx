import React, { useState, useEffect, Fragment } from 'react';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
import { toast } from 'react-toastify';

import { round1Decimal } from '/client/utility/Convert';

const BuildPace = ()=> {
  
  const [ result, resultSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('reportOnCyclePace', (err, reply)=>{
      err && console.log(err);
      reply && resultSet(reply);
    });
  }, []);
  
  function exportTable() {
    const dateString = new Date().toLocaleDateString();
    toast(
      <a href={`data:text/plain;charset=UTF-8,${result}`}
        download={`build_pace_${dateString}.txt`}
      >Download Build Pace for {dateString} to your computer as JSON text file</a>
      , {autoClose: false, closeOnClick: false}
    );
  }

  if(!result) {
    return(
      <div>
        <p className='centreText'>fetching...may take several minutes...</p>
        <CalcSpin />
      </div>
    );
  }
  
  return(
    <div className='overscroll wide'>
      <p>All complete, serialized orders since pertinent records began.</p>
      <br />
      
      <div className='rowWrapR middle '>
        <button
          className='chartTableAction endSelf'
          title='Download Table'
          onClick={()=>exportTable()}
        ><i className='fas fa-download fa-fw'></i></button>
      </div>
      <table className='wide'>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Product Batch</th>
            <th>{"time % to go 0%->50% completed"}</th>
            <th>{"time % to go 51%->100% completed"}</th>
            </tr>
        </thead>
        <tbody>
          {JSON.parse(result)
            .sort((g1, g2)=> g1.group < g2.group ? -1 : g1.group > g2.group ? 1 : 0)
            .map( (entry, index)=>(
              <Fragment key={index}>
                <tr>
                  <td colSpan='4' className='medBig bold'
                  >{entry.group.toUpperCase()}</td>
                </tr>
                {entry.durrArray
                  .sort((w1, w2)=> w1[0] < w2[0] ? -1 : w1[0] > w2[0] ? 1 : 0)
                  .map( (e, ix)=>(
                    <Fragment key={'t'+ix}>
                      <tr>
                        <td></td>
                        <td className='bold' colSpan='3'>{ e[0].toUpperCase() }</td>
                      </tr>
                      {e[1].sort((b1, b2)=> b1[0] < b2[0] ? -1 : b1[0] > b2[0] ? 1 : 0)
                        .map( (y, i)=>(
                          <tr key={'b'+i}>
                            <td></td>
                            <td className='small'>{ y[0] }</td>
                            <td>{ round1Decimal(y[1]) }</td>
                            <td>{ round1Decimal(y[2]) }</td>
                          </tr>
                      ))}
                    </Fragment>
                ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BuildPace;