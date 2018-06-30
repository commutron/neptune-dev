import { Meteor } from 'meteor/meteor';
import React from 'react';

//import FindBox from './FindBox.jsx';
import TopBar from './TopBar.jsx';

export const PublicLayout = ({content}) => (
  <div className='basicContainer'>
    <div className='gridHeaderNav'>
      <div className='primeNav'>
        <nav className='primeNav'>
          <a className='title' href='/' title='Home'>
            <img
              src='/neptune-logo-white.svg'
              className='logoSVG' />
          </a>
        </nav>
      </div>
    </div>
    <div className='basicMainFull'>
      {content}
    </div>
  </div>
);

export const BasicLayout = ({content, link}) => (
  <div className='basicContainer'>
    <div className='gridHeaderNav'>
      <TopBar link={link} />
    </div>
    <div className='basicMainFull'>
      {content}
    </div>
    <div className='basicFooter'></div>
  </div>
);

export const LandingLayout = ({content}) => ( content );

export const LabelLayout = ({content}) => (
  <div className='basicContainer'>
    <div className='gridHeaderNav noPrint'>
      <TopBar />
    </div>
    <div className='basicMainFull'>
      <div className='wide noPrint'>
        <button
          className='smallAction clear'
          onClick={()=> window.history.back()}
        ><i className='fas fa-arrow-circle-left fa-lg'></i> Go Back</button>
      </div>
      <div className='printLabel'>
        {content}
      </div>
    </div>
    <div className='basicFooter noPrint'></div>
  </div>
);

    
