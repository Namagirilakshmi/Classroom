import {inject} from "aurelia-framework";
import {AuthService} from "./AuthService";
import {CourseService} from "./CourseService";
import {PostService} from "./postservice";
import io from 'socket.io-client';
var socket = io('http://pc176111:9091');

@inject(AuthService,CourseService,PostService)
export class ClassRoom{
	constructor(authService,courseService,postService){
		this.posts = [];
		this.isAnnouce = true;
		this.showContainer = false;
		this.authService = authService;
		this.courseService = courseService;
		this.postService = postService;
		this.currentUser = this.authService.getCurrentUser();
		this.studentList = [];
		this.freeStudents = [];
		this.selectedStudents=[];
		this.isAllChecked = false;
		this.courseService.getSubjects({"userDet":{"name":this.currentUser.name, "email":this.currentUser.email},"role":this.currentUser.role})
		.then(data => {
			this.subjectList = data;
		});
		this.courseService.getStudentsList().then(data => {
			this.studentList = data;
		});
	}
	activate(params){
		this.courseService.getSubjectObject(params).then((data)=>{
			this.currentSubject = data;
			var studArr=[];
			for(var index in this.currentSubject.students){
				studArr.push(this.currentSubject.students[index].email);
			}
			for(var index in this.studentList){
				var mail = this.studentList[index].email;
				if (jQuery.inArray(mail, studArr)=='-1') {
					this.freeStudents.push(this.studentList[index]);
				}
			}
		});
		this.postService.getPosts(params).then((data)=>{
			this.posts=data;
			setTimeout(()=>$('.collapsible').collapsible(),500);
		});
		socket.on("newpost",(data)=>{this.addPost(data)});
		socket.on("newcomment",(data)=>{this.addCommentToPost(data.postid,data.comment)})
	}
	attached(){
		var _this = this;
		$('ul.tabs').tabs();
		$('.datepicker').pickadate(
            {
                selectMonths: true,
                selectYears: 50,
                closeOnSelect: false,
                today: '',
                clear: '',
                close: 'ok',
            	onOpen: function(){                                        
                            $('.datepicker').val("");
                        	_this.duedate=$('.datepicker').val();
                            if(parseInt(_this.duedate.length) >= 0){
                                $('.has-error.dob').hide();
                            }
                            else
                                $('.has-error.dob').show();
                        },
                onSet:function(){
                           	_this.duedate=$('.datepicker').val();
                           	if(_this.duedate.length>0){
                           	    this.close();
                           	}
                           	if(parseInt(_this.duedate.length) >= 0){
                           	    $('.has-error.dob').hide();
                           	}
                           	else
                           	    $('.has-error.dob').show();
                        }
            });
		setTimeout(()=>$('.collapsible').collapsible());
		Waves.displayEffect();			
		$('.modal-trigger').leanModal();
	}
	addPost(post){
		this.posts.splice(0,0,post);
	}
	addCommentToPost(postid,comment){
		for(let i=0;i<this.posts.length;i++){
			if(this.posts[i]._id == postid){
				this.posts[i].comments.push(comment);		
				return;
			}
		}
	}
	postAnnouncement(){
		let post = {
			"type":"annouce",
			"content":this.postContent,
			"by":{"name":this.currentUser.name,"email":this.currentUser.email},
			"in":this.currentSubject.subjectCode,
			"comments":[]
		}
		if(this.currentUser.role == "student"){
			post.type="userpost";
		}
		this.postService.postAnnouncement(post);
		this.postContent="";
		this.showContainer = false;
		setTimeout(()=>$('.collapsible').collapsible());
	}
	addComment(index,post){
		let commentDetail={
			"postid":post._id,
			"comment":{
				"content":post.userComment,
				"by":{"name":this.currentUser.name,"email":this.currentUser.email}
			}
		}
		post.userComment="";
		this.postService.addComment(commentDetail);
		setTimeout(()=>$('.collapsible').collapsible());
	}
	postAssignment(){
		let assignDetail = {
			"type":"assign",
			"title":this.title,
			"description":this.description,
			"duedate":this.duedate,
			"by":{"name":this.currentUser.name,"email":this.currentUser.email},
			"in":this.currentSubject.subjectCode,
			"comments":[]
		}
		this.postService.postAssignment(assignDetail)
	}
	checkAll() {
    	this.freeStudents.forEach(i => i.checked = this.isAllChecked);
    	this.selectedStudents = [];
		if(this.isAllChecked){
			for (var i = 0; i < this.freeStudents.length; i++) {
			this.selectedStudents.push(this.freeStudents[i]);
			}
		}		
  	}
  	clearingCheck(ele){
  		if(ele.checked==false){
  			this.selectedStudents.splice(this.selectedStudents.indexOf(ele),1);
  			this.isAllChecked=false;		
  		}
  		else{
  			this.selectedStudents.push(ele);
  		}
  		if(this.selectedStudents.length == this.freeStudents.length)
  			this.isAllChecked=true;
  	}
	addStudent(){		
		if(this.selectedStudents.length == 0 ){
			return;
		}
		let newStudents = [];		
		for (var i = 0; i < this.selectedStudents.length; i++) {
			let student = this.selectedStudents[i];
			newStudents.push({"name":student.name,"email":student.email});
		}
		for(let i=0;i<newStudents.length;i++){
			let student = newStudents[i];
			this.currentSubject.students.push(student);
			this.freeStudents.splice(this.freeStudents.indexOf(student),1);
		}
		$('#studentsList').closeModal();
		this.selectedStudents = [];
		this.courseService.joinSubject({"subjectCode":this.currentSubject.subjectCode,"user":newStudents})
		.then(()=>{
			$('.modal-trigger').leanModal();
		});
	}
	getDetail(studentDetail){
		this.studentDetail = studentDetail;
	}
	removeStudent(studentDetail){
		this.courseService.leaveSubject({"subjectCode":this.currentSubject.subjectCode,"userDet":{"name":studentDetail.name,"email":studentDetail.email}});
		this.currentSubject.students.splice(this.currentSubject.students.indexOf(studentDetail),1);
		this.freeStudents.push({"name":studentDetail.name,"email":studentDetail.email});
	}
}