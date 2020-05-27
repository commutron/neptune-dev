import React from 'react';
import Pref from '/client/global/pref.js';

const SearchHelp = ()=> (
  <div className='pop'>
    <div className='space centre'>
      <dl>
        <dt className='vspace'>Searchable</dt>
        <dd>{Pref.item} serial number</dd>
        <dd>{Pref.batch} number</dd>
        <dd>{Pref.group}'s abreviation</dd>
        <dd>{Pref.docs}</dd>

        <dt className='vspace'>Not Searchable</dt>
        <dd>part numbers</dd>
        <dd>{Pref.widget}s</dd>
        <dd>partial names</dd>
        <dd>tags</dd>
        <dd>users</dd>
        
        <dt className='vspace'>Shortcuts</dt>
        <dd>{Pref.btch} = {Pref.batch}</dd>
        <dd>{Pref.grp} = {Pref.group}</dd>
        <dd>d = docs / {Pref.docs}</dd>
        <dd>{Pref.npi} = {Pref.npiFull}</dd>
      </dl>
    </div>
  </div>
);

export default SearchHelp;