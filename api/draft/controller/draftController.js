const Draft = require("../../draft/model/draft");
const cloud = require("../../../config/cloudinary");
const Blog = require("../../blog/model/blog")

exports.getAllDraft = async (req, res) => {
    try {
        let response = await Draft.find()
            .populate("category drafter")
        res.status(200).json({
            data: response
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.draftNewPost = async (req, res) => {
    let images = [];
    for (let file of req.files) {
        let result = await cloud.uploads(file.path);
        images.push(result.url);
    }
    try {
        let result = await cloud.uploads();
        let draft = new Draft({
            drafter: req.body.drafter,
            title: req.body.title,
            tags: req.body.tags,
            category: req.body.category,
            content: req.body.content,
            featured_image: images
        });

        let response = await draft.save();
        res.status(200).json({
            data: response
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.getDraftById = async (req, res) => {
    try {
        const id = req.params.id;
        let response = await Draft.findById({
                _id: id
            })
            .populate("category drafter")
        res.status(200).json({
            response
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.getDraftByUser = async (req, res) => {
    try {
        const user = req.params.id;
        let response = await Draft.find({
                drafter: user
            })
            .populate("category drafter")
        res.status(200).json({
            response
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

// delete a blogpost
exports.removeDraft = async (req, res) => {
    try {
        const id = req.params.id;
        let response = await Draft.remove({
            _id: id
        });
        res.status(200).json({
            data: response
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.updateDraft = async (req, res) => {
    try {
        const id = req.params.id;
        let response = await Draft.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.status(200).json({
            data: response
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        });
    }
}

exports.addDraftToBlog = async (req, res) => {
    try {
        const id = req.params.id;
        let response = await Draft.findById({
            _id: id
        })
        let {
            title,
            tags,
            category,
            featured_image,
            content,
            drafter
        } = response

        if (!response.isCompleted) {
            return res.status(400).json({
                msg: "Draft Not Completed"
            })
        }
        let blog = new Blog({
            title: title,
            tags: tags,
            category: category,
            content: content,
            featured_image: featured_image,
            writer: drafter
        });

        response.isPublished = true;
        await response.save();
        let addedFromDraft = await blog.save();
        res.status(200).json({
            data: addedFromDraft
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        });
    }
}