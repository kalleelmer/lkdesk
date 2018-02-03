var module = angular.module("lkticket.admin");

module.factory('Clippy', function() {

	var clip = 0;

	var load = function () {
		clippy.load(localStorage.mascot || 'Clippy', function(agent) {
			// Do anything with the loaded agent
			agent.show();
			agent.speak("IMAGINAL!!")
			agent.moveTo(500,500)

			clip = agent;

			clip.speak("HEJ!");

		});
	}

	load();

	return {
		setMascot : function functionName(n) {
			localStorage.mascot = n;
			clip.hide();
			load();
		},
		say : function(say) {
			console.log(clip);
			if (clip) {
				clip.speak(say);
			} else {
				console.log("Clippy har inte vaknat än: " + say);
			}
		},
		play : function(animation) {
			clip.play(animation);
		}
	}
});
