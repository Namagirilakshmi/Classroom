import {inject} from "aurelia-framework";
import {HttpClient,json} from "aurelia-fetch-client";

export class PostService{
	postAnnouncement(post){
		return new Promise((resolve,reject)=>{
			let httpClient = new HttpClient();
			httpClient.fetch("/newpost",{
				method:"POST",
				body:json(post)
			})
			.then(response => response.json())
			.then(data => resolve(data));
		})
	}
	getPosts(subject){
		return new Promise((resolve,reject)=>{
			let httpClient = new HttpClient();
			httpClient.fetch("/getPosts?subjectCode="+subject.subjectCode)
			.then(response => response.json())
			.then(data => resolve(data));
		});
	}
	addComment(commentDetail){
		console.log("service");
		let httpClient = new HttpClient();
		httpClient.fetch("/addComment",{
			method:"POST",
			body:json(commentDetail)
		});
	}
	postAssignment(assignDetail){
		return new Promise((resolve,reject)=>{
			let httpClient = new HttpClient();
			httpClient.fetch("/newpost",{
				method:"POST",
				body:json(assignDetail)
			})
			.then(response => response.json())
			.then(data => resolve(data));
		})
	}
	getAssignment(assignDetail){
		return new Promise((resolve,reject)=>{
			let httpClient = new HttpClient();
			httpClient.fetch("/getAssignment",{
				method:"POST",
				body:json(assignDetail)
			})
			.then(response => response.json())
			.then(data => {resolve(data);});
		});		
	}
	addCommentToAssignment(commentDetail){
		return new Promise((resolve,reject)=>{
			let httpClient = new HttpClient();
			httpClient.fetch("/addCommentToAssign",{
				method:"POST",
				body:json(commentDetail)
			})
			.then(response => response.json())
			.then(data => resolve(data)); 
		});	
	}
}