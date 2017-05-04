(function() {
    'use strict';
    var app = angular.module('mainApp');
    app.controller('userCtrl', ['Upload','userSRV','$scope','$location','$rootScope','$mdDialog','$mdToast','localStorageService','$window',
        function (Upload,userSRV,$scope,$location,$rootScope,$mdDialog,$mdToast,localStorageService,$window) {

            $scope.profile=null;
            $scope.users = [];
            $scope.advs = [];
            $scope.subjects=[];
            $scope.subjectsdb = [];
            $scope.currentNavItem = 'Perfil';

            angular.element(document).ready(function () {
                var data = {
                    name:  localStorageService.get('userName')
                };
                if(data.name == null){
                    $location.path("/");
                    $scope.currentNavItem = 'Advs';
                }
                else{
                    var advs=[];
                    userSRV.getProfile(data,function (profile) {
                        $scope.profile=localStorageService.get('userName');
                        if(profile.image!=false){
                        $scope.image = "../imagesprof//" + profile.userid + ".png";

                        }
                        else{
                           $scope.image = "../imagesprof//undefined.png";
                        }
                        if(profile.advs[0]!=null) {
                            for (var i = 0; i < profile.advs.length; i++) {
                                advs.push({
                                    id: profile.advs[i].id,
                                    title: profile.advs[i].title,
                                    description: profile.advs[i].description,
                                    exchange: profile.advs[i].exchange,
                                    owner: profile.advs[i].owner,
                                    ownername: profile.advs[i].ownername,
                                    category: profile.advs[i].category
                                })
                            }
                        }
                        $scope.advs=advs

                    });

                }
            });

            $scope.getAdv = function (adv) {

                localStorageService.add('adv', adv);
                $rootScope.adv = localStorageService.get('adv');
                $location.path("/Adv");

            };


            $scope.search=function () {

                if($scope.search.word!=undefined){
                    userSRV.search($scope.search.word, function (response) {
                        localStorageService.add('advs', response);
			location.reload();
			$location.path("/Anuncios");
                    });


                }else{
                    localStorageService.add('advs', null);
                    location.reload();
                    $location.path("/Anuncios");
                }
            };

            $scope.filterdb=function(){
                userSRV.filterdb($scope.filterDB,function (users) {
                    $scope.users = users;
                    $scope.userName = "";
                    $scope.userPass = "";
                    $scope.filterDB="";

                })

            };

            $scope.upload = function (file) {
                var data= {
                    id:localStorageService.get('userID'),
                    file : file
                };
                userSRV.upload(data,function () {
                    $window.location.reload();
                });
            };
            $scope.showAdvanced = function(ev) {
                $mdDialog.show({
                    templateUrl: 'tpls/dialog.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true
                })
            };
            $scope.logout=function () {
                localStorageService.clearAll();
                $scope.profile=null;
                $location.path("/");
            };
            $scope.showPrompt = function(ev) {
                var confirm = $mdDialog.prompt()
                    .title('¿Estás seguro de que quieres borrar tu cuenta?')
                    .textContent('Te hecharemos de menos')
                    .placeholder('Confirmar contraseña')

                    .targetEvent(ev)
                    .ok('Okay!')
                    .cancel('Quiero seguir!');

                $mdDialog.show(confirm).then(function(result) {
                    var data = {
                        name: localStorageService.get('userName'),
                        password:result
                    };

                    userSRV.removeUsers(data, function (response) {
                        if(response.statusCode=200) {
                            $scope.logout();
			    location.reload();
                            $scope.currentNavItem = 'Login';

                        }
                        else{

                        }
                    });
                });
            };
            $scope.updatePass=function(){
                if($scope.newPass==$scope.newPass2) {
                    var data = {
                        name: localStorageService.get('userName'),
                        password: $scope.userPass,
                        new: $scope.newPass
                    };

                    userSRV.updatePass(data, function () {
			$mdToast.show(
                            $mdToast.simple()
                                .textContent('Contraseña cambiada correctamente')
                                .position('bottom left')
                                .hideDelay(3000)
                        );
                    });
                }
                $scope.newPass="";
                $scope.userPass = "";
                $scope.newName="";
                $scope.newPass2="";

            };
            $scope.updateName=function(){
                var data = {
                    name:localStorageService.get('userName'),
                    new:$scope.newName
                };

                userSRV.updateName(data,function (results) {

                    if(results!="500") {
                        localStorageService.add('userName',$scope.newName)
			$scope.profile = $scope.newName;
                        location.reload();
                    }else{
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent($scope.newName+" ya esta en uso")
                                .position("bottom")
                                .hideDelay(3000)
                        );
                    }
                    $scope.newPass="";
                    $scope.userPass = "";
                    $scope.newName="";
                    $scope.newPass2="";

                });

            };

            $scope.showSubjects=function(){ /////////////
                userSRV.getSubjects(function (sub) {
                    $scope.subjects = sub;
                });
            };

            $scope.addToSubj=function(){ /////////////////
                var us= {
                    name: $scope.userToAdd,
                    subject:$scope.subjectToAdd.split("\n")[0]

                };
                userSRV.addUserToSubj(us);
                $scope.userToAdd="";
                $scope.subjectToAdd=""

            };
            $scope.usersSubj=function () {/////////////////
                var subj={
                    name:$scope.usersF.split("\n")[0]
                };
                userSRV.usersFromSubj(subj,function(result){
                    $scope.subjects ="";
                    $scope.users=result;
                });
                $scope.usersF="";
            };


            $scope.showList = function() {
                userSRV.getUsers(function (users) {
                    $scope.subjects ="";
                    $scope.users = users;
                });
            };
        }]);
})();
