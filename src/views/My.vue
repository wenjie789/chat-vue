<template>
  <div>
    <main-nav title="我的" />

    <n-spin :show="userLoading">
      <div class="profile-baseinfo" v-if="store.state.userInfo.id > 0">
        <div class="avatar">
          <n-avatar :size="72" :src="store.state.userInfo.avatar" />
        </div>
        <div class="base-info">
          <div class="username">
            <strong>{{ store.state.userInfo.nickname }}</strong>
          </div>
          <div class="userinfo">
            <span class="info-item">UID. {{ store.state.userInfo.id }} </span>
            <span class="info-item"
              >{{ formatDate(store.state.userInfo.created_on) }}&nbsp;加入</span
            >
          </div>
          <div class="userinfo">
            <span class="info-item">
              <router-link
                @click.stop
                class="following-link"
                :to="{
                  name: 'following',
                  query: {
                    s: store.state.userInfo.username,
                    n: store.state.userInfo.nickname,
                    t: 'follows',
                  },
                }"
              >
                關注&nbsp;&nbsp;{{ store.state.userInfo.follows }}
              </router-link>
            </span>
            <span class="info-item">
              <router-link
                @click.stop
                class="following-link"
                :to="{
                  name: 'following',
                  query: {
                    s: store.state.userInfo.username,
                    n: store.state.userInfo.nickname,
                    t: 'followings',
                  },
                }"
              >
                粉絲&nbsp;&nbsp;{{ store.state.userInfo.followings }}
              </router-link>
            </span>
          </div>
        </div>
      </div>
    </n-spin>
    <div>
      <van-cell-group>
        <van-cell size="large" is-link  v-for="(item,index) in routeList" :key="index" @click="toRoute(item)">
            <template #title>
            <div style="display: flex;align-items: center;">
             <n-icon :size="24">
               <component :is="item.icon"></component>
              </n-icon>
            <div style="margin-left: 20px;">{{item.label}}</div>
            </div>
          </template>

        </van-cell>
      </van-cell-group>
    </div>
    <tabbar />
  </div>
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import {
  HomeOutline,
  BookmarksOutline,
  MegaphoneOutline,
  ChatbubblesOutline,
  LeafOutline,
  PeopleOutline,
  WalletOutline,
  SettingsOutline,
  LogOutOutline,
} from "@vicons/ionicons5";
import { Hash } from "@vicons/tabler";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { formatDate } from "@/utils/formatTime";
import { NIcon } from "naive-ui";
const store = useStore();
const userLoading = ref(false);
const router = useRouter()
const routeList = ref([
  {
    label: "話題",
    key: "topic",
    icon: () => h(Hash),
    href: "/topic",
  },
  {
    label: "主頁",
    key: "profile",
    icon: () => h(LeafOutline),
    href: "/profile",
  },
  {
    label: "消息",
    key: "messages",
    icon: () => h(ChatbubblesOutline),
    href: "/messages",
  },
  {
    label: "收藏",
    key: "collection",
    icon: () => h(BookmarksOutline),
    href: "/collection",
  },
  {
    label: "好友",
    key: "contacts",
    icon: () => h(PeopleOutline),
    href: "/contacts",
  },
  {
    label: "設置",
    key: "setting",
    icon: () => h(SettingsOutline),
    href: "/setting",
  },
  {
    label: "退出登錄",
    key: "logout",
    icon: () => h(LogOutOutline),
    href: "/",
  },
]);
const toRoute = (item:any)=>{
  
  if(item.key=='logout'){
    store.commit('userLogout',{})
  }
  router.push(item.href)
}
</script>

<style lang="less" scoped>
.profile-tabs-wrap {
  padding: 0 16px;
}

.profile-baseinfo {
  display: flex;
  padding: 16px;

  .avatar {
    width: 72px;
  }

  .base-info {
    position: relative;
    margin-left: 12px;
    width: calc(100% - 84px);

    .username {
      line-height: 16px;
      font-size: 16px;
    }

    .userinfo {
      font-size: 14px;
      line-height: 14px;
      margin-top: 10px;
      opacity: 0.75;
      .info-item {
        margin-right: 12px;
      }
    }

    .top-tag {
      transform: scale(0.75);
    }
  }

  .user-opts {
    position: absolute;
    top: 16px;
    right: 16px;
    opacity: 0.75;
  }
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
  .profile-wrap,
  .pagination-wrap {
    background-color: rgba(16, 16, 20, 0.75);
  }
}
</style>
