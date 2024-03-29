$(function(){
    $('#sidebarCollapse').on('click',function(){
        $('#sidebar, #content').toggleClass('active');
    })
})

$(document).ready(function(){
    $('[data-toggle="popover"]').popover();   
});

$(document).ready(()=>{
    $('#toggle-mode').click(()=>{
        if($('#toggle-mode').text() === "Details mode"){
            $('#toggle-mode').text("Focus mode");
            $("#focus-mode").css("display","none");
            $("#details-mode").css("display","block");
        }else{
            $('#toggle-mode').text("Details mode");
            $("#focus-mode").css("display","block");
            $("#details-mode").css("display","none");
        }
    })
});

$(document).ready(()=>{
    $('#add-user-button').click(()=>{
        if($('#add-user').css("opacity") == 0){
            $('#add-user').css({"height":"300","opacity":"1"});
        }else{
            $('#add-user').css({"height":"0","opacity":"0"});
        }
    });
});

$(document).ready(()=>{
    $('#add-task-button').click(()=>{
        $('#add-task').css("display","block");
        $('#add-task-button').css("display","none");
    });
    $('#cancel-task').click(()=>{
        $('#add-task').css("display","none");
        $('#add-task-button').css("display","block");
    })
});


$(document).ready(()=>{
    $('#add-comment-button').click(()=>{
        $('#add-comment').css("display","block");
        $('#add-comment-button').css("display","none");
    });
    $('#cancel-comment').click(()=>{
        $('#add-comment').css("display","none");
        $('#add-comment-button').css("display","block");
    })
});

$(document).ready(()=>{
    $('#add-user-task-button').click(()=>{
        if($('#add-user-task').css("opacity") == 0){
            $('#add-user-task').css({"height":"300","opacity":"1"});
        }else{
            $('#add-user-task').css({"height":"0","opacity":"0"});
        }
    });
});

$(document).ready(()=>{
    $('#edit-access-button').click(()=>{
        if($('#edit-access').css("opacity") == 0){
            $('#edit-access').css({"height":"300","opacity":"1"});
        }else{
            $('#edit-access').css({"height":"0","opacity":"0"});
        }
    });
});

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        
        reader.onload = function (e) {
            $('#image-source').attr('src', e.target.result);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

$(document).ready(()=>{
    $('#picture').change((f)=>{
        readURL(f.target);
    })
});

function allowDrop(ev) {
    console.log("allowDrop");
    ev.preventDefault();
}

function drag(ev) {
    console.log("drag");
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    console.log("drop");
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    mx = ev.target;
    while(!$(mx).hasClass("infinite-scroll-y-axis"))
        mx = mx.parentElement;
    addBtn = $(mx).children().last().remove()
    mx.appendChild(document.getElementById(data));
    mx.appendChild(addBtn[0]);
}