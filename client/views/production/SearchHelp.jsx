import React from 'react';
import Pref from '/client/global/pref.js';

const SearchHelp = ()=> (
  <div className='card'>
    <div className='space centre'>
      <hr />

      <ul>
        <li>Searchable</li>
        <ul>
          <li>{Pref.item} serial number</li>
          <li>{Pref.batch} number</li>
          <li>{Pref.group}'s abreviation</li>
          <li>{Pref.docs}</li>
        </ul>
      </ul>
      <ul>
        <li>Not Searchable</li>
        <ul>
          <li>part numbers</li>
          <li>{Pref.widget}s</li>
          <li>partial names</li>
          <li>tags</li>
          <li>users</li>
        </ul>
      </ul>
      <ul>
        <li>Shortcuts</li>
        <ul>
          <li>{Pref.btch} = {Pref.batch}</li>
          <li>{Pref.grp} = {Pref.group}</li>
          <li>d = docs / {Pref.docs}</li>
        </ul>
      </ul>

      <hr />
    </div>
  </div>
);

export default SearchHelp;