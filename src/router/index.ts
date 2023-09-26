import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "廣場",
      keepAlive: true,
    },
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/post",
    name: "post",
    meta: {
      title: "社區详情",
    },
    component: () => import("@/views/Post.vue"),
  },
  {
    path: "/topic",
    name: "topic",
    meta: {
      title: "話題",
    },
    component: () => import("@/views/Topic.vue"),
  },
  {
    path: "/anouncement",
    name: "anouncement",
    meta: {
      title: "公告",
    },
    component: () => import("@/views/Anouncement.vue"),
  },
  {
    path: "/profile",
    name: "profile",
    meta: {
      title: "主頁",
    },
    component: () => import("@/views/Profile.vue"),
  },
  {
    path: "/u",
    name: "user",
    meta: {
      title: "用戶詳情",
    },
    component: () => import("@/views/User.vue"),
  },
  {
    path: "/messages",
    name: "messages",
    meta: {
      title: "消息",
    },
    component: () => import("@/views/Messages.vue"),
  },
  {
    path: "/collection",
    name: "collection",
    meta: {
      title: "收藏",
    },
    component: () => import("@/views/Collection.vue"),
  },
  {
    path: "/contacts",
    name: "contacts",
    meta: {
      title: "好友",
    },
    component: () => import("@/views/Contacts.vue"),
  },
  {
    path: "/following",
    name: "following",
    meta: {
      title: "關注",
    },
    component: () => import("@/views/Following.vue"),
  },
  {
    path: "/wallet",
    name: "wallet",
    meta: {
      title: "錢包",
    },
    component: () => import("@/views/Wallet.vue"),
  },
  {
    path: "/Chatpage",
    name: "Chatpage",
    meta: {
      title: "聊天",
      keepAlive: true,
    },
    component: () => import("@/views/Chatpage.vue"),
  },
  {
    path: "/setting",
    name: "setting",
    meta: {
      title: "設置",
    },
    component: () => import("@/views/Setting.vue"),
  },
  {
    path: "/feedback",
    name: "feedback",
    meta: {
      title: "反饋",
      keepAlive: true,
    },
    component: () => import("@/views/Feedback.vue"),
  },
  {
    path: "/my",
    name: "my",
    meta: {
      title: "我的",
    },
    component: () => import("@/views/My.vue"),
  },
  {
    path: "/404",
    name: "404",
    meta: {
      title: "404",
    },
    component: () => import("@/views/404.vue"),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 塞波爾社區`;
  next();
});

export default router;
