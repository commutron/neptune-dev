import React from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

const SearchHelp = ()=> (
  <AnimateWrap type='cardTrans'>
    <div className='card'>
      <div className='space comfort'>
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
  </AnimateWrap>
);

export default SearchHelp;