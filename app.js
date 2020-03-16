var express=require("express"),
    app=express(),
    bodyParser=require("body-parser"),
    methodOverride=require("method-override"),
    expressSanitizer=require("express-sanitizer"),
    mongoose=require("mongoose");


// app config   
mongoose.connect('mongodb://localhost:27017/BlogApp', {useNewUrlParser: true , useUnifiedTopology: true });
app.set("view engine","ejs");
mongoose.set('useFindAndModify', false);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));



// mongoose/model config
var BlogSchema= new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date , default: Date.now}
});
var Blog= mongoose.model("Blog", BlogSchema);

// ROUTES
const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>
{
    console.log('server is running');
});

//INDEX ROUTE
app.get("/blogs",(req,res)=>{
    Blog.find({},(err,blogs)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{ blogs: blogs});

        }
    })
})

app.get("/",(req,res)=>{
    res.redirect("/blogs");
});

//NEW ROUTE
app.get("/blogs/new",(req,res)=>{
    res.render("new");
})

//CREATE ROUTE
app.post("/blogs",(req,res)=>{
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,(err,newblog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/blogs");
        }
    })
});

// SHOW ROUTE
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(err,foundblog)=>{
        if(err){
            console.log("error!!!!!!");
        }
        else{
            res.render("show",{blog:foundblog});
        }
    })
    
});

//EDIT ROUTE
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(err,foundblog)=>{
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{ blog : foundblog});
        }
    })
    
});

// update route
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body= req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updated)=>{
        if(err){
            res.redirect("/blogs");
           }
           else{
               res.redirect("/blogs/"+ req.params.id);
           }
    })
})

//DESTROY ROUTE
app.delete("/blogs/:id",(req,res)=>{
Blog.findByIdAndRemove(req.params.id,(err)=>{
    if(err){
        res.redirect("/blogs");
    }
    else{
        res.redirect("/blogs");
    }
})
});