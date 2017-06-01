import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

export default class SlideDownWrap extends Component	{

  render() {

    return (
      <CSSTransitionGroup
				component='div'
				transitionName='cardTrans'
				transitionEnterTimeout={400}
				transitionAppearTimeout={400}
				transitionLeaveTimeout={200}
				transitionAppear={true}>
				
        {this.props.children}
      
      </CSSTransitionGroup>
    );
  }
}