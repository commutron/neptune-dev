import moment from 'moment';
import 'moment-timezone';
import 'moment-business-time';
//// |||| DEV HELPER |||| \\\\
export default function GoodLocal() {
  const localTZ = moment.tz.guess();
  const nowYear = moment().year();
  
  const remDay = ('*-11-11').replace('*', nowYear );
  const remIS = moment( remDay ).isWorkingDay() ?
                  'Work Day' : 'HOLIDAY';
                  
  const xmasDay = ('*-12-25').replace('*', nowYear );
  const xmasIS = moment( xmasDay ).isWorkingDay() ?
                  'Work Day' : 'HOLIDAY';
    
  console.log(localTZ, `${remDay}: ${remIS}`, `${xmasDay}: ${xmasIS}`);
}