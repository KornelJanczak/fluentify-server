import * as googleCloud from '@google-cloud/text-to-speech';

export interface IGenerateAudioRequest
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechRequest {}

export interface IAudioContent
  extends googleCloud.protos.google.cloud.texttospeech.v1
    .ISynthesizeSpeechResponse {}

export interface IVoice
  extends googleCloud.protos.google.cloud.texttospeech.v1.IVoice {}
