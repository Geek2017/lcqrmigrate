angular.module('QrApp').controller('enrollCtrl', function($scope, $http, $filter) {

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
        window.location.href = "/#"
    });



    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {

            try {
                $http.get('https://api.autoserved.com/count.php').success(function(response) {
                    const count = response[0][0].count

                    console.log(response[0][0].count);

                    var equ = parseInt(count) + 1;
                    $scope.covaxid = "CoVax No-" + equ;

                    console.log(user.phoneNumber)
                    $('.mobileno').val(user.phoneNumber);

                    var num = user.phoneNumber;

                    var nnum = num.replace("+", "");
                    $scope.registereds;
                    try {
                        $http.get('https://api.autoserved.com/readinfo.php?contactno=' + nnum).success(function(response) {


                            var ndata = [];
                            if (response.length) {
                                angular.forEach(response, function(value, key) {

                                    var dname = value.fullname;

                                    var res = dname.split(",");

                                    // console.log(res[1], res[0])

                                    let resfm = res[1];

                                    let sresfm = resfm.split(' ')

                                    console.log(resfm)

                                    const rname0 = res[0] + ', ' + sresfm[2] + ' ' + sresfm[3] + ' ' + sresfm[1];
                                    const rname00 = rname0.replace(/undefined/i, " ");
                                    const rname1 = res[0] + ', ' + sresfm[1];

                                    let nid = value.qrid.replace(/CoVax No-/i, " ");

                                    var tpd0 = { id: value.id, fullname: rname00, contactno: value.contactno, age: value.age, brgy: value.brgy, decision: value.decision, qrid: nid, sex: value.sex, age: value.age, usertype: value.usertype, created_at: value.created_at }

                                    var tpd1 = { id: value.id, fullname: rname1, contactno: value.contactno, age: value.age, brgy: value.brgy, decision: value.decision, qrid: nid, sex: value.sex, age: value.age, usertype: value.usertype, created_at: value.created_at }


                                    if (typeof sresfm[2] === 'undefined') {
                                        console.log(tpd1);
                                        ndata.push(tpd1);
                                    } else {
                                        console.log(tpd0);
                                        ndata.push(tpd0);
                                    }

                                    console.log(ndata);

                                    return $scope.registereds = ndata;
                                });

                            } else {
                                $(".loader").hide();
                                $(".nodb").show();
                            }




                            $scope.currentPage = 0;
                            $scope.pageSize = 5;
                            $scope.data = [];



                            if (response.length) {
                                $(".loader").hide();
                                $('table').show();


                                $scope.numberOfPages = () => {
                                    return Math.ceil(
                                        $scope.data.length / $scope.pageSize
                                    );
                                }

                                for (var i = 0; i < response.length; i++) {
                                    $scope.data.push(`Question number ${i}`);
                                }
                            } else {
                                $(".loader").hide();

                                $('table').show();
                            }

                        });
                    } catch (error) {
                        console.log(error)
                    }

                }).catch(function(data) {
                    console.log(data)
                });
            } catch (error) {
                alert(error, 'Check your Connection make sure its stable!')
            }

        } else {
            window.location.href = '/';
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

            var fnstr = $scope.lastName + ", " + $scope.middleName + " " + $scope.firstName;

            var newfn = fnstr.replace(/undefined/i, " ");

            console.log(newfn);

            var num = $('.mobileno').val();

            var nnum = num.replace("+", "");

            let ldata = JSON.stringify(localStorage.getItem("footprint"));
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
                qrcode: qrdata1,
                jcinfo: strjcinfo,
                jqna: strjqna,
                footprint: ldata
            }
            console.log(data);

            $http.post("https://api.autoserved.com/insert.php", data).then(function(response) {

                console.log(response.data.message)

                if (response.status == 200) {
                    if (response.data.message == "Oops! required fields empty. Please check your input" || response.data.message == "Please fill all the fields all required * ") {
                        console.log("Error:", response.data.message);
                        $scope.scsmsg = response.data.message + " please try again"
                    } else {

                        console.log(response.data.message);
                        $scope.scsmsg = response.data.message
                        $('#staticBackdrop').modal('show');

                        setTimeout(function() {
                            $('#staticBackdrop').modal('hide');
                            location.replace('#/')
                            location.replace('#/enroll')
                        }, 3000);
                    }
                } else {

                }

            });



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

            $http.post("https://api.autoserved.com/insert.php", data).then(function(response) {

                console.log(response.data.message)

                if (response.status == 200) {
                    if (response.data.message == "Oops! required fields empty. Please check your input" || response.data.message == "Please fill all the fields all required * ") {
                        console.log("Error:", response.data.message);
                        $scope.scsmsg = response.data.message + " please try again"
                    } else {

                        console.log(response.data.message);
                        $scope.scsmsg = response.data.message
                        $('#staticBackdrop').modal('show');

                        setTimeout(function() {
                            $('#staticBackdrop').modal('hide');
                            location.replace('#/')
                            location.replace('#/enroll')
                        }, 3000);
                    }
                } else {

                }

            });
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

        console.log(registered)

        $http.get('https://api.autoserved.com/getuserpic.php/?id=' + registered.id).success(function(response) {
            console.log(response)

            if (registered.decision == "Opo/Yes") {

                $('#qrid').modal('show');
                $scope.cimg = response[0].img;
                $scope.cqr = response[0].qrcode
                $scope.cfullname = registered.fullname
                $scope.cbrgy = registered.brgy
            } else {
                alert("Only Affirmative Registrant can have QrID");
            }
        });



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

                location.replace('#/')
                location.replace('#/spindex')

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