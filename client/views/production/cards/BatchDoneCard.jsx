import React from 'react';

import JumpText from '/client/components/tinyUi/JumpText.jsx';
// import StatsSimple from '../../../components/smallUi/StatsSimple.jsx';

const BatchDoneCard = ({ group, widgetData, batchData })=> {

  let w = widgetData;
  let b = batchData;

  return(
    <div className='card' key={1}>
      <div className='space'>
        <h1>{b.batch}</h1>
        <h3>
          <JumpText title={group} link={group} />
          <JumpText title={w.widget} link={w.widget} />
        </h3>
        <p>tags:</p>
        <br />

        <div className='centre greenT big'>
          <i className='clean'>{b.finishedAt.toLocaleString()}</i>
          <progress className='prog' value='1' max='1'></progress>
          <i className='clean'>Tracked Items: {b.items}</i>
          <i className='clean'>Tracked Steps: {b.steps}</i>
          <i className='clean'>Total Units: {b.units}</i>
        </div>

        {/*<StatsSimple report={b} />*/}

      </div>
		</div>
  );
};
  
export default BatchDoneCard;