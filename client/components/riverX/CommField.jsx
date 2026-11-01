import React from 'react';

export const CommTrigger = ({ commTrigger })=> (
  <button
			id='stoneCommTrigger'
			name='Add Comment'
			className='moreStepAction centre'
		  onClick={()=>commTrigger(true)} 
		><i className='fas fa-comment fa-fw fa-lg'></i>
	</button>
);

export const CommField = ({ commSet })=> (
  <textarea 
    id='stoneCommField'
    className='stoneBase w100'
    onInput={(e)=>commSet(e.target.value)}
    required
    >
  </textarea>
);