import React from 'react';

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