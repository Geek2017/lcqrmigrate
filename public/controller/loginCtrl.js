angular.module('QrApp').controller('loginCtrl', function($scope) {

    function showTime() {
        var date = new Date();
        var h = date.getHours(); // 0 - 23
        var m = date.getMinutes(); // 0 - 59
        var s = date.getSeconds(); // 0 - 59
        var session = "AM";

        if (h == 0) {
            h = 24;
        }

        if (h > 24) {
            h = h - 24;
            session = "PM";
        }

        h = (h < 10) ? "0" + h : h;
        m = (m < 10) ? "0" + m : m;
        s = (s < 10) ? "0" + s : s;

        var time = h + ":" + m + ":" + s + " " + session;

        console.log(parseInt(h))

        if (parseInt(h) >= 17 || parseInt(h) <= 7) {
            console.log(h, 'Closed')
            $("#showit").attr("disabled", true);
            $("#notice").show();
        } else {
            console.log(h, 'Open')
            $("#showit").attr("disabled", false);
            $("#notice").hide();
        }



        setTimeout(showTime, 1000);

    }

    showTime();


    var effectAry = ['flash', 'tada'];

    var data = {
        loop: true,
        in: {
            effect: effectAry[0]
        },
        out: {
            effect: effectAry[1],
            callback: function() {

            }
        },
    };

    $('.hoge').textillate(data);
    $('.hoge').on('start.tlt', console.log('-----start.tlt triggered.'))
        .on('inAnimationBegin.tlt', console.log('inAnimationBegin.tlt triggered.'))
        .on('inAnimationEnd.tlt', console.log('inAnimationEnd.tlt triggered.'))
        .on('outAnimationBegin.tlt', console.log('outAnimationBegin.tlt triggered.'))
        .on('outAnimationEnd.tlt', console.log('outAnimationEnd.tlt triggered.'));



    var md = new MobileDetect(window.navigator.userAgent);
    var slowLoad = window.setTimeout(function() {
        $('#showit').attr("disabled", true);
        $('#exampleModal').modal('show');
        $('#iphone').hide()
        $('#ibutton').hide()
        $('#android').hide()
    }, 50000);

    window.addEventListener('load', function() {
        window.clearTimeout(slowLoad);
        localStorage.setItem('stable', 1)
    }, false);

    if (localStorage.getItem('stable')) {
        if (md.mobile() === "iPhone") {

            $('#showit').attr("disabled", true);
            $('#exampleModal').modal('show');
            $('#android').hide()
            $('#connection').hide()
            $('#closeit').hide()
            $('#iphone').show()

            console.log(md.os())
            console.log(md.version('Mobile'));
            console.log(md.mobile())
            console.log(md.mobileGrade());
        } else if (md.mobile() === "iPad") {

            $('#showit').attr("disabled", true);
            $('#exampleModal').modal('show');
            $('#connection').hide()
            $('#android').hide()
            $('#closeit').hide()
            $('#iphone').show()

            console.log(md.userAgent())
            console.log(md.tablet())
            console.log(md.version('iOS'));
            console.log(md.mobileGrade());
        } else if (md.os() === "AndroidOS") {
            console.log(md.os())
            if (md.version("Android") < 8.0) {
                $('#connection').hide()
                $('#showit').attr("disabled", true);
                $('#exampleModal').modal('show');
                $('#iphone').hide()
                $('#ibutton').hide()
            }
            console.log(md.version("Android"))
            console.log(md.versionStr("Chrome"))
            console.log(md.mobileGrade());
        } else {
            console.log(md.ua)
        }
    }



    $('#container').hide()

    $("#showit").click(function() {
        $('#container').show()
        $('#showit').hide()
        $(".css").css("padding-top", "0%");
    });

    function getUiConfig() {
        return {
            'callbacks': {
                'signInSuccess': function(user, credential, redirectUrl) {
                    handleSignedInUser(user);
                    return false;
                }
            },
            'signInFlow': 'invisible',
            'signInOptions': [{
                provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                recaptchaParameters: {
                    type: 'image',
                    size: 'invisible',
                    badge: 'bottomleft'
                },
                defaultCountry: 'PH',
                defaultNationalNumber: '639216686509',
                loginHint: '+639216686509'
            }],
            'tosUrl': 'https://www.google.com'
        };
    }

    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    var handleSignedInUser = function(user) {

        window.location.href = '#/enroll';
    }

    var handleSignedOutUser = function() {

        ui.start('#firebaseui-container', getUiConfig());
    };

    firebase.auth().onAuthStateChanged(function(user) {
        // document.getElementById('loading').style.display = 'none';
        // document.getElementById('loaded').style.display = 'block';
        user ? handleSignedInUser(user) : handleSignedOutUser();
    });

    var initApp = function() {
        // document.getElementById('sign-out').addEventListener('click', function() {
        //     firebase.auth().signOut();
        // });
    };

    window.addEventListener('load', initApp);

    $("#closeit").click(function() {
        $('#exampleModal').modal('hide');
    });

    $("#ibutton").click(function() {
        $('#exampleModal').modal('hide');
    });

    $("#logout").click(function() {
        $('#exampleModal').modal('hide');
        window.location.href = '#/enroll';
    });


});