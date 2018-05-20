import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import WidgetSort from '/client/components/bigUi/WidgetSort.jsx';
import NumStat from '/client/components/uUi/NumStat.jsx';

export default class WidgetsDepth extends Component	{
  
  constructor() {
    super();
    this.state = {
      filter: false,
      textString: ''
    };
  }
  
  setFilter(rule) {
    this.setState({ filter: rule });
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
    const f = this.state.filter;
    
    let basicFilter = 
      f === 'done' ?
      w.filter( x => active.includes(x._id) === false ) :
      f === 'inproc' ?
      w.filter( x => active.includes(x._id) !== false ) :
      w;
    let showList = basicFilter.filter( 
      tx => tx.widget.toLowerCase().includes(this.state.textString) === true ||
            tx.describe.toLowerCase().includes(this.state.textString) === true);

    return (
      <AnimateWrap type='cardTrans'>
        <div className='' key={1}>
          <WidgetSort
            onChange={e => this.setFilter(e)}
            onTxtChange={e => this.setTextFilter(e)} />
          <div className='wrapDeck'>
            {w.length < 1 ? <p>no {Pref.widget}s created</p> : null}
              { showList.map( (entry, index)=> {
              let ac = active.includes(entry._id) ? 'leapBar activeMark' : 'leapBar';
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
    let items = Array.from(mData, x => x.items);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    return total;
  }
  
  avgTime(mData) {
    let elapsed = [];
    for(let md of mData) {
      let t = md.finish !== false && moment(md.finish).diff(moment(md.start), 'day');
      t !== false && t > 0 ? elapsed.push(t) : null;
    }
    let avgElapse = elapsed.length > 0 ?
      elapsed.reduce((x,y)=>x+y) / elapsed.length : 0;
    return avgElapse;
  }
  
  avgNC(mData) {
    let items = Array.from(mData, x => x.items);
    let total = items.length > 0 ? items.reduce((x,y)=>x+y) : 0;
    let ncs = Array.from(mData, x => x.nonCons);
    let allNCs = ncs.length > 0 ? ncs.reduce((x,y)=>x+y) : 0;
    let perI = (allNCs / total).toFixed(1);
    let perW = (allNCs / ncs.length).toFixed(1);
    return { perI, perW };
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
            num={isNaN(avgNCs.perI) ? 'n/a' : avgNCs.perI}
            name={'nonCons per ' + Pref.item}
            title={'mean average of all ' + Pref.batch + 'es'}
            color='redT'
            size='big' />
          <NumStat
            num={isNaN(avgNCs.perW) === true ? 'n/a' : avgNCs.perW}
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
    );
  }
  componentDidMount() {
    Meteor.call('widgetTops', this.props.data._id, (err, reply)=>{
      if(err)
        console.log(err);
      !reply ? null : this.setState({ moreData : reply });
    });
  }
}