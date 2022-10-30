import React from 'react';
import './style';

const NavButton = ({ title, icon, link, blank, tag, shrink }) => (
  <span className='navButtonWrap'>
    <a href={link || ''} target={blank ? '_blank' : ''}>
      <i
        className={(icon || 'fa-solid fa-unlink') + ' fa-fw navButtonIcon'}
        data-fa-transform={shrink ? "shrink-" + shrink : ''}  
      ></i>
      <i className='navButtonText'
      >{title || ''}{tag && <sup className='monoFont'><wbr />{tag}</sup>}</i>
    </a>
  </span>
);

export default NavButton;

export const NavButtonShell = ({ title, icon, link, blank }) => (
  <span className='navButtonWrap'>
    <a href={link || ''} target={blank ? '_blank' : ''}>
      {icon}
      <i className='navButtonText'>{title || ''}</i>
    </a>
  </span>
);

export const NavBar = ({ title, icon, link, blank, span }) => (
  <span className={`navBarWrap ${'navBarflex'+span}`}>
    <a href={link || ''} target={blank ? '_blank' : ''}>
      <i className={(icon || 'fa-solid fa-unlink') + ' fa-fw navBarIcon'}></i>
      <i className='navBarText'>{title || ''}</i>
    </a>
  </span>
);

export const NavPlaceholder = ({ title, icon, tag }) => (
  <span>
    <div className='navButtonPlaceHolder'>
      <i 
        className={(icon || 'fa-solid fa-unlink') + ' fa-fw navButtonIcon'}></i>
      <i className='navButtonText'
      >{title || ''}{tag && <sup className='monoFont'><wbr />{tag}</sup>}</i>
    </div>
  </span>
);

// export const NavBarPlaceholder = ({ title, icon, span }) => (
//   <span className={`navBarPlaceholer ${'navBarflex'+span}`}>
//     <i className={(icon || 'fa-solid fa-unlink') + ' fa-fw navBarIcon'}></i>
//     <i className='navBarText'>{title || ''}</i>
//   </span>
// );