import { Component } from '@angular/core';

// Importing the live-camera dependencies

import { CameraPreview, CameraPreviewDimensions, CameraPreviewOptions, CameraPreviewPictureOptions } from '@ionic-native/camera-preview/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TextToSpeech } from '@ionic-native/text-to-speech/ngx'
import { Vibration } from '@ionic-native/vibration/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {


  currentQuestion: any;
  currentImage: any;
  currentSessionKey:Number;
  commands = {
    'welcome':'Hello User! Welcome to a whole new experience. I am Vision, your assistant.',
    'instructions':'Click the lower area of mobile for interacting with me. You will sense vibration when the area will be clicked.',
    'commands':'Use these commands',
    'commandClick':'Click',
    'commandClickDescription':'Use the click command to click the image.',
    'commandQuesion':'Question',
    'commandQuestionDescription':'Use the question command to ask a question.',
    'commandRead':'Read',
    'commandReadDescription':'Use the reed command to know text on image.',
    'commandList':'List of commands : Click, Question, Read'
  }

  /* Initialising all the dependencies for app*/
  constructor(private cameraPreview: CameraPreview, private speechRecognition: SpeechRecognition, private http: HttpClient,private tts: TextToSpeech,private vibration: Vibration) {
    this.cameraPreview.startCamera(this.cameraPreviewOptions);

    // Making the user familiar with app on every new load.
    this.tts.speak({
      text:this.commands.welcome+' '+this.commands.instructions+
      ' '+this.commands.commands+' '+
      ', '+'Command one'+', '+this.commands.commandClick+', '+this.commands.commandClickDescription+
      ', '+'Command two'+', '+this.commands.commandQuesion+', '+this.commands.commandQuestionDescription+
      ', '+'Command three'+', '+this.commands.commandRead+', '+this.commands.commandReadDescription+
      ', '+'I will repeat the commands, '+this.commands.commandList
    })
  }


  cameraPreviewOptions: CameraPreviewOptions = {

    x: 0,
    y: 80,
    width: window.screen.width,
    height: 500,
    camera: 'rear',
    tapPhoto: true,
    toBack: true,
    alpha: 1,
    // storeToFile:true
  }

/* To specify the image quality*/ 
  pictureOpts: CameraPreviewPictureOptions = {
    width: 400,
    height: 300,
    quality: 70,
  }

  /* Handling the Speech Question*/
  // public inputQuestion() {
  //   this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
  //     if (hasPermission) {
  //       this.speechRecognition.startListening().subscribe((matches: string[]) => {
  //         this.question = matches[0];
  //         console.log('question asked : ' + matches[0])
  //       })
  //     } else {
  //       this.speechRecognition.requestPermission()
  //     }
  //   })
  //   console.log('Capture Speech Question!')
  //   console.log('Captured Image\n' + this.questionImage)

  // }

/* Handling the Image (base64) Question*/

  // public inputImage() {
  //   this.cameraPreview.takePicture(this.pictureOpts).then(
  //     (base64Image) => { this.questionImage = base64Image }
  //   )

  //   this.sessionKey = Math.floor(Math.random() * 1000000);
  //   console.log('Capture Image!')
  // }


  // public testAPI(){
  //   var sessionData = {
  //     "Image" : this.questionImage,
  //     "Session-Key":this.sessionKey,
  //     "Question":this.question
  //   };

  //   var httpOptions = {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     })
  //   }

  //   var headers = new HttpHeaders().set('Content-Type','application/json');
  //   this.http.post('https://imageupload.anvil.app/_/api/v1/base64ImageUpload',sessionData,httpOptions).subscribe(
  //     res=>{
  //       let responsePayload = JSON.parse(JSON.stringify(res))
  //       this.tts.speak(responsePayload.answer)
  //     }
  //   )
  // }


  // public testAPI() {
  //   console.log('API-CONN clicked');
  //   var formData = new FormData();
  //   formData.append("questionText", this.question)
  //   formData.append("questionImage", this.questionImage)


  //   this.http.post('http://192.168.0.101:5000/api/predict', formData).subscribe(
  //     (res) => { console.log(res) }
  //   )
  // }

  public async delay(ms:number){
    return new Promise(resolve=>{setTimeout(resolve,ms)})
  }

  public async askAssistant(){

    this.vibration.vibrate(1000);
    await this.delay(2000);
    this.inputCommand();
  }

  public inputCommand(){
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (hasPermission) {
        this.tts.speak('Enter the command after beep')
        .then(()=>{
                this.speechRecognition.startListening().subscribe((matches: string[]) => {
                var currentCommand = matches[0];
                console.log('command entered : ' + currentCommand);
                if (currentCommand=='question'){
                  this.tts.speak('Please enter the question')
                  .then(()=>{
                    this.inputQuestion()
                  })
                }else if(currentCommand=='click'){
                  this.tts.speak('Taking Image')
                  .then(()=>{
                    this.clickImage();
                  })
                }else if(currentCommand=='read'){
                  this.tts.speak('Taking Reading')
                  .then(()=>{
                    this.readText();
                  });
                }else{
                  this.tts.speak('Invalid Command');
                }
              })
          })
      } else {
        this.speechRecognition.requestPermission()
      }
    })
  }

  public inputQuestion(){
    this.speechRecognition.hasPermission().then((hasPermission: boolean) => {
      if (hasPermission) {
        this.speechRecognition.startListening().subscribe((matches: string[]) => {
          this.currentQuestion = matches[0];
          console.log('question entered : ' + matches[0]);
          this.getAnswer();
        })
      } else {
        this.speechRecognition.requestPermission()
      }
    })
  }

  public clickImage(){
    this.cameraPreview.takePicture(this.pictureOpts).then(
      (base64Image) => { 
        this.currentImage = base64Image;
        this.currentSessionKey = Math.floor(Math.random() * 1000000);
        console.log('Capture Image!');
        console.log('Session Key : ' + this.currentSessionKey);
      }
    )
  }

  public getAnswer(){
    var sessionData = {
      "Image" : this.currentImage,
      "Session-Key":this.currentSessionKey,
      "Question":this.currentQuestion
    };

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    var headers = new HttpHeaders().set('Content-Type','application/json');
    this.http.post('https://imageupload.anvil.app/_/api/v1/base64ImageUpload',sessionData,httpOptions).subscribe(
      res=>{
        let responsePayload = JSON.parse(JSON.stringify(res))
        this.tts.speak(responsePayload.answer)
      }
    )
  }
  public readText(){
    var sessionData = {
      "Image" : this.currentImage,
      "Session-Key":this.currentSessionKey,
    };

    var httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    var headers = new HttpHeaders().set('Content-Type','application/json');
    this.http.post('https://imageupload.anvil.app/_/api/v1/readText',sessionData,httpOptions).subscribe(
      res=>{
        let responsePayload = JSON.parse(JSON.stringify(res))
        this.tts.speak(responsePayload.answer)
      }
    )
  }

}
