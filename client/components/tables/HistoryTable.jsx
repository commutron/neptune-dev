import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';
import StepBack from '../river/StepBack.jsx';

const HistoryTable = ({ id, serial, history, done })=> (
  <div>
    <table className='wide'>
      <thead className='green cap'>
        <tr>
          <th>step</th>
					<th>type</th>
					<th>time</th>
					<th>who</th>
					<th>comment</th>
					<th>inspect</th>
          <th>{Pref.builder}</th>
          <th>method</th>
          <th>change</th>
          <th>issue</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {history.map( (entry, index)=>{
          return (
            <HistoryRow
              key={index}
              entry={entry}
              id={id}
              serial={serial}
              done={done} />
          );
        })}
      </tbody>
    </table>
  </div>
);

const HistoryRow = ({ entry, id, serial, done })=> {
  let dt = entry;
  
  const cancel = Roles.userIsInRole(Meteor.userId(), 'edit') && !done ? 
                 <StepBack id={id} bar={serial} entry={dt} /> : 
                 '';
                 
   let good = dt.good ? 
              <i className='clean greenT'>G{cancel}</i> :
              <b className='up redT'>{Pref.ng}</b>;
   
   const infoF = dt.type === 'first' && typeof dt.info === 'object';
   const infoT = dt.type === 'test' && typeof dt.info === 'string';
   
   let inspect = infoF ? dt.info.verifyMethod : '';
   let builder = infoF ? dt.info.builder.map( (e, i)=> { return( 
                          <i key={i}><UserNice id={e} />, </i> )})
                       : '';
   let method = infoF ? dt.info.buildMethod : '';
   let change = infoF ? dt.info.change : '';
   let issue = infoF ? dt.info.issue : infoT ? dt.info : '';

  return(
    <tr>
      <td>{dt.step}</td>
      <td>{dt.type}</td>
      <td>{moment(dt.time).calendar()}</td>
      <td><UserNice id={dt.who} /></td>
      <td>{dt.comm}</td>
      <td>{inspect}</td>
      <td>{builder}</td>
      <td>{method}</td>
      <td>{change}</td>
      <td>{issue}</td>
      <td>{good}</td>
    </tr>
  );
};

export default HistoryTable;