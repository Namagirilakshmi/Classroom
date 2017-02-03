import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AuthService} from "./AuthService";
import {CourseService} from "./CourseService";
import {Validator,ValidationController,ValidationError,ValidationRules,validateTrigger} from 'aurelia-validation';

@inject(Router,AuthService,CourseService,ValidationController,Validator)
export class Home{
	constructor(router,authService,courseService,controller,validator){
		this.router = router;
		this.authService = authService;
		this.currentUser = authService.getCurrentUser();
		this.courseService = courseService;
		this.subjectList = [];
		this.controller=controller;
		this.validator=validator;
		this.controller.validateTrigger = validateTrigger.change; 
		this.courseService.getSubjects({"userDet":{"name":this.currentUser.name, "email":this.currentUser.email},"role":this.currentUser.role})
		.then(data => {
			this.subjectList = data;
			setTimeout(()=>$(".dropdown-button").dropdown());
		});
	}
	attached(){
		ValidationRules
			.ensure('subjectName').displayName('Subject Name').required()
			.ensure('sectionName').displayName('Section Name').required()
			.ensure('subjectCode').displayName('Subject Code').required()
			.on(this);
		$('.modal-trigger').leanModal({
	    	starting_top: '10%',
	    	ending_top: '20%',
	    });
	    $('.dropdown-button').dropdown();
	}
	createSubject(){
		this.controller.validate().then(()=>{
			if (this.validationMessages.length <= 0) {
				let subjectDetail = {
					"subjectName":this.subjectName,
					"sectionName":this.sectionName,
					"handledBy":{"name":this.currentUser.name,"email":this.currentUser.email},
					"studyMaterials" : []
				}
				this.subjectName = "";
				this.sectionName = "";
				this.courseService.createSubject(subjectDetail).then(data=>this.subjectList.push(data));
				$('#modal1').closeModal();
			}				
		});	
		setTimeout(()=>$(".dropdown-button").dropdown());
	}
	closeDialog(){
		$('#modal1').closeModal();	
	}
	joinSubject(){
		this.controller.validate().then(()=>{
			if (this.validationMessages.length <= 0) {
				let subjectDetail = {
					"subjectCode":this.subjectCode,
					"user":{"name":this.currentUser.name,"email":this.currentUser.email}
				}
				this.subjectCode = "";
				this.courseService.joinSubject(subjectDetail).then(data=>this.subjectList.push(data));
				$('#modal1').closeModal();	
			}
		});
		setTimeout(()=>$(".dropdown-button").dropdown());
	}
	deleteSubject(subject){
		this.courseService.deleteSubject(subject);
		this.subjectList.splice(this.subjectList.indexOf(subject),1);
	}
	leaveSubject(subject){
		this.courseService.leaveSubject({"subjectCode":subject.subjectCode,"userDet":{"name":this.currentUser.name,"email":this.currentUser.email}});
		this.subjectList.splice(this.subjectList.indexOf(subject),1);
	}
	
}