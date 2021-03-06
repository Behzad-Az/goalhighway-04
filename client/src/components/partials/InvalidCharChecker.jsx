const InvalidCharChecker = (str, maxChar, type) => {
  let regEx;

  switch (type) {
    case 'username':
      regEx = new RegExp(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/);
      break;
    case 'password':
      regEx = new RegExp(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/);
      break;
    case 'coursePrefix':
      regEx = new RegExp(/[^a-zA-Z0-9]/);
      break;
    case 'courseSuffix':
      regEx = new RegExp(/[^a-zA-Z0-9]/);
      break;
    case 'courseDesc':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'courseFeed':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'courseReview':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'profName':
      regEx = new RegExp(/[^a-zA-Z\ \_\-\'\,\.\`]/);
      break;
    case 'tutorRequest':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'revTitle':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'revDesc':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'convSubject':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\$\#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'convContent':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'instLongName':
      regEx = new RegExp(/[^a-zA-Z\ \-\_\'\.]/);
      break;
    case 'instShortName':
      regEx = new RegExp(/[^a-zA-Z\ \-\_\'\.]/);
      break;
    case 'interviewAnswer':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'interviewQuestion':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'itemTitle':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\$\!\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'itemDesc':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\$\!\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'itemPrice':
      regEx = new RegExp(/[^a-zA-Z0-9\ \$\*\(\)\_\-\,\.\[\]]/);
      break;
    case 'resumeTitle':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'resumeIntent':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'postalCode':
      regEx = new RegExp(/[^a-zA-Z0-9\ ]/);
      break;
    case 'jobPosition':
      regEx = new RegExp(/[^a-zA-Z0-9\ \-\_\(\)\'\\/\\.]/);
      break;
    case 'reviewerBackground':
      regEx = new RegExp(/[^a-zA-Z0-9\ \-\_\(\)\'\\/\\.]/);
      break;
    case 'jobPros':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'jobCons':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;

    case 'companyName':
      regEx = new RegExp(/[^a-zA-Z0-9\ \-\_\(\)\'\\/\\.]/);
      break;
    case 'jobPhotoName':
      regEx = new RegExp(/[^a-zA-Z0-9\ \-\_\.]/);
      break;
    case 'jobSearchTags':
      regEx = new RegExp(/[^a-zA-Z0-9\ \-\_]/);
      break;
    case 'jobLink':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'jobLocation':
      regEx = new RegExp(/[^a-zA-Z0-9\ \-\_\(\)\'\,\.]/);
      break;

    default:
      regEx = 'iL5mdXEbyY';
      break;
  }

  return str.length > maxChar ||
         str.search(regEx) != -1;
};

export default InvalidCharChecker;
