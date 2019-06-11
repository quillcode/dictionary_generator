const vm = new Vue({
    el: "#app",
    data: {
        posts: [],
        top_2p: [],
    },
    created() {
        // returns posts
        axios.get('/api/blog/')
            .then(response => {
                vm.posts = response.data;
                vm.top_2p.push(vm.posts[0]);
                vm.top_2p.push(vm.posts[1]);
            });

    }
});