import {HttpClient,json} from "aurelia-fetch-client";
import { RedirectToRoute } from 'aurelia-router';

export class AuthService{
	constructor(){
		this.loggedUser = undefined;
		this.exist = undefined;
	}
	run(navigationInstruction, next) {
		if(navigationInstruction.fragment == "/register" || navigationInstruction.fragment == "/"){
			if(this.isUserLogged()){
				return next.cancel(new RedirectToRoute('home'));
			}
			return next();
		}
		if(this.isUserLogged()){
			return next();
		}
		return next.cancel(new RedirectToRoute('login'));
	}
	login(userDetail){
		return new Promise((resolve,reject) =>{
			let httpClient = new HttpClient();
			httpClient.fetch('/validate', {
				method: "POST",
	         	body: json(userDetail)
	      	})
	      	.then(response => response.json())
	      	.then(data => {
	        	 if(data.logged == true){
	        	 	this.loggedUser = data;
	        	 	sessionStorage["userDetail"] = JSON.stringify(data);
	        	 }else{
	        	 	this.loggedUser = null;
	        	 }
	        	 resolve(data);
	      	});
      	});
	}
	isUserExist(userId){
		return new Promise((resolve,reject) =>{
			let httpClient = new HttpClient();
			httpClient.fetch('/checkUser', {
				method: "POST",
	         	body: json(userId)
	      	})
	      	.then(response => response.json())
	      	.then(data => {
	        	resolve(data);
	      	});
      	});
    }
	registerUser(registerDetail){
		let httpClient = new HttpClient();
		httpClient.fetch('/register', {
			method: "POST",
         	body: json(registerDetail)
      	});
	}
	getCurrentUser(){
		if(this.isUserLogged() == false){
			return null;
		}
		return {"email":this.loggedUser.email,"role":this.loggedUser.role,"name":this.loggedUser.name};
	}
	isUserLogged(){
		if(this.loggedUser == null){
			this.loggedUser = JSON.parse(sessionStorage["userDetail"] || null);
		}
		return (this.loggedUser != null);
	}
	logOut(){
		this.loggedUser = null;
		sessionStorage["userDetail"] = null;
	}
}