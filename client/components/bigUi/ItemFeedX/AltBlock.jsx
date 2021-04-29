import React from 'react';
import './style.css';

const AltBlock = ({ entry, cal, flowName })=> (
  <n-feed-info-block class='altflow'>
    <n-feed-left-anchor>
      <i className='fas fa-directions fa-lg fa-fw' 
        title='Alt Flow'
      ></i>
    </n-feed-left-anchor>
    <n-feed-info-center>
      <n-feed-info-title class='cap'>
        <span>Switched to Alternative Flow</span>
        <span></span>
        <span>{flowName}</span>
        <span>{cal(entry.assignedAt)}</span>
      </n-feed-info-title>
    </n-feed-info-center>
    <n-feed-right-anchor></n-feed-right-anchor>
  </n-feed-info-block>
);

export default AltBlock;