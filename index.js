const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const PORT=3000;
const mongoose=require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');

dotenv.config();
app.use(cors({
  origin:["http://localhost:3000","http://localhost:5173"]
}));
app.use(bodyParser.json());

const todoSchema=new mongoose.Schema({
  id:String,
  description:String
});

const Todos=mongoose.model('Todos',todoSchema);

mongoose.connect(process.env.DBURL,{useNewUrlParser:true,useUnifiedTopology:true});


  app.get('/todos',async (req, res) => {
    // - Retrieve all todo items
    let allTodos=await Todos.find({});
    res.status(200).json({todos:allTodos});
  });
  

  app.post('/todos', async (req, res) => {
    // - Create a new todo item
    if(!req.body.description){
      res.status(301).json({message:"Todo data not recieved"});
    }
    else{
    const todo = {
      id: Math.floor(Math.random() * 1000000), // unique random id
      description: req.body.description
    };
    const newTodo=new Todos(todo);
    await newTodo.save();
    res.status(201).json({message:'successfully Created.',todoId:todo.id});
  }
  });


  app.put('/todos/:id', async(req, res) => {
    // - Update an existing todo item by ID
    if(!req.body.description) res.status(301).json({message:"field empty"});
    else{
      let todo=await Todos.findOneAndUpdate({id:req.params.id},req.body,{new:true});
      if(todo){
        res.status(200).json({message:"Updated successfully"});
      }
      else res.status(400).json({message:'Todo not found'});
    }
  });


  app.delete('/todos/:id',async (req, res) => {
    // - Delete a todo item by ID
    await Todos.deleteOne({id:req.params.id});
    res.status(200).json({message:"succesfully deleted"});
  });

  //   for all other routes, return 404
  app.use((req, res, next) => {
    res.status(404).send('Invalid route');
  });

  app.listen(PORT,(err)=>{
    if(err) console.log('unable to listen ',err);
    console.log(`Listening on Port ${PORT}`);
  });