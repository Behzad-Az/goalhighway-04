'use strict';

// ***************************************************
// DEPENDENCIES
// ***************************************************
const express = require('express');
const url = require('url');
const app = express();
const bodyParser = require('body-parser');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const connection = require('./db/knexfile.js').production;
const knex = require('knex')(connection);
const fs = require('fs');
const path = require('path');
const randIdString = require('random-base64-string');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '127.0.0.1:9200',
  log: 'error'
});
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyAf8NX2LPzDPLTwLeHX9IgJ3LuvDQXiiEI'
});

// ***************************************************
// NODE MAILER SETUP
// ***************************************************
const nodemailer = require('nodemailer');
const mailer = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'no-reply@goalhighway.com',
    pass: 'ba9876543210'
  }
});

const blacklist = [
  '/api/index',
  '/api/courses',
  '/api/users',
  '/api/docs',
  '/api/institutions',
  '/api/searchbar',
  '/imagesapi/companies',
  '/imagesapi/users',
  '/imagesapi/itemsforsale',
  '/imagesapi/institutions',
  '/api/resumes'
];

// ***************************************************
// MIDDLEWARE
// ***************************************************
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  // SECRET GOES INTO .ENV FILE
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(blacklist, (req, res, next) => {
  if (req.session.user_id) {
    next();
  } else {
    console.error('Error inside server.js - invalid req.session.user_id');
    res.send(false);
  }
});
app.use(express.static(path.join(__dirname, '/../../goalhwy_docs/public')));

// ***************************************************
// DOCUMENT STORAGE
// ***************************************************
const documentUpload = require('./helpers/Upload_Helpers/documentUpload.js');
const resumeUpload = require('./helpers/Upload_Helpers/resumeUpload.js');
const userPhotoUpload = require('./helpers/Upload_Helpers/userPhotoUpload.js');
const itemForSaleUpload = require('./helpers/Upload_Helpers/itemForSaleUpload.js');

// ***************************************************
// PORT
// ***************************************************
const PORT = process.env.PORT || 19001;
const server = app.listen(PORT, '127.0.0.1', 'localhost', () => console.log(`Listening on ${ PORT }`));

// ***************************************************
// HELPERS
// ***************************************************
const getIndexPageData = require('./helpers/GET_Routes/getIndexPageData.js');
const getUserProfileData = require('./helpers/GET_Routes/getUserProfileData.js');
const getCoursePageTopRow = require('./helpers/GET_Routes/getCoursePageTopRow.js');
const getCoursePageDocs = require('./helpers/GET_Routes/getCoursePageDocs.js');
const getCoursePageItems = require('./helpers/GET_Routes/getCoursePageItems.js');
const getCoursePageFeed = require('./helpers/GET_Routes/getCoursePageFeed.js');
const getCourseReviewPageTopRow = require('./helpers/GET_Routes/getCourseReviewPageTopRow.js');
const getCourseReviewPageReviews = require('./helpers/GET_Routes/getCourseReviewPageReviews.js');
const getDocPageTopRow = require('./helpers/GET_Routes/getDocPageTopRow.js');
const getDocPageRevs = require('./helpers/GET_Routes/getDocPageRevs.js');
const getDocPageRevDownload = require('./helpers/GET_Routes/getDocPageRevDownload.js');
const getCompanyPageTopRow = require('./helpers/GET_Routes/getCompanyPageTopRow.js');
const getCompanyPageQas = require('./helpers/GET_Routes/getCompanyPageQas.js');
const getCompanyPageJobs = require('./helpers/GET_Routes/getCompanyPageJobs.js');
const getCompanyPageReviews = require('./helpers/GET_Routes/getCompanyPageReviews.js');
const getInstPageData = require('./helpers/GET_Routes/getInstPageData.js');
const getJobPageData = require('./helpers/GET_Routes/getJobPageData.js');
const getUserNavBarData = require('./helpers/GET_Routes/getUserNavBarData.js');
const getInstitutionsAndPrograms = require('./helpers/GET_Routes/getInstitutionsAndPrograms.js');
const getLoginCheck = require('./helpers/GET_Routes/getLoginCheck.js');
const getRightSideBarData = require('./helpers/GET_Routes/getRightSideBarData.js');
const getLeftSideBarData = require('./helpers/GET_Routes/getLeftSideBarData.js');
const getFeedPageData = require('./helpers/GET_Routes/getFeedPageData.js');
const getResumeDownload = require('./helpers/GET_Routes/getResumeDownload.js');
const getConversationPageData = require('./helpers/GET_Routes/getConversationPageData.js');
const getCourseFeedReplies = require('./helpers/GET_Routes/getCourseFeedReplies.js');
const getSearchBarResults = require('./helpers/GET_Routes/getSearchBarResults.js');
const getUsernameAvailability = require('./helpers/GET_Routes/getUsernameAvailability.js');
const getEmailAvailability = require('./helpers/GET_Routes/getEmailAvailability.js');
const getFrontPageNumbers = require('./helpers/GET_Routes/getFrontPageNumbers.js');

