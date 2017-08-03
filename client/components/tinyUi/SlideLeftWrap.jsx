import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

export default class SlideLeftWrap extends Component	{

  render() {

    return (
      <CSSTransitionGroup
				component='span'
				transitionName='contentLeft'
				in={true}
				transitionEnter={true}
				transitionAppear={true}
				transitionLeave={true}
				transitionEnterTimeout={1000}
				transitionAppearTimeout={1000}
				transitionLeaveTimeout={1000}>
				
        {this.props.children}
      
      </CSSTransitionGroup>
    );
  }
}