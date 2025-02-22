import jwt from 'jsonwebtoken';

// User authentication middleware
const authUser = async (req, res, next) => {
    console.log(req.headers.utoken);
    const { utoken } = req.headers; // Changed 'token' to 'utoken' for clarity

    if (!utoken) {
        return res.json({ success: false, message: 'Not Authorized. Please Login Again' });
    }

    try {
        const token_decode = jwt.verify(utoken, process.env.JWT_SECRET);
        req.userId = token_decode.userId; // Kept 'userId' as it's already correct for users
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authUser;
