import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';

import FindBox from './FindBox.jsx';
import TopBar from './TopBar.jsx';

AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');
ArchiveDB = new Mongo.Collection('archivedb');

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

export const BasicLayout = ({content}) => (
  <div className='basicContainer'>
    <div className='gridHeaderSearch'>
      <FindBox />
    </div>
    <div className='gridHeaderNav'>
      <TopBar />
    </div>
    <div className='basicMainFull'>
      {content}
    </div>
    <div className='basicFooter'></div>
  </div>
);


export const DashLayout = ({content}) => (
  <div className='dashContainer'>
    <div className='gridHeaderSearch'>
      <FindBox />
    </div>
    <div className='gridHeaderNav'>
      <TopBar />
    </div>
      {content}
    <div className='basicFooter'></div>
  </div>
);

    
