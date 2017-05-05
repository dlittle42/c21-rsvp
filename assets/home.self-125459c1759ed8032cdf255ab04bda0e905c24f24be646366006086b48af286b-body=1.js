var globalStorage = {
    features: {},
    userInfo: {}
}

var textOne,
    textTwo,
    textThree,
    textFour

$(document).ready(function () {

    globalStorage.features = {
        speechSynth: speech.readySpeechSynthesis(),
        annyang: speech.readySpeechRecognition(),
        webGL: Detector.webgl
    }

    var userInfo = pullUserInfo()
    window.history.replaceState('', '', '')

    globalStorage.userInfo = {
        firstName: userInfo[0],
        lastName: userInfo[1],
        email: userInfo[2]
    }

    textOne = $('#textBox1')
    textTwo = $('#textBox2')
    textThree = $('#textBox3')
    textFour = $('#textBox4')

    var fullname = globalStorage.userInfo.firstName + ' ' + globalStorage.userInfo.lastName

    var phrase1 = 'Hello, ' + fullname
    var phrase2 = 'Join us for the agents of the future event, on June 23rd at 5pm';
    var phrase5 = 'For an exclusive engagement with our keynote speaker, seth godin';
    var phrase8 = 'Reserve your spot at the event';
    var phrase9
    if (globalStorage.features.annyang)
        phrase9 = 'say RSVP, or info';
    else
        phrase9 = 'click RSVP, or info';

  //  prefillForm(globalStorage.userInfo.firstName, globalStorage.userInfo.lastName, globalStorage.userInfo.email);

    //prevent spacebar scrolldown in FF
    window.onkeydown = function (e) {
        if (e.which == 32 && e.target == document.body)
            e.preventDefault();
    };
    //prevent tabbing through form prematurely
    $(':input, a').attr("tabindex", "-1");

/*
    if (globalStorage.features.webGL) _env.init()
    else _env.fallbackInit()
*/
    _env.init()

    if (window.location.pathname == '/globe') return

    spectro.init()
    spectro.dance()

    if (isIOS()) {
        $('#volumeAlert').addClass('hide')
        $('#unmute').removeClass('hide')
    } else {
        spectro.activate()
    }

    if (!isMobile())
        $(window).resize(function () {
            if ($(window).height() < 700)
                $('body').css({overflow: 'scroll'})
            else
                $('body').css({overflow: 'hidden'})
        })

    //
    //BEGIN EVENT EXECUTION
    //
    setTimeout(function () {
        if (isIOS()) {
            $('#unmute').addClass('hide')
            spectro.stiffle()
            spectro.activateIOS()
        } else {
            $('#volumeAlert').addClass('hide')
        }
    }, 3000)

    setTimeout(function () {
        if (!globalStorage.features.speechSynth)
            document.getElementById('voAudio').play()

        if (isIOS())
            clock.init()

        var baseFrameDelay = 2500

        // IN: frame 1
        speech.utterPhrase(phrase1)
        // - line 1
        textEffector.effectIn(textOne, 'Hello', 0)

        // - line 2
        setTimeout(function () {
            textEffector.effectIn(textTwo, fullname, 0)

            // OUT: frame 1
            setTimeout(function () {
                textEffector.effectOut(textOne)
                textEffector.effectOut(textTwo)
            }, baseFrameDelay - 500)

            // IN: frame 2
            setTimeout(function () {
                textOne.removeClass('firstFrame')
                textTwo.removeClass('firstFrame')
                textTwo.addClass('smaller')
                speech.utterPhrase(phrase2)
                // - line 1
                textEffector.effectIn(textOne, 'Join us for the', 0)

                // - line 2
                setTimeout(function () {
                    textEffector.effectIn(textTwo, 'agents of the future', 1)

                    // - line 3
                    setTimeout(function () {
                        textEffector.effectIn(textThree, 'event on', 0)

                        // - line 4
                        setTimeout(function () {
                            textEffector.effectIn(textFour, 'June 23rd at 5PM', 2)

                            //OUT: frame 2
                            setTimeout(function () {
                                textEffector.effectOut(textOne)
                                textEffector.effectOut(textTwo)
                                textEffector.effectOut(textThree)
                                textEffector.effectOut(textFour)
                            }, baseFrameDelay + 700)

                            // IN: frame 3
                            setTimeout(function () {
                                speech.utterPhrase(phrase5)
                                // - line 1
                                textEffector.effectIn(textOne, 'For an exclusive', 0)

                                // - line 2
                                setTimeout(function () {
                                    textEffector.effectIn(textTwo, 'engagement with our', 0)

                                    // - line 3
                                    setTimeout(function () {
                                        textEffector.effectIn(textThree, 'keynote speaker', 0)

                                        // - line 4
                                        setTimeout(function () {
                                            textEffector.effectIn(textFour, 'seth godin', 1)

                                            // OUT: frame 3
                                            setTimeout(function () {
                                                textEffector.effectOut(textOne)
                                                textEffector.effectOut(textTwo)
                                                textEffector.effectOut(textThree)
                                                textEffector.effectOut(textFour)
                                            }, baseFrameDelay + 700)

                                            // IN: frame 4
                                            setTimeout(function () {
                                                textOne.addClass('lastFrame')
                                                textTwo.addClass('lastFrame')
                                                speech.utterPhrase(phrase8)
                                                // - line 1
                                                textEffector.effectIn(textOne, 'Reserve your spot', 0)

                                                // - line 2
                                                setTimeout(function () {
                                                    textEffector.effectIn(textTwo, 'at the event', 0)

                                                    // [spoken only]
                                                    setTimeout(function () {
                                                        speech.utterPhrase(phrase9)
                                                        glowButtons()
                                                    }, 1600)

                                                    // fourth frame interactions
                                                    setTimeout(function () {
                                                        $('#rsvpBox').removeClass('hide')
                                                        clickEvents();
                                                        speech.startListening()

                                                        setTimeout(function () {
                                                            if (globalStorage.features.webGL)
                                                                t.unglowAllSprites()
                                                        }, 3000)// turn off leftover sprites
                                                    }, 1000)// interactions

                                                }, 1000)// frame 4 - line 2

                                            }, 3600)// frame 4 - line 1

                                        }, 400)// frame 3 - line 4

                                    }, 400)// frame 3 - line 3

                                }, 300)// frame 3 - line 2

                            }, 4300)// frame 3 - line 1

                        }, 300)// frame 2 - line 4

                    }, 300)// frame 2 - line 3

                }, 300)// frame 2 - line 2

            }, 2800)// frame 2 - line 1

        }, 1000)// frame 1 - line 2

    }, 1000)// frame 1 - line 1

})

