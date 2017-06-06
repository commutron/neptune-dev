import React, {Component} from 'react';
import moment from 'moment';

import RMAFall from './RMAFall.jsx';

// props
/// id={b._id}
/// barcode={i.barcode}
/// rma={rma} // relevent cascades
/// cascades={b.cascade} // all cascades
/// rmaList={i.rma}

export default class RMACascade extends Component {
  
  // bit ridiculous this needs state to work
  constructor() {
    super();
    this.state = {
      fall: false
    };
    // enable fall at component load
    Meteor.setTimeout(()=> { // wait for data to be loaded
      Session.get('nowStep') === 'done' ?
        this.setState({ fall: true })
        : null;
    }, 100);
  }
  
  // enable fall at component data change
  componentWillReceiveProps() {
    Meteor.setTimeout(()=> { // wait for data to be loaded
      Session.get('nowStep') === 'done' ?
      this.setState({ fall: true }) :
      this.setState({ fall: false});
    }, 100);
  }
  
  render() {
    
    return (
      <div className='wide'>
        {
        // RMA activating available after current RMAs are finished
        this.state.fall ?
          <RMAFall
            id={this.props.id}
            cascades={this.props.cascades}
            barcode={this.props.barcode}
            rma={this.props.rmaList}
            allItems={this.props.allItems} />
        :null}
      
        {
        // list rmas active on this item
        this.props.rma.map( (entry, index)=>{
          if(index == this.props.rma.length - 1) {
          // current rma is bold
            return(
              <div key={index} className='bleed cap fadeRed centre'>
                <b>RMA: {entry.rmaId}, {moment(entry.time).calendar()}</b>
              </div>
              );
          }else{
          // previous rmas are italic
            return(
              <div key={index} className='bleed cap fadeRed centre'>
                <i>RMA: {entry.rmaId}, {moment(entry.time).calendar()}</i>
              </div>
              );
          }})}

      </div>
    );
  }
}