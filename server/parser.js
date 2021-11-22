const format = require('./format.js');
const axios = require('axios');


const searchUrlPrefix = 'https://www.ratemyprofessors.com/search/teachers?query='
const instructorUrlPrefix = 'https://www.ratemyprofessors.com/ShowRatings.jsp?tid='

exports.fetchInstructorProfiles = async (req) => {

    // Get profile for all instructors in request from server
    var resp = [];
    var instructors = req.instructors;

        for(i = 0; i < instructors.length; i++) {
            var instructor = instructors[i];

            // Handle courses with more than one instructor
            var splitNames = instructor.name.split(';');
           for(j = 0; j < splitNames.length; j++) {
            var name = format.formatName(splitNames[j]);

            // Check if response is already sending this instructor's names
            if(resp.filter(instr => instr.name === name).length > 0) {continue;} 

            var college = format.formatCollege(instructor.courseInfo);
            var searchPage = await getSearchPage(name, college);
            var tid = parseTID(searchPage);
            var instructorProfile = await getInstructorProfileByTID(tid);
            var instructorData = await parseInstructorProfile(name, instructorProfile, tid);
            resp.push(instructorData);
           }
            
        }
  

    return resp;    
}

// Searches for an instructor and returns their profile page
 async function getSearchPage(name, college)  {

    //sid is the School ID for Auburn University
    var sid = 'U2Nob29sLTYw'
    var searchUrl = searchUrlPrefix + name + '&sid=' + sid;
    
    // Get search page for this instructor/college
     return axios.get(searchUrl)
        .then(function (response) {
        // handle success
        return response.data;
        })
        .catch(function (error) {
        // handle error
        console.log('Error getting RateMyProfessor Search Page', error);
        })
}


// Use TID to identify instructor and get their profile page
async function getInstructorProfileByTID(tid) {
    
    return axios.get(instructorUrlPrefix + tid)
        .then(function (response) {
            //handle success
        return response.data;
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
}

    //TODO: Handle case where search page finds a professor but no entries
    //      from Auburn university
    // Parse TID from search page
    function parseTID(source) {

        // Get relevant div element from HTML
        var auburnBlock = 'CardSchool__School-sc-19lmz2k-1 iDlVGM">Auburn University'
        var auburnBlockStart = source.indexOf(auburnBlock); 
        var tidDivStart = '"TeacherCard__StyledTeacherCard';
        var tidDivEnd = '">'
        //Start from offset of block relevant to employment at Auburn University
        console.log('checking auburn block at ' + (auburnBlockStart - 900));
        var start_index = source.indexOf(tidDivStart, Math.max(0, auburnBlockStart - 900));
        var end_index = source.indexOf(tidDivEnd, start_index);
        var div = source.substring(start_index, end_index + 2);

        // Parse TID from div
        start_index = div.indexOf('tid=') + 4;
        end_index = div.indexOf('">', start_index);

        return div.substring(start_index, end_index);
    }



    // Function handles collecting and structuring instructor data
 async function parseInstructorProfile (name, source, tid) {

        var teacherBlock = parseTeacherBlock(source);
        var rating = parseOverallRating(teacherBlock);
        var feedback = parseFeedback(teacherBlock);
        var link = instructorUrlPrefix + tid;

        let instructorData = {
            name: name,
            rating: rating,
            wouldTakeAgain: feedback.wouldTakeAgain,
            difficulty: feedback.difficulty,
            link: link 
        }

        return instructorData;
}


function parseTeacherBlock(source) {
    // Get relevant div element from HTML
    var blockStart = source.indexOf('<div class="TeacherRatingsPage__TeacherBlock');
    var blockEnd = source.indexOf('SimilarProfessors', blockStart);
    var teacherBlock = source.substring(blockStart, blockEnd);
    return teacherBlock;
}

    
function parseOverallRating(source) {
    var blockStart = source.indexOf('RatingValue__Numerator');
    var blockEnd = source.indexOf('</div>');
    var ratingNode = source.substring(blockStart, blockEnd);
    var rating = ratingNode.substring(ratingNode.length - 3);

    // Handle N/A Rating
    if(rating === 'N/A') {
        return 'N/A';
    }

     // Handle rating that is whole number
    var stripped = rating.replace(/[^0-9.]/g, ''); 
    if(rating !== stripped) {
       return stripped + '.0/5.0';
    }

    return rating + '/5.0';
}

function parseFeedback(source) {

    // Parse amount of ratings this professor has received
    var ratingsListStart = source.indexOf('"#ratingsList">');
    var ratingsListEnd = source.indexOf("<!--", ratingsListStart + 15);
    var ratingsCount = source.substring(ratingsListStart + 15, ratingsListEnd);

    // Parse "Would Take Again" percentage
    var blockStart = source.indexOf('FeedbackNumber');
    var blockEnd = source.indexOf('</div>', blockStart);
    var feedbackNode = source.substring(blockStart, blockEnd);
    var wouldTakeAgain = feedbackNode.substring(feedbackNode.length - 3);

    wouldTakeAgain = format.formatPercent(wouldTakeAgain);

    // Parse "Level of Difficulty" rating
    blockStart = source.indexOf('FeedbackNumber', blockEnd);
    blockEnd = source.indexOf('</div>', blockStart);
    feedbackNode = source.substring(blockStart, blockEnd);
    var difficulty = feedbackNode.substring(feedbackNode.length - 3);

    // Handle difficulty that is whole number
    var stripped = difficulty.replace(/[^0-9.]/g, ''); 
    if(difficulty !== stripped) {
        difficulty = stripped + '.0';
    }
    difficulty = difficulty + '/5.0';

    let feedback = {
        wouldTakeAgain: wouldTakeAgain,
        difficulty: difficulty,
        ratingsCount: ratingsCount
    }

    return feedback;
}





