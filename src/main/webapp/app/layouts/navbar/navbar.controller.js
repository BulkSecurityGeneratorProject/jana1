(function() {
    'use strict';

    angular
        .module('janasanthwanamApp')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope','$state', 'Auth', 'Principal', 'ProfileService', 'LoginService'];

    function NavbarController ($scope, $state, Auth, Principal, ProfileService, LoginService) {
        var vm = this;

        vm.isNavbarCollapsed = true;
        vm.isAuthenticated = Principal.isAuthenticated;
        vm.account = null;


      

        ProfileService.getProfileInfo().then(function(response) {
            vm.inProduction = response.inProduction;
            vm.swaggerEnabled = response.swaggerEnabled;
        });

        vm.login = login;
        vm.logout = logout;
        vm.toggleNavbar = toggleNavbar;
        vm.collapseNavbar = collapseNavbar;
        vm.$state = $state;

        function login() {
            collapseNavbar();
            LoginService.open();
        }

        function logout() {
            collapseNavbar();
            Auth.logout();
            $state.go('home');
            alert("You have been logged out.");
            
        }

        function toggleNavbar() {
            vm.isNavbarCollapsed = !vm.isNavbarCollapsed;
        }

        function collapseNavbar() {
            vm.isNavbarCollapsed = true;
        }


        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();        

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }        
    }
})();
