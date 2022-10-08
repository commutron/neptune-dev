import React from 'react';
import Pref from '/client/global/pref.js';

const SearchHelp = ()=> (
  <div className='pop vmargin space'>
    <div className='cap rowWrap'>
      <dl className='margin5'>
        <dt>Searchable</dt>
        <dd>{Pref.item} serial number</dd>
        <dd>{'Partial serial numbers > 5 digits'}</dd>
        <dd>{Pref.xBatch} number</dd>
        <dd>{Pref.group}'s abreviation</dd>
        <dd>"docs" or "{Pref.docs}"</dd>
      </dl>
      <dl className='margin5'>
        <dt>Not Searchable</dt>
        <dd>part numbers</dd>
        <dd>{Pref.widget}s</dd>
        <dd>tags</dd>
        <dd>users</dd>
        <dd>{Pref.equip}</dd>
      </dl>
    </div>
    <p className='small indenText'><em>* Triple click in search field to clear selection</em></p>
  </div>
);

export default SearchHelp;