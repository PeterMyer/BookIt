const router = require("express").Router();
const {
    models: { User }
} = require("../db");
module.exports = router;

//GET /api/users
router.get("/", async (req, res, next) => {
    try {
        const users = await User.findAll({
            // explicitly select only the id and username fields - even though
            // users' passwords are encrypted, it won't help if we just
            // send everything to anyone who asks!
            attributes: ["id", "username"]
        });
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// POST /api/users
router.post("/", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        res.status(201).send(
            await User.create({
                username,
                // email,
                password
            })
        );
    } catch (err) {
        next(err);
    }
});
