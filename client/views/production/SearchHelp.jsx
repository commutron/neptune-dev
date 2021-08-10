import React from 'react';
import Pref from '/client/global/pref.js';

const SearchHelp = ()=> (
  <div className='pop'>
    <div className='space centre cap'>
      <dl>
        <dt className='vspace'>Searchable</dt>
        <dd>{Pref.item} serial number</dd>
        <dd>{'Partial serial numbers > 5 digits'}</dd>
        <dd>{Pref.xBatch} number</dd>
        <dd>{Pref.group}'s abreviation</dd>
        <dd>docs / {Pref.docs}</dd>

        <dt className='vspace'>Not Searchable</dt>
        <dd>part numbers</dd>
        <dd>{Pref.widget}s</dd>
        <dd>partial names</dd>
        <dd>tags</dd>
        <dd>users</dd>
      </dl>
    </div>
  </div>
);

export default SearchHelp;