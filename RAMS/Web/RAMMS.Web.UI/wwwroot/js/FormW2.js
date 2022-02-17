﻿var currentDate = new Date();
$(document).ready(function () {
    currentDate = formatDate(currentDate);

    $('.allow_numeric').keypress(function (event) {
        var $this = $(this);
        if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
            ((event.which < 48 || event.which > 57) &&
                (event.which != 0 && event.which != 8))) {
            event.preventDefault();
        }

        var text = $(this).val();
        if ((event.which == 46) && (text.indexOf('.') == -1)) {
            setTimeout(function () {
                if ($this.val().substring($this.val().indexOf('.')).length > 3) {
                    $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
                }
            }, 1);
        }

        if ((text.indexOf('.') != -1) &&
            (text.substring(text.indexOf('.')).length > 3) &&
            (event.which != 0 && event.which != 8) &&
            ($(this)[0].selectionStart >= text.length - 3)) {
            event.preventDefault();
        }
    });

    $("#formW2IssuedBy").on("change", function () {
        var id = $("#formW2IssuedBy option:selected").val();
        if (id != "99999999" && id != "") {
            $.ajax({
                url: '/ERT/GetUserById',
                dataType: 'JSON',
                data: { id },
                type: 'Post',
                success: function (data) {
                    $("#formW2IssuedName").val(data.userName);
                    $("#formW2IssuedName").prop("disabled", true);
                },
                error: function (data) {
                    console.error(data);
                }
            });
        }
        else if (id == "99999999") {
            $("#formW2IssuedName").prop("disabled", false);
            $("#formW2IssuedName").val('');
        }
        else {
            $("#formW2IssuedName").prop("disabled", true);
            $("#formW2IssuedName").val('');
        }
        $("#formW2IssuedDate").val(currentDate);
        return false;
    });


    $("#formW2CommencementDate").change(function () {
        var value = $(this).val();
        var commDate = new Date(formatDate(value));
        var minDate = new Date(2020, 0, 1);
        if (commDate < minDate) {
            app.ShowErrorMessage("Commencement date should not be less than 01-01-2020");
            $(this).val('');
            return;
        }

    });


    $("#formW2CompletionDate").change(function () {
        var value = $(this).val();
        var dateVal = $("#formW2CommencementDate").val();
        commDate = new Date(formatDate(dateVal));

        var compDate = new Date(formatDate(value));

        if (compDate < commDate) {
            app.ShowErrorMessage("Completion date should not be less than Commencment date");
            $(this).val('');
            return;
        }

    });



});

$(document).on("click", "#saveFormW2Btn", function () {

    Save(false);
});

$(document).on("click", "#submitFormW2Btn", function () {
    Save(true);
});

$(document).on("click", "#saveFCEMBtn", function () {

    SaveFCEM(false);
});

$(document).on("click", "#submitFCEMBtn", function () {
    SaveFCEM(true);
});


function SaveFCEM(submit) {
    if (submit) {
        $("#divPage .svalidate").addClass("validate");
    }

    if (!ValidatePage('#divPage')) {
        return false;
    }

    InitAjaxLoading();

    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output = (('' + month).length < 2 ? '0' : '') + month + '/' +
        (('' + day).length < 2 ? '0' : '') + day + '/' + d.getFullYear();

    var saveObj = new Object;

    saveObj.PkRefNo = $("#fcemPkRefNo").val();
    saveObj.Fw2PkRefNo = $("#FW2HRef_No").val();
    saveObj.Date = $("#fcemDate").val();
    saveObj.Sstatus = $("#fcemStatus").find(":selected").val();
    saveObj.Progress = $("#fcemProgress").val();
    saveObj.IsBq = $("#fcemBQ").prop("checked");
    saveObj.IsDrawing = $("#fcemDrawing").prop("checked");
    saveObj.Remark = $("#fcemRemark").val();

    //Created by
    if ($("#formw2RequestedBy").find(":selected").val() != "") saveObj.ModBy = $("#formw2RequestedBy").find(":selected").val();
    if ($("#FW2HRef_No").val() != "") saveObj.ModDt = output
    if ($("#formW2IssuedBy").find(":selected").val() != "") saveObj.CrBy = $("#formW2IssuedBy").find(":selected").val();
    if ($("#FW2HRef_No").val() == "") saveObj.CrDt = output;

    saveObj.ActiveYn = true;
    saveObj.SubmitSts = submit;
    console.log(saveObj);
    $.ajax({
        url: '/InstructedWorks/SaveFCEM',
        data: saveObj,
        type: 'POST',
        success: function (data) {
            HideAjaxLoading();
            if (data == -1) {
                app.ShowErrorMessage("Reference id already Exist");
            }
            else {
                $("#FW2HRef_No").val(data);
                if (submit) {
                    $("#saveFCEMBtn").hide();
                    $("#submitFCEMBtn").hide();
                    app.ShowSuccessMessage('Successfully Submitted', false);
                    location.href = "/InstructedWorks";
                }
                else {
                    $("#saveFCEMBtn").show();
                    $("#submitFCEMBtn").show();
                    app.ShowSuccessMessage('Successfully Saved', false);
                }
            }
        },
        error: function (data) {
            HideAjaxLoading();
            app.ShowErrorMessage(data.responseText);
        }

    });

}

