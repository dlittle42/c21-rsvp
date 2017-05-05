var synth
var utter1,
    utter2,
    utter3,
    utter4,
    utter5

var speech = (function () {
    return {
        readySpeechSynthesis: function () {
            synth = window.speechSynthesis;
            if (synth) {
                utter1 = new SpeechSynthesisUtterance
                utter2 = new SpeechSynthesisUtterance
                utter3 = new SpeechSynthesisUtterance
                utter4 = new SpeechSynthesisUtterance
                utter5 = new SpeechSynthesisUtterance
            }

            return synth != undefined
        },
        readySpeechRecognition: function () {
            if (annyang) {
                var commands = {
                    'RSVP': function () {
                        rsvpEvents()
                    },
                    'info': function () {
                        infoEvents()
                    },
                    'back': function () {
                        backEvents()
                    }
                };
                annyang.addCommands(commands);
            } else {
                $('body').addClass('nomic')
            }
            return annyang != null
        },
        addFinalCommand: function () {
            if (annyang) {
                var commands = {
                    'OK': function () {
                        t.run()
                        submitForm()
                    }
                }
                annyang.addCommands(commands);
            }
        },
        startListening: function () {
            if (annyang)
                annyang.start()
        },
        utterPhrase: function (phrase) {
            effectShouldHappen = true
            if (globalStorage.features.speechSynth) {
                utter1.text = phrase
                synth.speak(utter1)
            }
        },
        mute: function () {
            document.getElementById('musicAudio').volume = 0
            if (globalStorage.features.speechSynth && !isIOS()) {
                synth.cancel()
                utter1.volume = 0
                utter2.volume = 0
                utter3.volume = 0
                utter4.volume = 0
                utter5.volume = 0
            } else if (isIOS()) {
                document.getElementById('voAudio').pause()
            }
            else
                document.getElementById('voAudio').volume = 0

        },
        unmute: function () {
            document.getElementById('musicAudio').volume = 1
            if (globalStorage.features.speechSynth && !isIOS()) {
                utter1.volume = 1
                utter2.volume = 1
                utter3.volume = 1
                utter4.volume = 1
                utter5.volume = 1
            } else if (isIOS()) {
                var sex = clock.getSecondsElapsed()
                log(sex)
                var vo = document.getElementById('voAudio')
                vo.currentTime = sex
                log('cr time')
                log(vo.currentTime)
                vo.play()
            }
            else
                document.getElementById('voAudio').volume = 1
        }
    }
})()
