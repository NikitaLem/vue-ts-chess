<template>
    <div class="little-chat">
        <ul class="chat-out" id="chat-out">
            <li v-for="(msg, index) in allMessages" :key="index">{{ `>>${index}: ${msg}` }}</li>
        </ul>
        <form action="" @submit="sendMessage($event)">
            <div class="chat-in">
                <input  id="message" autocomplete="off" style="flex-grow: 1; padding-left: 15px; font-size: 2rem;" v-model="currentMessage"/>
                <input type="submit" value="Send"/>
            </div>
        </form>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import * as io from 'socket.io-client';

const socket = io();

export default Vue.extend({
    name: 'LittleChat',

    data() {
        return {
            currentMessage: '' as string,
            allMessages: [] as string[],
        };
    },

    methods: {
        sendMessage(event: any): void {
            if (this.currentMessage === '') return;
            socket.emit('newMessage', this.currentMessage);
            this.currentMessage = '';
            event.preventDefault();
        },
    },

    mounted() {
        socket.on('addNewLine', (msg: string) => {
            this.allMessages.push(msg);
        });
    }
    
})
</script>
<style>
    .little-chat {
        width: 100%;
        height: 300px;
    }

    .chat-out {
        box-sizing: border-box;
        border: 2px solid #444444;
        width: 100%;
        height: 260px;
        margin: 0;
        padding: 0;
        list-style: none;
        overflow-y: scroll;
    }

    .chat-out li {
        font-size: 1.6rem;
        padding-left: 15px;
    }

    .chat-in {
        display: flex;
        width: 100%;
        height: 40px;
    }
</style>
