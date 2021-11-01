


// We normally receive names in order LAST-FIRST from tiger scheduler
exports.formatName = (name) => {

    if(!name || name.length == 0) {
        return '';
    }

    // Put into format FIRST LAST
    var names = name.trim().split(" ", 3);
    var formatted = '';
    
    if(names.length > 2) { // Handle Middle names included
    } else if(names.length == 1) { // Handle only one name given
    } else { // Swap first and last name 
        var last = names[0];
        last = last.substring(0, last.length - 1); //Strip comma
        var first = names[1];
        formatted = first + ' ' + last;
    }

    console.log('Name formatted from ' + name + ' to ' + formatted);
    return formatted;
}


exports.formatCollege = (courseInfo) => {
    var blockStart = courseInfo.indexOf('Coll of');
    var blockEnd = courseInfo.indexOf(']', blockStart);
    var college = courseInfo.substring(blockStart, blockEnd);

    console.log('Course Info formatted from: ' + courseInfo + ' to college name:  ' + college);
    return college;
}


exports.formatPercent = (percent) => {
    var formatted = percent;
    // Handle percentage is 100% (we need 4 chars instead of 3)
    if(formatted === '00%') {
        return '100%';

    } else if(formatted === 'N/A' ) {
        return 'N/A';
        
        //Handle percentage is < 10% )
    } else if(formatted.replace(/[^0-9.]/g,'').length < 2) { //Regex strips everything except digits and decimals
        formatted = formatted.substring(1);
    }

    return formatted;
}