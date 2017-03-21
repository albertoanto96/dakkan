(function() {
    'use strict';
    var app = angular.module('mainApp');
    app.service('userSRV', ['$http','Upload',function ($http,Upload) {


        this.usersFromSubj=function(subject,callback){ //cambiar
            var req = {
                method: 'POST',
                url: '/userssubj',
                headers: {'Content-Type': 'application/json'},
                data: subject

            };

            $http(req).then(function (response) {
                    callback(response.data)
            });

        };

        this.upload=function (data) {
            Upload.upload({
                url: 'upload/',
                data:data
            }).then(function (resp) {
                console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            });

        };

        this.getProfile=function (data,callback) {

            var req = {
                method: 'POST',
                url: '/profile',
                headers: {'Content-Type': 'application/json'},
                data: data
            };
            $http(req).then(function (response) {
                callback(response.data)
            });

        };



        this.addUserToSubj=function(u){ //cambiar
            var req = {
                method: 'PUT',
                url: '/updsub',
                headers: {'Content-Type': 'application/json'},
                data: u
            };
            $http(req).then(function (response) {
            });


        };
        this.getUsers = function (callback) {

            $http.get('/all').then(function (response) {
                callback (response.data);
            });

        };

        this.getSubjects=function(callback){ //////////cambiar
            $http.get('/subjects').then(function (response) {
                callback (response.data);
            });

        };
        this.removeUsers = function (data,callback) {
            var req = {
                method: 'DELETE',
                url: '/delete',
                headers: {'Content-Type': 'application/json'},
                data: data
            };
            $http(req).then(function (response) {
                callback(response)

            });
        };
        this.filterdb =function (data,callback) {

            var req = {
                method: 'GET',
                data: data,
                url: '/filterdb/'+data,
                headers: {'Content-Type': 'application/json'}

            };

             $http(req).then(function (response) {

              callback(response.data)

             });
        };
        this.updatePass=function(data,callback){
            var req = {
                method: 'PUT',
                url: '/updatePass',
                headers: {'Content-Type': 'application/json'},
                data: data
            };
            $http(req).then(function (response) {
                callback(response.data)
            });
        };

        this.updateName=function(data,callback){
            var req = {
                method: 'PUT',
                url: '/updateName',
                headers: {'Content-Type': 'application/json'},
                data: data
            };
            $http(req).then(function (response) {
                var result = response.data
                callback(result)
            });
        }
    }]);
})();