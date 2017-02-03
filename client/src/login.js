import {Validator,ValidationController,ValidationError,ValidationRules,validateTrigger} from 'aurelia-validation';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {AuthService} from "./AuthService";

@inject(Router,AuthService,ValidationController,Validator,Element)
export class App{
	constructor(router,authService,controller,validator,element){
		this.router = router;
		this.authService = authService;
		this.validationMessages;
		this.controller = controller;
		this.validator = validator;
		this.controller.validateTrigger = validateTrigger.change; 
		this.element = element;
	}
	attached(){
		Waves.displayEffect();
		ValidationRules      
			.ensure('email').displayName('email').required().email()
  			.ensure('password').displayName('Password').required()
			.on(this);
	}
	login(){
		this.controller.validate().then(()=>{
			if (this.validationMessages.length <= 0) {
				var userDetail = {
					"email":this.email,
					"password":this.password
				}
				this.authService.login(userDetail).then((data)=>{
					if(this.authService.isUserLogged()){
						Materialize.toast("logged in sucessfully",1000);
						this.router.navigateToRoute('home');
					}
					else{
						/*this.email = "";*/
						this.password = "";
						this.element.querySelector('input[type="password"]').focus();
						this.element.querySelector(".center.has-error").innerHTML = data.error;
					}
				});
			}	
		});
	}
}
