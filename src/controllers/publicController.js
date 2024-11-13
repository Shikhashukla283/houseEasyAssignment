
const public = async (req, res, next) => {
    const id = req.params.id
    try {
        return res.status(200).json('This is a public API. Doesn\'t require any authentication')
    } catch (error) {
        console.log(error)
        next(error)
    }
}
module.exports = {
    public
}
