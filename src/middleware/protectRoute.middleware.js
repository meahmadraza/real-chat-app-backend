export const protectRoute = async (req, res, next) => {
    try {

        const token = req.cookies.jwt;

        if (!token) {
            console.log("No token");
            return res.status(401).json({ message: "Access Denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();

    } catch (err) {
        console.log("Error in protectRoute", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
