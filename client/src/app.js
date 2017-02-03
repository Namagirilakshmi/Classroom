import {Router, RouterConfiguration} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {AuthService} from "./AuthService";

@inject(AuthService)
export class App{
	router: Router;
  constructor(authService){
    this.authService = authService;
  }
  configureRouter(config: RouterConfiguration, router: Router){
    config.title = 'Classroom';
    config.addPipelineStep('authorize', this.authService);
    config.map([
      { route: '', moduleId: './login', name:"login",  title: 'Login'},
      { route: '/home',  moduleId: './home', name:'home' , title:"Home" },
      { route: '/classroom/:subjectCode',  moduleId: './classroom', name:'classroom' , title:"Classroom" },
      { route: '/assignment/:assignmentId',  moduleId: './assignment', name:'assignment' , title:"Assignment" },
      { route: '/register',  moduleId: './register', name:'register',title:"Register" }
    ]);
    this.router = router;
  }
}