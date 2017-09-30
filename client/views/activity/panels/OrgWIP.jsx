import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

export default class OrgWIP extends Component	{
  
  constructor() {
    super();
    this.state = {
      wip: false,
    };
  }
  
  relevant() {
    const b = this.props.b;
    const now = moment();
    const thisWeek = (fin)=> { return ( moment(fin).isSame(now, 'week') ) };
    const live = b.filter( x => x.finishedAt === false || thisWeek(x.finishedAt) === true );
    
    Meteor.call('WIPProgress', live, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({'wip': reply});
    });
  }


  render() {
    
    const wip = this.state.wip;
    
    if(!wip) {
      return (
        <div className='centreTrue'>
          loading...
        </div>
      );
    }
    
    console.log(wip);
    
    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={0}>
          
          {wip.map( (entry, index)=>{
            return(
              <ul key={index}>
                <li>{entry.batch}, {entry.group}, {entry.widget}</li>
                <ul>
                  <li>finished, {entry.finished.toString()}</li>
                  <li>total {Pref.item}s, {entry.total}</li>
                  {entry.steps.map( (stp, index)=>{
                    return(
                      <li key={index}>{stp.step}, {stp.type}, {stp.count}</li>
                  )})}
                  <li>rma, {entry.rma}</li>
                  <li>scraps, {entry.scrap}</li>
                </ul>
              </ul>
            )})}
        
        </div>
      </AnimateWrap>
    );
  }
  componentDidMount() {
    this.relevant();
  }
}