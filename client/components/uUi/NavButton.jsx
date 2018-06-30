import React from 'react';

const NavButton = ({ title, icon, trans, link, blank }) => (
  <span className='navButtonWrap'>
    <a href={link || ''} target={blank ? '_blank' : ''}>
      <i
        className={'fas ' + (icon || 'fa-unlink') + ' fa-fw navButtonIcon'}
        data-fa-transform={trans || ''}></i>
      <i className='navButtonText'>{title || ''}</i>
    </a>
  </span>
);

export default NavButton;

export const NavPlaceholder = ({ title, icon, trans }) => (
  <span>
    <div className='navButtonPlaceHolder'>
      <i 
        className={'fas ' + (icon || 'fa-unlink') + ' fa-fw navButtonIcon'}
        data-fa-transform={trans || ''}></i>
      <i className='navButtonText'>{title || ''}</i>
    </div>
  </span>
);