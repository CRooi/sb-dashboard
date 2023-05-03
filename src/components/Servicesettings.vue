<template>
    <div v-if="apikey == ''">
        您还未配置OpenAI-SB API Key。
    </div>
    <div v-if="apikey != ''">
        <div style="font-weight: bold; font-size: 24px; margin-bottom: 10px;">
            GPT4
            <t-loading v-if="isLoading" style="position: relative; left: 2px; top: -2px; font-size: 24px;" />
            <t-skeleton animation="gradient" v-if="isLoading" />
            <t-tag style="position: relative; top: -4px;" v-if="!isLoading && gpt4Status" theme="primary" variant="light-outline">已开启</t-tag>
            <t-tag style="position: relative; top: -4px;" v-if="!isLoading && !gpt4Status" theme="danger" variant="light-outline">已关闭</t-tag>
        </div>
        <t-popconfirm theme="danger" v-if="!isLoading && gpt4Status" @visible-change="onSwitchGpt4VisibleChange">
            <template #content>
                <p class="title" style="font-weight: 500; font-size: 14px;">确定吗？</p>
                <p class="describe" style="margin-top: -12px; font-size: 12px; color: var(--td-text-color-secondary);">关闭GPT4将影响到正在使用GPT4的服务。</p>
            </template>
            <t-button style="margin-bottom: 20px;" v-if="!isLoading" :loading="isButtonLoading" :disabled="isButtonLoading">{{ gpt4Status ? '关闭' : '开启' }}GPT4</t-button>
        </t-popconfirm>
        <t-popconfirm theme="danger" v-if="!isLoading && !gpt4Status" @visible-change="onSwitchGpt4VisibleChange">
            <template #content>
                <p class="title" style="font-weight: 500; font-size: 14px;">确定吗？</p>
                <p class="describe" style="margin-top: -12px; font-size: 12px; color: var(--td-text-color-secondary);">对于普通用户，建议使用GPT3.5而不是GPT4。因为GPT4的价格比GPT3.5<span style="color: red; font-weight: bold;">高出157.5至315倍</span>。且GPT3.5的响应速度是GPT4的<span style="color: red; font-weight: bold;">四倍多</span>。</p>
            </template>
            <t-button style="margin-bottom: 20px;" v-if="!isLoading" :loading="isButtonLoading" :disabled="isButtonLoading">{{ gpt4Status ? '关闭' : '开启' }}GPT4</t-button>
        </t-popconfirm>
        <div style="font-weight: bold; font-size: 24px; margin-bottom: 10px;">
            更换API Key
            <t-loading v-if="isLoading" style="position: relative; left: 2px; top: -2px; font-size: 24px;" />
        </div>
        <t-skeleton animation="gradient" v-if="isLoading" />
        <t-popconfirm theme="danger" v-if="!isLoading" @visible-change="onChangeApikeyVisibleChange">
            <template #content>
                <p class="title" style="font-weight: 500; font-size: 14px;">确定吗？</p>
                <p class="describe" style="margin-top: -12px; font-size: 12px; color: var(--td-text-color-secondary);">更换API Key将导致<span style="color: red; font-weight: bold;">@openai_sb_bot不可用</span>以及旧API Key失效。请将正在使用的旧API Key替换为新API Key。SB Dashboard将会自动保存新API Key。</p>
            </template>
            <t-button :loading="isButtonLoading" :disabled="isButtonLoading">更换API Key</t-button>
        </t-popconfirm>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'
import ls from '../localStorage'
import axios from 'axios'
import { MessagePlugin, DialogPlugin, DialogInstance } from 'tdesign-vue-next'

let isLoading = ref(true)
let isButtonLoading = ref(false)
let apikey: Ref<string> = ref(ls.get('apikey') || '')
let gpt4Status: Ref<any> = ref('')

let dialog: DialogInstance

if(apikey.value != '') {
    (() => {
        axios.get(`https://sbapi.crooi.io/sb-api/user/status?api_key=${apikey.value}`).then(res => {
            let json = res.data.data
            if(res.data.code == 500) {
                MessagePlugin.error('获取状态失败，请检查API Key是否填写正确。')
                return
            }
            isLoading.value = false
            gpt4Status.value = json.enable_gpt4
        })
    })()
}

let onSwitchGpt4VisibleChange = (_val: any, context: any = {}) => {
    if (context && context.trigger === 'confirm') {
        switchGpt4()
    }
}

let onChangeApikeyVisibleChange = (_val: any, context: any = {}) => {
    if (context && context.trigger === 'confirm') {
        changeApikey()
    }
}

let switchGpt4 = () => {
    isButtonLoading.value = true
    let url: string = `https://sbapi.crooi.io/sb-api/user/switch_gpt4?api_key=${apikey.value}&enable=${gpt4Status.value ? '0' : '1'}`
    axios.get(url).then(res => {
        let json = res.data
        if(json.code == 500) {
            MessagePlugin.error('操作失败，请检查API Key是否填写正确。')
        }else {
            MessagePlugin.success('操作成功。')
            gpt4Status.value = json.data
        }
        isButtonLoading.value = false
    })
}

let changeApikey = () => {
    isButtonLoading.value = true
    axios.get(`https://sbapi.crooi.io/sb-api/user/reset?api_key=${apikey.value}`).then(res => {
        let json = res.data
        if(json.code == 500) {
            MessagePlugin.error('操作失败，请检查API Key是否填写正确。')
        }else {
            dialog = DialogPlugin.alert({
                body: `API Key已重置。新API Key为：${json.data}。`,
                onConfirm: () => {
                    dialog.destroy()
                }
            })
            apikey.value = json.data
            ls.set('apikey', json.data)
        }
        isButtonLoading.value = false
    })
}
</script>

<style>
.t-popconfirm__body > .t-icon {
    margin-top: 14px !important;
}

.t-popconfirm__buttons {
    margin-top: -8px !important;
}
</style>