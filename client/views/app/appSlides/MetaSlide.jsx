import React from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';

const MetaSlide = ()=> (
  <div className='space3v lightTheme scrollWrap'>
    <div className='monoFont centreText'>
      <p className='centre'>
        <img src='/titleLogo.svg' className='noCopy' height='200' />
      </p>
      <div className='max750 autoSelf'>
        <h2>Neptune {Pref.neptuneVersion}</h2>
        <p>Copyright ©{moment().year()} Commutron Industries Ltd. <a href='https://www.commutron.ca' target='_blank'>https://www.commutron.ca</a></p>
        <p>All Rights Reserved, No Public License</p>
        <p>All 3rd party packages used with permission under the MIT License</p>
        <p>Source avaliable <a href='https://github.com/commutron/neptune-dev' target='_blank'>https://github.com/commutron/neptune-dev</a></p>
        <br />
        <h3>Authored by</h3>
        <p>Matthew Andreas 2016-2021 <a href='https://github.com/mattandwhatnot' target='_blank'>https://github.com/mattandwhatnot</a></p>
        <br />
        <h3>with the generous support of</h3>
        <p>Robert Leonardo, Todd Ector, Hollis Scheller, Adam Wonnick
          <br/>and &nbsp;
          <a href='https://www.leveluptutorials.com/' target='_blank'>Scott Tolinski of Level Up Tutorials</a>
        </p>
        <br />
        <h3>and the wonderful open source community</h3>
        <p>
          <a href='https://www.meteor.com/' target='_blank'>MeteorJS</a>,&nbsp;
          <a href='https://reactjs.org/' target='_blank'>ReactJS</a>,&nbsp;
          <a href='https://www.mongodb.com/' target='_blank'>MongoDB</a>,&nbsp;
          <a href='https://momentjs.com/' target='_blank'>MomentJS</a>,&nbsp;
          <a href='https://fontawesome.com/' target='_blank'>Font Awesome</a>,&nbsp;
          <a href='https://formidable.com/open-source/victory/' target='_blank'>Victory</a> and many more.
        </p>
        <br />
        <h3>Made possible by the</h3>
        <p>Scientific Research and Experimental Development Tax Incentive Program</p> 
      </div>
    </div>
  </div>
);

export default MetaSlide;

export const MetaLink = ()=> (
  <p className='vmargin'>
    <a href='/meta'>Neptune {Pref.neptuneVersion} ©{moment().year()} Commutron Industries Ltd.</a>
  </p>
);