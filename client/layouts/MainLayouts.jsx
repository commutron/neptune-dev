import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import FindBox from './FindBox.jsx';
import TopBar from './TopBar.jsx';

AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');

export const MainLayout = ({content, link, plainFooter}) => (
  <div className='main-layout'>
    <header className='clearfix'>
      <TopBar link={link} />
    </header>
    <main>
      {content}
    </main>
    {plainFooter ?
      <footer></footer>
    : null}
  </div>
);

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

    
