
Ci-dessous une liste de pratiques pour utiliser Angularjs.

Ces pratiques sont un condensés des guides de [johnpapa/angular-styleguide](https://github.com/johnpapa/angular-styleguide) et de [mgechev/angularjs-style-guide](https://github.com/mgechev/angularjs-style-guide)

En cas pratique, une adaptation du [Angularjs TodoMVC](http://todomvc.com/examples/angularjs/#/) selon les pratiques évoquées ci-dessous.

**Sommaire**
* [Pratiques globales](#pratiques_globales)
    * [Structure de fichiers](#structure_de_fichiers)
    * [Conventions de nommage](#conventions_de_nommage)
    * [IIFE](#iife)
    * [Utiliser des fonctions nommées au lieu de fonctions anonymes](#fonctions_nommees)
    * [Placer les membres (méthodes, attributs) "appellables" en haut](#appellables_haut)
    * [Retourner une *promise* lors d'un appel à données](#promise_appel)
* [Module](#module)
* [Controller](#controller)
* [Factory/Service](#factory_service)
    * [Service](#service)
* [Provider](#provider)
* [Directive](#directive)
* [Routing](#routing)
* [Template](#template)

<a name="pratiques_globales"></a>
# Pratiques globales

<a name="structure_de_fichiers"></a>
### Structure de fichiers
**Un composant par fichier (controller,service, factory, etc.)**
* Créer un haut niveau de divisions par composants et un bas niveau par fonctionnalités :

```
.
├── app
│   ├── app.js
│   ├── controllers
│   │   ├── home
│   │   │   ├── FirstCtrl.js
│   │   │   └── SecondCtrl.js
│   │   └── my-complex-functionnality
│   │       └── ThirdCtrl.js
│   ├── directives
│   │   ├── home
│   │   │   └── directive1.js
│   │   └── about
│   │       ├── directive2.js
│   │       └── directive3.js
│   ├── filters
│   │   ├── home
│   │   └── about
│   └── services
│       ├── CommonService.js
│       ├── cache
│       │   ├── Cache1.js
│       │   └── Cache2.js
│       └── models
│           ├── Model1.js
│           └── Model2.js
├── partials
├── lib
└── test
```

* Créer un haut niveau de division par fonctionnalités et un bas niveau par types de composants.

```
.
├── app
│   ├── app.js
│   ├── common
│   │   ├── controllers
│   │   ├── directives
│   │   ├── filters
│   │   └── services
│   ├── home
│   │   ├── controllers
│   │   │   ├── FirstCtrl.js
│   │   │   └── SecondCtrl.js
│   │   ├── directives
│   │   │   └── directive1.js
│   │   ├── filters
│   │   │   ├── filter1.js
│   │   │   └── filter2.js
│   │   └── services
│   │       ├── service1.js
│   │       └── service2.js
│   └── my-complex-module
│       ├── controllers
│       │   └── ThirdCtrl.js
│       ├── directives
│       │   ├── directive2.js
│       │   └── directive3.js
│       ├── filters
│       │   └── filter3.js
│       └── services
│           └── service3.js
├── partials
├── lib
└── test
```
<a name="conventions_de_nommage"></a>
### Conventions de nommage
Element | Naming style | Example | usage
----|------|----|--------
Modules | lowerCamelCase  | angularApp |
Controllers | Functionality + 'Ctrl'  | AdminCtrl |
Directives | lowerCamelCase  | userInfo |
Filters | lowerCamelCase | userFilter |
Services | UpperCamelCase | User | constructor

<a name="iife"></a>
### Encapsuler les composants dans un IIFE(Immediately Invoked Function Expression)
Evite que les variables et fonctions ne vivent plus longtemps que prévu dans le scope global et évite les collisions de variables.
```javascript
(function() {
    'use strict';

    angular
        .module('app')
        .factory('logger', logger);

    function logger() { }
})();
```
<a name="fonctions_nommees"></a>
### Utiliser des fonctions nommées au lieu de fonctions anonymes
Plus facile à lire et à débugguer.

```javascript
/* Éviter */
angular
    .module('app')                    
    .controller('DashboardController', function() { }) //fonction anonyme
    .factory('logger', function() { }); //fonction anonyme
```

```javascript
/* Recommander */
// dashboard.js
angular
    .module('app')
    .controller('DashboardController', DashboardController);
    
//fonctions nommées
function DashboardController() { }
```

```javascript
// logger.js
angular
    .module('app')
    .factory('logger', logger);
    
//fonctions nommées
function logger() { }
```

<a name="appellables_haut"></a>
### Placer les membres (méthodes, attributs) "appellables" en haut.
Plus facile à lire et on voit directement quels membres peuvent être utilisés.

```javascript
/* Éviter */
function dataService() {
  var someValue = '';
  function save() {
    /* */
  };
  function validate() {
    /* */
  };

  return {
      save: save,
      someValue: someValue,
      validate: validate
  };
}
```

```javascript
/* Recommander */
function dataService() {
    var someValue = '';
    var service = {
        save: save,
        someValue: someValue,
        validate: validate
    };
    return service;

    ////////////

    function save() {
        /* */
    };

    function validate() {
        /* */
    };
}
```

<a name="promise_appel"></a>
### Retourner une *promise* lors d'un appel à données
*promise* (*promesse* en français) est un objet issu d'un appel à une action asynchrone.

```javascript
/* recommended */

activate();

function activate() {
    /**
     * Étape 1
     * Demande à la fonction getAvengers des données avenger et attend la promesse
     */
    return getAvengers().then(function() {
        /**
         * Étape 4
         * Effectue une action sur la résolution final de la promesse
         */
        logger.info('Activated Avengers View');
    });
}

function getAvengers() {
      /**
       * Étape 2
       * Demande à dataservice de récupérer les données et attends la promesse
       */
      return dataservice.getAvengers()
          .then(function(data) {
              /**
               * Étape 3
               * initialise la donnée et retourne la promesse
               */
              vm.avengers = data;
              return vm.avengers;
      });
}
```

<a name="module"></a>
# Module
Créer un module Angular
```javascript
(function() {
    'use strict';

    angular
    .module('app', [
        'ngAnimate', //autres modules
        'ngRoute', //autres modules
        'app.shared', //sous-modules
        'app.dashboard' //sous-modules
    ]);
    
})();
```
Ne pas hésiter à créer plusieurs modules ou sous-modules dans l'esprit de la ré-usabilité. 
Pour un sous-module on prendra comme convention *module.sous_module*

<a name="controller"></a>
# Controller
Créer un controller et utiliser la syntaxe avec controllerAs plutôt que la syntaxe classique avec $scope.

```javascript
(function() {
    angular
        .module('app')
        .controller('DashboardController', function($scope) { //syntaxe classique
            $scope.name = {};
            $scope.sendMessage = function() { };
    });
})();
```

```javacript
/* Recommandé */
(function() {
    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    function DashboardController() {
        var vm = this;
        vm.name = {};
        vm.sendMessage = sendMessage;
        
        function sendMessage(){
        
        }
    }

})();
```

Utilisation dans le template
```html
<input ng-model="vm.name"/>
```
Note: Vous pouvez remplacer *vm* par ce que vous voulez tant que vous restez consistant.

<a name="factory_service"></a>
# Factory/Service

Pour se simplifier la tâche, utiliser les services au lieu de Factory. Pour plus d'[explications](http://blog.thoughtram.io/angular/2015/07/07/service-vs-factory-once-and-for-all.html).

<a name="service"></a>
### Service
Mettre le code métier dans des services. Les services s'occuperont de la gestion de la donnée (appelle XHR, local storage, etc.). Cela peut s'apparenter au *model* dans l'architecture MVC.

```javascript
/* recommended */
(function() {
angular
    .module('app')
    .service('User', User);

function User() {
    var someValue = '';
    var service = {
        save: save,
        someValue: someValue,
        validate: validate
    };
    
    return service;

    ////////////

    function save() {
        /* */
    };

    function validate() {
        /* */
    };
}

})();
```
<a name="provider"></a>
# Provider
Si le service a besoin de configuration, il faut le définir en tant que *provider*
```javascript
(function() {
    angular.module('demo', [])
    .config(function ($provide) {
      $provide.provider('sample', Sample);
    });

    var demo = angular.module('demo');

    demo.config(function (sampleProvider) {
      sampleProvider.setFoo(41);
    });
    
    function Sample(){
        var foo = 42;
        
        return {
          setFoo: setFoo,
          $get: get
        };
        
        ////////////
        
        function setFoo(f){
            foo = f
        };
        
        function get function(){
            return {
                foo: foo
            }
        }
    }

})();

```

<a name="directive"></a>
# Directive
Généralement, pour toutes manipulations du DOM on utilise une directive.

```javascript
(function() {
    angular
        .module('app')
        .directive('myExample', myExample);

    function myExample() {
        var directive = {
            restrict: 'EA',
            templateUrl: 'app/feature/example.directive.html',
            scope: {
                max: '='
            },
            link: linkFunc,
            controller: ExampleController,
            // note: Ça serait 'ExampleController' (le nom exporté du controller comme une chaine de caractère)
            // Si cela faisait référence à un controller se trouvant dans un autre fichier
            controllerAs: 'vm', // 'vm' pour 'ViewModel'
            bindToController: true // lie le scope extérieur à la directive au scope à l'intérieur de la directive
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            console.log('LINK: scope.vm.min = %s', scope.vm.min);
            console.log('LINK: scope.vm.max = %s', scope.vm.max);
        }
    }

    //Si on a besoin d'injecter une dependance
    //ExampleController.$inject = ['$dependance'];

    function ExampleController($dependance) {
        var vm = this;
        vm.min = 3;
        
        console.log('CTRL: vm.min = %s', vm.min);
        console.log('CTRL: vm.max = %s', vm.max);
    }
})();
```

```html
<!-- example.directive.html -->
<div>hello world</div>
<div>max={{vm.max}}<input ng-model="vm.max"/></div>
<div>min={{vm.min}}<input ng-model="vm.min"/></div>
```

<a name="routing"></a>
# Routing
Utiliser [AngularUi-Router](http://angular-ui.github.io/ui-router/)

Note : 
Vous pouvez utiliser un *provider* tel que *routerHelperProvider* (ci-dessous) pour aider à définir des *états* (routes) dans plusieurs fichiers.
* Cela permet à chaque module d'avoir ses propres routes. 
* Chaque module doit fonctionner seul. En enlevant un module l'app doit contenir que des routes qui fonctionnent. 
* C'est plus facile d'activer ou désactiver des modules sans problèmes de routes orphelin

```javascript
// customers.routes.js
(function() {
    angular
        .module('app.customers')
        .run(appRun);

    /* @ngInject */
    appRun.$inject = ['routerHelper'];
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'customer',
                config: {
                    abstract: true,
                    template: '<ui-view class="shuffle-animation"/>',
                    url: '/customer'
                }
            }
        ];
    }
})();
```

```javascript
// routerHelperProvider.js
(function() {
    
angular
    .module('blocks.router')
    .provider('routerHelper', routerHelperProvider);

routerHelperProvider.$inject = ['$locationProvider', '$stateProvider', '$urlRouterProvider'];
/* @ngInject */
function routerHelperProvider($locationProvider, $stateProvider, $urlRouterProvider) {
    /* jshint validthis:true */
    this.$get = RouterHelper;

    $locationProvider.html5Mode(true);

    RouterHelper.$inject = ['$state'];
    /* @ngInject */
    function RouterHelper($state) {
        var hasOtherwise = false;

        var service = {
            configureStates: configureStates,
            getStates: getStates
        };

        return service;

        ///////////////

        function configureStates(states, otherwisePath) {
            states.forEach(function(state) {
                $stateProvider.state(state.state, state.config);
            });
            if (otherwisePath && !hasOtherwise) {
                hasOtherwise = true;
                $urlRouterProvider.otherwise(otherwisePath);
            }
        }

        function getStates() { return $state.get(); }
    }
}
})();
```

<a name="template"></a>
# Template
* Utiliser ng-bind ou ng-cloak pour empêcher le contenu de s'afficher tant qu'il n'est pas prêt.
* Utiliser ng-src pour pour afficher une image dynamiquement
* Utiliser ng-href pour afficher un lien dynamiquement