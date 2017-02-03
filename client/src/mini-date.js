import moment from './moment';

export class MiniDateValueConverter {
  toView(value) {
  	let date = new Date(value);
  	let diff=moment(date).diff(moment("00:00:00","HH:mm:ss"),"days");
  	console.log(diff);
  	if(diff == 0){
  		return "Today";
  	}
  	else if(diff == 1){
  		return "Tomorrow";
  	}
    return moment(date).format('DD, MMM');
  }
}