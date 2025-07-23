import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        res.status(200).json(filteredUsers);
    } catch (err) {
        console.log("Error in getUsers", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        })
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageURL
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageURL = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text,
            image: imageURL
        })

        await newMessage.save();

        res.status(200).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage", error);
        return res.status(500).json({ message: "Internal server error" });

    }
}