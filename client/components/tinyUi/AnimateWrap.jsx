import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

const AnimateWrap = ({ children, type, el })=> (
  <CSSTransitionGroup
		component={el || 'div'}
		transitionName={type}
		transitionEnter={true}
		transitionAppear={true}
		transitionLeave={false}
		transitionEnterTimeout={500}
		transitionAppearTimeout={500}
	>
    {children}
  </CSSTransitionGroup>
);

export default AnimateWrap;