var textEffector = (function () {
    return {
        effectIn: function (div, text, importance) {
            var html = wrapCharsInSpans(text)

            if (importance == 1) {
                html = markImportance(html, 'font-weight: 900;')
            } else if (importance == 2) {
                html = markImportance(html, 'color: #c39b57;font-weight:900;')
            }

            div.html(html)

            var delay = 0;
            div.find('span').each(function () {
                var that = $(this)
                setTimeout(function () {
                    that.removeClass('hide')
                }, delay)
                delay += 60
            })
        },
        effectOut: function (div) {
            div.addClass('hide')
            setTimeout(function () {
                div.html('')
                div.removeClass('hide')
            }, 200)
        }
    }

    function wrapCharsInSpans(text) {
        var charArray = text.split('')
        var html = '',
            curLetter
        for (var i = 0; i < charArray.length; i++) {
            curLetter = charArray[i]
            if (curLetter == ' ')
                curLetter = '&nbsp;'
            html += '<span class="text-fade-down hide">' + curLetter + '</span>'
        }
        return html
    }

    function markImportance(html, styles) {
        var head = '<div style="' + styles + '">'
        var tail = '</div>';
        return head + html + tail
    }
})()

var spectro = (function () {
    var audioBarDanceInterval,
        isDancing,
        nextBar,
        cont

    return {
        init: function () {
            nextBar = 0;
            cont = $('#audioControl')
            isDancing = false

        },
        activate: function () {
            cont.removeClass('inactive')
            cont.click(function () {
                if (isDancing) {
                    spectro.stiffle()
                    speech.mute()
                    if (isMobile()){
                        $('#unmute').removeClass('hide')
                        setTimeout(function(){
                            $('#unmute').addClass('hide')
                        },2000)
                    }
                }
                else {
                    spectro.dance()
                    speech.unmute()
                }
            })
        },
        activateIOS: function () {
            cont.click(function () {
                var that = $(this),
                    time = clock.getSecondsElapsed()

                document.getElementById('voAudio').currentTime = time
                document.getElementById('voAudio').play()

                that.off('click')
                spectro.activate()
            })
        },
        dance: function () {
            isDancing = true
            var randInterval = getRandomInt(60, 130)
            audioBarDanceInterval = setInterval(function () {
                cont.find('span:eq(' + nextBar + ')').toggleClass('shrink')
                getNextBar()
            }, randInterval)
        },
        stiffle: function () {
            isDancing = false
            cont.find('span').each(function () {
                $(this).addClass('shrink')
            })
            clearInterval(audioBarDanceInterval)
        }
    }

    function getNextBar() {
        nextBar += 2
        if (nextBar >= 6) {
            nextBar = nextBar - 7
        }
    }
})()

