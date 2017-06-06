import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

export default class SlideDownWrap extends Component	{

  render() {

    return (
      <CSSTransitionGroup
				component='div'
				transitionName='cardTrans'
				transitionEnter={true}
				transitionAppear={true}
				transitionLeave={false}
				transitionEnterTimeout={400}
				transitionAppearTimeout={400}>
				
        {this.props.children}
      
      </CSSTransitionGroup>
    );
  }
}