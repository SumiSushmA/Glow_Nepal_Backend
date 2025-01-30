import jwt from 'jsonwebtoken';

// Stylist authentication middleware
const authStylist = async (req, res, next) => {
    const { stoken } = req.headers; // Changed 'dtoken' to 'stoken' for clarity

    if (!stoken) {
        return res.json({ success: false, message: 'Not Authorized. Please Login Again' });
    }

    try {
        const token_decode = jwt.verify(stoken, process.env.JWT_SECRET);
        req.body.stylistId = token_decode.id; // Updated to 'stylistId' instead of 'docId'
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export default authStylist;
