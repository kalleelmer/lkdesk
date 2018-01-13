var module = angular.module("lkticket.admin");

module.factory('Clippy', function() {

	var clip = 0;

  var connection = new WebSocket('ws://localhost:8080', ['soap', 'xmpp']);

  connection.onopen = function() {
  };

  // Log errors
  connection.onerror = function(error) {
    console.log('WebSocket Error ' + error);
  };

  // Log messages from the server
  connection.onmessage = function(e) {
		if (clip != 0) {
			clip.speak(e.data);
		}
  };

  var load = function() {
    clippy.load(localStorage.mascot || 'Clippy', function(agent) {
      // Do anything with the loaded agent
      agent.show();
      agent.speak("IMAGINAL!!")

      clip = agent;

    });
  }

  load();

  return {
    setMascot: function functionName(n) {
      localStorage.mascot = n;
      clip.hide();
      load();
    },
    say: function(say) {
      console.log(clip);
      clip.speak(say);
    },
    play: function(animation) {
      clip.play(animation);
    }
  }
});
