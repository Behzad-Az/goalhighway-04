const getSearchBarResults = (req, res, esClient) => {

  const search = (index, body) => esClient.search({ index, body });
  const query = req.query.query.trim();
  const searchType = req.query.searchType;
  const inst_id = req.session.inst_id.toLowerCase();

  const validateInputs = () => new Promise((resolve, reject) => {
    if (
      query.length >= 3 && query.length <= 40 &&
      query.search(/[^a-zA-Z0-9\ \-\(\)\'\\/\\.]/) == -1 &&
      ['mainSearchBar', 'companyName'].includes(searchType)
    ) {
      resolve();
    } else {
      reject('Invalid search query.');
    }
  });

  const docSearchBody = {
    size: 5,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['course_name^5', 'inst_name^2']
          }
        },
        should: {
          multi_match: {
            query,
            fields: ['kind^5', 'title']
          }
        },
        filter: [
          { type: { value: 'document' } },
          { term: { inst_id } }
        ]
      }
    }
  };

  const courseSearchBody = {
    size: 5,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['title^5', 'inst_name', 'course_desc^2'],
            fuzziness: 'AUTO'
          }
        },
        filter: [
          { type: { value: 'course' } },
          { term: { inst_id } }
        ]
      }
    }
  };

  const institutionSearchBody = {
    size: 2,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['name'],
            fuzziness: 'AUTO'
          }
        },
        filter: {
          type: { value: 'institution' }
        }
      }
    }
  };

  const companySearchBody = {
    size: 2,
    from: 0,
    query: {
      bool: {
        must: {
          multi_match: {
            query,
            fields: ['name'],
            fuzziness: 'AUTO'
          }
        },
        filter: {
          type: { value: 'company' }
        }
      }
    }
  };

  validateInputs()
  .then(() => {
    switch (searchType) {
      case 'mainSearchBar':
        return Promise.all([
          search('goalhwy_es_db', docSearchBody),
          search('goalhwy_es_db', courseSearchBody),
          search('goalhwy_es_db', institutionSearchBody),
          search('goalhwy_es_db', companySearchBody)
        ]);
      case 'companyName':
        return search('goalhwy_es_db', companySearchBody);
    }
  })
  .then (results => {
    switch (searchType) {
      case 'mainSearchBar':
        res.send({
          searchResults: results[0].hits.hits.concat(results[1].hits.hits).concat(results[2].hits.hits).concat(results[3].hits.hits)
        });
        break;
      case 'companyName':
        res.send({
          searchResults: results.hits.hits
        });
        break;
    }
  })
  .catch(err => {
    console.error('Error inside getSearchBarResults.js: ', err);
    res.send(false);
  });

};

module.exports = getSearchBarResults;
