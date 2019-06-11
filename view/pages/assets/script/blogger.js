const select = (el) => document.querySelector(el);

const vm = new Vue({
    el: "#app",
    data: {
        menu_stat: '',
        posts: [],
        newPost: {
            author: "Amar",
            title: "",
            brief: "",
            hero_image: "https://source.unsplash.com/user/erondu/",
            body: ""
        },
        activeSection: '#add_posts',
        editor: {}
    },
    watch: {
        activeSection(newVal) {
            if (newVal === '#all_posts') {
                this.getPosts();
            }
        }
    },
    methods: {
        getPosts() {
            // returns posts
            axios.get('/api/blog/')
                .then(response => {
                    vm.posts = response.data;
                });
        },
        deletePost(postId) {

            axios.get('/api/blog/delete/' + postId).then(function (response) {
                select('#_' + postId).classList.add('removing');
                // on success
                // update after animation completes
                setTimeout(() => {
                    vm.getPosts();
                }, 500)
            }).catch(error => {
                console.error(error);
            });
        },
        publishPost() {
            // console.log(this.editor.getDelta());

            // this line of code is syncronous
            vm.newPost.body = JSON.stringify(vm.editor.getDelta()),

                axios.post('/api/blog/publish', vm.newPost)
                .then(response => {
                    // reset the new post
                    // vm.newPost = {
                    //     author: "Amar",
                    //     title: "",
                    //     brief: "",
                    //     hero_image: "",
                    //     body: ""
                    // }
                    // vm.editor.updateContents(new Delta());
                }).catch(error => {
                    console.log(error.response);
                });
        },
        draftPost() {
            axios.post('/api/blog/adraft', this.editor.Delta)
                .then(response => {
                    console.log(response);
                })
        },
        previewPost() {
            console.log('you are previewing the post');
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
    created() {
        this.activeSection = window.location.hash || '#all_posts';
    },
    mounted() {
        // text editors script
        const quillContainer = select('#editor');
        // readOnly: true,
        // debug: 'info',
        let options = {
            modules: {
                // syntax: true,
                toolbar: '#toolbar',
                imageResize: {
                    displaySize: true
                }
            },
            placeholder: ' ...لیکنه دلته وکړۍ #',
            theme: 'bubble',
            scrollingContainer: '#scrolling-container ',
        };
        let quill = new Quill(quillContainer, options);
        this.editor = quill.editor;
        // by defualt right to left
        select(".ql-direction").click();
    }
});