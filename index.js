// <<<<<<<<<<< dependencies start >>>>>>>>>
const express = require('express')

const cors = require('cors')
const bodyParser = require('body-parser')
const { ObjectId } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
// <<<<<< dependencies app use>>>>
const app = express();
// app.use(ObjectID);
app.use(bodyParser.json());
app.use(cors());

// <<<<<<<< dependencies end>>>
const port = 5000;

const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.1brmu.mongodb.net/${process.env.DV_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => error && console.log(error));
client.connect(err => {
  const popularCourseCollection = client.db("Educamp").collection("popularCourses ");
  const enrollCourseCollection = client.db("Educamp").collection("enrollCourse ");
  const makingAdminCollection = client.db("Educamp").collection("makeAdmin ");
  const payWithEnrollCourse = client.db("Educamp").collection("paySuccess ");
   
  // <<<<< Add Popular Course Post method Start here>>>
  app.post("/popularCourses", (req, res) => {
    const  addCourse = req.body;
    popularCourseCollection.insertOne(addCourse)
    .then(result=>{
      res.send(result)
      // console.log(result)
    })

  });
  // <<<<< Add Popular Course Post method End here>>>
  // <<<<<< popular course get method start here >>>>
  app.get('/getPopularCourse',(req, res)=>{
    popularCourseCollection.find({})
    .toArray((err, documents) => res.send(documents))
    
  })
  // <<<<<< popular course get method end here >>>>
  // ..... getPopularCourse delete method start here....
  app.delete('/deleteCourse/:id',(req, res)=>{
    popularCourseCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result => console.log(result))
  })
  // ..... getPopularCourse delete method end here....
  //popularCourse update method start here....
  app.patch('/courseUpdate',(req, res)=>{
    console.log(req.body);
    const updateData ={
      "CourseName" : req.body.CourseName ,
      "CourseTitle": req.body.CourseTitle,
      "instructorName": req.body.instructorName,
      "CoursePricing": req.body.CoursePricing,
      "lecture": req.body.lecture,
      "quizzes": req.body.quizzes,
      "duration": req.body.duration,
      "skillLevel": req.body.skillLevel,
      "students": req.body.students,
      "assessments": req.body.assessments,
      "description": req.body.description, 
    }
    if (req.body.imgUrl !==null) {
      updateData.imgUrl = req.body.imgUrl
    }
    popularCourseCollection.updateOne(
      {_id: ObjectId(req.body.id)},
      { $set: {...updateData}}
      
    )
    .then(result => {
      res.send(result.modifiedCount > 0)
       
  })
  })
  //popularCourse update method end here....
  // <<<< enrollCourse post method start >>>>
  app.post('/addEnrollCourse',(req, res)=>{
    const enrollCourse = req.body;
    enrollCourseCollection.insertOne(enrollCourse)
    .then(result =>{
      res.send(result)
      // console.log(result)
    })
  })
  // <<<< enrollCourse post method end >>>>
  // <<<<< enrollCourse get method start here >>>>
  app.get('/getEnrollCourse',(req, res)=>{
    enrollCourseCollection.find({})
    .toArray((err,documents) =>res.send(documents))
  })
  // <<<<< enrollCourse get method End here >>>>
  // <<<< Enroll Course delete method >>>
  app.delete('/deleteProduct/:id',(req,res)=>{
    enrollCourseCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=> console.log(result))
})

// <<<< make Admin...
app.post('/makeAdmin',(req, res)=>{
  const admin =req.body;
  makingAdminCollection.insertOne(admin)
  .then(result => {
    res.send(result)
    // console.log(result);
  })
})
app.post('/getAdmin', (req,res)=>{
  const email = req.body.email;
  makingAdminCollection.find({email:email})
  .toArray((err, documents) => {
       res.send(documents.length > 0)
  })
  // console.log(admin)
})

// payment  success
app.delete('/paymentSuccess/:id',(req,res)=>{
  // const item =req.body;
  enrollCourseCollection.deleteMany()
  .then(result=> console.log(result))
})

//  <<<<<< payment schedule updating >>>>
app.post('/payWithEnrollCourse',(req, res)=>{
    const payData =req.body;
    payWithEnrollCourse.insertOne(payData)
    .then(result =>{
      res.send(result);
      // console.log(result);
    })
});
app.get('/getPayWithEnrollCourse',(req, res)=>{
  payWithEnrollCourse.find({})
    .toArray((err,documents) =>res.send(documents))
})

app.delete('/deleteItem/:id',(req, res)=>{
  payWithEnrollCourse.deleteOne({_id:ObjectId(req.params.id)})
  .then(result => console.log(result))
})
app.patch('/courseUpdatingData', (req,res) =>{
  // console.log(req.body);
  payWithEnrollCourse.updateMany(
      {_id: ObjectId(req.body.id)},
      { $set: {"paymentStatus" : req.body.paymentStatus }}
  )
  .then(result=>{
      console.log(result)
  })
})

  app.get('/', (req, res) => {
    res.send('Hello World!')
  });
});
app.listen(process.env.PORT || port);