(function() {

  var socket = io.connect();

  // On connection to server
  socket.on('connect', function() {
    // Tell the server I want to be in the mobile room
    socket.emit('room', 'mobile');
  });

  socket.on('html', function(code) {
    console.log('html code evaluated:', code);
    reset();
    document.location.reload(true);

    // mosync = null;

    document.open();
    document.write(code);
    document.close();

  });

  socket.on('javascript', function(code) {
    try {
      console.log('Code evaluate on mobile:', code);
      // execute eval in the global scope
      eval.call(window, code);
    } catch(e) {
      // If the user changes something that generate an error,
      // we don't want to show an alert every time
      // alert('something went wrong with the js!');
      console.log('error catch mobile:', e);
      socket.emit('mobilelog', e.message);
    }
  });

  socket.on('reset', function() {
    reset();
  });

  function reset() {
    mosync.nativeui.destroyAll();
    mosync.bridge.send(['Custom', 'restoreWebView']);
    mosync.bridge.send(['Custom', 'restoreWebView']);
    mosync.nativeui.callBackTable = {};
    mosync.nativeui.eventCallBackTable = {};

    mosync.nativeui.numWidgetsRequested = 0;
    window.clearInterval(mosync.nativeui.showInterval);
  }

  socket.on('downloadResource', function(data) {
    mosync.bridge.send([
      'Custom',
      'downloadResource',
      data.url,
      data.filename
    ], function(message) {
      socket.emit('fileSaved', message);
    });
  });

  socket.on('getListResources', function() {
    mosync.bridge.send([
      'Custom',
      'getListResources'
    ], function(resources) {
      socket.emit('listResources', resources);
    });
  });

})(); // (function() {