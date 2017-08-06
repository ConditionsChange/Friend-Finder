//API Routes

module.exports = function(app,path,friends){

    //send back friends array from database
    app.get('/api/friends', function(req, res){
        res.send(friends);
    });


    //from survey page add new friend information to database and send back matched friend to client
    app.post('/api/friends', function(req, res){

        var tempFriends = friends.slice();
        var check = containsFriend(req.body,friends) //return the index of the friend already in the database. Return false if a new friend is added
        if (check != false){ //if the submitted friend information is already in the database
            tempFriends.splice(check,1) //temporarily remove the friend from the database so he/she does not get matched up with himself/herself
        }

        // compare submitted friend information with entire riend database
        var compatibility = [] //array that holds the compatibility scores. Lower values means more compatability. 
        
        for (var i =0;i<tempFriends.length;i++){ // for every friend in the database
            var friendComparison = []; //array for holding the scores of a 1-on-1 comparison
            for (var j=0;j < req.body.scores.length;j++) { //for every score in the ith friend
                friendComparison.push(Math.abs(req.body.scores[j] - tempFriends[i].scores[j])); //take the absolute value of the difference of every score
            }
            var total = friendComparison.reduce(getSum);
            compatibility.push(total);
        }

        var indexOfBestMatch = findSmallest(compatibility); //get the index of the friend with the most compatibility
        console.log("\nCompatibility Array:");
        console.log(compatibility);
        console.log("Best match for \"" + req.body.name + "\" is \"" + friends[indexOfBestMatch].name + "\" with a compatibility score of " +  compatibility[indexOfBestMatch].toString() + ".");
        res.send(tempFriends[indexOfBestMatch]); //send back to client best match

        if (check === false){
            friends.push(req.body); //add new friend info to database if not already in the database        
            console.log("New friend \""+ req.body.name + "\" added to the database.")
        }

        return friends;
    });

}

//compare names to check if submitted friend information is already in the database
function containsFriend(newFriend, friends) {
    for (var i = 0; i < friends.length; i++) {
        if (newFriend.name == friends[i].name) {
            return i;
        }
    }
    return false;
}

//use reduce and getSum to total up values in score array
function getSum(total, num) {
    return total + num;
}

//find the index of the best match by finding the smallest value in the compatability array
function findSmallest (array){
    var lowestIndex = 0;
    var lowestValue = array[0];
    for (var i=0;i<(array.length-1);i++){
        if (array[i+1] < lowestValue){
            lowestIndex = i+1;
            lowestValue = array[i+1];
        }
    }

    return lowestIndex;
}