import Vue from 'vue';

Vue.prototype.$timePlugin = {
    unixtoDate: (time) => {
        let datetime = new Date(time * 1000)
        let year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        let date = datetime.getDate();
        
        return `${year}/${month}/${date}`
    },
    unixtoDateTime: (time) => {
        let datetime = new Date(time * 1000)
        let year = datetime.getFullYear();
        let month = datetime.getMonth() + 1;
        let date = datetime.getDate();
        let hour = datetime.getHours();
        let minute = datetime.getMinutes();
        let second = datetime.getSeconds();

        return `${year}/${month}/${date} ${hour}:${minute}:${second}`
    }
}