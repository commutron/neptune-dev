import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

export default class SlideUpWrap extends Component	{

  render() {

    return (
      <CSSTransitionGroup
				component='div'
				transitionName='contentTrans'
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