var module = angular.module("lkticket.admin");

module.factory('clippyService', function() {

	var clip = 0;

	clippy.load('Clippy', function(agent) {
		// Do anything with the loaded agent
		agent.show();
		agent.speak("IMAGINAL!!")

		clip = agent;

		clip.speak("HEJ!");

	});

	return {
		say : function(say) {
			console.log(clip);
			clip.speak(say);
		},
		play : function(animation) {
			clip.play(animation);
		}
	}
});
