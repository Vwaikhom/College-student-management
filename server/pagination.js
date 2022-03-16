const db = require('./connection');

module.exports.paginate = (model) => {
     return async(req,res,next) => {
        const page = parseInt(req.query.page,10) || 1;
        const limit = parseInt(req.quert.limit, 10) || 1;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {};

        if(endIndex <  queryAsync("SELECT COUNT(*) FROM student_profile")){
            result.next = {
                page: page + 1,
                limit: limit,
            };
        }
        if(startIndex > 0){
            result.presvious = {
                page: page - 1,
                limit: limit,
            }
        }

        try{
            result.results =  queryAsync("SELECT * FROM student_profile LIMIT ? OFFSET ?", (limit,startIndex));
            res.paginatedResult = result; 
            next();
        } catch(e){
            res.status(500).json({message : e.message});
        }
    };
}