const postNewDoc = require('./helpers/POST_Routes/postNewDoc.js');
const postNewRevision = require('./helpers/POST_Routes/postNewRevision.js');
const postNewLikeDislike = require('./helpers/POST_Routes/postNewLikeDislike.js');
const postNewCourseFeed = require('./helpers/POST_Routes/postNewCourseFeed.js');
const postNewCourseFeedReply = require('./helpers/POST_Routes/postNewCourseFeedReply.js');
const postNewCourseUser = require('./helpers/POST_Routes/postNewCourseUser.js');
const postNewCourseUserAssistReq = require('./helpers/POST_Routes/postNewCourseUserAssistReq.js');
const postNewCourseReview = require('./helpers/POST_Routes/postNewCourseReview.js');
const postNewItemForSale = require('./helpers/POST_Routes/postNewItemForSale.js');
const postNewCourse = require('./helpers/POST_Routes/postNewCourse.js');
const postNewInst = require('./helpers/POST_Routes/postNewInst.js');
const postNewUser = require('./helpers/POST_Routes/postNewUser.js');
const postLogin = require('./helpers/POST_Routes/postLogin.js');
const postNewFlag = require('./helpers/POST_Routes/postNewFlag.js');
const postNewInterviewQuestion = require('./helpers/POST_Routes/postNewInterviewQuestion.js');
const postNewInterviewAnswer = require('./helpers/POST_Routes/postNewInterviewAnswer.js');
const postNewCompanyReview = require('./helpers/POST_Routes/postNewCompanyReview.js');
const postNewResume = require('./helpers/POST_Routes/postNewResume.js');
const postNewResumeReviewFeed = require('./helpers/POST_Routes/postNewResumeReviewFeed.js');
const postNewConversation = require('./helpers/POST_Routes/postNewConversation.js');
const postNewConvMessage = require('./helpers/POST_Routes/postNewConvMessage.js');
const postNewPasswordChangeRequest = require('./helpers/POST_Routes/postNewPasswordChangeRequest.js');

const updateUserProfile = require('./helpers/UPDATE_Routes/updateUserProfile.js');
const updateCourseUserTutorStatus = require('./helpers/UPDATE_Routes/updateCourseUserTutorStatus.js');
const updateTutorLog = require('./helpers/UPDATE_Routes/updateTutorLog.js');
const updateItemForSale = require('./helpers/UPDATE_Routes/updateItemForSale.js');
const updateResume = require('./helpers/UPDATE_Routes/updateResume.js');
const updateUserRegisterConfirm = require('./helpers/UPDATE_Routes/updateUserRegisterConfirm');
const updateUserPassword = require('./helpers/UPDATE_Routes/updateUserPassword.js');

const deleteRevision = require('./helpers/DELETE_Routes/deleteRevision.js');
const deleteCourseFeed = require('./helpers/DELETE_Routes/deleteCourseFeed.js');
const deleteCourseUser = require('./helpers/DELETE_Routes/deleteCourseUser.js');
const deleteResume = require('./helpers/DELETE_Routes/deleteResume.js');
const deleteResumeReviewRequest = require('./helpers/DELETE_Routes/deleteResumeReviewRequest.js');
const deleteItemForSale = require('./helpers/DELETE_Routes/deleteItemForSale.js');
const deleteConversation = require('./helpers/DELETE_Routes/deleteConversation.js');


// ***************************************************
// ROUTES - GET
// ***************************************************

app.get('/api/users/:user_id', (req, res) => {
  getUserProfileData(req, res, knex, req.session.user_id);
});


