angular.module('app.services', ['base64'])

// factory: logger
// fucntion(s): log
// 		purpose: checks if log console is defined. If undefined, defines. prints to console.
// 		var: string 
//		return: log
.factory ('logger', function (){
	 function log (text){
		if (typeof console == "undefined") {
    		window.console = {
       		log: function () {}
   			};
		}
	console.log(text);
	}

	return {log: log};
})


// factory: sync
// fucntion(s): 
//		create
//		read

.factory ('sync', function($q, $http){

// function:		create
// purpose: post request to http link 
// var: string (url), JSON
// return: empty JSON upon success
	function create (JSON){
	}	

// function: read
// purpose:  retreive info from http link 
// var: string (url)
// return: filled JSON upon success
	var read = function (url){
		return $http.get (url)
			.then (function Success (response){
				console.log (url + " " + response.status +": " + response.statusText);
				return response.data;
			}, function Error (response){
				console.log (url + " " + response.status +": "+ response.statusText);
				return response.statusText;
			});


	}	
	
	return{read: read};
})


// factory: select
// fucntion(s): 
//		set
//		get

.factory ('select', function (){
	var JSON = {};

// function: set
// purpose:  sets the JSON  from the list pages 
// var: JSON
// return: n/a
	function set (data){
		JSON = data;

	}

// function: get
// purpose:  gets the JSON for the view pages
// var: 
// return: number
	function get (){
		return JSON;
	}

	return {set: set,
			get: get}
})

// factory: Camera
// function(s): 
//		checkPermissions
// 		setOptions
//		openCamera
//		convertToBase64
.factory('Camera', function($base64) {

// function: checkPermissions
// purpose:  checks and asks for camera permissions
// var: n/a
// return: n/a
	function checkPermissions (){
		// add event listener
      document.addEventListener("deviceready", onDeviceReady, false);

      // wait for device to be ready
      function onDeviceReady() {
        console.log(navigator.camera);
      	// check if camera permissions have been requested
    	cordova.plugins.diagnostic.isCameraAuthorized(function(authorized){
    	console.log("App is " + (authorized ? "authorized" : "denied") + " access to camera");
    		// if not, request access
    	if (!authorized){
			cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
            console.log("Successfully requested camera authorization: authorization was " + status);
        }, function(error){
            console.error(error);
        	});
		}
		}, function(error){
    		console.error("The following error occurred: "+ error);
		});
	}
	}

// function: setOptions
// purpose:  set the parameters for the camera options 
// var: source type (camera or image gallery)
// return: camera options
	function setOptions (source){
		var cameraOption = {
			quality: 100,
			allowEdit: false,
			sourceType: source,
			destinationType: Camera.DestinationType.FILE_URI,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.PICTURE,
			correctOrientation: true
		};
		return cameraOption;
	}

// function: openCamera
// purpose:  opens the camera and take the picture
// var: n/a
// return: n/a (eventually will return the encoded image)
	function openCamera() {
    	var options = setOptions(Camera.PictureSourceType.CAMERA);

    	navigator.camera.getPicture(function cameraSuccess(imageUri) {

        console.log(imageUri);

    	}, function cameraError(error) {
        	console.debug("Camera Error: " + error, "app");
    	}, options);
}

	function openGallery() {
    	var options = setOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM);

    	navigator.camera.getPicture(function cameraSuccess(imageUri) {

        console.log(imageUri);

    	}, function cameraError(error) {
        	console.debug("Camera Error: " + error, "app");
    	}, options);
}

// function: openGallery
// purpose:  opens the gallery to select a picture
// var: n/a
// return: n/a (eventually will return the encoded image)
	// function openGallery(){
 //    	var options = setOptions(Camera.PictureSourceType.CAMERA);

 //    	navigator.camera.getPicture(function cameraSuccess(imageUri) {

 //    	console.log (imageUri);

 //    	}, function cameraError(error) {
 //        console.debug("Unable to obtain picture: " + error, "app");

 //    	}, options);

	// }


// factory: convertImage
// function: convert
// 	purpose: converts an image to base 64
// 	var: file (image)
//	return: base 64 string
	var imageData;
	function convertToBase64 (file){
		imageData = $base64.encode (file);
		console.log(imageData);
       	return imageData;
	}	

// return values
	return {checkPermissions: checkPermissions,
			setOptions: setOptions,
			openCamera: openCamera,
			openGallery: openGallery,
			convertToBase64: convertToBase64
		};


});