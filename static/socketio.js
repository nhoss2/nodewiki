
$(document).ready(function(){

  var rawMd, fileName;
  var editingAllowed = false; //dont allow editing until something is loaded

  var socket = io.connect();
  socket.on('connect', function(){
    socket.on('navLinks', function (data){
      $('#navigation').html(data.links);
      changeContentHeight();
    });

    var canSendReadFile = true;
    $(document).on('click', '#navigation a', function(a){
      if (canSendReadFile == true){
        socket.emit('readFile', {name: $(a.currentTarget).text()});
        canSendReadFile = false;
        $('#navigation').children().attr('class', '');
        $('#content #markdown_content').html('');
        $('#content_header h1').html('Node Wiki');
        $(a.currentTarget).attr('class', 'selected');
      }
    });

    socket.on('readFileReply', function(data){
      canSendReadFile = true;
      if (data.error.error == true){
        console.warn('error: ' + data.error.reason);
        $('#notification').html('error reading file: ' + data.error.reason);
        $('#notification').slideDown('fast', function(){
          window.setTimeout(function(){$('#notification').slideUp()}, 7000);
        });
        $('#content #markdown_content').html('');
        changeContentHeight();
      } else {
        $('#content #markdown_content').html(data.fileContents);
        $('#content #content_header h1').html(data.fileName);
        rawMd = data.rawMd;
        fileName = data.fileName;
        editingAllowed = true;
        showButtons(true);
        changeContentHeight();
        $('#notification').slideUp();
      }
    });

    socket.on('readFolderReply', function(data){
      canSendReadFile = true;
      $('#content #markdown_content').html('');
      changeContentHeight();
      editingAllowed = false;
      showButtons(false);
    });

    socket.on('saveFileReply', function(data){
      if (data.error.error == true){
        console.warn('there was an error saving');
        $('#notification').html('there was an error');
        $('#notification').slideDown('fast', function(){
          window.setTimeout(function(){$('#notification').slideUp()}, 7000);
        });
      } else {
        $('#content #markdown_content').html(data.fileContents);
        rawMd = data.rawMd;
        fileName = data.fileName;
        editingAllowed = true;
        changeContentHeight();
        $('#notification').html('Saved');
        $('#notification').slideDown('fast', function(){
          window.setTimeout(function(){$('#notification').slideUp()}, 2000);
        });
      }
    });

    $(document).on('click', '#edit_save_buttons a#save', function(){
      if (editingAllowed == false){ //if user is currently editing
        socket.emit('saveFile', {name: fileName, content: $('#content #markdown_content textarea').val()});
      }
    });

    $(document).on('click', '#navigation code#back_button', function(){
      socket.emit('goBackFolder');
      $('#content #markdown_content').html('');
      $('#content_header h1').html('Node Wiki');
      //editingAllowed = true;
    })

  });

  $(document).on('click', '#edit_save_buttons a#edit', function(){
    if (editingAllowed == true){
      editingAllowed = false;
      $('#content').height('auto');
      $('#content #markdown_content').html('<textarea>' + rawMd + '</textarea>');
    }
  });

  function showButtons(show){
    var buttons = '<a id="edit" href="#">Edit</a>\n<a id="save" href="#">Save</a>';
    if (show){
      $('#edit_save_buttons').html(buttons);
    } else {
      $('#edit_save_buttons').html('');
    }
  }


  function changeContentHeight(){
    $('#content').height('auto');
    var offset = $('#content').offset();
    var contentBottom = $('#content').height() + offset.top;

    var offsetNav = $('#navigation').offset();
    var navBottom = $('#navigation').height() + offsetNav.top;

    if (navBottom > contentBottom){
      $('#content').height($('#navigation').height() + 20 + 'px');
    }
  }


});