function openW1() {
    $("#saveFormW2Btn").hide();
    $("#submitFormW2Btn").hide();

    $("#saveFCEMBtn").hide();
    $("#submitFCEMBtn").hide();
}

function openFCEM() {
    $("#saveFormW2Btn").hide();
    $("#submitFormW2Btn").hide();

    $("#saveFCEMBtn").show();
    $("#submitFCEMBtn").show();
}

function checkW2Exist() {
    if (ValidatePage("#divpage")) {
        if ($("#FW2HRef_No").val() == "0" || $("#FW2HRef_No").val() == "") {
            $("#lnkPage").click();
            app.ShowErrorMessage("Required to save the Form W2 details and then try to create FCEM");
        }
    }
    else {
        $("#saveFormW2Btn").click();
        app.ShowErrorMessage("Required fields are incomplete in Form W2");
    }
}

function openW2() {

    $("#saveFormW2Btn").show();
    $("#submitFormW2Btn").show();

    $("#saveFCEMBtn").hide();
    $("#submitFCEMBtn").hide();
}

function Save(submit) {
    if (submit) {
        $("#divPage .svalidate").addClass("validate");
    }

    if (!ValidatePage('#divPage')) {
        return false;
    }

    InitAjaxLoading();

    var d = new Date();

    var month = d.getMonth() + 1;
    var day = d.getDate();

    var output = (('' + month).length < 2 ? '0' : '') + month + '/' +
        (('' + day).length < 2 ? '0' : '') + day + '/' + d.getFullYear();

    var saveObj = new Object;

    saveObj.PkRefNo = $("#FW2HRef_No").val();

    saveObj.Fw1IwRefNo = $("#fw1RefNo").val();
    saveObj.Fw1RefNo = $("#fw1PKRefNo").val();
    saveObj.Fw1ProjectTitle = $("#fw1ProjectTitle").val()
    saveObj.Region = $("#formW2Region").val();
    saveObj.RegionName = $("#formW2RegionName").val();
    saveObj.Division = $("#formW2DivisionCode").find(":selected").val();
    saveObj.DivisonName = $("#formW2DivisonName").val();

    saveObj.Rmu = $("#formW2RMU").find(":selected").val();
    saveObj.RmuName = $("#formW2RMUName").val();

    saveObj.JkrRefNo = $("#fw2JkrRefNo").val();
    saveObj.DateOfInitation = $("#formW2InitiationDate").val();
    saveObj.SerProviderRefNo = $("#fw2SerProviderRef").val();
    saveObj.ServiceProvider = $("#formW2ServiceProvider").find(":selected").val();
    saveObj.Attn = $("#fw2Attn").val();
    saveObj.Cc = $("#fw2cc").val();
    saveObj.RoadCode = $("#frmW2RoadCode").val().split("-")[0];
    saveObj.RoadName = $("#formW2roadDesc").val();

    if ($("#formW2Fromch").val() != "") saveObj.FrmCh = $("#formW2Fromch").val();
    if ($("#formW2Toch").val() != "") saveObj.ToCh = $("#formW2Toch").val();
    saveObj.TitleOfInstructWork = $("#formW2TitleOfInstructWork").val();
    if ($("#formW2CommencementDate").val() != "dd/mm/yyyy" && $("#formW2CommencementDate").val() != "") saveObj.DateOfCommencement = $("#formW2CommencementDate").val();
    if ($("#formW2CompletionDate").val() != "dd/mm/yyyy" && $("#formW2CompletionDate").val() != "") saveObj.DateOfCompletion = $("#formW2CompletionDate").val();
    if ($("#fw2InstructWorkDuration").val() != "") saveObj.InstructWorkDuration = $("#fw2InstructWorkDuration").val();
    saveObj.Remarks = $("#formW2Remarks").val();
    saveObj.DetailsOfWorks = $("#formW2DetailsOfWorks").val();
    saveObj.CeilingEstCost = $("#formW2EstCost").val();

    if ($("#formW2IssuedBy").find(":selected").val() != "") saveObj.IssuedBy = $("#formW2IssuedBy option:selected").val();
    if ($("#formW2IssuedName").val() != "") saveObj.IssuedName = $("#formW2IssuedName").val();
    if ($("#formW2IssuedDate").val() != "dd/mm/yyyy" && $("#formW2IssuedDate").val() != "") saveObj.IssuedDate = $("#formW2IssuedDate").val();
    saveObj.IssuedSign = $("#formW2IssuedSignture").prop("checked");

    if ($("#formw2RequestedBy").find(":selected").val() != "") saveObj.RequestedBy = $("#formw2RequestedBy option:selected").val();
    if ($("#formW2RequestedName").val() != "") saveObj.RequestedName = $("#formW2RequestedName").val();
    if ($("#formW2RequestedDate").val() != "dd/mm/yyyy" && $("#formW2RequestedDate").val() != "") saveObj.RequestedDate = $("#formW2RequestedDate").val();
    saveObj.RequestedSign = $("#formW2RequestedSign").prop("checked");

    //Created by

    if ($("#formw2RequestedBy").find(":selected").val() != "") saveObj.ModBy = $("#formw2RequestedBy").find(":selected").val();
    if ($("#FW2HRef_No").val() != "") saveObj.ModDt = output
    if ($("#formW2IssuedBy").find(":selected").val() != "") saveObj.CrBy = $("#formW2IssuedBy").find(":selected").val();
    if ($("#FW2HRef_No").val() == "") saveObj.CrDt = output;

    saveObj.ActiveYn = true;
    saveObj.SubmitSts = submit;
    console.log(saveObj);
    $.ajax({
        url: '/InstructedWorks/SaveFormW2',
        data: saveObj,
        type: 'POST',
        success: function (data) {
            HideAjaxLoading();
            if (data == -1) {
                app.ShowErrorMessage("Reference id already Exist");
            }
            else {
                $("#FW2HRef_No").val(data);
                if (submit) {
                    $("#saveFormW2Btn").hide();
                    $("#submitFormW2Btn").hide();
                    app.ShowSuccessMessage('Successfully Submitted', false);
                    location.href = "/InstructedWorks";
                }
                else {
                    $("#saveFormW2Btn").show();
                    $("#submitFormW2Btn").show();
                    app.ShowSuccessMessage('Successfully Saved', false);
                }
            }
        },
        error: function (data) {
            HideAjaxLoading();
            app.ShowErrorMessage(data.responseText);
        }

    });

}

