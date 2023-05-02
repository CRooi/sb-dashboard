<template>
    <t-layout>
        <t-aside>
            <t-menu theme="light" :value="nowShow" style="margin-right: 50px; min-height: 100vh;">
                <template #logo>
                    <div style="margin: auto; font-size: 24px;">
                        SB Dashboard
                    </div>
                </template>
                <t-menu-item value="status" @click="nowShow = 'status'">
                    <template #icon>
                        <t-icon name="dashboard" />
                    </template>
                    状态
                </t-menu-item>
                <t-menu-item value="charge" @click="nowShow = 'charge'">
                    <template #icon>
                        <t-icon name="money-circle" />
                    </template>
                    卡密充值
                </t-menu-item>
                <t-menu-item value="serviceSettings" @click="nowShow = 'serviceSettings'">
                    <template #icon>
                        <t-icon name="setting" />
                    </template>
                    服务设置
                </t-menu-item>
                <t-menu-item value="settings" @click="nowShow = 'settings'">
                    <template #icon>
                        <t-icon name="setting" />
                    </template>
                    仪表盘设置
                </t-menu-item>
            </t-menu>
        </t-aside>
        <t-layout>
            <t-content>
                <div style="padding: 20px;">
                    <status v-if="nowShow == 'status'" />
                    <Settings v-if="nowShow == 'settings'" />
                    <Charge v-if="nowShow == 'charge'" />
                    <Servicesettings v-if="nowShow == 'serviceSettings'" />
                </div>
            </t-content>
        </t-layout>
    </t-layout>
</template>  

<script setup lang="ts">
import { ref, Ref } from 'vue'
import Status from './components/Status.vue'
import Settings from './components/Settings.vue'
import Charge from './components/Charge.vue'
import Servicesettings from './components/Servicesettings.vue'

let nowShow: Ref<string> = ref('status')
</script>

<style>
* {
    font-family: sans-serif;
}

html, body {
    padding: 0;
    margin: 0;
}
</style>