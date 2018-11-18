import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

const InOutWrap = ({ children, type, contain, add })=> (
  <CSSTransitionGroup
		component={contain || 'div'}
		className={add || ''}
		transitionName={type}
		transitionEnter={true}
		transitionAppear={true}
		transitionLeave={true}
		transitionEnterTimeout={300}
		transitionAppearTimeout={300}
		transitionLeaveTimeout={300}
	>
    {children}
  </CSSTransitionGroup>
);
// these timouts are 100ms shorter than the duration in the css
// this seems to avoid a flicker at the end of the animation

export default InOutWrap;