import React from 'react';
import Pref from '/client/global/pref.js';

const SearchHelp = ()=> (
  <div className='pop vmargin space cap'>
    <dl className='vmarginhalf'>
      <dt>Searchable</dt>
      <dd>{Pref.item} serial number</dd>
      <dd>{'Partial serial numbers > 5 digits'}</dd>
      <dd>{Pref.xBatch} number</dd>
      <dd>{Pref.group}'s abreviation</dd>
      <dd>docs or {Pref.docs}</dd>
    </dl>
    <dl className='vmarginhalf'>
      <dt>Not Searchable</dt>
      <dd>part numbers</dd>
      <dd>{Pref.widget}s</dd>
      <dd>partial names</dd>
      <dd>tags</dd>
      <dd>users</dd>
    </dl>
  </div>
);

export default SearchHelp;