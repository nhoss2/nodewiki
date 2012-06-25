
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
        $('#notification').html('there was an error: ' + data.error.reason);
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

        if (creatingNewFile == true){
          creatingNewFile == false;
          $('#content #content_header h1').html(fileName);
          tempFile = '';
          socket.emit('refreshNav');
        }
      }
    });

    $(document).on('click', '#edit_save_buttons a#save', function(){
      if (editingAllowed == false){ //if user is currently editing
        if (creatingNewFile == true){
          if ($('#content #content_header input').val() != '' && $('#content #markdown_content textarea').val() != ''){
            socket.emit('saveFile', {name: $('#content #content_header input').val(), content: $('#content #markdown_content textarea').val()});
          } else {
            $('#notification').html('The title or the content cannot be empty. Also, the title needs to end with ".md"');
            $('#notification').slideDown('fast', function(){
              window.setTimeout(function(){$('#notification').slideUp()}, 4000);
            });
          }
        } else {
          socket.emit('saveFile', {name: fileName, content: $('#content #markdown_content textarea').val()});
        }
      }
    });

    $(document).on('click', '#navigation code#back_button', function(){
      socket.emit('goBackFolder');
      $('#content #markdown_content').html('');
      $('#content_header h1').html('Node Wiki');
      //editingAllowed = true;
    })

    var tempFile; // hold the <a> tag for the new file being created
    var creatingNewFile = false;

    $(document).on('click', '#navigation code#new_file', function(){
      fileName = '';
      rawMd = '';
      creatingNewFile = true;
      editingAllowed = false;
      socket.emit('newFile');
      $('#navigation a:last').after('<a href="#"><code>New File...</code></a>');
      tempFile = $('#navigation a:last');
      $('#navigation').children().attr('class', '');
      tempFile.attr('class', 'selected');
      $('#navigation code#new_file').remove();
      $('#content #markdown_content').html('<textarea></textarea>');
      $('#content #content_header h1').html('<form><input type="text" /></form>');
      $('#content #content_header input').focus();
      showButtons(true, true);
      changeContentHeight();
    });

    $(document).on('click', '#edit_save_buttons a#cancel', function(){
      tempFile.remove();
      tempFile = '';
      creatingNewFile = false;
      editingAllowed = true;
      $('#content #markdown_content').html('');
      $('#content #content_header h1').html('Node Wiki');
      $('#navigation').append('<code id="new_file">New File</code>');
      showButtons(false);
    });

  });

  $(document).on('click', '#edit_save_buttons a#edit', function(){
    if (editingAllowed == true){
      editingAllowed = false;
      $('#content').height('auto');
      $('#content #markdown_content').html('<textarea>' + rawMd + '</textarea>');
    }
  });

  function showButtons(show, newFile){
    var buttons = '<a id="edit" href="#">Edit</a>\n<a id="save" href="#">Save</a>';
    if (show){
      if (newFile){
        $('#edit_save_buttons').html('<a id="cancel" href="#">Cancel</a>\n<a id="save" href="#">Save</a>');
      } else {
        $('#edit_save_buttons').html(buttons);
      }
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