// ********************* COURSE PAGE ***************************
app.get('/api/courses/:course_id/toprow', (req, res) => {
  getCoursePageTopRow(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/types/:doc_type', (req, res) => {
  getCoursePageDocs(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/items', (req, res) => {
  getCoursePageItems(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/feed', (req, res) => {
  getCoursePageFeed(req, res, knex, req.session.user_id);
});


// ****************** COURSE REVIEW PAGE ************************
app.get('/api/courses/:course_id/reviews/toprow', (req, res) => {
  getCourseReviewPageTopRow(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/reviews/reviews', (req, res) => {
  getCourseReviewPageReviews(req, res, knex, req.session.user_id);
});


// ********************* DOC PAGE ***************************
app.get('/api/courses/:course_id/docs/:doc_id/toprow', (req, res) => {
  getDocPageTopRow(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/:doc_id/revisions', (req, res) => {
  getDocPageRevs(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/docs/:doc_id/revisions/:rev_id/download', (req, res) => {
  getDocPageRevDownload(req, res, knex, req.session.user_id);
});


// ********************* INDEX PAGE ***************************
app.get('/api/index', (req, res) => {
  getIndexPageData(req, res, knex, req.session.user_id);
});


// ********************* INST PAGE ***************************
app.get('/api/institutions/:inst_id', (req, res) => {
  getInstPageData(req, res, knex, req.session.user_id);
});


// ********************* COMPANY PAGE ***************************
app.get('/api/companies/:company_id/toprow', (req, res) => {
  getCompanyPageTopRow(req, res, knex, esClient);
});

app.get('/api/companies/:company_id/qas', (req, res) => {
  getCompanyPageQas(req, res, knex, req.session.user_id);
});

app.get('/api/companies/:company_id/jobs', (req, res) => {
  getCompanyPageJobs(req, res, esClient, req.session.user_id);
});

app.get('/api/companies/:company_id/reviews', (req, res) => {
  getCompanyPageReviews(req, res, knex, req.session.user_id);
});


app.get('/api/jobs', (req, res) => {
  getJobPageData(req, res, knex, req.session.user_id, esClient);
});


app.get('/api/rightsidebar', (req, res) => {
  getRightSideBarData(req, res, knex, req.session.user_id);
});

app.get('/api/leftsidebar', (req, res) => {
  getLeftSideBarData(req, res, knex, req.session.user_id);
});

app.get('/api/login/check', (req, res) => {
  getLoginCheck(req, res);
});

app.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.send(true);
});

app.get('/api/usernavbardata', (req, res) => {
  getUserNavBarData(req, res, knex, req.session.user_id);
});

app.get('/api/institutions_programs', (req, res) => {
  getInstitutionsAndPrograms(req, res, knex, req.session.user_id);
});

app.get('/api/users/:user_id/feed', (req, res) => {
  getFeedPageData(req, res, knex, req.session.user_id);
});

app.get('/api/resumes/:resume_id', (req, res) => {
  getResumeDownload(req, res, knex, req.session.user_id);
});

app.get('/api/chatroom', (req, res) => {
  res.send({text: 'Hello world'});
});

app.get('/api/conversations', (req, res) => {
  getConversationPageData(req, res, knex, req.session.user_id);
});

app.get('/api/courses/:course_id/feed/:course_feed_id/replies', (req, res) => {
  getCourseFeedReplies(req, res, knex, req.session.user_id);
});

app.get('/api/searchbar', (req, res) => {
  getSearchBarResults(req, res, esClient);
});

app.get('/api/username_availability', (req, res) => {
  getUsernameAvailability(req, res, knex, req.session.user_id);
});

app.get('/api/email_availability', (req, res) => {
  getEmailAvailability(req, res, knex, req.session.user_id);
});

app.get('/api/front_page_numbers', (req, res) => {
  getFrontPageNumbers(req, res, knex, esClient);
});

// ***************************************************
// ROUTES - POST
// ***************************************************
app.post('/api/courses', (req, res) => {
  postNewCourse(req, res, knex, req.session.user_id, esClient, randIdString);
});

app.post('/api/courses/:course_id/docs', documentUpload.single('file'), (req, res) => {
  req.file ? postNewDoc(req, res, knex, req.session.user_id, esClient, randIdString) : res.send(false);
});

app.post('/api/courses/:course_id/items', itemForSaleUpload.single('file'), (req, res) => {
  postNewItemForSale(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/courses/:course_id/reviews', (req, res) => {
  postNewCourseReview(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/courses/:course_id/docs/:doc_id', documentUpload.single('file'), (req, res) => {
  postNewRevision(req, res, knex, req.session.user_id, esClient, randIdString);
});

app.post('/api/likes/:foreign_table/:foreign_id', (req, res) => {
  postNewLikeDislike(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/courses/:course_id/feed', (req, res) => {
  postNewCourseFeed(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/courses/:course_id/feed/:course_feed_id/replies', (req, res) => {
  postNewCourseFeedReply(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/users/:user_id/courses/:course_id', (req, res) => {
  postNewCourseUser(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/users/:user_id/resumes', resumeUpload.single('file'), (req, res) => {
  req.file ? postNewResume(req, res, knex, req.session.user_id, randIdString) : res.send(false);
});

app.post('/api/feed/resumes/:resume_id', (req, res) => {
  postNewResumeReviewFeed(req, res, knex, req.session.user_id);
});

app.post('/api/users/:user_id/courses/:course_id/tutorlog', (req, res) => {
  postNewCourseUserAssistReq(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/institutions', (req, res) => {
  postNewInst(req, res, knex, req.session.user_id, esClient, randIdString);
});

app.post('/api/register', (req, res) => {
  postNewUser(req, res, knex, bcryptjs, mailer, randIdString);
});

app.post('/api/flags/:foreign_table/:foreign_id', (req, res) => {
  postNewFlag(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/companies/:company_id/questions', (req, res) => {
  postNewInterviewQuestion(req, res, knex, req.session.user_id, esClient, randIdString);
});

app.post('/api/companies/:company_id/questions/:question_id/answers', (req, res) => {
  postNewInterviewAnswer(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/companies/:company_id/reviews', (req, res) => {
  postNewCompanyReview(req, res, knex, req.session.user_id, esClient, randIdString);
});

app.post('/api/conversations', (req, res) => {
  postNewConversation(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/conversations/:conversation_id', (req, res) => {
  postNewConvMessage(req, res, knex, req.session.user_id, randIdString);
});

app.post('/api/login', (req, res) => {
  postLogin(req, res, knex, bcryptjs);
});

app.post('/api/forgot_account', (req, res) => {
  postNewPasswordChangeRequest(req, res, knex, bcryptjs, mailer, randIdString);
});


// ***************************************************
// ROUTES - UPDATE
// ***************************************************
app.put('/api/users/:user_id', userPhotoUpload.single('file'), (req, res) => {
  updateUserProfile(req, res, knex, req.session.user_id, googleMapsClient);
});

app.put('/api/users/:user_id/courses/:course_id/tutor', (req, res) => {
  updateCourseUserTutorStatus(req, res, knex, req.session.user_id);
});

app.put('/api/users/:user_id/courses/:course_id/tutorlog/update', (req, res) => {
  updateTutorLog(req, res, knex, req.session.user_id);
});

app.put('/api/courses/:course_id/items/:item_id', itemForSaleUpload.single('file'), (req, res) => {
  updateItemForSale(req, res, knex, req.session.user_id);
});

app.put('/api/users/:user_id/resumes/:resume_id', resumeUpload.single('file'), (req, res) => {
  updateResume(req, res, knex, req.session.user_id);
});

app.put('/api/confirm_register', (req, res) => {
  updateUserRegisterConfirm(req, res, knex);
});

app.put('/api/reset_password', (req, res) => {
  updateUserPassword(req, res, knex, bcryptjs);
});


// ***************************************************
// ROUTES - DELETE
// ***************************************************
app.delete('/api/courses/:course_id/docs/:doc_id/revisions/:rev_id', (req, res) => {
  deleteRevision(req, res, knex, req.session.user_id, esClient);
});

app.delete('/api/courses/:course_id/feed/:feed_id', (req, res) => {
  deleteCourseFeed(req, res, knex, req.session.user_id);
});

app.delete('/api/users/:user_id/courses/:course_id', (req, res) => {
  deleteCourseUser(req, res, knex, req.session.user_id);
});

app.delete('/api/users/:user_id/resumes/:resume_id', (req, res) => {
  deleteResume(req, res, knex, req.session.user_id);
});

app.delete('/api/feed/resumes/:resume_id', (req, res) => {
  deleteResumeReviewRequest(req, res, knex, req.session.user_id);
});

app.delete('/api/courses/:course_id/items/:item_id', (req, res) => {
  deleteItemForSale(req, res, knex, req.session.user_id);
});

app.delete('/api/conversations/:conversation_id', (req, res) => {
  deleteConversation(req, res, knex, req.session.user_id);
});
