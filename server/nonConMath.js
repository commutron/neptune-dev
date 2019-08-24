/*


// how many nonCons
    const nonConTotal = temp === 'cool' ? 0 : 
      rNC.length;
// how many are unresolved 
    const nonConLeft = rNC.filter( x => 
      x.inspect === false && ( x.skip === false || x.snooze === true )
    ).length;
        
// how many items have nonCons
    const hasNonCon = temp === 'cool' ? 0 :
      [... new Set( Array.from(rNC, x => { return x.serial }) ) ].length;

// what percent of items have nonCons
    const percentOfNCitems = temp === 'cool' ? 0 :
      ((hasNonCon / itemQuantity) * 100 ).toFixed(0);
      
// mean number of nonCons on items that have nonCons
    const nonConsPerNCitem = temp === 'cool' ? 0 :
      (nonConTotal / hasNonCon).toFixed(1);
      

  let ncTypeCounts = [];
    for(let ncType of aNCOps) {
      let typNum = 0;
      for(let t of batchesNC) {
        let nw = t.nonCon.filter(
                  x => x.type === ncType &&
                    moment(x.time)
                      .isBetween(sRange, eRange) );
        typNum += nw.length;
      }
      ncTypeCounts.push({meta: ncType, value: typNum});
    }


      
*/