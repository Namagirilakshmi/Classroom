export function configure(aurelia){
	 aurelia.use
    .standardConfiguration().plugin("aurelia-materialize-css").plugin('aurelia-validation');
	aurelia.start().then(() => aurelia.setRoot());
}

