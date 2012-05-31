
$(document).ready(function(){

  var rawMd, fileName;
  var editingAllowed = false; //dont allow editing until something is loaded

  var socket = io.connect();
  socket.on('connect', function(){
    socket.on('navLinks', function (data){
      $('#navigation').html(data.links);
      changeContentHeight();
    });

    $(document).on('click', '#navigation a', function(a){
      socket.emit('readFile', {name: $(a.currentTarget).text()});
      $('#content #markdown_content').html('<p>Loading...</p>');
    });

    socket.on('readFileReply', function(data){
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
        changeContentHeight();
        $('#notification').slideUp();
      }
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
      if (editingAllowed == false){ //currently editing
        socket.emit('saveFile', {name: fileName, content: $('#content #markdown_content textarea').val()});
      }
    });
  });

  $(document).on('click', '#edit_save_buttons a#edit', function(){
    if (editingAllowed == true){
      editingAllowed = false;
      $('#content').height('auto');
      $('#content #markdown_content').html('<textarea>' + rawMd + '</textarea>');
    }
  });

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

  // changing class of links on navigation
  $(document).on('click', '#navigation a', function(a){
    $('#navigation').children().attr('class', '');
    $(a.currentTarget).attr('class', 'selected');
  });


});
