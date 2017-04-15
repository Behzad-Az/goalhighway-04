const getRightSideBarData = (req, res, knex, user_id) => {

  let instName, studentCount, courseCount, tutorCount, revCount;

  const getInstName = () => knex('institutions')
    .select('inst_long_name')
    .where('id', req.session.inst_id);

  const getStudentCount = () => knex('institution_program')
    .innerJoin('users', 'institution_program.id', 'inst_prog_id')
    .where('inst_id', req.session.inst_id)
    .count('username as studentCount');

  const getCourseIds = () => knex('courses')
    .select('id')
    .where('inst_id', req.session.inst_id);

  const getTutorCount = courseIds => knex('course_user')
    .where('tutor_status', true)
    .whereIn('course_id', courseIds)
    .count('user_id as tutorCount');

  const getRevCount = courseIds => knex('revisions')
    .innerJoin('docs', 'doc_id', 'docs.id')
    .whereIn('course_id', courseIds)
    .count('revisions.id as revCount');

  // const getCourseFeeds = courseIds => knex('course_feed')
  //   .innerJoin('courses', 'course_feed.course_id', 'courses.id')
  //   .select(
  //     'course_feed.id', 'course_feed.created_at', 'course_feed.tutor_log_id', 'course_feed.course_id',
  //     'course_feed.commenter_name', 'course_feed.category', 'course_feed.content', 'course_feed.header',
  //     'course_feed.doc_id', 'courses.short_display_name'
  //   )
  //   .whereIn('courses.id', courseIds)
  //   .orderBy('course_feed.created_at', 'desc')
  //   .limit(3);

  // const getResumeFeeds = () => knex('resume_review_feed')
  //   .select('id', 'additional_info', 'created_at', 'owner_name', 'owner_id', 'resume_id', 'title')
  //   .where('audience_filter_id', req.session.inst_prog_id)
  //   .andWhere('audience_filter_table', 'institution_program')
  //   .whereNull('deleted_at')
  //   .orderBy('created_at', 'desc')
  //   .limit(3);

  // const categorizeFeed = (feedArr, feedType) => feedArr.map(feed => {
  //   feed.type = feedType;
  //   return feed;
  // });

  Promise.all([
    getInstName(),
    getStudentCount(),
    getCourseIds()
  ]).then(results => {
    instName = results[0][0] ? results[0][0].inst_long_name : 'N/A';
    studentCount = results[1][0].studentCount;
    courseCount = results[2].length;
    let courseIds = results[2].map(element => element.id);
    return Promise.all([
      getTutorCount(courseIds),
      getRevCount(courseIds)
      // getCourseFeeds(courseIds),
      // getResumeFeeds()
    ]);
  }).then(results => {
    tutorCount = results[0][0].tutorCount;
    revCount = results[1][0].revCount;
    // let feeds = categorizeFeed(results[2], 'courseFeed')
    //             .concat(categorizeFeed(results[3], 'resumeReviewFeed'));
    let output = { instName, instId: req.session.inst_id, studentCount, courseCount, tutorCount, revCount };
    res.send(output);
  }).catch(err => {
    console.error('Error inside getRightSideBarData.js: ', err);
    res.send(false);
  });

};

module.exports = getRightSideBarData;
