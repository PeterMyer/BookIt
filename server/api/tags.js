const router = require("express").Router();

const {
    models: { Tag, Tagging, UserArticle }
} = require("../db");
module.exports = router;

// GET /api/tags
router.get("/", async (req, res, next) => {
    try {
        const tags = await Tag.findAll({ include: Tagging });
        res.json(tags);
    } catch (err) {
        console.log("> GET /api/tags ERR: ", err);
        next(err);
    }
});

// POST /api/tags
router.post("/", async (req, res, next) => {
    try {
        const { name } = req.body;
        const newTag = await Tag.create({ name: name });

        // console.log("NEW TAG CREATED: ", newTag);
        res.json(newTag);
    } catch (err) {
        console.log("> POST /api/tags ERR: ", err);
        next(err);
    }
});

// GET /api/tags/:id
router.get("/:id", async (req, res, next) => {
    try {
        //
        const { id } = req.params;
        const userArticles = await UserArticle.findAllTaggingsByUser(id);
        const name = userArticles
            .flatMap((item) => item.taggings)
            .map((item) => item.tag.name);

        if (!name) {
            res.sendStatus(404);
            return;
        }

        let uniqueName = [...new Set(name)]
        res.status(200).send(uniqueName);
    } catch (err) {
        console.log("> GET /api/tags/:ID ERR: ", err);
        next(err);
    }
});
