import React from 'react';
import './style.css';
//import Pref from '/client/global/pref.js';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const CreateBlock = ({ title, user, datetime, cal })=> (
  <n-feed-info-block class='create'>
    <n-feed-left-anchor>
      <i className="fas fa-plus-circle fa-lg fa-fw"></i>
    </n-feed-left-anchor>
    <n-feed-info-center>
      <n-feed-info-title>
        <span>{title}</span>
        <span></span>
        <span><UserNice id={user} /></span>
        <span>{cal(datetime)}</span>
      </n-feed-info-title>
    </n-feed-info-center>
    <n-feed-right-anchor></n-feed-right-anchor>
  </n-feed-info-block>
);

export default CreateBlock;