let express = require("express");
	app = express();
	path = require('path');
	session = require('express-session');
	bodyparser = require('body-parser');
	mongoose = require("mongoose");
	Schema = mongoose.Schema;
	TasksSchema = new mongoose.Schema({
		title: {type: String, required: true, minlength: 2, maxlength: 25},
		description: {type: String, required: true, minlength: 2, maxlength: 200},
		completed: {type: Boolean, default: false},
	}, {timestamps: true});


app.use(bodyparser.json()); //We are parsing json data.
app.use(express.static(path.join(__dirname + "/angularapp/dist")));
app.use(session({
	secret: 'hushdonttell',
	proxy: true,
	resave: false,
	saveUninitialized: true
}));

app.set('views', path.join(__dirname + '/views'));

mongoose.connect("mongodb://localhost/tasks");
mongoose.model('Tasks', TasksSchema);
mongoose.Promise = global.Promise;

var Tasks = mongoose.model('Tasks');

//Global vars here:

//app. functions here:

app.get('/tasks', function(req, res) {
	Tasks.find({}, (err, tasks)=> {
		if(err){
			console.log("Load all Error", err);
			res.json({message: "Error", errors: err});
		}
		else{
			console.log("Load all Success");
			res.json({tasks: tasks});
		}
	});
});

app.post("/tasks", (req, res)=>{
	let new_task = new Tasks(req.body); 
	new_task.save((err, task)=>{
		if(err){
			console.log("New Error", err);
			res.json({message: "Error on new task", errors: err});
		}
		else{
			console.log(task);
			res.redirect("/");
		}
	});
});

app.delete("/tasks/:id", (req, res)=>{
	let done_task = Tasks.findOneAndRemove({_id: req.params.id});
	done_task.remove((err,task)=>{
		if(err){
		console.log("New Error", err);
		res.json({message: "Error on deletion", errors: err});
		}
		else{
			res.redirect("/");
		}
	});
});

app.get("/tasks/:id", (req,res)=>{
	Tasks.find({_id: req.params.id}, (err,task)=>{
		if(err){
			res.json({message: "Error with get id"}, {errors: err});
		}
		else{
			console.log("task id success");
			res.json({tasks: task});
		}
	});
});

app.put("/tasks/:id", (req,res)=>{
	let ud_task = Tasks.findOne({_id:req.params.id});
	ud_task.update({title: req.body.title, description: req.body.description, completed: req.body.completed}, (err,task)=>{
		if(err){
			res.json({message:"we done goofed", error: err});
		}
		else{
			res.redirect("/");
		}
	});
});

// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });




var server = app.listen(1337, () => {
	console.log("listening on port 1337");
});
var io = require("socket.io").listen(server);
io.sockets.on('connection', (socket)=> {
	console.log("Client/socket is connected!");
	console.log("Client/socket id is: ", socket.id);
	//Socket code here:
});