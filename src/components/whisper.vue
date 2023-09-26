<template>
    <n-modal
        :show="show"
        @update:show="closeModal"
        class="whisper-card"
        preset="card"
        size="small"
        title="私信"
        :mask-closable="false"
        :bordered="false"
        :style="{
            width: '360px',
        }"
    >
        <div class="whisper-wrap">
            <n-alert :show-icon="false">
                即將發私信給:
                <n-ellipsis style="max-width: 100%">
                    <n-gradient-text type="success">
                        {{ user.nickname }}@{{ user.username }}
                    </n-gradient-text>
                </n-ellipsis>
            </n-alert>
            <div class="whisper-line">
                <n-input
                    type="textarea"
                    placeholder="請輸入私信內容（請勿發送不和諧內容，否則將會被封號）"
                    :autosize="{
                        minRows: 5,
                        maxRows: 10,
                    }"
                    v-model:value="content"
                    maxlength="200"
                    show-count
                />
            </div>
            <div class="whisper-line send-wrap">
                <n-button
                    strong
                    secondary
                    type="primary"
                    :loading="loading"
                    @click="sendWhisper"
                >
                    發送
                </n-button>
            </div>
        </div>
    </n-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { sendUserWhisper } from '@/api/user';

const props = withDefaults(
    defineProps<{
        show: boolean;
        user: Item.UserInfo;
    }>(),
    {
        show: false,
    }
);
const content = ref('');
const loading = ref(false);

const emit = defineEmits<{
    (e: 'success'): void;
}>();
const closeModal = () => {
    emit('success');
};
const sendWhisper = () => {
    loading.value = true;
    sendUserWhisper({
        user_id: props.user.id,
        content: content.value,
    })
        .then((res: any) => {
            window.$message.success('發送成功');
            loading.value = false;
            content.value = '';

            closeModal();
        })
        .catch((err: any) => {
            loading.value = false;
        });
};
</script>

<style lang="less" scoped>
.whisper-wrap {
    .whisper-line {
        margin-top: 10px;

        &.send-wrap {
            .n-button {
                width: 100%;
            }
        }
    }
}
.dark {
    .whisper-wrap {
        background-color: rgba(16, 16, 20, 0.75);
    }
}
</style>