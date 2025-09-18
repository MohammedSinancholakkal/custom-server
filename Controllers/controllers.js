
const users = require('../Model/userSchema')
const jwt = require('jsonwebtoken')


//register 

exports.Register = async (req, res) => {
    console.log('inside register function');
    const { username, email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(409).json("User already exists!");
        }

        const newUser = new users({
            username,
            email,
            password ,
            role: "user" 
        });

        await newUser.save();
        res.status(201).json(newUser);

    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ error: err.message });
    }
};


    

//login
exports.Login = async (req, res) => {
    console.log("inside login function");

    const { email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email, password });

        if (existingUser) {

            //create token with role also
            const token = jwt.sign({ userId: existingUser._id, role: existingUser.role },process.env.jwt_secret
            );

            // include role in response
            res.status(200).json({ existingUser, token, role: existingUser.role });

        } else {
            res.status(400).json("Invalid email/password");
        }
    } catch (err) {
        res.status(406).json(err);
    }
}

    