module.exports = Object.freeze({
    
        "introMsg":"Welcome to <amazon:emotion name=\"excited\" intensity=\"medium\">Total Recall.</amazon:emotion>, a fun game to enhance your memory, by Physeek Fit. \
                   Say Help to know how to play the game or to start the game say 60s, 70s, 80, or 90s.",
        "levelMsg":`You are on level %d`,
        "lastMsg":"Would you like to play again?",
        "card_title" :"Total Recall ... by Physeek Fit",
        "gap500ms":`<break time="500ms"/>`,
        "gap800ms":`<break time="800ms"/>`,
        "documentName":"MusicalMemoraizerDoc",
        "token":"MusicalMemoraizerToken",
        "decadeChoiceMsg":"To choose a decade say 60s,70s,80s or 90s",
        "userChoice":`You have chosen the exciting decade of the <amazon:emotion name="excited" intensity="high">%s.</amazon:emotion> To start or continue the game say <amazon:emotion name="excited" intensity="high">Rock On.</amazon:emotion>`,
        "beginlevelMsg":`You are in level %d and your score is %d. The chosen bands from the %s are`,
        "levelStartMsg" :`You will now hear random band names. If the band was present in the chosen list say yes or else say no. The first band is `,
        "triviaMsg" : `An interesting trivia from the %s %s %s`,
        "nextlevelMsg":`This completes level %d. %s %s %s To continue to next level say rock on. If you want to switch to a different decade say 60s,70s,80s, or 90s`,
        "quiz_start_level":1,
        "quiz_end_level":5,
        "question":"%s",
        "gameoverMsg":"Game Over! Congrats, you scored %s points",
        "helpMsg":
                   "<amazon:emotion name=\"excited\" intensity=\"medium\">Total Recall</amazon:emotion> by Physeek Fit is a game designed to improve short term memory using popular artist bands from the 60s through the 90s.\
                    Choose a decade and listen to a list of famous bands from that era.\
                    After you hear the random chosen list, you will be asked if a random artist/band was in the chosen list. \
                    Say yes or no to record your answer. You get 10 points for every correct answer.\
                    The chosen list and number of questions gradually increase at each level.\
                    You can also change the decade in between the game after each level without affecting your score",


"decades":{"60s":"60s","sixty":"60s","sixties":"60s","60":"60s","1960s":"60s",
"70s":"70s","seventy":"70s","seventies":"70s","70":"70s","1970s":"70s",
"80s":"80s","eighty":"80s","eighties":"80s","80":"80s","1980s":"80s",
"90s":"90s","ninety":"90s","nineties":"90s","90":"90s","1990s":"90s"
},
        
 "datasource" : {
        "detailImageRightData": {
            "type": "object",
            "objectId": "detailImageRightSample",
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://physeek.fit/tools/asmm/vinyl.png",
                        "size": "large"
                    }
                ]
            },
            "title": "Total Recall",
            "subtitle": "A fun game to enhance your memory",
            "image": {
                "contentDescription": "",
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "sources": [
                    {
                        "url": "https://physeek.fit/tools/asmm/decadesvin.png",
                        "size": "large"
                    }
                ]
            },
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": "Next Band Name"
                },
                "rating": {
                    "text": ""
                },
                "locationText": {
                    "type": "PlainText",
                    "text": "Decade Name"
                },
                "bodyText": {
                    "type": "PlainText",
                    "text": "Level : 10<br>Score: 100"
                }
            },
            "logoUrl": "https://physeek.fit/tools/asmm/logo.png"
        }
    }


    
   
});
