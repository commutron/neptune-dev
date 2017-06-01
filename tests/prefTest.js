 let cache = new Cache()
 console.log(cache.time);

 setTimeout(function(){
   let cache = new Cache();
   console.log(cache.time);
 },4000);