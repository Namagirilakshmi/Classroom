import {Validator,ValidationController,ValidationError,ValidationRules,validateTrigger} from 'aurelia-validation';
import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {AuthService} from "./AuthService";

@inject(Router,AuthService,ValidationController,Validator,Element)
export class Register{
	constructor(router,authService,controller,validator,element){
		this.router = router;
		this.authService = authService;
		this.controller=controller;
		this.validator=validator;
		this.controller.validateTrigger = validateTrigger.change;
		this.element = element;
	}
	attached(){
		Waves.displayEffect();
		ValidationRules.customRule(
		  'passwordMatch',
		  (value, obj, otherPropertyName) => 
		    value === obj[otherPropertyName],
		  '${$displayName} must match Password'
		);
		ValidationRules      
			.ensure('first_name').displayName('First Name').required().matches(/^[A-Za-z]{0,}$/).withMessage(`\${$displayName} should contain only alphabets.`).maxLength(20).withMessage(`\${$displayName} should not exceed 20 characters.`)
			.ensure('last_name').displayName('Last Name').required().matches(/^[A-Za-z]{0,}$/).withMessage(`\${$displayName} should contain only alphabets.`).maxLength(20).withMessage(`\${$displayName} should not exceed 20 characters.`)
  			.ensure('email').displayName('Email').required().email()
  			.ensure(a => a.password).displayName('Password').required().matches(/^(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).withMessage(`\${$displayName} should contain atleast one lower case letter, one upper case letter, one digit and one special character with minimum of 8 characters`)
			.ensure(a => a.confirm_password).displayName('Confirm Password').required().satisfiesRule('passwordMatch', 'password')
  			.ensure('dob').displayName('Date Of Birth').required()
  			.ensure('phone').displayName('Phone Number').required().matches(/^[\d]{10}$/).withMessage(`\${$displayName} is not a valid number`)
  			.ensure('gender').displayName('Gender').required()
  			.ensure('role').displayName('Role').required()
  			.ensure('terms').displayName('Terms').required()
			.on(this);			
			var _this=this;
      var year = (new Date).getFullYear();
      $('.datepicker').pickadate(
            {
              selectMonths: true,
              selectYears: 50,
              closeOnSelect: false,
              today: '',
              clear: '',
              close: 'ok',
              min: new Date(year-32,0,1),
            	max: new Date(year-16,11,31),
            	onOpen: function() {
                            $('.datepicker').val("");
                        	_this.dob=$('.datepicker').val();
                            if(parseInt(_this.dob.length) >= 0){
                                $('.has-error.dob').hide();
                            }
                            else
                                $('.has-error.dob').show();
                        },
              onSet:function(){
                           	_this.dob=$('.datepicker').val();
                           	if(_this.dob.length>0){
                           	    this.close();
                           	}
                           	if(parseInt(_this.dob.length) >= 0){
                           	    $('.has-error.dob').hide();
                           	}
                           	else
                           	    $('.has-error.dob').show();
                        }
            });
	}
	register(){
		this.controller.validate().then(()=>{
			if (this.validationMessages.length <= 0) {
				let registerDetail = {
					"name":this.first_name+" "+this.last_name,
					"email":this.email,
					"password":this.password,
					"dob":this.dob,
					"phoneNumber":this.phone,
					"gender":this.gender,
					"role":this.role
				}
        this.authService.isUserExist(registerDetail).then((result)=>{
          if(result.exist){
            this.email = "";
            alert(result.error);
            this.element.querySelector('input[type="email"]').focus();
          }
          else{
            this.authService.registerUser(registerDetail);
            this.router.navigateToRoute('login');
          }
        });
			}
		});
	}
	backToLogin(){		
		this.router.navigateToRoute('login');
	}
}