function pullUserInfo() {
    var first, last, email
    first = getQueryParam('first')
    last = getQueryParam('last')
    email = getQueryParam('email')

    if (first == 'first')
        first = ''
    if (last == 'last')
        last = ''
    if (email == 'email')
        email = ''

    return [first, last, email]
}

function prefillForm(firstname, lastname, email) {
    var one,
        two,
        three
    one = two = three = true
    if (firstname != 'First' && firstname != '') {
        $('#first').val(firstname);
        one = false
    }

    if (lastname != 'Last' && lastname != '') {
        $('#last').val(lastname)
        two = false
    }

    if (email != 'Email' && email != '') {
        $('#email').val(email)
        three = false
    }

    if (one || two || three) {
        $('#form h2').html('PLEASE ENTER YOUR INFORMATION')
    }
}

function clickEvents() {
    $('.button').click(function () {
        var that = $(this)
        if (that.hasClass('rsvp')) {
            rsvpEvents()
        } else if (that.hasClass('info') && !that.hasClass('post')) {
            infoEvents()
        } else if (that.hasClass('confirm')) {
            submitForm()
        } else if (that.hasClass('post')) {
            postInfoEvents()
        }
    })

    $('#backButton').click(function () {
        if (formOrInfo == -1)
            hideForm()
        else
            hideInfo()
    })

    if (isIOS()) {
        $('input').on('blur', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.scrollTo(0, 0);
        });
    }

    $('input').on('focus', function () {
        var that = $(this)
        var num = that.data('num')
        $('hr[data-num=' + num + ']').addClass('show')
        that.off('focus')
    })
}

function glowButtons() {
    $('.button.rsvp').addClass('glow')
    setTimeout(function () {
        $('.button.rsvp').removeClass('glow')
        $('.button.info').addClass('glow')
        setTimeout(function () {
            $('.button.info').removeClass('glow')
        }, 700)
    }, 700)
}

function backEvents() {
    quickGlow($('#backButton'))
    if (formOrInfo == -1)
        hideForm()
    else if (formOrInfo == 1)
        hideInfo()
}

function rsvpEvents() {
  //  ga_track('click', 'rsvp')
    quickGlow($('.button.rsvp'))
    setTimeout(function () {
        $('#rsvpBox').addClass('hide')
        showForm()

        textEffector.effectOut(textOne)
        textEffector.effectOut(textTwo)
        textEffector.effectOut(textThree)
        textEffector.effectOut(textFour)

        t.zoomGlobe()
        speech.addFinalCommand()
    }, 600)
}

