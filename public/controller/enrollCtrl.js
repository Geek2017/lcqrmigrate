angular.module('QrApp').controller('enrollCtrl', function($scope, $http, $filter, $timeout) {


    $('table').hide();
    $('.idhide').hide();
    $(".nodb").hide();
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



    $("#logout").click(function() {
        localStorage.clear()
        sessionStorage.clear()
        firebase.auth().signOut();
        window.location.href = "./"
    });

    // var ref = firebase.database().ref("registrant");
    // ref.remove();

    firebase.auth().onAuthStateChanged(function(user) {

        if (user) {
            console.log(user)

            firebase.database().ref('/masterlist/').orderByChild('contactno').on("value", function(snapshot) {
                let cdata = user.phoneNumber;
                var rdata = snapshot.val().length;

                console.log(rdata)

                var counter = 0;
                $timeout(function() {
                    $scope.$apply(function() {
                        // let returnArr = [];
                        snapshot.forEach(childSnapshot => {
                            let item = childSnapshot.val();
                            item.key = childSnapshot.key;

                            $http.get('https://api.autoserved.com/getuserpic.php/?id=' + item[0]).success(function(response) {
                                console.log(response)
                                var uid = firebase.database().ref().child('/imgs/').push().key;
                                var updates = {};

                                updates['/imgs/' + uid] = response[0];
                                firebase.database().ref().update(updates);

                                if (updates) {
                                    console.log(updates)
                                }
                            });

                            // if (counter !== 24853) {
                            //     counter++;

                            //     console.log(item, counter, rdata)
                            //     var data = {
                            //         id: item[0],
                            //         qrid: item[1],
                            //         contactno: item[2],
                            //         fullname: item[3],
                            //         sex: item[4],
                            //         brgy: item[5],
                            //         age: item[6],
                            //         decision: item[7],
                            //         usertype: item[8]
                            //     }

                            //     // console.log(data);

                            //     // var uid = firebase.database().ref().child('/registrant/').push().key;
                            //     // var updates = {};

                            //     // updates['/registrant/' + uid] = data;
                            //     // firebase.database().ref().update(updates);

                            //     // if (updates) {
                            //     //     console.log(updates)
                            //     // }
                            // }

                        });


                        // $scope.registereds = returnArr;
                        // console.log($scope.registereds);



                        // if (!rdata) {
                        //     $(".loader").hide();
                        //     $('table').hide()
                        //     $(".nodb").show()
                        //     $('.covaxid').val("CoVax No-" + "001");
                        // } else {
                        //     $(".loader").hide();
                        //     $('table').show()
                        //     $(".nodb").hide()
                        // }
                    });

                })

            });


            var ref = firebase.database().ref("registrant");

            ref.on("value", function(snapshot) {

                const rdata = snapshot.numChildren();

                var equ = parseInt(rdata) + 1;

                var num = user.phoneNumber;

                $('.covaxid').val("CoVax No-" + equ);

                $('.mobileno').val(num);

                var nnum = num.replace("+", "");




            });

            var nnum = user.phoneNumber.replace("+", "");

            // $(".loader").hide();
            // $('table').hide()
            // $(".nodb").show()


            let returnArr = []

            console.log(parseInt(nnum));

            // ref.orderByChild('contactno').equalTo(parseInt(nnum)).on('child_added', (snapshot) => {

            //     console.log(snapshot.val());

            //     returnArr.push(snapshot.val());

            //     console.log(returnArr);

            //     $timeout(function() {
            //         var ldata = JSON.stringify(returnArr);
            //         $scope.$apply(function() {
            //             if (!ldata) {
            //                 $(".loader").hide();
            //                 $('table').hide()
            //                 $(".nodb").show()

            //             } else {
            //                 $(".loader").hide();
            //                 $('table').show()
            //                 $(".nodb").hide()
            //                 console.log(JSON.parse(ldata))
            //                 $scope.registereds = JSON.parse(ldata);

            //                 $scope.currentPage = 0;
            //                 $scope.pageSize = 5;
            //                 $scope.rdata = [];


            //                 $scope.numberOfPages = () => {
            //                     return Math.ceil(
            //                         $scope.rdata.length / $scope.pageSize
            //                     );
            //                 }

            //                 for (var i = 0; i < 10; i++) {
            //                     $scope.rdata.push(`Question number ${i}`);
            //                 }
            //             }
            //         });
            //     });


            // });


        } else {
            window.location.href = "./"
        }

    });


    var md = new MobileDetect(window.navigator.userAgent);

    $http.get("https://ipapi.co/json")
        .then(function(response) {
            $scope.geoinfo = response.data;
            var coordinates = [];
            if ("geolocation" in navigator) { //check geolocation available 
                //try to get user current location using getCurrentPosition() method
                navigator.geolocation.getCurrentPosition(function(position) {
                    console.log("Found your location \nLat : " + position.coords.latitude + " \nLang :" + position.coords.longitude);
                    var latlong = position.coords.latitude + ":" + position.coords.longitude;
                    coordinates.push(latlong);
                });
            } else {
                console.log("Browser doesn't support geolocation!");
            }

            function geoinfo() {
                var geoinfo = [{
                    "ip": $scope.geoinfo.ip,
                    "city": $scope.geoinfo.city,
                    "coordinates": coordinates,
                    "ISP": $scope.geoinfo.org
                }]
                return geoinfo;
            }
            // console.log(geoinfo());

            function footprint() {

                if (md.mobile() === "iPhone") {
                    console.log(md.os())
                    console.log(md.version('Mobile'));
                    console.log(md.mobile())
                    console.log(md.mobileGrade());

                    var footprint = [{
                        "type": md.mobile(),
                        "os": md.mobile(),
                        "version": md.version('Mobile'),
                        "grade": md.mobileGrade(),
                        "geoinfo": geoinfo()[0]
                    }]
                    return footprint
                } else if (md.mobile() === "iPad") {
                    console.log(md.userAgent())
                    console.log(md.tablet())
                    console.log(md.version('iOS'));
                    console.log(md.mobileGrade());

                    var footprint = [{
                        "type": md.mobile(),
                        "userAgent": md.userAgent(),
                        "version": md.version('iOS'),
                        "grade": md.mobileGrade(),
                        "geoinfo": geoinfo()[0]
                    }]
                    return footprint
                } else if (md.os() === "AndroidOS") {
                    console.log(md.os())
                    if (md.version("Android") < 8) {
                        window.location.href = '/';
                    } else {
                        console.log(md.version("Android"))
                        console.log(md.versionStr("Chrome"))
                        console.log(md.mobileGrade());

                        var footprint = [{
                            "type": md.os(),
                            "version": md.version("Android"),
                            "browser": md.versionStr("Chrome"),
                            "grade": md.mobileGrade(),
                            "geoinfo": geoinfo()[0]
                        }]
                        return footprint
                    }


                } else {
                    console.log(md)
                    var footprint = [{
                        "details": md.ua,
                        "geoinfo": geoinfo()[0]
                    }]
                    return footprint
                }
            }

            localStorage.setItem("footprint", JSON.stringify(footprint()[0]));
        });


    console.log(localStorage.getItem("footprint"));


    $(".urc").click(function() {
        if ($(".urc").prop('checked') == true) {
            $('#urc').hide();
            $('.companyname').val("Unemployed/Retired");
            $('.companyaddress').val("Unemployed/Retired");
            $('.positiondesignation').val("Unemployed/Retired");
            $('.companycontact').val("0101010101");

        } else {
            $('#urc').show();
        }
    });

    $("#exit2").hide();


    $("#flw").hide();
    $("#eflw").hide();


    $("#sumbit").hide();

    $("#p0").hide();

    $("#p1").hide();
    $("#details").hide();
    $(".privacy").hide();

    $(".spin").hide();

    $("#submit").hide();

    $(".eula11").hide();
    $(".eula22").hide();

    $(".eula").click(function() {
        $("#submit").show();
    });



    $(".eula0").click(function() {
        $(".eula11").show();
        $(".eula0").attr("disabled", true);
    });

    $("#dangerRadio0").click(function() {
        $(".eula22").show();
        $("#p0").hide();
    });

    $("#sucessRadio0").click(function() {
        $(".eula22").hide();
        $("#p0").show();
    });

    $("#dangerRadio1").click(function() {
        $("#p0").show();
        $("#exit").hide();
    });

    $("#sucessRadio1").click(function() {

        $("#exit2").show();
        $("#p0").hide();
    });

    $(".nomiddle").click(function() {
        if ($(".nomiddle").prop('checked') == true) {

            $('.MiddleName').hide();
            $('.MiddleName').val(" ");

        } else {
            $('.MiddleName').show();

        }
    });

    function downloadid() {

        if (window.matchMedia("(orientation: portrait)").matches) {
            alert('Kindly rotate screen to Landscape in order to download the vaccine ID properly!')
        } else {

            window.scrollTo(0, 0);
            var s = $('#capture').position().top;
            $('body').scrollTop(s)
            $('#download').hide();
            html2canvas($("#capture"), {
                onrendered: function(canvas) {
                    saveAs(canvas.toDataURL(), 'qrvaccineid.png');
                }
            });
            $("#exit").show();

        }

    }

    $("#download").click(function() {

        downloadid();
    });

    function saveAs(uri, filename) {

        var link = document.createElement('a');
        if (typeof link.download === 'string') {
            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
            $('#download').show();
        } else {
            window.open(uri);
        }
    }






    $("#enroll").show();






    $('.consent').change(function() {

        if ($(".consent option:selected").text() == "Opo/Yes") {

            $("#details").show();
            $(".privacy").show();
        } else {

            $("#details").hide();
            $(".privacy").show();

            $scope.Gender = "";
            $scope.Contact = "";
            $scope.Building = "";
            $scope.Street = "";
            $scope.Purok = "";
            $scope.Barangay = "";
            $scope.CompanyAddress = "";
            $scope.PositionDesignation = "";
            $scope.CompanyContact = "";
            $scope.CompanyName = "";


        }
    });

    var userimg = []

    function getBaseUrl() {
        var file = document.querySelector('input[type=file]')['files'][0];
        var reader = new FileReader();
        var baseString;
        reader.onloadend = function() {
            baseString = reader.result;

            $(".idhide").show()

            console.log(baseString);

            userimg.push(baseString);
        };
        reader.readAsDataURL(file);
    }

    $('#gq0 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q0").val(btnText);
    });

    $('#gq1 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q1").val(btnText);
    });

    $('#gq2 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q2").val(btnText);
    });

    $('#gq3 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q3").val(btnText);
    });

    $('#gq4 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q4").val(btnText);
    });

    $('#gq5 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q5").val(btnText);
    });

    $('#gq6 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q6").val(btnText);
    });

    $('#gq7 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q7").val(btnText);
    });

    $('#gq8 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q8").val(btnText);
    });

    $('#gq9 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q9").val(btnText);
    });

    $('#gq10 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q10").val(btnText);
    });

    $('#gq11 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q11").val(btnText);
    });

    $('#gq12 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q12").val(btnText);
    });

    $('#gq13 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q13").val(btnText);
    });

    $('#gq14 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q14").val(btnText);
    });

    $('#gq15 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q15").val(btnText);
    });

    $('#gq16 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q16").val(btnText);
    });

    $('#gq17 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q17").val(btnText);
    });

    $('#gq18 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q18").val(btnText);
    });

    $('#gq19 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q19").val(btnText);
    });

    $('#gq20 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q20").val(btnText);
    });

    $('#gq21 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q21").val(btnText);
    });

    $('#gq22 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q22").val(btnText);
    });

    $('#gq23 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q23").val(btnText);
    });

    $('#gq24 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q24").val(btnText);
    });

    $('#gq25 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q25").val(btnText);
    });

    $('#gq26 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q26").val(btnText);
    });

    $('#gq27 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q27").val(btnText);
    });

    $('#gq28 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q28").val(btnText);
    });

    $('#gq29 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q29").val(btnText);
    });

    $('#gq30 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q30").val(btnText);

        if (btnText == "Opo/Yes") {
            $("#flw").show();
        } else {
            $("#flw").hide();
        }
    });

    $('#gq31 button').on('click', function() {
        var thisBtn = $(this);

        thisBtn.addClass('active').siblings().removeClass('active');
        var btnText = thisBtn.text();
        var btnValue = thisBtn.val();
        console.log(btnText + ' - ' + btnValue);

        $("#q31").val(btnText);

        if (btnText == "Opo/Yes") {
            $("#eflw").show();
        } else {
            $("#eflw").hide();
        }
    });




    $("#file").change(function() {
        getBaseUrl()
    });

    $(".year").change(function() {

        console.log()

        var d = new Date();
        var n = d.getFullYear();
        if (n - $(".year").val() < 18) {
            alert('INVALID AGE!');
            $("#age").val(" ")
        } else {
            $("#age").val(n - $(".year").val())
            $("#p1").show();
        }

    });




    $('#enroll').on('submit', function(e) {
        e.preventDefault();
        if ($(".consent option:selected").text() == "Opo/Yes") {
            $(".spin").show();
            $(".eula").attr("disabled", "disabled");

            var qrdata1 = [];

            var jcinfo = {
                birthDay: $scope.month + ":" + $scope.day + ":" + $scope.year,
                building: $(".building").val(),
                street: $(".street").val(),
                purok: $(".purok").val(),
                companyaddress: $(".companyaddress").val(),
                positiondesignation: $(".positiondesignation").val(),
                companycontact: $(".companycontact").val(),
                companyname: $(".companyname").val(),
                emergencycame: $(".efullname").val(),
                emergencyno: $(".econtact").val()
            }

            var jqna = {
                q0: $("#q0").val(),
                q1: $("#q1").val(),
                q2: $("#q2").val(),
                q3: $("#q3").val(),
                q4: $("#q4").val(),
                q5: $("#q5").val(),
                q6: $("#q6").val(),
                q7: $("#q7").val(),
                q8: $("#q8").val(),
                q9: $("#q9").val(),
                q10: $("#q10").val(),
                q11: $("#q11").val(),
                q12: $("#q12").val(),
                q13: $("#q13").val(),
                q14: $("#q14").val(),
                q15: $("#q15").val(),
                q16: $("#q16").val(),
                q17: $("#q17").val(),
                q18: $("#q18").val(),
                q19: $("#q19").val(),
                q20: $("#q20").val(),
                q21: $("#q21").val(),
                q22: $("#q22").val(),
                q23: $("#q23").val(),
                q24: $("#q24").val(),
                q25: $("#q25").val(),
                q26: $("#q26").val(),
                q27: $("#q27").val(),
                q28: $("#q28").val(),
                q29: $("#q29").val(),
            }

            localStorage.setItem("jcinfo", JSON.stringify(jcinfo));

            $('#qrcode').qrcode({
                width: 200,
                height: 200,
                text: $('.covaxid').val()
            });

            function qrtobase64() {
                var canvas = document.getElementsByTagName('canvas');
                var dataURL = canvas[0].toDataURL("image/png");
                qrdata1.push(dataURL);
            }

            qrtobase64();


            var qrdata1 = qrdata1[0];

            var strjcinfo = JSON.stringify(jcinfo);
            var strjqna = JSON.stringify(jqna);

            $(".btntxt").hide();
            $(".loader").show();
            $('table').hide();
            $("#submit").prop("disabled", true);

            var fnstr = $scope.lastName + ", " + $scope.firstName + " " + $scope.middleName;

            var newfn = fnstr.replace(/undefined/i, " ");

            console.log(newfn);

            var num = $('.mobileno').val();

            var nnum = num.replace("+", "");

            let ldata = JSON.stringify(localStorage.getItem("footprint"));


            var data = {
                contactno: parseInt(nnum),
                qrid: $('.covaxid').val(),
                fullname: newfn,
                sex: $scope.gender,
                brgy: $scope.barangay,
                age: $("#age").val(),
                decision: $(".consent option:selected").text(),
                usertype: $scope.flw0,
                img: userimg[0],
                qrcode: qrdata1,
                jcinfo: strjcinfo,
                jqna: strjqna,
                footprint: ldata
            }
            console.log(data);

            try {
                var uid = firebase.database().ref().child('/registrant/').push().key;
                var updates = {};

                updates['/registrant/' + uid] = data;
                firebase.database().ref().update(updates);

                if (updates) {
                    $('#staticBackdrop').modal('show');
                    console.log(updates)
                    setTimeout(function() {
                        $('#staticBackdrop').modal('hide');
                        location.replace('#/')
                        location.replace(' #/enroll')
                    }, 3000)
                }

            } catch (error) {
                alert(error)
            }



        } else {
            $(".spin").show();
            var fnstr = $scope.lastName + ", " + $scope.middleName + " " + $scope.firstName;

            var newfn = fnstr.replace(/undefined/i, " ");

            console.log(newfn);

            $(".privacy").show();

            let ldata = JSON.stringify(localStorage.getItem("footprint"));
            var num = $('.mobileno').val();

            var nnum = num.replace("+", "");

            var data = {
                contactno: nnum,
                qrid: $('.covaxid').val(),
                fullname: newfn,
                sex: $scope.gender,
                brgy: $scope.barangay,
                age: $("#age").val(),
                decision: $(".consent option:selected").text(),
                usertype: $scope.flw0,
                img: userimg[0],
                qrcode: "N/A",
                jcinfo: "N/A",
                jqna: "N/A",
                footprint: ldata
            }

            console.log(data);

            $(".btntxt").hide();
            $(".loader").show();
            $('table').hide();
            $("#submit").prop("disabled", true);

            try {
                var uid = firebase.database().ref().child('/registrant/').push().key;

                var updates = {};
                updates['/registrant/' + uid] = data;
                firebase.database().ref().update(updates);

                if (updates) {
                    $('#staticBackdrop').modal('show');
                    console.log(updates)
                    setTimeout(function() {
                        $('#staticBackdrop').modal('hide');
                        location.replace('#/')
                        location.replace(' #/enroll')
                    }, 3000)
                }
            } catch (error) {
                alert(error)
            }


        }
    });


    $("#exit").click(function() {

        window.location.href = '#/';
        localStorage.clear();
        window.location.reload();

    });

    $("#exit2").click(function() {

        window.location.href = '#/';
        localStorage.clear();
        window.location.reload();

    });



    $scope.qrid = function(registered) {

        console.log(registered.id)
        console.log(registered.img)
        $scope.cimg = "./assets/img/imgl.gif";
        $scope.cqr = "./assets/img/imgl.gif";
        if (registered.img === undefined) {
            // $("#fimg").removeClass("hidden")
            // $('.bqid').hide();
            if (registered.decision == "Opo/Yes") {
                $('#qrid').modal('show');
                $http.get('https://cloudology.info/mysqlapi/getuserpic.php/?id=' + registered.id).success(function(response) {
                    console.log(response)

                    $scope.cimg = response[0].img;
                    $scope.cqr = response[0].qrcode;
                    $scope.cfullname = registered.fullname;
                    $scope.cbrgy = registered.brgy;

                    $(".loading0").addClass("hidden")
                    $(".loading1").removeClass("hidden")

                });
            } else {
                alert("Only Affirmative Registrant can have QrID");
            }

        } else {
            if (registered.decision == "Opo/Yes") {
                $scope.cimg = registered.img;
                $scope.cqr = registered.qrcode;
                $scope.cfullname = registered.fullname;
                $scope.cbrgy = registered.brgy;
                $('#qrid').modal('show');
            } else {
                alert("Only Affirmative Registrant can have QrID");
            }
        }





    }

    $scope.printid = function() {

        $("#btng").hide()
        $('#qrid').animate({ scrollTop: 0 }, 'slow');
        html2canvas($("#qrids"), {
            onrendered: function(canvas) {

                var nWindow = window.open('');

                nWindow.document.body.appendChild(canvas);
                nWindow.focus();
                nWindow.print();
                $('#qrid').modal('hide');
                location.replace('#/')


                setTimeout(function() {
                    nWindow.close();

                }, 1000)

            }
        });


    }

    $scope.downloadid = function(e) {
        $("#btng").hide()
        $('#qrid').animate({ scrollTop: 0 }, 'slow');
        html2canvas($("#qrids"), {
            onrendered: function(canvas) {
                saveAs(canvas.toDataURL(), 'qrid.png');
                $('#qrid').modal('hide');
            }
        });

    }


}).filter('startFrom', function() {
    return function(input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    }
});