const express = require('express')
const res = require('express/lib/response')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))


const Product = require('./models/product')

mongoose.connect('mongodb://127.0.0.1:27017/farm3', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })




app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));


app.listen(3000, ()=>{
    console.log("APP is listening on port 3000")
})

//new has to be above /:id
app.get('/products/new', (req, res)=>{
    // res.send(`New2`)
    res.render("products/new")
    })
    
    app.get("/products", async(req, res)=>{
        const products = await Product.find({})
        res.render("products/index", {products})
        //res.send(`All products3 ${products}`)
    } )
    
app.get("/products/:id", async(req, res)=>{
    const {id} = req.params
    const product = await Product.findById(id)
    res.render("products/show", {product})
    //res.send(`All products3 ${products}`)
} )

app.get("/products/:id/edit", async(req, res)=>{
    // res.send("edit")
    const {id} = req.params
    const product = await Product.findById(id)
    res.render("products/edit", {product})

} )
app.put("/products/:id", async(req, res)=>{
    // res.send("edit")
    const {id} = req.params
    const product = await Product.findByIdAndUpdate(id, req.body, {runValidators:true, new: true})
    res.redirect(`/products/${product._id}`)

} )

app.delete("/products/:id", async(req, res)=>{
    // res.send("edit")
    const {id} = req.params
    const product = await Product.findByIdAndDelete(id)
    res.redirect(`/products`)

} )


app.post("/products", async(req, res)=>{
    const newProduct = Product(req.body)
    await newProduct.save()
    res.redirect(`/products/${newProduct._id}`)
})
