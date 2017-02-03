import {Validator,ValidationController,ValidationError,ValidationRules,validateTrigger} from 'aurelia-validation';
import {inject} from 'aurelia-framework';
import {ClassRoom} from "./classroom";


@inject(ValidationController,Validator,ClassRoom)
export class About{
	constructor(controller,validator,classroom){
		this.selectedFiles = [];
		this.classroom = classroom;		
		this.validationMessages;
		this.controller = controller;
		this.controller.validateTrigger = validateTrigger.change;
		this.validator = validator;
		this.currentUser = classroom.currentUser;	
		this.classroom.courseService.getSubjectObject(this.classroom.currentSubject)
		.then(data => {
			this.materials = data.studyMaterials;
			setTimeout(()=>{
				$('.materialboxed').materialbox();
				$('.collapsible').collapsible();
			});
		});	
	}
	attached(){
		Waves.displayEffect();	
		(function( func ) {
		    $.fn.addClass = function() { // replace the existing function on $.fn
		        func.apply( this, arguments ); // invoke the original function
		        this.trigger('classChanged'); // trigger the custom event
		        return this; // retain jQuery chainability
		    }
		})($.fn.addClass); // pass the original function as an argument

		(function( func ) {
		    $.fn.removeClass = function() {
		        func.apply( this, arguments );
		        this.trigger('classChanged');
		        return this;
		    }
		})($.fn.removeClass);	
		ValidationRules.customRule(
		  'fileCheck',
		  () => 
		    this.selectedFiles.length>0,
		  '${$displayName} is required'
		);
		ValidationRules     
			.ensure('fileHead').displayName('File Name').required()
			.ensure('fileName').displayName('File').satisfiesRule('fileCheck')
			.on(this);
		$('.materialboxed').materialbox();
		$('.collapsible').collapsible();
		$('.collapsible li').on('classChanged',function(){ 
			console.log(this);
		});
	}
	uploadFile(){
		this.controller.validate();
		let array = [];
		for( let i = 0 ; i<this.selectedFiles.length; i++){			
			array.push(this.selectedFiles.item(i).name);
		}
		this.classroom.courseService.uploadFiles(this.selectedFiles);
		this.classroom.courseService.updateMaterials({"courseId" : this.classroom.currentSubject,"newFile" : {"name" : this.fileHead,"files" : array,"desc" : this.description}});
		this.materials.push({"name" : this.fileHead,"files" : array,"desc" : this.description});
		document.getElementById('upload').reset();		
		$('.materialboxed').materialbox();				
	}

}