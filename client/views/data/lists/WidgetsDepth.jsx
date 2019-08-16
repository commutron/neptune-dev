import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import DumbFilter from '/client/components/tinyUi/DumbFilter.jsx';
import LeapRow from '/client/components/tinyUi/LeapRow.jsx';
import NumStat from '/client/components/uUi/NumStat.jsx';

export default class WidgetsDepth extends Component	{
  
  constructor() {
    super();
    this.state = {
      textString: ''
    };
  }
  
  setTextFilter(rule) {
    this.setState({ textString: rule.toLowerCase() });
  }
  
  render() {

    const active = this.props.active;
    const w = this.props.widgetData
                .sort((w1, w2)=> {
                  if (w1.widget < w2.widget) { return -1 }
                  if (w1.widget > w2.widget) { return 1 }
                  return 0;
                });
    //const g = this.props.groupAlias;
    
    let showList = w.filter( 
      tx => tx.widget.toLowerCase().includes(this.state.textString) === true ||
            tx.describe.toLowerCase().includes(this.state.textString) === true);

    return (
      <AnimateWrap type='cardTrans'>
        <div className='' key={1}>
          <DumbFilter
            size='big'
            onTxtChange={e => this.setTextFilter(e)}
            labelText='Filter searches id and description, not case-sensitve.' />
          <div className='tableList'>
            {w.length < 1 ? <p>no {Pref.widget}s created</p> : null}
              { showList.map( (entry, index)=> {
              let ac = active.includes(entry._id) ? 'activeMark' : '';
                return(
                  <WidgetIndexCard key={index} data={entry} barStyle={ac} />
              )})}
            </div>
        </div>
      </AnimateWrap>
    ); 
  }
}

class WidgetIndexCard extends Component {
  
  constructor() {
    super();
    this.state = {
      moreData: false
    };
  }
  
  totalI(mData) {
    let items = Array.from(mData.batchInfo, x => x.items);
    let quantities = Array.from(mData.batchInfoX, x => x.quantity);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    let totalX = quantities.length > 0 ? quantities.reduce((x,y)=>x+y) : 0;
    return total + totalX;
  }
  
  avgTime(mData) {
    let elapsed = [];
    for(let md of mData.batchInfo) {
      let t = md.finish !== false && moment(md.finish).diff(moment(md.start), 'day');
      t !== false && t > 0 ? elapsed.push(t) : null;
    }
    for(let md of mData.batchInfoX) {
      let t = md.complete !== false && moment(md.complete).diff(moment(md.start), 'day');
      t !== false && t > 0 ? elapsed.push(t) : null;
    }
    let avgElapse = elapsed.length > 0 ?
      elapsed.reduce((x,y)=>x+y) / elapsed.length : 0;
    return avgElapse;
  }
  
  avgNC(mData) {
    let items = Array.from(mData.batchInfo, x => x.items);
    let quantities = Array.from(mData.batchInfoX, x => x.quantity);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    let totalX = quantities.length > 0 ? quantities.reduce((x,y)=>x+y) : 0;
    
    let ncs = Array.from(mData.batchInfo, x => x.nonCons);
    let ncsX = Array.from(mData.batchInfoX, x => x.nonCons);
    
    let allNCs = ncs.length > 0 ? ncs.reduce((x,y)=>x+y) : 0;
    let allNCsX = ncsX.length > 0 ? ncsX.reduce((x,y)=>x+y) : 0;
    
    let perI = (allNCs / ( total > 0 ? total : 1));
    let perIX = (allNCsX / ( totalX > 0 ? totalX : 1) );
    const perItem = ( perI + perIX ).toFixed(1);
    
    let perW = (allNCs / (ncs.length > 0 ? ncs.length : 1) );
    let perWX = (allNCsX / (ncsX.length > 0 ? ncsX.length : 1) );
    const perWOrder = ( perW + perWX ).toFixed(1);
    
    return { perItem, perWOrder };
  }
  
  render() {
    
    const data = this.props.data;
    const mData = this.state.moreData;
    
    if(!mData) {
      return(
        <CalcSpin />
      );
    }
    
    let totalItems = this.totalI(mData);
    
    let avgTime = this.avgTime(mData);
    let avgDur = avgTime > 0 ?
      moment.duration(avgTime, "days").humanize() : 'n/a';
   
   let avgNCs = this.avgNC(mData);
      
    return(
      <LeapRow
        title={data.widget.toUpperCase()}
        cTwo={data.describe}
        cThree={
          <NumStat
            num={totalItems}
            name={'total ' + Pref.item + 's'}
            title={'serialized items of all ' + Pref.batch + 'es'}
            color='blueT'
            size='big' />
        }
        cFour={
          <NumStat
            num={isNaN(avgNCs.perItem) ? 'n/a' : avgNCs.perItem}
            name={'nonCons per ' + Pref.item}
            title={'mean average of all ' + Pref.batch + 'es'}
            color='redT'
            size='big' />
        }
        cFive={
          <NumStat
            num={isNaN(avgNCs.perWOrder) === true ? 'n/a' : avgNCs.perWOrder}
            name={'nonCons per ' + Pref.batch}
            title={'mean average of all ' + Pref.batch + 'es'}
            color='redT'
            size='big' />
        }
        cSix={
          <NumStat
            num={avgDur}
            name={'per ' + Pref.batch}
            title={'mean average of all ' + Pref.batch + 'es'}
            color='greenT'
            size='big' />
        }
        sty={this.props.barStyle}
        address={'/data/widget?request=' + data.widget}
      />
      );
      /*
      <div className='wrapDeckCard indexCard'>
        <LeapButton
          title={data.widget}
          sub={data.describe}
          sty={this.props.barStyle}
          address={'/data/widget?request=' + data.widget}
        />
        <div className='wellSpacedLine balance'>
          <NumStat
            num={totalItems}
            name={'total ' + Pref.item + 's'}
            title={'serialized items of all ' + Pref.batch + 'es'}
            color='blueT'
            size='big' />
          <NumStat
            num={isNaN(avgNCs.perItem) ? 'n/a' : avgNCs.perItem}
            name={'nonCons per ' + Pref.item}
            title={'mean average of all ' + Pref.batch + 'es'}
            color='redT'
            size='big' />
          <NumStat
            num={isNaN(avgNCs.perWOrder) === true ? 'n/a' : avgNCs.perWOrder}
            name={'nonCons per ' + Pref.batch}
            title={'mean average of all ' + Pref.batch + 'es'}
            color='redT'
            size='big' />
          <NumStat
            num={avgDur}
            name={'per ' + Pref.batch}
            title={'mean average of all ' + Pref.batch + 'es'}
            color='greenT'
            size='big' />
        </div>
      </div>
      */
    
  }
  componentDidMount() {
    Meteor.call('widgetTops', this.props.data._id, (err, reply)=>{
      err && console.log(err);
      !reply ? null : this.setState({ moreData : reply });
    });
  }
}