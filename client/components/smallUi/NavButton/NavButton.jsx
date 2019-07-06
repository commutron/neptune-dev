import React from 'react';
import './style';

const NavButton = ({ title, icon, trans, link, blank }) => (
  <span className='navButtonWrap'>
    <a href={link || ''} target={blank ? '_blank' : ''}>
      <i
        className={'fas ' + (icon || 'fa-unlink') + ' fa-fw navButtonIcon'}></i>
      <i className='navButtonText'>{title || ''}</i>
    </a>
  </span>
);

export default NavButton;

export const NavPlaceholder = ({ title, icon, trans }) => (
  <span>
    <div className='navButtonPlaceHolder'>
      <i 
        className={(icon || 'fas fa-unlink') + ' fa-fw navButtonIcon'}></i>
      <i className='navButtonText'>{title || ''}</i>
    </div>
  </span>
);