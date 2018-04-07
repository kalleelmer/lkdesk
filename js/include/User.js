var module = angular.module("lkticket.admin");

var UserFactory = function(Core, Notification, $rootScope) {
	var User = {};
	var user = {
		profiles : null,
		profile : null
	};

	function loadProfiles() {
		Core.get("/desk/profiles/mine").then(
			function(response) {
				user.profiles = response.data;
				restoreProfile();
			},
			function(response) {
				Notification.error("Kunde inte hämta profiler: "
					+ response.status);
			});
	}
	
	function loadLocations() {
		Core.get("/desk/locations").then(
			function(response) {
				user.locations = response.data;
				restoreLocation();
			},
			function(response) {
				Notification.error("Kunde inte hämta försäljningsställe: "
					+ response.status);
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

	function restoreLocation() {
		console.log("Restoring location: " + sessionStorage.location_id);
		if (sessionStorage.location_id) {
			for (var i = 0; i < user.locations.length; i++) {
				if (user.locations[i].id == sessionStorage.location_id) {
					User.setLocation(user.locations[i]);
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

	User.locationID = function() {
		if (!user.location) {
			return 0;
		}
		return user.location.id;
	}

	User.getProfile = function() {
		return user.profile;
	}

	User.getLocation = function() {
		return user.location;
	}

	User.setProfile = function(profile) {
		user.profile = profile;
		sessionStorage.profile_id = profile.id;
		Notification.info("Din profil är " + profile.name);
		$rootScope.$emit("PROFILE_SELECTED");
	}

	User.setLocation = function(location) {
		user.location = location;
		sessionStorage.location_id = location.id;
		Notification.info("Försäljningsställe är " + location.name);
		$rootScope.$emit("LOCATION_SELECTED");
	}

	$rootScope.$on("LOGIN_SUCCESS", function(event, data) {
		loadProfiles();
		loadLocations();
	});

	return User;
}

module.factory("User", UserFactory);