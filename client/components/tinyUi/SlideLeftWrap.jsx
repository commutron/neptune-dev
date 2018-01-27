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
		transitionEnterTimeout={400}
		transitionAppearTimeout={400}
		transitionLeaveTimeout={400}
	>
    {children}
  </CSSTransitionGroup>
);

export default SlideLeftWrap;