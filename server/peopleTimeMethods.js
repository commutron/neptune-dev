import moment from 'moment';
//import timezone from 'moment-timezone';
//import business from 'moment-business';

Meteor.methods({
  
  phaseBestGuess(uID, batchNum, tideStart, tideStop, clientTZ, accessKey) {
    const privateKey = accessKey || Meteor.user().orgKey;
    const tStop = tideStop ? tideStop : new Date();
    const batch = BatchDB.findOne({ orgKey: privateKey, batch: batchNum });
    const app = AppDB.findOne({ orgKey: privateKey});
    const phaseDB = [...app.trackOption, app.lastTrack];
      
      
    function deriveHistory(historyObjs) {
      const historyFlat = [].concat(...historyObjs);
      
      const foundKeys = _.pluck(historyFlat, 'key');
      const uniqKeys = _.uniq(foundKeys);
      
      const key2phase = (key)=> {
        const obj = phaseDB.find( x => x.key === key );
        return obj ? obj.phase : null;
      };
      const uniqPhases = _.uniq( Array.from(uniqKeys, x => key2phase(x) ) );
      const cleanResult = uniqPhases.length > 0 ? uniqPhases : false;
      
      return cleanResult;
    }
    
    function deriveNC(ncObjs) {
      const ncFlat = [].concat(...ncObjs);

      const foundWhere = _.pluck(ncFlat, 'where');
      const uniqWhere = _.uniq(foundWhere);
      
      const cleanResult = uniqWhere.length > 0 ? uniqWhere : false;
      
      return cleanResult;
    }
      

    const itemHistoryS = Array.from( batch.items, 
                          x => x.history.filter( y =>
                            y.time > tideStart && 
                            y.time < tStop &&
                            y.who === uID ) );
    const phaseFromStep = deriveHistory(itemHistoryS);
    
    if(phaseFromStep) {
      return [ 'fromStep', phaseFromStep ];
    }else{
      
      const itemHistoryFn = Array.from( batch.items,
                            x => x.history.filter( y =>
                              y.time > tideStart && 
                              y.time < tStop &&
                              y.type === 'first' && 
                              y.info.builder.includes(uID) ) );
      const phaseFromFirstN = deriveHistory(itemHistoryFn);
      
      if(phaseFromFirstN) {
        return [ 'fromNowFirst', phaseFromFirstN ];
      }else{
        
        const inBncN = batch.nonCon.filter( x =>
          x.time > tideStart && x.time < tStop && x.who === uID );
        const inBncF = batch.nonCon.filter( x =>
          x.fix !== false && x.fix.time > tideStart && x.fix.time < tStop && x.fix.who === uID );
        const inBncI = batch.nonCon.filter( x =>
          x.inspect !== false && x.inspect.time > tideStart && x.inspect.time < tStop && x.inspect.who === uID );
        const anyNC = [...inBncN,...inBncF,...inBncI ] ;
        const phasefromNC = deriveNC(anyNC);
        
        if(phasefromNC) {
          return [ 'fromNC', phasefromNC ];
        }else{
          
          const itemHistorySh = Array.from( batch.items, 
                        x => x.history.filter( y =>
                          moment(y.time).tz(clientTZ)
                            .isSame(moment(tStop).tz(clientTZ), 'hour') && 
                          y.who === uID ) );
          const phaseFromHourStep = deriveHistory(itemHistorySh);
          
          if(phaseFromHourStep) {
            return [ 'fromHourStep', phaseFromHourStep ];
          }else{
            
            const itemHistoryFd = Array.from( batch.items,
                                x => x.history.filter( y =>
                                  y.type === 'first' && 
                                  moment(y.time).tz(clientTZ)
                                    .isSame(moment(tideStart).tz(clientTZ), 'day') &&
                                  y.info.builder.includes(uID) ) );
            const phaseFromFirstD = deriveHistory(itemHistoryFd);
            
            if(phaseFromFirstD) {
              return [ 'fromDayFirst', phaseFromFirstD ];
            }else{
                
              const cCache = CacheDB.findOne({dataName: 'phaseCondition'});
              const cB = cCache && cCache.dataSet.find( x => x.batch === batchNum );
              const openPhases = cB && cB.phaseSets.filter( x => x.condition === 'open' );
              
              if( !tideStop && openPhases && openPhases.length === 1 ) {
                return [ 'fromOnlyOpen', [openPhases[0].phase] ];
              }else{
                
                const docW = WidgetDB.findOne({_id: batch.widgetId});
                const flow = docW.flows.find( x => x.flowKey === batch.river );
                const riverFlow = flow ? flow.flow : [];
        
                let riverFirsts = riverFlow.filter( x => x.type !== 'first' );
                let nextFirstPhase = false;
                for(let first of riverFirsts) {
                  const ffound = batch.items.find( x => 
                                  x.history.find( y =>
                                    y.key === first.key &&
                                    y.time < tideStart ) );
                  if(!ffound) {
                    nextFirstPhase = first.phase;
                    break;
                  }
                }
                
                if(nextFirstPhase) {
                  return [ 'fromNextFirst', [`${nextFirstPhase} prep`] ];
                }else{
  
                  return false;
                }
              }
            }
          }
        }
      }
    }
  },
  
  
  assemblePhaseTime(batchID, clientTZ) {
    const accessKey = Meteor.user().orgKey;
    const batch = BatchDB.findOne({_id: batchID, orgKey: accessKey});
    if( batch && Array.isArray(batch.tide) ) {  
      const slim = batch.tide.map( x => {
        const dt = Meteor.call('phaseBestGuess', x.who, batch.batch, x.startTime, x.stopTime, clientTZ, accessKey);
        const mStart = moment(x.startTime);
        const mStop = !x.stopTime ? moment() : moment(x.stopTime);
        const dur = moment.duration(mStop.diff(mStart)).asMinutes();
        return {
          phaseGuess: dt,
          duration: dur
        };
      });
      return slim;
    }else{
      return false;
    }
  },
  
  /// Given history flat -> outputs step keys with quantity of each ///
  /*
    const stepsArr = Array.from(historyFlat, st => st.key );
      
    const stepsReduced = stepsArr.reduce( (allSteps, step)=> { 
      step in allSteps ? allSteps[step]++ : allSteps[step] = 1;
      return allSteps;
    }, {});
  
    const stepQu = Object.entries(stepsReduced)
      .reduce( (result, val)=> {
        result.push( { ph: val[0], qu: val[1] } );
        return result;
      }, []);
      
    console.log(stepQu);
  */
  ///////////////////////////////////////////////////////////////
  
});