var express = require('express');
var database = require('./db');
var router = express.Router();
var db = new database();
var io = require("./Sample").app.myApp;
var socket = null;
io.on('connection',function(sock){
	console.log("connected ...");
	socket=sock;
});
router.post("/validate",function(req,res){
	db.validateUser(req.body,function(result){
		res.json(result);
	});
});
router.post("/checkUser",function(req,res){
	db.checkUser(req.body,function(result){
		res.json(result);
	});
});
router.post("/register",function(req,res){
	db.registerUser(req.body);
	res.end();
});
router.get("/getStudents",function(req,res){
	db.getStudents(req.body,function(result){
		res.json(result);
	});
});
router.post("/createSubject",function(req,res){
	db.createSubject(req.body);
	res.end();
});
router.post("/getSubjects",function(req,res){
	db.getSubjects(req.body,function(result){
		res.json(result);
	});
});
router.post("/joinSubject",function(req,res){
	db.joinSubject(req.body,function(result){
		res.json(result);
	});
});
router.post("/delSubject",function(req,res){
	db.deleteSubject(req.body);
	res.end();
});
router.post("/leaveSubject",function(req,res){
	db.leaveSubject(req.body);
	res.end();
});
router.get("/getSubject",function(req,res){
	db.getSubject(req.query.subjectCode,function(result){
		res.json(result);
	});
});
router.post("/newpost",function(req,res){
	db.createPost(req.body,function(result){
		res.json(result);
		io.emit('newpost',result);
	})
});
router.get("/getPosts",function(req,res){
	db.getPosts(req.query.subjectCode,function(result){
		res.json(result);
	});
})
router.post("/addComment",function(req,res){
	db.addComment(req.body,function(result){
		res.json({"error":null});
		io.emit("newcomment",req.body);	
	});
	
});
router.post("/getAssignment",function(req,res){
	db.getAssignment(req.body,function(result){
		res.json(result);
	});
})
router.post("/addCommentToAssign",function(req,res){
	db.addCommentToAssign(req.body,function(result){

	});
	res.end();
})
router.post("/fileUpload",function(req,res){
	for(var file in req.files){
		var sampleFile = req.files[file];
		sampleFile.mv('../client/uploadfiles/'+sampleFile.name,function(err){
		 	console.log(err);
		});
	}
});
router.post("/updateMaterials",function(req,res){
	db.updateMaterials(req.body,function(result){
		res.json(result);
	});
});
module.exports = router;