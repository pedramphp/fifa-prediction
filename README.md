Fifa Prediction Program
===============

#Setup Instance
---------------------
```sh
npm install
grunt // this will run your application 


// you can also pass environment vars for Production
sudo HOST='0.0.0.0' forever start app.js   
//or
node HOST='0.0.0.0' app.js

//stop your server
forever stop app.js

Under script folder
// to generate all the basic data run.
node load-data.js

// for update call
node update.js

//--------------------------------------

//UNDER THE SRC/SCRIPT FOLDER

//will remove all collections and run all the scripts below
node load-data.js

// remove all collections
node clean-collections.js


// create user records first (ONE TIME DEAL)
node create-users.js

// create teams collection. (ONE TIME DEAL)
node create-teams.js

//create matches collection (ONE TIME DEAL)
node create-matches.js


// create empty prediction list based on users. (ONE TIME DEAL)
node create-empty-prediction.js

// read users predictions and update databse records. (ONE TIME DEAL)
node insert-user-prediction.js

// update each user prediction match score based on the current matches.
node update-prediction-scores.js

// ONCE you setup every thing you need to run these commands everyday after matches are finished. or run cronjob.
//------------------------------------

// will run the below commands.
node update.js

// update match table with new scores.
node update-match-scores.js

// re-run user prediction match
node update-prediction-scores.js


```

#API
------------------

### All Matches - includes the match score
-----------------
```url
http://worldcup.kimonolabs.com/api/matches?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a
```

###All Qualified Teams
---------------------------
```url
http://worldcup.kimonolabs.com/api/teams?apikey=ad2ff693e51d4cc636bdd59c3daf4e2a
```

#Game Rules
-----------------

Group Stage:

5 points for each exact score line of each game.

3 points for each prediction of the correct winner with the correct goal difference.

1 point for predicting the correct winner/tie game. (Clarification: In Case of a Tie, The only possible points to get are 5 & 1. No possibility of 3 points for a tie!)

4 points for prediction [by correct order] of the top 2 teams advancing of each group

2 point is given for prediction of the top 2 teams of each group by an incorrect order

Knock Out Stage:

4 points are given for the correct prediction of each team in the Quarter-Finals (Last 8)

7 points are given for the correct prediction of each team in the Semi-Finals (Last 4)

8 points are given for the correct prediction of each team in the final

5 points are given for the correct prediction of the 3rd place team of the tournament

7 points are given for the prediction of the tournament’s runner-up

10 points are given for the prediction of the world cup champions

6 points are given for the prediction of the Top-Goal-Scorer of the Tournament
