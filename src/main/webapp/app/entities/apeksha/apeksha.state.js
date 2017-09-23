(function() {
    'use strict';

    angular
        .module('janasanthwanamApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('apeksha', {
            parent: 'entity',
            url: '/apeksha?page&sort&search',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'janasanthwanamApp.apeksha.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/apeksha/apekshas.html',
                    controller: 'ApekshaController',
                    controllerAs: 'vm'
                }
            },
            params: {
                page: {
                    value: '1',
                    squash: true
                },
                sort: {
                    value: 'id,asc',
                    squash: true
                },
                search: null
            },
            resolve: {
                pagingParams: ['$stateParams', 'PaginationUtil', function ($stateParams, PaginationUtil) {
                    return {
                        page: PaginationUtil.parsePage($stateParams.page),
                        sort: $stateParams.sort,
                        predicate: PaginationUtil.parsePredicate($stateParams.sort),
                        ascending: PaginationUtil.parseAscending($stateParams.sort),
                        search: $stateParams.search
                    };
                }],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('apeksha');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('apeksha-detail', {
            parent: 'apeksha',
            url: '/apeksha/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'janasanthwanamApp.apeksha.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/apeksha/apeksha-detail.html',
                    controller: 'ApekshaDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('apeksha');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Apeksha', function($stateParams, Apeksha) {
                    return Apeksha.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'apeksha',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('apeksha-detail.edit', {
            parent: 'apeksha-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/apeksha/apeksha-dialog.html',
                    controller: 'ApekshaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Apeksha', function(Apeksha) {
                            return Apeksha.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('apeksha.new', {
            parent: 'apeksha',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/apeksha/apeksha-dialog.html',
                    controller: 'ApekshaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                applicationNumber: null,
                                beneficiaryName: null,
                                district: null,
                                gender: null,
                                fathersName: null,
                                age: null,
                                dateOfBirth: null,
                                aadharNumber: null,
                                rationCardNumber: null,
                                rationCardCategory: null,
                                caste: null,
                                religion: null,
                                houseName: null,
                                houseNumber: null,
                                tcNumber: null,
                                village: null,
                                taluk: null,
                                panchayat: null,
                                postOffice: null,
                                pinCode: null,
                                mobileNumber: null,
                                landLineWithSTD: null,
                                occupation: null,
                                annualIncome: null,
                                familyDetails: null,
                                landTotalCent: null,
                                landThaluk: null,
                                landVillage: null,
                                landDistrict: null,
                                requirementPurpose: null,
                                recommendationMinister: null,
                                recommendationMLA: null,
                                recommendationMP: null,
                                recommendationOthers: null,
                                hospitalName: null,
                                treatmentHistory: null,
                                expectedAmount: null,
                                anyAmountReceivingFromGovt: null,
                                govtAmountPurposeDetails: null,
                                bankName: null,
                                bankBranchName: null,
                                bankAccountNumber: null,
                                bankIfscCode: null,
                                additionalDocuments: null,
                                additionalDocumentsContentType: null,
                                remarks: null,
                                dateOfApplcation: null,
                                nomineeAvailable: null,
                                nomineeName: null,
                                nomineeGender: null,
                                nomineeAge: null,
                                nomineeRelationship: null,
                                nomineeHouseName: null,
                                nomineeHouseNumber: null,
                                nomineeTcNo: null,
                                nomineeVillage: null,
                                nomineeThaluk: null,
                                nomineePanchayat: null,
                                nomineePostOffice: null,
                                nomineePinCode: null,
                                nomineeMobileNumber: null,
                                nomineeLandLineWithSTD: null,
                                nomineeBankName: null,
                                nomineeBankBranch: null,
                                nomineeBankAccountNumber: null,
                                nomineeBankIfscCode: null,
                                photo: null,
                                photoContentType: null,
                                applicationForm: null,
                                applicationFormContentType: null,
                                aadharCard: null,
                                aadharCardContentType: null,
                                rationCard: null,
                                rationCardContentType: null,
                                doctorReport: null,
                                doctorReportContentType: null,
                                bankPassbookFrontPage: null,
                                bankPassbookFrontPageContentType: null,
                                nomineePhoto: null,
                                nomineePhotoContentType: null,
                                nomineeAadharCardRationCard: null,
                                nomineeAadharCardRationCardContentType: null,
                                nomineeRelationShipProof: null,
                                nomineeRelationShipProofContentType: null,
                                nomineeBankPassbookFrontPage: null,
                                nomineeBankPassbookFrontPageContentType: null,
                                isApplicantDifferentFromBenefeciary: null,
                                votersCardNumber: null,
                                applicantPlace: null,
                                onBehalfApplicantName: null,
                                onBehalfApplicantIDProof: null,
                                onBehalfApplicantIdProofNumber: null,
                                onBehalfApplicantRelationship: null,
                                onBehalfApplicantMobileNumber: null,
                                benefieciaryHasOwnProperty: null,
                                hasRecommendation: null,
                                isRecommendationFromChiefMinister: null,
                                isAnyAmountReceivingFromGovt: null,
                                isNomineeAvailable: null,
                                isPanchayatCorporationMunicipality: null,
                                nomineePlace: null,
                                nomineePanchayatCorporationMunicipality: null,
                                applicantExtraField1: null,
                                applicantExtraField2: null,
                                applicantExtraField3: null,
                                benefieciaryExtraField1: null,
                                generalPurposeExtraField1: null,
                                generalPurposeExtraField2: null,
                                generalPurposeExtraField3: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('apeksha', null, { reload: 'apeksha' });
                }, function() {
                    $state.go('apeksha');
                });
            }]
        })
        .state('apeksha.edit', {
            parent: 'apeksha',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/apeksha/apeksha-dialog.html',
                    controller: 'ApekshaDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Apeksha', function(Apeksha) {
                            return Apeksha.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('apeksha', null, { reload: 'apeksha' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('apeksha.delete', {
            parent: 'apeksha',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/apeksha/apeksha-delete-dialog.html',
                    controller: 'ApekshaDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Apeksha', function(Apeksha) {
                            return Apeksha.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('apeksha', null, { reload: 'apeksha' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
