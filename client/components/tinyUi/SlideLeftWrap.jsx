import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

const SlideLeftWrap = ({ children })=> (
  <CSSTransitionGroup
		component='span'
		transitionName='contentLeft'
		in={true}
		transitionEnter={true}
		transitionAppear={true}
		transitionLeave={true}
		transitionEnterTimeout={1000}
		transitionAppearTimeout={1000}
		transitionLeaveTimeout={1000}
	>
    {children}
  </CSSTransitionGroup>
);

export default SlideLeftWrap;