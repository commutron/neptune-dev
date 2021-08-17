import React from 'react';
import Pref from '/client/global/pref.js';

const CyclePaceTable = ({ stepTimes, fallTimes })=> (
  <table className='w100 vmargin cap leftText numFont'>
    <thead>
      <tr>
        <th></th>
        <th>Ideal Pace</th>
        <th>Average Pace</th>
      </tr>
      <tr>
        <th colSpan='3' className='spacehalf'>{Pref.flow}</th>
      </tr>
    </thead>
    <tbody>
      {!stepTimes ? null :
        stepTimes.sort((a,b)=> a.type > b.type ? 1 : a.type < b.type ? -1 : 0)
        .map( (ent, inx)=>(
          <tr key={inx}>
            <td>{ent.type}</td>
            <td>{ent.avgBest}</td>
            <td>{ent.avgPace}</td>
          </tr>
        ))
      }
    </tbody>
    <thead>  
      <tr>
        <th colSpan='3' className='spacehalf'>{Pref.fall}</th>
      </tr>
    </thead>
    <tbody>
      {!fallTimes ? null :
        fallTimes.sort((a,b)=> a.type > b.type ? 1 : a.type < b.type ? -1 : 0)
        .map( (ent, inx)=>(
          <tr key={inx}>
            <td>{ent.type}</td>
            <td>{ent.avgBest}</td>
            <td>{ent.avgPace}</td>
          </tr>
        ))
      }
    </tbody>
  </table>
);

export default CyclePaceTable;