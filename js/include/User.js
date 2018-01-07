var module = angular.module("lkticket.admin");

var UserFactory = function(Core, Clippy) {
	var User = {};
	var user = {
		profiles : null,
		profile : null
	};

	function loadProfiles() {
		Core.get("/desk/profiles/mine").then(function(response) {
			user.profiles = response.data;
			restoreProfile();
		}, function(response) {
			Clippy.say("Kunde inte hämta profiler: " + response.status);
		});
	}

	function restoreProfile() {
		console.log("Restoring profile: " + sessionStorage.profile_id);
		if (sessionStorage.profile_id) {
			for (var i = 0; i < user.profiles.length; i++) {
				if (user.profiles[i].id == sessionStorage.profile_id) {
					User.setProfile(user.profiles[i]);
					return;
				}
			}
		}
	}

	User.getUser = function() {
		return user;
	}

	User.profileID = function() {
		if (!user.profile) {
			return 0;
		}
		return user.profile.id;
	}

	User.setProfile = function(profile) {
		user.profile = profile;
		sessionStorage.profile_id = profile.id;
		Clippy.say("Din profil är " + profile.name + " (" + profile.id + ")");
	}

	loadProfiles();

	return User;
}

module.factory("User", UserFactory);