angular.module('sync.services', ['ngCordova'])

.factory('syncService', ['mySqlDbService', '$http', function(mySqlDbService, $http) {
	  return {
		  uploadPhoto : function (session, imageUri, imageId, recipients, success , error, photoIndex)
		  {
		    	console.log("Sincronizando sessión: " + session.id );
		    	var ft = new FileTransfer();
		        var options = new FileUploadOptions();
		
		        options.fileKey = "image";
		        options.fileName = 'foto.jpg'; // We will use the name auto-generated by Node at the server side.
		        options.mimeType = "image/jpeg";
		        var serverURL = encodeURI('http://www.odiseo.com.ar/projects/brancaAppPhotos/guardar-foto.php');
		        options.params = {"deviceId": 12312313 , "sessionId" : session.id , "fotoId": imageId,   "date" : session.date , "recipients" : recipients };
				ft.onprogress = function(progressEvent) 
				{
    				if (progressEvent.lengthComputable) 
    				{
    					var percentage = progressEvent.loaded / progressEvent.total;
    					$('.syncProgress span').html('Sincronizando foto '+(photoIndex+1)+' de la sesión: '+percentage+'%');
    				} else {
      					$('.syncProgress span').html('Sincronizando foto '+(photoIndex+1)+' de la sesión.');
    				}
    				
    				$('.syncProgress ').show();
				};
		        ft.upload(imageUri, serverURL,
				            function (e) {
				               console.log("imagen sincronizada.");
				               $('.syncProgress ').hide();
				               success(session, imageUri, imageId, recipients);
				         	},
				            function (e) {
				         		console.log("Upload failed");
				            	console.log(e);
				            	$('.syncProgress ').hide();
				            		error(session, imageUri, imageId, recipients);
				            }, options);
	     },
	    
	    saveSession : function (url , dataReq){
	    	var req = {
	    			 method: 'POST',
	    			 url: url,
	    			 data: jQuery.param(dataReq) ,
	    			 headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	    	};
	    	return $http(req);
	       	//.success(function(){...}).error(function(){...});
	   },
	  };
  }
])