import React, { Fragment } from 'react';
import moment from 'moment';
import './style.css';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const ABlock = ({ classtext, fullicon, icontitle, subdetail, children })=> (
  <n-feed-info-block class={classtext}>
    <n-feed-left-anchor>
      <i className={`${fullicon} fa-lg fa-fw`} title={icontitle || ''}></i>
    </n-feed-left-anchor>
    <n-feed-info-center>
      <n-feed-info-title class='cap'>
        {children}
      </n-feed-info-title>
      {subdetail || null}
    </n-feed-info-center>
    <n-feed-right-anchor></n-feed-right-anchor>
  </n-feed-info-block>
);

export default ABlock;

export const CreateBlock = ({ title, user, datetime, cal })=> (
  <ABlock
    classtext='create'
    fullicon="fa-solid fa-plus-circle"
    >
    <Fragment>
      <span>{title}</span>
      <span>Created</span>
      <span><UserNice id={user} /></span>
      <span>{cal(datetime)}</span>
    </Fragment>
  </ABlock>
);

export const AltBlock = ({ entry, cal, flowName })=> (
  <ABlock
    classtext='altflow'
    fullicon="fa-solid fa-directions"
    icontitle='Alt Flow'
    >
    <Fragment>
      <span>Switched to Alternative Flow</span>
      <span>{flowName}</span>
      <span>{cal(entry.assignedAt)}</span>
    </Fragment>
  </ABlock>
);

export const QuoteBlock = ({ dt, cal })=> {
  
  const hoursDur = moment.duration(dt.timeAsMinutes, "minutes")
                    .asHours().toFixed(2, 10);
                    
  return(
    <ABlock
      classtext='quoteEvent'
      fullicon="fa-solid fa-hourglass-start"
      >
      <Fragment>
        <span>Quote Time set to {hoursDur} hours</span>
        <span>({dt.timeAsMinutes} minutes)</span>
        <span>{cal(dt.updatedAt)}</span>
      </Fragment>
    </ABlock>
  );
};

export const EventBlock = ({ dt, cal })=> {
  
  const icon = dt.title === 'Start of Process' ? 'fa-solid fa-play-circle' :
               dt.title === 'End of Process' ? 'fa-solid fa-stop-circle' : 
               'fa-solid fa-asterisk';
  return(
    <ABlock
      classtext='evEvent'
      fullicon={icon}
      subdetail={dt.sub && <dd className='small'>{dt.sub}</dd>}
      >
      <Fragment>
        <span>{dt.title}</span>
        <span>{dt.detail}</span>
        <span>{cal(dt.time)}</span>
      </Fragment>
    </ABlock>
  );
};

export const AlterBlock = ({ dt, cal })=> {
  
  const toDate = (val)=> typeof(val) == 'object' && moment(val).isValid() ? moment(val).format('MMM D YYYY, h:mm a') : val;
  
  return(
    <ABlock
      classtext='alterEvent'
      fullicon='fa-solid fa-eraser'
      subdetail={
        <dd>{toDate(dt.oldValue)} <i className="fas fa-arrow-right fa-fw"></i> {toDate(dt.newValue)}</dd>
      }
      >
      <Fragment>
        <span>Altered: <em className='clean'>"{dt.changeKey}"</em></span>
        <span>for {dt.changeReason}</span>
        <span><UserNice id={dt.changeWho} /></span>
        <span>{cal(dt.changeDate)}</span>
      </Fragment>
    </ABlock>
  );
};

export const CompleteBlock = ({ title, datetime, cal })=> (
  <ABlock
    classtext='finish'
    fullicon="fa-solid fa-flag-checkered"
    >
    <Fragment>
      <span>{title}</span>
      <span>{cal(datetime)}</span>
    </Fragment>
  </ABlock>
);