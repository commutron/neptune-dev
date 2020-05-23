import React from 'react';
import Pref from '/client/global/pref.js';

const SearchHelp = ()=> (
  <div className='card'>
    <div className='space comfort'>
      <hr />

      <ul>
        <li>Searchable</li>
        <ul>
          <li>{Pref.item} serial number</li>
          <li>{Pref.batch} number</li>
          <li>{Pref.group}'s full name</li>
          <li>{Pref.group}'s abreviation</li>
          <li>{Pref.widget} id</li>
          <li>all {Pref.scrap} {Pref.item}s</li>
        </ul>
      </ul>
      <ul>
        <li>Not Searchable</li>
        <ul>
          <li>part numbers</li>
          <li>{Pref.widget} descriptions</li>
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
          <li>{Pref.scrp} = {Pref.scrap}s</li>
        </ul>
      </ul>

      <hr />
    </div>
  </div>
);

export default SearchHelp;