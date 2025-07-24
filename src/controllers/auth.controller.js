import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required to signup" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            return res.status(400).json({ message: "User not created" });
        }

    } catch (err) {
        console.log("Error in Signup", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    } catch (err) {
        console.log("Error in Login", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const logout = async (req, res) => {
    try {
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(0),
        });

        res.status(200).json({ message: "User logged out successfully" });

    } catch (err) {
        console.log("Error in Logout", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const updateProfilePic = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userID = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Please provide a profile picture" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userID, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json({ updatedUser });

    } catch (error) {
        res.status(500).json({ message: "error in updating Profile pic" });
    }

}
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}