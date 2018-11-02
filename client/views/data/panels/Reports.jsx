import { Meteor } from 'meteor/meteor';
import React, {Component} from 'react';
//import Pref from '/client/global/pref.js';
//import BestWorstBatch from '/client/components/bigUi/BestWorstBatch.jsx';
// import PopularWidget from '/client/components/charts/PopularWidget.jsx'; 
import ReportRequest from '/client/components/forms/ReportRequest.jsx'; 

export default class Reports extends Component {
  
  constructor() {
    super();
    this.state = {
      //tops: false,
      start: false,
      end: false,
    };
  }
  
  tops() {
    //this.setState({ tops: false });
    //const best = this.props.app.ncScale.low;
    //const worst = this.props.app.ncScale.max;
    const start = this.state.start;
    const end = this.state.end;
    //const newOnly = this.state.newOnly === 'new' ? true : false;
    //const widgetSort = this.props.widgetSort;
    Meteor.call('buildReport', start, end, (error, reply)=> {
      error && console.log(error);
      //this.setState({ tops: reply });
      if(reply) {
        console.log(reply);
      }
    });
  }
  
  render () {
    
    //const tops = this.state.tops;
    console.log({start: this.state.start, end: this.state.end});
    
    const g = this.props.groupData;
    const w =this.props.widgetData;
    const b = this.props.batchData;
    const a = this.props.app;
    
    
    return(
      <div className='overscroll'>
        <div className='centre wide'>
          
          <ReportRequest 
            setFrom={(v)=>this.setState({start: v})}
            setTo={(v)=>this.setState({end: v})} />
          
          {/*  
          <GenerateReport
            doRefresh={(e)=>this.tops()} />
          */}
          
          <button 
            className='action clear'
            onClick={this.tops.bind(this)} 
          >Generate Report</button>
        
        </div>
        
      
        {/*<PopularWidget groupData={groupData} widgetData={widgetData} />*/}
        
        {/*
        <BestWorstBatch
          groupData={groupData}
          widgetData={widgetData} 
          app={app} />
        */}  
            
      </div>
    );
  }
}