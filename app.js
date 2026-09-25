const express = require('express');
const userModal = require("./models/user")
const postModal = require("./models/post")
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")


const app = express()

app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
    res.render("index")
    // res.send("this is home page")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get('/post', isLoggedIn, async (req, res) => {
    const user = await userModal.findOne({ email: req.user.email })
    const allPosts = await postModal.find({ userId: req.user.userId })
    console.log('user: ', user, allPosts);
    res.render('post', { user, posts: allPosts })
})

app.get("/edit-post/:id", isLoggedIn, async (req, res) => {
    const { id } = req.params
    const post = await postModal.findOne({ _id: id })
    console.log('post: ==============>>>>>>>>>>>>>>> ', post);
    res.render("editPost", { post })
})

app.post("/sign-up", async (req, res) => {
    const { name, email, username, password } = req.body;
    const userExist = await userModal.findOne({ email })
    if (userExist) {
        return res.status(400).send("User Already Exist!!!!")
    }

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            // console.log(hash)
            const userDetails = await userModal.create({
                name,
                email,
                username,
                password: hash
            })

            let token = jwt.sign({ email, userId: userDetails._id }, "random")
            res.cookie("token", token)
            res.redirect("/login")
        })
    })

})

app.post("/log-in", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send("please fill the all required values!!!")
    }
    const user = await userModal.findOne({ email })

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            console.log('result: ', result);
            let token = jwt.sign({ email, userId: user._id }, "random")
            res.cookie("token", token)
            res.redirect("/post")
            // res.status(200).send("you can login")
        } else {
            res.redirect('/login')
        }
    })
})

app.post("/log-out", isLoggedIn, (req, res) => {
    res.cookie("")
    res.status(200).send("Logout successfully")
})

app.post('/posts/create', isLoggedIn, async (req, res) => {
    if (req.user.email) {
        const user = await userModal.findOne({ _id: req.user.userId })
        const createdPost = await postModal.create({ userId: req.user.userId, description: req.body.description })

        user.posts.push(createdPost._id)

        await user.save()
        res.redirect('/post')
    } else {
        res.redirect("/login")
    }
})

app.post('/posts/edit/:id', isLoggedIn, async (req, res) => {
    if (req.user.email) {
        const updatePost = await postModal.findOneAndUpdate({ _id: req.params.id }, { description: req.body.content, likes: [] }, { new: true })
        res.redirect('/post')
    } else {
        res.redirect("/login")
    }
})

app.post('/posts/like/:id', isLoggedIn, async (req, res) => {
    if (req.user.userId) {
        const post = await postModal.findOne({ _id: req.params.id }).populate("userId")
        if (post.likes.indexOf(req.user.userId) === -1) {
            post.likes.push(req.user.userId)
        } else {
            post.likes.splice(post.likes.indexOf(req.user.userId), 1)
        }

        await post.save()
        res.redirect('/post')
    } else {
        res.redirect("/login")
    }
})

app.get('/post/remove/:id', isLoggedIn, async (req, res) => {
    if (req.user.userId) {
        const removedPost = await postModal.findOneAndDelete({ _id: req.params.id })
        const userDetails = await userModal.findOne({ _id: req.user.userId })

        userDetails.posts.splice(userDetails.posts.indexOf(removedPost._id), 1)
        await userDetails.save()
        res.redirect("/post")
    } else {
        res.redirect("/login")
    }
})

function isLoggedIn(req, res, next) {
    if (req.cookies.token === "") { return res.status(401).send("Please Login!!!") }
    else {
        const user = jwt.verify(req.cookies.token, "random")
        req.user = user
    }
    next()
}


app.listen(3000)