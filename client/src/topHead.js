import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from "./AuthService";

@inject(Router,AuthService)
export class TopHead{
	constructor(router,authService){
		this.router = router;
		this.authService = authService;
		this.currentUser = authService.getCurrentUser();
	}
	logOut(){
		this.authService.logOut();
		this.router.navigateToRoute('login');
	}
	isHome() {    
    	return this.router.history.fragment == '/home';
	}
	attached(){
		$('.dropdown-button').dropdown();		
		$('.button-collapse').sideNav({
        	closeOnClick: true
    	});
	}
}