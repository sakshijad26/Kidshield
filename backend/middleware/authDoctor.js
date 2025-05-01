import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ success: false, message: 'Not Authorized. Login again.' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.docId = decoded.id;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ success: false, message: error.message });
    }
};

export default authDoctor;
