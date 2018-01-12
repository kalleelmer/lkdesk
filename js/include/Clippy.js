var module = angular.module("lkticket.admin");

module.factory('Clippy', function() {

	var clip = 0;

	var load = function () {
		clippy.load(localStorage.mascot || 'Clippy', function(agent) {
			// Do anything with the loaded agent
			agent.show();
			agent.speak("IMAGINAL!!")

			clip = agent;

			clip.speak("HEJ!");

		});
	}

	load();

	return {
		setMascot : function functionName(n) {
			clip.hide();
			localStorage.mascot = n;
			load();
		},
		say : function(say) {
			console.log(clip);
			clip.speak(say);
		},
		play : function(animation) {
			clip.play(animation);
		}
	}
});