function Delete(id) {
    var headerId = id;
    app.Confirm("Are you sure you want to delete the record?, If Yes click OK.", function (e) {
        if (e) {
            InitAjaxLoading();
            $.ajax({
                url: '/InstructedWorks/Delete',
                data: { headerId },
                type: 'POST',
                success: function (data) {
                    if (data > 0) {
                        app.ShowSuccessMessage('Successfully Deleted', false);
                        FormDGridRefresh();
                    }
                    else {
                        app.ShowErrorMessage("Error in Deleted. Kindly retry later.", false);
                    }
                    HideAjaxLoading();
                }
            });
        }
    });
}

function GetImageList(id) {
    var group = $("#FormADetAssetGrpCode option:selected").val();

    $("#saveFormW2Btn").hide();
    $("#submitFormW2Btn").hide();
    $("#saveFCEMBtn").hide();
    $("#submitFCEMBtn").hide();

    if (id && id > 0) {
        $("#FW2HRef_No").val(id);
    }
    else {
        id = $("#FW2HRef_No").val();
    }

    $.ajax({
        url: '/InstructedWorks/GetW2ImageList',
        data: { formW2Id: id, assetgroup: group },
        type: 'POST',
        success: function (data) {
            $("#ViewPhoto").html(data);
            $("#FW2HRef_No").val(id);
        },
        error: function (data) {
            alert(data.responseText);
        }

    });

    return true;
}

