myApp
.controller("login",['$scope', '$http','$location',function(scope, http, loc){
    scope.doLogin=function(item){
        http({
          method:'POST',
          url:"/login",
          data:{user:scope.user, password:scope.password}
        }).then(function(){
          loc.url("/menu")
        }, function(){
          alert("Login Failed")
        })
    }    
}])
.factory('statesFactory', function($http){
    return {
      getAllStateAbbreviations:function(cb){
        $http.get("/states/abbreviations").then(function(response){
          cb(response["data"])
        })
      },
      getStateDetails:function(stateKey, cb){
        $http.get("/states/"+stateKey).then(function(response){
          cb(response["data"])
        })
      }
    }
})
.factory('guestBookFactory', function($http){
  return {
    writeMessage:function(inputParam, cb){
      $http({
        url:"/write",
        method:"POST",
        data:inputParam
      }).then(function(response){
        cb(response["data"])
      })
    },
    readMessage:function(cb){
      $http({
        method:"GET",
        url:"/read"
      }).then(function(response){
        cb(response["data"])
      })
    }
  }
})
.service("messagesService", function(guestBookFactory){
  var self = this 
  self.messages = []
  self.getMessage = function(cb){
     if(self.messages.length == 0){
        guestBookFactory.readMessage(function(messages){
          cb(messages)
        })
     }else{
      cb(self.messages)
    }     
  }
  self.updateMessage = function(messages){
    self.messages = messages
  }
})
.controller("menucontroller", function($scope, $http, messagesService){
  $scope.doLogout = function(){
    $http({
      url:"/logout",
      method:"GET"
    }).then(function(){
      alert("Logout Success")
    })
  }
  $scope.messages = []
  $scope.fetchMessages =  function(){
     messagesService.getMessage(function(msgs){
        $scope.messages = msgs
      })
  }
 
})
.controller('statesController', function($scope, statesFactory){
  function updateStateInfo(){
    statesFactory.getStateDetails($scope.state, function(stateInfo){
      $scope.stateInfo = stateInfo
    })
  }
  statesFactory.getAllStateAbbreviations(function(statesObject){
    $scope.states = statesObject
    $scope.state = $scope.states[0]
    updateStateInfo()
  })
  $scope.onstatechange = function(){
    updateStateInfo()
  }

})
.controller("messageViewController", function($scope, messagesService){
   $scope.messages = []
   messagesService.getMessage(function(msgs){
    $scope.messages = msgs
  })
})
.controller("guestBookController", function($scope, guestBookFactory, messagesService){ 
  $scope.addMessage = function(){    
    guestBookFactory.writeMessage({phone:$scope.phoneno,message:$scope.message}, function(messages){
      messagesService.updateMessage(messages)
      alert("Message Posted Successfully") 
    })
    $scope.phoneno = $scope.message = ""
  }
})