function infoEvents() {
   // ga_track('click', 'info')
    quickGlow($('.button.info'))
    setTimeout(function () {
        $('#rsvpBox').addClass('hide')
        textEffector.effectOut(textOne)
        textEffector.effectOut(textTwo)
        textEffector.effectOut(textThree)
        textEffector.effectOut(textFour)
        showInfo()
    }, 600)
}

function postInfoEvents() {
    quickGlow($('.button.post'))
    t.unzoomGlobe()
    setTimeout(function () {
        $('#thankYou').addClass('hide')
        $('#info').removeClass('hide')
        $('body').addClass('info')
        formOrInfo = 1
    }, 600)
}

function quickGlow(button) {
    button.addClass('glow')
    setTimeout(function () {
        button.removeClass('glow')
    }, 600)
}

function submitForm() {
   // ga_track('click', 'submit')

    quickGlow($('.button.confirm'))

    var first = $('#first').val(),
        last = $('#last').val(),
        email = $('#email').val()

    $('.error.first').html('')
    $('.error.last').html('')
    $('.error.email').html('')

    var errors = verifyForm()

    if (errors[0] != '' || errors[1] != '' || errors[2] != '') {
        $('.error.first').html(errors[0])
        $('.error.last').html(errors[1])
        $('.error.email').html(errors[2])
        return
    }

    // force success

    $('#form').addClass('hide')
    $('#thankYou').removeClass('hide')
    $('#backButton').addClass('hide')
    if (globalStorage.features.annyang)
        annyang.removeCommands(['rsvp', 'info', 'back'])
/*
    $.post({
        url: '/submit',
        data: {'first': first, 'last': last, 'email': email},
        success: function (response) {
            if (response.success) {
                $('#form').addClass('hide')
                $('#thankYou').removeClass('hide')
                $('#backButton').addClass('hide')
                if (globalStorage.features.annyang)
                    annyang.removeCommands(['rsvp', 'info', 'back'])
            } else {
                $('.error.email').html(response.msg)
            }
        },
        error: function (response) {
            $('.error.email').html('There was an error submitting the form.')
        }
    });
*/
}

function verifyForm() {
    var first = $('#first').val(),
        last = $('#last').val(),
        email = $('#email').val()

    var errors = []

    if (first.length < 1)
        errors.push('Please provide your first name')
    else
        errors.push('')

    if (last.length < 1)
        errors.push('Please provide your last name')
    else
        errors.push('')

    if (email.length < 1)
        errors.push('Please provide your email address')
    else
        errors.push('')

    return errors
}

//0 = none, -1=form, 1 =info
var formOrInfo = 0

function showForm() {
    $(":input, a").removeAttr("tabindex");
    $('#form').removeClass('hide')
    $(":input").removeClass('shrink')
    $('#backButton').removeClass('hide')
    formOrInfo = -1
}

function hideForm() {
    $(":input, a").attr("tabindex", "-1");
    $('#form').addClass('hide')
    $('#backButton').addClass('hide')
    formOrInfo = 0
    t.unzoomGlobe()
    $('#rsvpBox').removeClass('hide')
    textEffector.effectIn(textOne, 'Reserve your spot', 0)
    textEffector.effectIn(textTwo, 'at the event', 0)
}

function showInfo() {
    $('body').addClass('info')
    $('#info').removeClass('hide')
    $('#backButton').removeClass('hide')
    formOrInfo = 1
}

function hideInfo() {
    $('#info').addClass('hide')
    $('#backButton').addClass('hide')
    $('#rsvpBox').removeClass('hide')
    $('body').removeClass('info')
    formOrInfo = 0
    textEffector.effectIn(textOne, 'Reserve your spot', 0)
    textEffector.effectIn(textTwo, 'at the event', 0)
}
