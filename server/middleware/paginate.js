const queryAsync = require('../db/connection');

function paginate(sql1, sql2, sql3){
    return async(req, res, next) => {
      var {year,sem} = req.params;
      var numRows;
      if(req.query.title){
        var search = '%'
        search += req.query.title;
        search += '%';
        search = `'${search}'`;
        var newSql3 = sql3.replace(/#/g,search)
        queryAsync(newSql3, [sem,year])
        .then((results) => {
          var responsePayload = {
            results: results,
            pagination: {
              page:1,
            }
          }
          res.paginatedResult = responsePayload;
          next();
        })
        .catch((e) => {
          console.log(e);
          res.json({err : e});
        })
      }

      else{
        var numPerPage = parseInt(req.query.npp, 10) || 20;
        var page = parseInt(req.query.page, 10) || 1;
        var numPages;
        var skip = (page-1) * numPerPage;
        var limit = skip + ',' + numPerPage;

        queryAsync(sql1, [sem,year])
        .then(function(results) {
          numRows = results[0].numRows;
          numPages = Math.ceil(numRows / numPerPage);
        })
        .then(() => queryAsync(sql2 + ' LIMIT ' + limit, [sem,year]))
        .then(function(results) {
          var responsePayload = {
            results: results
          };
          //res.results = results;
          if (page < numPages) {
            responsePayload.pagination = {
              current: page,
              perPage: numPerPage,
              previous: page > 0 ? page - 1 : undefined,
              next: page < numPages - 1 ? page + 1 : undefined,
              numberofPages: numPages
            }
          }
          else responsePayload.pagination = {
            err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
          }
          res.paginatedResult = responsePayload;
          next()
        })
        .catch(function(err) {
          console.error(err);
          res.json({ err: err });
        });
      }
    }
  }

  module.exports = paginate;