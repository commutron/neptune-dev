import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';
import BinaryStat from '/client/components/uUi/BinaryStat.jsx';
import WatchButton from '/client/components/bigUi/WatchModule/WatchModule.jsx';

const BatchDetails = ({hBs, lBs, cBs, bCache, user, app})=> {
  
  /*
  let headers = wBs && wBs.length > 0 ? Object.keys(wBs[0]) :
                cBs && cBs.length > 0 ? Object.keys(cBs[0]) :
                [];
  headers.length > 0 && headers.shift();
  console.log(headers);
  */
  
  return(
    <div className='overGridScroll' tabIndex='1'>
      
      <div className='overGridRowScrollHeader'></div>
      
      {!hBs ? null :
        hBs.map( (entry, index)=>{
          return(
            <BatchDetailChunk
              key={`${entry.batchID}hot${index}`}
              ck={entry}
              warm={true}
              user={user}
              app={app} />
      )})}
      
      <div className='overGridRowScrollHeader'></div>
      
      {!lBs ? null :
        lBs.map( (entry, index)=>{
          return(
            <BatchDetailChunk
              key={`${entry.batchID}luke${index}`}
              ck={entry}
              warm={true}
              user={user}
              app={app} />
      )})}
      
      <div className='overGridRowScrollHeader'></div>
      
      {!cBs ? null :
        cBs.map( (entry, index)=>{
          return(
            <BatchDetailChunk 
              key={`${entry.batchID}cool${index}`}
              ck={entry}
              warm={false}
              user={user}
              app={app} />
      )})}
      
    </div>
  
  );
};

export default BatchDetails;


const BatchDetailChunk = ({ck, warm, user, app})=> (

  <div className='overGridRowScroll'>
    {Roles.userIsInRole(Meteor.userId(), 'debug') && 
      <div><b>{ck.batch}</b></div> }
    <div><i>SO: {ck.salesOrder}</i></div>
    <div><i>Created {ck.timeElapse} ago</i></div>
    <div><i>Due {ck.salesEnd}</i></div>
    <div>
      <NumStat
        num={
          ck.weekDaysRemain < 0 ? 
            ck.weekDaysRemain * -1 :
            ck.weekDaysRemain
        }
        name={
          ck.weekDaysRemain < 0 ? 
            ck.weekDaysRemain === -1 ?
              'Weekday Overdue' :
              'Weekdays Overdue' : 
                ck.weekDaysRemain === 1 ?
                  'Weekday Remaining' :
                  'Weekdays Remaining'}
        title=''
        color={ck.weekDaysRemain < 0 ? 'yellowT' : 'blueT'}
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.itemQuantity}
        name='Total Boards'
        title=''
        color='blueT'
        size='big' />
    </div>
    <div>
      <BinaryStat
        good={ck.riverChosen}
        name='Flow Assigned'
        title='A Process Flow has been assigned'
        size='big' />
    </div>
    {Roles.userIsInRole(Meteor.userId(), 'nightly') &&
      <PhaseProgress
        batchID={ck.batchID}
        warm={warm}
        app={app} />}
    {!Roles.userIsInRole(Meteor.userId(), 'nightly') ||
      Roles.userIsInRole(Meteor.userId(), 'debug') &&
      <div>
        <NumStat
          num={ck.percentOfDoneItems}
          name='Complete'
          title=''
          color='greenT'
          size='big' />
      </div>}
    <div>
      <NumStat
        num={ck.nonConTotal}
        name='Total Noncons'
        title=''
        color='redT'
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.percentOfNCitems}
        name='of Items have noncons'
        title=''
        color='redT'
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.nonConsPerNCitem}
        name='Mean Noncons Per Item'
        title='mean average'
        color='redT'
        size='big' />
    </div>
    <div>
      <NumStat
        num={ck.itemHasRMA}
        name='RMA Boards'
        title=''
        color='redT'
        size='big' />
      </div>
    <div>
      <NumStat
        num={ck.itemIsScrap}
        name='Scrap Boards'
        title=''
        color='redT'
        size='big' />
    </div>
    <div>
      <WatchButton 
        list={user.watchlist}
        type='batch'
        keyword={ck.batch}
        unique={`watch=${ck.batch}`}
        iconOnly={true} />
    </div>
  </div>
);

class PhaseProgress extends React.PureComponent {
  
  constructor() {
    super();
    this.state = {
      progData: false
    };
  }
  
  componentDidMount() {
    Meteor.call('phaseProgress', this.props.batchID, (error, reply)=>{
      error && console.log(error);
      this.setState({ progData: reply });
    });
  }
  
  render() {
    
    const app = this.props.app;
    const dt = this.state.progData;
    
    Roles.userIsInRole(Meteor.userId(), 'debug') &&
      console.log(this.state.progData);
    
    if(!this.props.warm || !dt) {
      return(
        <React.Fragment>
          {app.phases.map( (phase, index)=>{
            return(
              <div key={this.props.bID + phase + index + 'z'}>
                <i className='fade small'>{phase}</i>
              </div>
          )})}
        </React.Fragment>
      );
    }
    
    if(dt.batchID === this.props.batchID) {
      return(
        <React.Fragment>
          {dt.phaseSets.map( (phase, index)=>{
            if(phase.steps.length === 0) {
              return(
                <div key={this.props.bID + phase + index + 'x'}>
                 <i className='fade small'>{phase.phase}</i>
                </div>
              );
            }else{
              const calNum = ( 
                phase.count / (dt.totalItems * phase.steps.length) 
                  * 100 ).toFixed(0);
              let fadeTick = calNum == 0 ? '0' :
                   calNum < 10 ? '5' :
                   calNum < 20 ? '10' :
                   calNum < 30 ? '20' :
                   calNum < 40 ? '30' :
                   calNum < 50 ? '40' :
                   calNum < 60 ? '50' :
                   calNum < 70 ? '60' :
                   calNum < 80 ? '70' :
                   calNum < 90 ? '80' :
                   calNum < 100 ? '90' :
                   '100';
              let niceName = phase.phase === 'finish' ?
                              Pref.isDone : phase.phase;
              return(
                <div 
                  key={this.props.bID + phase + index + 'g'} 
                  className={'fillRight' + fadeTick}>
                  <NumStat
                    num={ calNum + '%' }
                    name={niceName}
                    title=''
                    color='whiteT'
                    size='big' />
              </div>
          )}})}
        </React.Fragment>
      );
    }
      
    return(
      <React.Fragment>
        {app.phases.map( (phase, index)=>{
          return(
            <div key={app._id + phase + index + 'ng'}></div>
        )})}
      </React.Fragment>
    );
  }
}