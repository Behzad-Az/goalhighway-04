const postNewDoc = (req, res, knex, user_id, esClient) => {

  let newDocObj = {
    course_id: req.params.course_id
  };

  let newRevObj = {};

  const insertNewDoc = (newDocObj, trx) => knex('docs')
    .transacting(trx)
    .insert(newDocObj)
    .returning('id');

  const insertNewRev = (newRevObj, trx) =>  knex('revisions')
    .transacting(trx)
    .insert(newRevObj)
    .returning('id');

  const adminAddToCourseFeed = (adminFeedObj, trx) => knex('course_feed')
    .transacting(trx)
    .insert(adminFeedObj);

  const getSearchData = () => knex('courses')
    .innerJoin('institutions', 'inst_id', 'institutions.id')
    .select('institutions.id', 'inst_long_name', 'inst_short_name', 'short_display_name')
    .where('courses.id', newDocObj.course_id);

  const determineCategory = type => {
    let output;
    switch(type) {
      case 'asg_report':
        output = 'new_asg_report';
        break;
      case 'lecture_note':
        output = 'new_lecture_note';
        break;
      case 'sample_question':
        output = 'new_sample_question';
        break;
      default:
        output = 'new_document';
        break;
    }
    return output;
  }

  const addDocToElasticSearch = esDocObj => {
    let kind;
    const indexObj = {
      index: {
        _index: 'search_catalogue',
        _type: 'document',
        _id: esDocObj.id
      }
    };
    switch (esDocObj.kind) {
      case 'asg_report':
        kind = 'assignment assingments report reports';
        break;
      case 'lecture_note':
        kind = 'lecture lectures note notes';
        break;
      case 'sample_question':
        kind = 'sample question questions quiz quizzes exam exams final finals midterm midterms';
        break;
      default:
        kind = 'other_kind_not_specified';
        break;
    };
    esDocObj.kind = kind;
    return esClient.bulk({ body: [indexObj, esDocObj] })
  };

  knex.transaction(trx => {
    insertNewDoc(newDocObj, trx)
    .then(docId => {
      newRevObj = {
        title: req.body.title,
        type: req.body.type,
        rev_desc: req.body.revDesc,
        file_name: req.file.filename,
        doc_id: docId[0],
        poster_id: user_id
      };
      return insertNewRev(newRevObj, trx);
    })
    .then(revId => {
      let adminFeedObj = {
        commenter_id: user_id,
        course_id: newDocObj.course_id,
        doc_id: newRevObj.doc_id,
        rev_id: revId[0],
        category: determineCategory(newRevObj.type),
        commenter_name: 'Anonymous',
        header: newRevObj.title,
        content: 'New document received.'
      };
      return adminAddToCourseFeed(adminFeedObj, trx);
    })
    .then(() => getSearchData())
    .then(searchData => {
      let esDocObj = {
        id: newRevObj.doc_id,
        title: newRevObj.title,
        kind: newRevObj.type,
        course_id: parseInt(newDocObj.course_id),
        course_name: searchData[0].short_display_name,
        inst_id: searchData[0].id,
        inst_name: `${searchData[0].inst_long_name} ${searchData[0].inst_short_name}`
      };
      return addDocToElasticSearch(esDocObj);
    })
    .then(response => {
      let errorCount = response.items.reduce((count, item) => item.index && item.index.error ? 1 : 0, 0);
      if (errorCount) { throw 'Could not upload to elastic search db'; }
      else { return; }
    })
    .then(() => trx.commit())
    .catch(err => {
      trx.rollback();
      throw err;
    });
  })
  .then(() => res.send(true))
  .catch(err => {
    console.error('Error inside postNewDoc.js', err);
    res.send(false);
  });

};

module.exports = postNewDoc;