//function changeRegion(obj) {
//    var ctrl = $(obj);

//    if (ctrl.val() != null && ctrl.val() != "") {
//        var name = ctrl.find("option:selected").text();
//        name = name.split('-').length > 1 ? name.split('-')[1] : name;
//        $("#formW2RegionName").val(name);
//    }
//    else {
//        $("#formW2RegionName").val('');
//    }
//}

function changeDivision(obj) {
    var ctrl = $(obj);
    if (ctrl.val() != null && ctrl.val() != "") {
        var name = ctrl.find("option:selected").text();
        name = name.split('-').length > 1 ? name.split('-')[1] : name;
        $("#formW2DivisonName").val(name);
    }
    else {
        $("#formW2DivisonName").val('');
    }
}

function changeRMU(obj) {
    var ctrl = $(obj);
    if (ctrl.val() != null && ctrl.val() != "") {
        var name = ctrl.find("option:selected").text();
        name = name.split('-')[1];
        $("#formW2RMUName").val(name);
    }
    else {
        $("#formW2RMUName").val('');
    }
}

function OnRoadChange(tis) {
    var ctrl = $(tis);

    if (ctrl.val() != null && ctrl.val() != "") {
        $("#formW2roadDesc").val(ctrl.find("option:selected").attr("Item1"));
        $("#formW2Fromchkm").val(ctrl.find("option:selected").attr("frokm"));
        $("#formW2Fromchm").val(ctrl.find("option:selected").attr("fromm"));

        $("#formW2Tochkm").val(ctrl.find("option:selected").attr("tokm"));
        $("#formW2Tochm").val(ctrl.find("option: selected").attr("tom"));

        $("#frmW2RoadCode").val(ctrl.val());
        var roadCode = ctrl.val();
        InitAjaxLoading();
        $.ajax({
            url: '/InstructedWorks/GetW1Details',
            dataType: 'JSON',
            data: { roadCode },
            type: 'Post',
            success: function (data) {
                if (data != null) {
                    $("#fw1RefNo").val(data.referenceNo);
                    $("#fw1PKRefNo").val(data.pkRefNo);
                    $("#fw1ProjectTitle").val(data.projectTitle);
                    $("#formW2TitleOfInstructWork").val(data.detailsOfWork);
                    $("#formW2EstCost").val(data.estimTotalCost);
                }
                HideAjaxLoading();
            },
            error: function (data) {
                console.error(data);
            }
        });

    }
    else {
        $("#formW2roadDesc").val('');
    }

}

function ChangeRUser(obj) {
    var id = $(obj).find("option:selected").val();
    if (id != "99999999" && id != "") {
        $.ajax({
            url: '/ERT/GetUserById',
            dataType: 'JSON',
            data: { id },
            type: 'Post',
            success: function (data) {
                if (data != null) {
                    $("#formW2RequestedName").val(data.userName);
                    $("#formW2RequestedName").prop("disabled", true);
                }
            },
            error: function (data) {
                console.error(data);
            }
        });
    }
    else if (id == "99999999") {
        $("#formW2RequestedName").prop("disabled", false);
        $("#formW2RequestedName").val('');
    }
    else {
        $("#formW2RequestedName").prop("disabled", true);
        $("#formW2RequestedName").val('');
    }
    $("#formW2RequestedDate").val(currentDate);
    return false;
}

function GoBack() {
    if ($("#hdnView").val() == "0") {
        if (app.Confirm("Unsaved changes will be lost. Are you sure you want to cancel?", function (e) {
            if (e) {
                location.href = "/InstructedWorks/Index";
            }
        }));
    }
    else
        location.href = "/InstructedWorks/Index";
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

