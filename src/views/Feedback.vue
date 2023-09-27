<template>
    <div>
        <main-nav :title="title" />

        <div class="friend-list">
            <h1>{{store.state.userInfo.is_admin ? '用戶列表' : '客服列表'}}</h1>
            <ul>
                <li @click="toChat(friend.user_id)" v-for="friend in friends" :key="friend.user_id" class="friend-item">
                    <img src="https://h1.qianyin.ink/file_server/image/icon/people.png" class="avatar" />
                    <div class="friend-info">
                        <p class="friend-name">{{ friend.nickname }}</p>
                        <p class="friend-status">{{ friend.is_online ? '在線':'離線' }}</p>
                    </div>
                </li>
            </ul>
        </div>
        <tabbar v-if="store.state.collapsedLeft"></tabbar>
    </div>
</template>

<script setup lang="ts">
import { kefuList ,chatIds} from '@/api/chat';
import { ref, onMounted, computed, watch,onActivated} from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import InfiniteLoading from "v3-infinite-loading";
import { getPosts } from '@/api/post';

const store = useStore();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const noMore = ref(false);
const list = ref<any[]>([]);
const page = ref(1);
const pageSize = ref(20);
const totalPage = ref(0);
const friends = ref<any[]>([]);




const title = computed(() => {
    let t = '反饋';

    if (route.query && route.query.q) {
        if (route.query.t && route.query.t === 'tag') {
            t = '#' + decodeURIComponent(route.query.q as string);
        } else {
            t = '搜索: ' + decodeURIComponent(route.query.q as string);
        }
    }

    return t;
});

const toChat = (id: any) => {
    console.log(id)
    router.push({
        name: 'Chatpage',
        query: {
            id
        },
    });
};
const loadPosts = () => {
    loading.value = true;
    getPosts({
        query: route.query.q ? decodeURIComponent(route.query.q as string) : null,
        type: route.query.t as string,
        page: page.value,
        page_size: pageSize.value,
    })
        .then((rsp) => {
            loading.value = false;
            if (rsp.list.length === 0) {
                noMore.value = true
            }

            if (page.value > 1) {
                list.value = list.value.concat(rsp.list);
            } else {
                list.value = rsp.list;
                window.scrollTo(0, 0);
            }

            totalPage.value = Math.ceil(rsp.pager.total_rows / pageSize.value);
        })
        .catch((err) => {
            loading.value = false;
            if (page.value > 1) {
                page.value--
            }
        });
};

const onPostSuccess = (post: Item.PostProps) => {
    // 如果不在第一页，需要跳转到详情页面
    if (page.value != 1) {
        router.push({
            name: 'post',
            query: {
                id: post.id,
            },
        });
        return;
    }

    // 如果实在第一页，就地插入新推文到文章列表中
    let items = [];
    let length = list.value.length;
    if (length == pageSize.value) {
        length--;
    }
    var i = 0;
    for (; i < length; i++) {
        let item: Item.PostProps = list.value[i];
        if (!item.is_top) {
            break;
        }
        items.push(item);
    }
    items.push(post);
    for (; i < length; i++) {
        items.push(list.value[i]);
    }
    list.value = items;
};

const nextPage = () => {
    if (page.value < totalPage.value || totalPage.value == 0) {
        noMore.value = false;
        page.value++;
        loadPosts();
    } else {
        noMore.value = true;
    }
};
onActivated(() => {
    // loadPosts(); 
    // console.log('onMounted',store.state.userInfo.is_admin)
    if(store.state.userInfo.is_admin){
        chatIds({})
        .then((rsp) => {
            console.log(rsp)
            friends.value = rsp.list || []
        })
        .catch((err) => {
            console.log(err)
        });
    }else{
        kefuList({})
        .then((rsp) => {
            console.log(rsp)
            friends.value = rsp.list || []
        })
        .catch((err) => {
            console.log(err)
        });
    }
    

});
</script>

<style lang="less" scoped>
ul {
    padding: 10px;
}

.friend-list {
    max-width: 400px;
    // margin: 0 auto;
    padding: 20px;
    font-family: Arial, sans-serif;
}

.friend-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    margin-right: 10px;
}

.friend-info {
    flex: 1;
}

.friend-name {
    font-weight: bold;
}

.friend-status {
    color: #666;
}

.load-more {
    margin: 20px;

    .load-more-wrap {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 14px;

        .load-more-spinner {
            font-size: 14px;
            opacity: 0.65;
        }
    }
}

.dark {

    .main-content-wrap,
    .pagination-wrap,
    .empty-wrap,
    .skeleton-wrap {
        background-color: rgba(16, 16, 20, 0.75);
    }
}
</style>