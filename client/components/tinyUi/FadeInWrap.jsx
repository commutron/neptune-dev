import React, {Component} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';

export default class FadeInWrap extends Component	{

  render() {

    return (
      <CSSTransitionGroup
				component='span'
				transitionName='modelTrans'
				transitionEnter={true}
				transitionAppear={true}
				transitionLeave={false}
				transitionEnterTimeout={200}
				transitionAppearTimeout={200}>
				
        {this.props.children}
      
      </CSSTransitionGroup>
    );
  }
}