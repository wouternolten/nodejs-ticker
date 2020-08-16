import Vue from 'vue';
import App from './App.vue';
import {
    MdTable,
    MdContent,
    MdCard,
    MdProgress,
    MdRipple,
    MdButton,
    MdIcon,
    MdField
} from 'vue-material/dist/components';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;
Vue.use(MdTable);
Vue.use(MdContent);
Vue.use(MdCard);
Vue.use(MdProgress);
Vue.use(MdRipple);
Vue.use(MdButton);
Vue.use(MdIcon);
Vue.use(MdField);

new Vue({
    render: h => h(App),
}).$mount('#app');
