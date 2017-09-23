import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

export default class OrgWIP extends Component	{
  
  /*
    let findWidget = (wId)=>{
    const widget = widgets.find( x => x._id === wId);
    return widget.widget;
  };
  
  
  const weekAgo = moment().subtract(1, 'week');
  const batches = batchesAll.filter( 
                  x => x.finishedAt === false || 
                  moment(x.finshedAt).isAfter(weekAgo) === true );
  
  
  let liveData = [];
  
  
  for(let b of batchesAll) {
    let w = findWidget(b.widgetId);
    liveData.push({
      batch: b.batch,
      widget: w.widget
    });
  }
  
  
  return liveData;
  */


  render() {
    
    const dt = this.props;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={0}>
          
          <i>hi</i>
          
          
      {/*
          <ul>
          {live.map( (entry, index)=>{
            //let w = this.findWidget.bind(this);
            return(
              <li key={index}>{entry.batch}, {entry.widget}</li>
            )})}
          </ul>
          */}
        </div>
      </AnimateWrap>
    );
  }
}