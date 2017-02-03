import {inject} from "aurelia-framework";
import {PostService} from "./postservice";
import {AuthService} from "./AuthService";
@inject(AuthService,PostService)
export class Assignment{
	constructor(authService,postservice){
		this.authService = authService;
		this.postService = postservice;
		this.currentUser = this.authService.getCurrentUser();
	}
	activate(params){
		let assignRetrieveDet ={
			"assignmentId":params.assignmentId,
			"user":{"name":this.currentUser.name,"email":this.currentUser.email}
		}
		this.postService.getAssignment(assignRetrieveDet).then((data)=>{this.currentAssignment=data;});
	}
	attached(){
		$('ul.tabs').tabs();
	}
	addComment(){
		let commentDetail = {
			"assignmentId":this.currentAssignment._id,
			"comment":{
				"content":this.userComment,
				"by":{"name":this.currentUser.name,"email":this.currentUser.email}
			}
		}
		this.postService.addCommentToAssignment(commentDetail);
	}
}