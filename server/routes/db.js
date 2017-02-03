var mongoose = require( 'mongodb' );
var ObjectId = require('mongodb').ObjectID;
var db;
mongoose.connect('mongodb://localhost:27017/classroom', function(err, database){
	if(err){
		console.log(err);
		return;
	}
	console.log("connect");
	db=database;
});
function Database(){}
/*for user login*/
Database.prototype.validateUser = function(userDetail , cb){
	db.collection("user").findOne(userDetail,function(err,result){
		if(result === null){

			cb({"logged":false,"error":"Invalid Username/Password"});
		}
		else{
			
			cb({"logged":true,"error":null,"email":result.email,"role":result.role,"name":result.name});
		}
	});
}
Database.prototype.checkUser = function(userDetail , cb){
	db.collection("user").findOne({"email":userDetail.email},function(err,result){
		if(result === null){
			cb({"error":null,"exist":false});
		}
		else{
			cb({"error":"user alreasy exists","exist":true});
		}
	});
}
Database.prototype.registerUser = function(registerDetail,cb){
	db.collection("user").insert(registerDetail);
}
/*subject related*/
Database.prototype.createSubject = function(subjectDetail,cb){
	db.collection("courses").insert(subjectDetail);
}
Database.prototype.getSubjects = function(user,cb){
	db.collection("courses").find(user).toArray(function(err,result){
		cb(result);
	})
}
Database.prototype.joinSubject = function(subjectDetail,cb){
	db.collection("courses").update({"subjectCode":subjectDetail.subjectCode},{"$push":{"students":{"$each":subjectDetail.user}}});
	db.collection("courses").findOne({"subjectCode":subjectDetail.subjectCode},function(err,result){
			cb(result);		
		});
}
Database.prototype.updateMaterials = function(studyDetail,cb){
	db.collection("courses").update({"subjectCode":studyDetail.courseId.subjectCode},{"$push":{"studyMaterials":studyDetail.newFile}},function(err,result){
		cb(result);
	});
}
Database.prototype.deleteSubject = function(subjectDetail,cb){
	db.collection("courses").remove(subjectDetail);
}
Database.prototype.leaveSubject = function(detail,cb){
	db.collection("courses").update({"subjectCode":detail.subjectCode},{"$pull":{"students":detail.userDet}});
}
Database.prototype.getSubject = function(subjectCode,cb){
	db.collection("courses").findOne({"subjectCode":subjectCode},function(err,result){
		cb(result);
	});
}
/*student details*/
Database.prototype.getStudents = function(user,cb){
	db.collection("user").find({"role":"student"},{"name":1,"email":1,"_id":0}).toArray(function(err,result){
		cb(result);
	})
}
/*post related*/
Database.prototype.createPost = function(post,cb){
	if(post.type == "assign"){
		db.collection("posts").insert(post,function(err,result){
			var resultedPost = result.ops[0];
			db.collection("assignments").insert({"title":post.title,"description":post.description,"by":post.by,"in":post.in,"duedate":post.duedate,"records":[]},
				function(err,result1){
					resultedPost.assignmentId = result1.ops[0]._id;
					resultedPost.turnedIn = 0;
					getNumberOfStudents(post.in,function(no){
						resultedPost.notTurnedIn = no;
						db.collection("posts").update({"_id":ObjectId(resultedPost._id)},{"$set":{"turnedIn":0,"notTurnedIn":no,"assignmentId":resultedPost.assignmentId}},function(err,result){
							
						});
						cb(resultedPost);
					})
			});
		});
	}
	else{
		db.collection("posts").insert(post,function(err,result){
			cb(result.ops[0]);
		});
	}
}
function getNumberOfStudents(subjectCode,cb){
	db.collection("courses").findOne({"subjectCode":subjectCode},function(err,result){
		cb(result.students.length);
	})
}
Database.prototype.getPosts = function(subjectCode,cb){
	db.collection("posts").find({"in":subjectCode}).sort({"$natural": -1}).toArray(function(err,result){
		cb(result);
	});
}
Database.prototype.addComment = function(commentDetail,cb){
	db.collection("posts").update({"_id":ObjectId(commentDetail.postid)},{"$push":{"comments":commentDetail.comment}});
	cb(commentDetail);
}
/*assignment related*/
Database.prototype.getAssignment = function(assignDet,cb){
	db.collection("assignments").findOne({"_id":ObjectId(assignDet.assignmentId)},function(err,result){
		var index = getIndexofRecord(result,assignDet.user);
		
		if(index == -1){
			var tempRecord = {"by":assignDet.user,"status":"notturned","content":"","comments":[],"grade":"","remarks":""}
			db.collection("assignments").update({"_id":ObjectId(assignDet.assignmentId)},{"$push":{"records":tempRecord}});
			result.records = null;
			result.record = tempRecord;
		}
		else{
			result.record = result.records[index];
			result.records = null;
		}
		cb(result);
	})
}
Database.prototype.addCommentToAssign = function(commentDetail,cb){

	db.collection("assignments").findOne({"_id":ObjectId(commentDetail.assignmentId),"records.by":commentDetail.comment.by},function(err,result){
		if(result==null){
			db.collection("assignments").update({"_id":ObjectId(commentDetail.assignmentId)},{"$push":{"records":
			{"by":commentDetail.comment.by,"status":"notturned","content":"","comments":[commentDetail.comment],"grade":"","remarks":""}
			}},function(err,result){
				
			});
		}
		else{
			db.collection("assignments").findOne({"_id":ObjectId(commentDetail.assignmentId)},function(err,result){
				var records=result.records;
				for(var i=0;i<records.length;i++)
				{
					var record=records[i];
					if(record.by.email==commentDetail.comment.by.email){
						var strin="records."+i+".comments";
						var temp={};
						temp[strin]=commentDetail.comment;
						db.collection("assignments").update({"_id":ObjectId(commentDetail.assignmentId),"records.by":commentDetail.comment.by},
						{"$push":temp});
						break;
					}
				}
			});
			
		}
	});
}
function getIndexofRecord(result,user){
	var records=result.records;
	for(var i=0;i<records.length;i++){
		var record=records[i];
		
		if(record.by.email==user.email){
			return i;
		}
	}
	return -1;
}
module.exports = Database;