import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import FindBox from './FindBox.jsx';
import TopBar from './TopBar.jsx';

AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');

export const BasicLayout = ({content, link}) => (
  <div className='basicContainer'>
    <div className='gridHeaderNav'>
      <TopBar link={link} />
    </div>
    <div className='basicMainFull'>
      {content}
    </div>
    <div className='basicFooter'></div>
  </div>
);

export const DashLayout = ({content, link}) => (
  <div className='dashContainer'>
    <div className='gridHeaderSearch'>
      <FindBox />
    </div>
    <div className='gridHeaderNav'>
      <TopBar link={link} />
    </div>
      {content}
    <div className='basicFooter'></div>
  </div>
);

export const ProductionLayout = ({content, link}) => (
  <div className='dashContainer'>
    <div className='gridHeaderSearch'>
      <FindBox />
    </div>
    <div className='gridHeaderNav'>
      <TopBar link={link} />
    </div>
      {content}
    <div className='basicFooter'></div>
  </div>
);

export const AnalysisLayout = ({content, link}) => (
  <div className='dashContainer'>
    <div className='gridHeaderSearch'>
      <FindBox />
    </div>
    <div className='gridHeaderNav'>
      <TopBar link={link} />
    </div>
      {content}
    <div className='basicFooter'></div>
  </div>
);

export const LabelLayout = ({content}) => (
  <div className='basicContainer'>
    <div className='gridHeaderNav noPrint'>
      <TopBar />
    </div>
    <div className='basicMainFull'>
      <div className='wide noPrint'>
        <button
          className='smallAction clear'
          onClick={()=> window.history.back()}
        ><i className='fa fa-arrow-circle-left fa-lg' aria-hidden='true'></i> Go Back</button>
      </div>
      <div className='printLabel'>
        {content}
      </div>
    </div>
    <div className='basicFooter noPrint'></div>
  </div>
);

    
