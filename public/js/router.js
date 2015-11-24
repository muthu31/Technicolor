var myApp = angular.module('myApp', ['ngRoute','ui.bootstrap']);
//hey, we can configure a provider!            
myApp.config(function($routeProvider){
   // helloWorldProvider.setName('World');
    $routeProvider
    .when("/login",{
        templateUrl:"views/login.html",
        controller:"login"
    })
    .when("/menu",{
        templateUrl:"views/menu.html",
        controller:"menucontroller"
    })
    .when("/nestedController",{
        templateUrl:"views/nestedController.html"
    })
    .otherwise({ redirectTo: '/login' });
})
