import React, {Component} from 'react';
import moment from 'moment';

import RMAFall from './RMAFall.jsx';

// props
/// id={b._id}
/// barcode={i.barcode}
/// rma={rma} // relevent cascades
/// cascadeData={b.cascade} // all cascades
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
        {this.state.fall ?
        // RMA activating available after current RMAs are finished
          <RMAFall
            id={this.props.id}
            cascadeData={this.props.cascadeData}
            barcode={this.props.barcode}
            rma={this.props.rmaList}
            allItems={this.props.allItems} />
        :null}
        {this.props.rma.map( (entry, index)=>{
        // list rmas active on this item  
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
          }})
        }
      </div>
    );
  }
}