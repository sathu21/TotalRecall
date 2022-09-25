/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const bandlist  = require('./bandlist');
const constants = require('./constants');
const sounds    = require('./bkgsounds');
const util = require('util');

const quiz_data = bandlist.quiz_data;
const decades=constants.decades;

const DOCUMENT_ID = "BandResponse";


const createDirectivePayload = (dataSources = {}, tokenId = "documentToken") => {
    return {
        type: "Alexa.Presentation.APL.RenderDocument",
        token: tokenId,
        document: {
            type: "Link",
            src: "doc://alexa/apl/documents/" + DOCUMENT_ID
        },
        datasources: dataSources
    }
};

function get_apl_directive(name,band,level,score,imgurl){
            const datasource = constants.datasource;
            
            
            datasource.detailImageRightData.textContent.primaryText.text=band;
            datasource.detailImageRightData.textContent.locationText.text=name;
            datasource.detailImageRightData.textContent.bodyText.text=`Level ${level}<br>Score : ${score}`;
            datasource.detailImageRightData.image.sources[0].url=imgurl;
            
            const aplDirective = createDirectivePayload(datasource);
            return(aplDirective);    
}



function getlist(len,maxlen){
    const arr=[];
    while(len>0){
        let idx = Math.floor(Math.random()*maxlen);
        if(!arr.includes(idx)){
            arr.push(idx);
            len--;
        }
    }
    return arr;
}

function get_randomized_list(len,maxlen){
   var ann_idx=getlist(len,maxlen);
   var quiz_idx=getlist(len,maxlen);
  var qlen = quiz_idx.length/2;
  while(qlen>0){
      let src = ann_idx[Math.floor(Math.random()*len)];
      if(!quiz_idx.includes(src)){
        quiz_idx[Math.floor(Math.random()*len)]=src;
        qlen--;
      }
  }
   return {ann_idx,quiz_idx};
}

function getItems(bands,idxs){
    const itemlist=[]
    while(idxs.length>0){
        itemlist.push(bands[idxs.shift()]);
    }
    return itemlist;
}

function get_bandlist(selected_decade,len){
    const bands = quiz_data[selected_decade]["bands"];
    const indexes = get_randomized_list(len,bands.length);
    const announce_list = getItems(bands,indexes.ann_idx);
    const quiz_list = getItems(bands,indexes.quiz_idx);
    return {announce_list,quiz_list};
}

function get_trivia(selected_decade){
    const idx = Math.floor(Math.random() *10);
    const trivia = quiz_data[selected_decade]["trivia"][idx];
    return trivia; 
    
}



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = sounds.start_snd + constants.introMsg;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.score = 0;
        sessionAttributes.level = constants.quiz_start_level;
        
         
        handlerInput.responseBuilder.addDirective(get_apl_directive(constants.decadeChoiceMsg,"60s,70s,80s,90s",constants.quiz_start_level,0,quiz_data.decadeImg[0]));
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(constants.decadeChoiceMsg)
            .withSimpleCard(constants.card_title, constants.decadeChoiceMsg)
            .withShouldEndSession(false)
            .getResponse();
    }
};



const ChoiceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChoiceIntent';
    },
    
    handle(handlerInput) {
        const user_choice = handlerInput.requestEnvelope.request.intent.slots.user_choice.value;
        var speakOutput=user_choice;
        var name="";
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        
        var current_score =sessionAttributes.score;
        var current_level = sessionAttributes.level;
        const len = 2*current_level+2;
        const selected_decade = decades[user_choice];
        
        var imgurl = quiz_data.decadeImg[1];
       
        if(selected_decade){
              name = quiz_data[selected_decade].name;
              const bandlist = get_bandlist(selected_decade,len);

              sessionAttributes.selected_decade = selected_decade;
              sessionAttributes.name = name;
              sessionAttributes.bandlist = bandlist;
              speakOutput =  util.format(constants.userChoice,name); //`You have chosen the decade <amazon:emotion name="excited" intensity="medium">${name}. Say Rock On</amazon:emotion> to start the game.`;
              imgurl = quiz_data[selected_decade]["bkgimgurl"];
        }else{
             speakOutput = constants.decadeChoiceMsg;    
        }
        
        handlerInput.responseBuilder.addDirective(get_apl_directive(name,"ROCK ON",current_level,current_score,imgurl));
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(constants.card_title,constants.name)
            .withShouldEndSession(false)
            .getResponse();
    }
};


const MemoryTestIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MemoryTestIntent';
    },
    
    handle(handlerInput) {
        
     
        var endSession=false; 
        const user_response = (handlerInput.requestEnvelope.request.intent.slots.user_response.value).toLowerCase().replace(" ","");
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const selected_decade = sessionAttributes.selected_decade;
        const name = sessionAttributes.name;
        const announce_list = sessionAttributes.bandlist.announce_list;
        const quiz_list = sessionAttributes.bandlist.quiz_list;
        const ans = sessionAttributes.ans;
        
        var current_score = sessionAttributes.score;
        var current_level = sessionAttributes.level;
        
        var imgurl = quiz_data[selected_decade]["bkgimgurl"];
        
        var itemlist = "";
        const beginlevelMsg = util.format(constants.beginlevelMsg,current_level,current_score,name);
        //`You are in level ${current_level} and your score is ${current_score}. The chosen bands from the ${name} are`;
        const levelStartMsg = util.format(constants.levelStartMsg);
        //`You will now hear random band names. If the band was present in the chosen list say yes or else say no.`;
        const trivia = get_trivia(selected_decade);
        const triviaMsg = util.format(constants.triviaMsg,selected_decade,constants.gap500ms,trivia);
        //`An interesting trivia from the ${selected_decade} ${gap500ms} ${trivia}.`;
        const nextlevelMsg  =  util.format(constants.nextlevelMsg,current_level,sounds.level_over_snd,triviaMsg, constants.gap500ms);
        //`This completes level ${current_level}. ${triviaMsg} ${gap500ms} To continue to next level say rock on. If you want try a different decade say 60s,70s,80s, or 90s`;
        
        
        var speakOutput=""; 
        
        if(ans && user_response === ans){
            speakOutput = sounds.right_ans_snd+"Correct";
            current_score = current_score + 10;
            sessionAttributes.score = current_score;
        }else if( user_response === "rockon" ){ //begin level
             for(const item in announce_list) {
                  itemlist = itemlist + constants.gap800ms + announce_list[item] ;
            }
            speakOutput = beginlevelMsg + itemlist + constants.gap500ms + levelStartMsg + constants.gap800ms ;
        }else{
            speakOutput = sounds.wrong_ans_snd+"Incorrect";
        }

        //  //next q
         var next_band = "TRIVIA";
         if(quiz_list.length > 0){
            var next_ans="";
            next_band = quiz_list.shift();
            speakOutput = speakOutput + constants.gap800ms + util.format(constants.question,next_band);
            //`Was ${next_band} in the chosen list?`; 
            if(next_band && announce_list.includes(next_band)){
                 next_ans = "yes";
            }else{
                 next_ans="no";
            }
            sessionAttributes.ans = next_ans;
         }else{
             if(current_level<constants.quiz_end_level){
                const bandlist = get_bandlist(selected_decade,announce_list.length+1);
                sessionAttributes.bandlist = bandlist;
                sessionAttributes.level = current_level + 1;
                imgurl = quiz_data.decadeImg[1];
                speakOutput = speakOutput + constants.gap500ms + nextlevelMsg;
             }else{
                 endSession = true;
                 const endgameMsg = util.format(constants.gameoverMsg,current_score);
                 speakOutput = speakOutput + constants.gap800ms + endgameMsg + sounds.game_over_snd;
                 next_band="GAME OVER!"
             }
         }
         
  
         
         
        handlerInput.responseBuilder.addDirective(get_apl_directive(name,next_band,current_level,current_score,imgurl));
         
         
         return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard(constants.card_title,next_band)
            .withShouldEndSession(endSession)
            .getResponse();
         
    }
};




const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = constants.helpMsg;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ChoiceIntentHandler,
        MemoryTestIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();