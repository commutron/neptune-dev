import React from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import UserNice from '../smallUi/UserNice.jsx';

const BlockNotes = ({ data })=> {
    
  const active = data.filter( x => x.solve === false );
  const blockersA = active.sort((s1, s2) => {return s1.time < s2.time});
  
  const done = data.filter( x => x.solve !== false );
  const blockersD = done.sort((s1, s2) => {return s1.time < s2.time});

  return (
    <div>
      {blockersA.length > 0 ?
        blockersA.map( (entry, index)=>{
          return ( <BlockBox key={index} dt={entry}/> );
        })
      :null}
      {blockersD.length > 0 ?
          blockersD.map( (entry, index)=>{
            return ( <BlockBox key={index} dt={entry}/> );
          })
      :null}
    </div>
  );
};

const BlockBox = ({ dt })=> {
/// Display simple information about the Blocker \\\\
  let solved = dt.solve ? <p>{dt.solve.action}</p> : null;
  let color = solved ? '' : 'yellowBox';
  let when = solved ? dt.solve.time : dt.time;
  let who = solved ? dt.solve.who : dt.who;
  return (
  	<fieldset className={color}>
      <legend>{Pref.block}</legend>
      <p>{dt.block}</p>
      {solved}
			<div className='footerBar'>
        {moment(when).calendar()} - <UserNice id={who} />
      </div>
    </fieldset>
	);
};

export default BlockNotes;