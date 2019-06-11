let getUserTemplate = () => {
    return {
        first_name: '',
        last_name: '',
        user_name: '',
        password: '',
        email: '',
        role: ''
    }
}
const vm = new Vue({
    el: "#app",
    data: {
        menu_stat: '',
        isSelected: '#users',
        users: [],
        saveAbleUser: getUserTemplate(),
        updateAbleUser: getUserTemplate(),
        u_errors: [],
    },
    methods: {
        deleteUser(un) {
            // un stands for user-name
            widgets.confirm('Are you sure want to delete <b>' + un + "</b>", 'warn', (bool) => {
                if (bool === true) {
                    axios.get('api/users/delete/' + un)
                        .then(response => {
                            // update users
                            // Fire the click event on the refresh button
                            $('.js_ref_us').click();
                        })
                        .catch(error => {
                            console.error(error)
                        });
                }
            });

        },
        editUser(un) {
            // make recursive tabindex to the first input
            axios.get('api/users/' + un)
                .then(response => {
                    // got users all information
                    vm.updateAbleUser = response.data;
                    vm.isSelected = '#edituser';
                })
                .catch(error => {
                    console.error(error)
                    $('.js_ref_us').click();
                });
        },
        updateUser() {
            // make recursive tabindex to the first input
            axios.post('/api/users/update/', this.updateAbleUser)
                .then(response => {
                    console.log('user updated');
                    // user have been successfully updated
                    vm.updateAbleUser = getUserTemplate();
                    vm.isSelected = '#users';
                    widgets.notify('User updated', 'info');
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        vm.u_errors = error.response.data;
                        setTimeout(() => {
                            vm.u_errors = [];
                        }, 7000);
                    }
                    console.log(error.response);
                });
        },
        addUser(event) {
            // make recursive tabindex to the first input
            $('#adduser .js-tabindex1').focus();
            axios.post('/api/users/add', this.saveAbleUser)
                .then(response => {
                    // update users list offline
                    vm.users.push(vm.saveAbleUser);
                    // reset all fields
                    widgets.notify('User added', 'info');
                    vm.saveAbleUser = getUserTemplate();
                })
                .catch(error => {
                    if (error.response.status == 422) {
                        vm.u_errors = error.response.data;
                        setTimeout(() => {
                            vm.u_errors = [];
                        }, 7000);

                        return;
                    }
                    console.log(error.response);
                    widgets.notify(error.response , 'warn');
                });
        },
        refreshUsersList(event) {
            if (!event.target.classList.contains('spin'))
                event.target.classList.add('spin');

            axios.get('/api/users/')
                .then(function (response) {
                    // data is array of users
                    vm.users = response.data;
                    setTimeout(() => {
                        event.target.classList.remove('spin');
                    }, 2000);
                });
        },
        logout() {
            axios.get('/api/users/logout')
                .then(res => {
                    // loged out , redirect to
                    console.log(res.data.redirect);
                    window.location.href = res.data.redirect.toLowerCase();

                }).catch(error => {
                    console.error(error);
                });
        }
    },
    created: function () {
        axios.get('/api/users/')
            .then(function (response) {
                // handle success
                // data is array of users
                vm.users = response.data;

                // which card to activate
                vm.isSelected = window.location.hash || '#users';
            });
    }
});