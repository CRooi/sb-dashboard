<template>
    <div v-if="apikey == ''">
        您还未配置OpenAI-SB API Key。
    </div>
    <div v-if="apikey != ''">
        API Key <t-tag theme="danger" variant="light-outline">请确保API Key填写正确。</t-tag>
        <div style="margin-bottom: 5px;"></div>
        <t-input size="large" placeholder="API Key" style="max-width: 99%; margin-bottom: 10px;" v-model="apikey" />
        卡密
        <div style="margin-bottom: 5px;"></div>
        <t-input size="large" placeholder="卡密" style="max-width: 99%; margin-bottom: 10px;" v-model="card" />
        <div style="margin-bottom: 5px;">还没有卡密？<t-link underline theme="primary" href="https://www.feijiji.com/#16" target="_blank">点我</t-link>购买
        </div>
        <div style="opacity: 0.5; margin-bottom: 10px;">充值成功后，「仪表盘设置」中的「已充值金额」将自动更新。</div>
        <t-button @click="charge()" :loading="isLoading" :disabled="isLoading">充值</t-button>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import ls from '../localStorage'
import axios from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'

let isLoading = ref(false)
let apikey: Ref<string> = ref(ls.get('apikey') || '')
let chargedMoney: Ref<string> = ref(ls.get('chargedMoney') || '')
let card: Ref<string> = ref('')

let charge = () => {
    isLoading.value = true
    if(apikey.value == '' || card.value == '') {
        MessagePlugin.error('某个或多个输入框未填写。')
        isLoading.value = false
        return
    }
    axios.get(`https://api.openai-sb.com/sb-api/user/card/use?api_key=${apikey.value}&card=${card.value}`).then(res => {
        let json = res.data
        if(json.code == 500) {
            MessagePlugin.error('充值失败，请检查API Key或卡密是否填写正确。')
        }else {
            axios.get(`https://api.openai-sb.com/sb-api/user/card/status?api_key=${apikey.value}&card=${card.value}`).then(res => {
                let json = res.data
                if(json.code == 500) {
                    MessagePlugin.error('已充值金额更新失败，原因未知。')
                }else {
                    chargedMoney.value = String(Number(chargedMoney.value) + Number(json.data.value))
                    ls.set('chargedMoney', chargedMoney.value)
                }
            })
            MessagePlugin.success('充值成功。')
        }
        isLoading.value = false
    })
}
</script>