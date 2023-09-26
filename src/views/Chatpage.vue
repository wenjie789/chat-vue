<template>
    <div class="chat">
        <div class="chat-header">
            <h2>問題反饋</h2>
        </div>
        <div class="chat-messages" ref="messageContainer">
            <div v-for="message in messages" :key="message.id" class="messages">
                <div v-if="message.type == 2">
                    <p :class="{ 'my-message': $route.query.id != message.sender_user_id }">{{ message.content }}</p>
                </div>
                <div v-else-if="message.type == 3" class="img"
                    :class="{ 'my-message': $route.query.id != message.sender_user_id }">
                    <img :src="message.content" alt="Image" />
                </div>
                <div v-else-if="message.type == 4" class="video"
                    :class="{ 'my-message': $route.query.id != message.sender_user_id }">
                    <video controls :src="message.content"></video>
                </div>
            </div>
        </div>
        <div class="chat-input">
            <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="輸入消息..." />
            <button @click="sendMessage">發送</button>
        </div>
        <div style="margin-top: 10px;margin-bottom: 10px;">
            <input type="file" ref="fileInput" style="display: none" @change="sendFile" accept="image/*,video/*" />
            <button @click="openFileInput">選擇文件</button>
        </div>
    </div>
</template>
  
<script>
import io from 'socket.io-client';
import axios from 'axios';
import { chatRecords, uploadAttachment } from '@/api/chat';
const socket = io('ws://106.14.167.99:8009', {
    path: '/chat',
    transports: ['websocket'], // 指定传输方式，如WebSocket
    autoConnect: true, // 是否自动连接
    reconnection: true, // 是否自动重新连接
    reconnectionAttempts: 3, // 重新连接尝试次数
    reconnectionDelay: 1000, // 重新连接延迟时间（毫秒）
});
export default {
    data() {
        return {
            messages: [],
            newMessage: '',
        };
    },
    activated() {
        socket.on('chat_result', (data) => {
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        });
        socket.on('chat_msg', (data) => {
            this.messages.push({
                type: data.msg_type,
                content: data.msg_content,
                sender_user_id: data.from_id
            });
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        });
        let obj = { token: localStorage.getItem('PAOPAO_TOKEN') }
        socket.emit('login', JSON.stringify(obj));
        socket.on('login_result', (data) => {
            console.log('login_result', data)
            // if(data.code == 0){
            //     socket.disconnect()
            // }
        });
        chatRecords({ with_id: this.$route.query.id })
            .then((rsp) => {
                this.messages = rsp.chat_list
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
                console.log('rsp', this.messages)
            })
            .catch((err) => {
                console.log(err)
            });
    },
    mounted() {

    },

    methods: {
        openFileInput() {
            this.$refs.fileInput.click();
        },

        sendFile(event) {
            const file = event.target.files[0];
            if (!file) return;

            const formData = new FormData();
            const token = localStorage.getItem('PAOPAO_TOKEN')
            let type = ''
            let msgtype = ''

            // 判断文件类型并处理
            if (file.type.startsWith('image/')) {
                type = 'public/image'
                msgtype = 3
                this.messages.push({
                    type: '3',
                    content: URL.createObjectURL(file),
                });
            } else if (file.type.startsWith('video/')) {
                msgtype = 4
                type = 'public/video'
                this.messages.push({
                    type: '4',
                    content: URL.createObjectURL(file),
                });
            }
            formData.append('file', file);
            formData.append('type', 'public/image');
            // 发起网络请求
            axios.post('http://106.14.167.99:8008/v1/attachment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + token
                },
            })
                .then(response => {
                    let obj = { to_id: Number(this.$route.query.id), msg_type: msgtype, msg_content: response.data.data.content }
                    socket.emit('chat', JSON.stringify(obj));
                    console.log('response', response.data.data.content)
                })
                .catch(error => {
                    console.error('文件上传失败:', error);
                });

            // 清空文件输入字段
            event.target.value = '';

            // 滚动到底部
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
        scrollToBottom() {
            const container = this.$refs.messageContainer;
            container.scrollTop = container.scrollHeight;
        },
        // chat- 传参json - { "to_id": 1212, "msg_type": 1, "msg_content": "ss" } - 返回推送
        //"chat_result": { "code": 0, "msg": "a" } code=0成功 > 0
        // 出现错误 - 给对方发送chat_msg消息 - { "from_id": 1211, "msg_type": 1, "msg_content": "ss" }
        sendMessage() {
            if (this.newMessage.trim() === '') return;
            this.messages.push(
                {
                    type: '2',
                    content: this.newMessage,
                },
            );
            let obj = { to_id: Number(this.$route.query.id), msg_type: 2, msg_content: this.newMessage }
            socket.emit('chat', JSON.stringify(obj));
            this.newMessage = '';
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        },
    },
};
</script>
  
<style scoped>
.text {
    /* max-width: 90%; */
}

.img {

    /* width: 80%; */
    margin-top: 10px;
    margin-bottom: 10px;
}

.video {
    /* display: flex;
    justify-content: flex-end; */
    /* width: 80%; */
    margin-top: 10px;
    margin-bottom: 10px;
}

.chat {
    /* max-width: 400px; */
    /* margin: 0 auto; */
    /* padding: 10px; */
    font-family: Arial, sans-serif;
}

.chat-header {
    text-align: center;
    margin-bottom: 20px;
}

.messages {
    max-width: 100%;
}

.chat-messages {
    height: 400px;
    width: 90%;
    overflow-y: scroll;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 0 auto;
    margin-bottom: 20px;

}

.message {
    padding: 5px;
    margin-bottom: 10px;
    border-radius: 5px;
}

.my-message {
    display: flex;
    justify-content: flex-end;
    /* max-width: 80%; */
    /* background-color: #007bff; */
    /* color: #fff; */

}

.chat-input {
    display: flex;
    /* width: 95%; */
}

input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>