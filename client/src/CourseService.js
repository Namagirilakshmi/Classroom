import {inject} from "aurelia-framework";
import {HttpClient,json} from "aurelia-fetch-client";

export class CourseService{
	constructor(){
		
	}
	createSubject(subjectDetail){
		return new Promise((resolve,reject) => {
			subjectDetail.subjectCode = Math.random().toString(36).substr(2, 5);
			subjectDetail.students = [];
			let httpClient = new HttpClient();
			httpClient.fetch('/createSubject', {
				method: "POST",
	         	body: json(subjectDetail)
	      	});
	      	resolve(subjectDetail);
		});
	}
	getSubjects(user){
		return new Promise((resolve,reject)=>{
			let fetchQuery = {};
			if(user.role == "teacher"){
				fetchQuery = {"handledBy":user.userDet};
			}
			else{
				fetchQuery = {"students":user.userDet};
			}
			let httpClient = new HttpClient();
			httpClient.fetch('/getSubjects', {
				method: "POST",
		       	body: json(fetchQuery)
		    })
		    .then(response => response.json())
		    .then(data => {
		   	 	resolve(data);
		    });	
		})		
	}
	joinSubject(subjectDetail){
		return new Promise((resolve,reject)=>{
			let httpClient = new HttpClient();
			httpClient.fetch("/joinSubject",{
				method:"POST",
				body:json(subjectDetail)
			})
			.then(response => response.json())
			.then(data => resolve(data));	
		});	
	}
	deleteSubject(subject){
		let httpClient = new HttpClient();
		httpClient.fetch("/delSubject",{
			method:"POST",
			body:json({"subjectCode":subject.subjectCode})
		});
	}
	leaveSubject(detail){
		let httpClient = new HttpClient();
		httpClient.fetch("/leaveSubject",{
			method:"POST",
			body:json(detail)
		});	
	}
	getSubjectObject(subject){
		return new Promise((resolve,reject)=>{
			let httpClient = new HttpClient();
			httpClient.fetch("/getSubject?subjectCode="+subject.subjectCode)
			.then(response => response.json())
			.then(data => resolve(data));
		});
	}
	getStudentsList(){
		return new Promise((resolve,reject)=>{
			let httpClient = new HttpClient();
			httpClient.fetch("/getStudents")
			.then(response => response.json())
			.then(data => resolve(data));
		});
	}
	uploadFiles(selectedFiles){
		let form = new FormData();
		for (var i = 0; i < selectedFiles.length; i++) {
			form.append('file'+i,selectedFiles[i]);				
		}
		let httpClient = new HttpClient();
		httpClient.fetch('/fileUpload', {
			method: "POST",
		    body: form
	    });
	}
	updateMaterials(studyDetails){
		return new Promise((resolve,reject) => {
			let httpClient = new HttpClient();
			httpClient.fetch('/updateMaterials', {
				method: "POST",
	         	body: json(studyDetails)
	      	});
	      	resolve(studyDetails);
		});
	}
}