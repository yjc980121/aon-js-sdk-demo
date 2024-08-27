<script setup>
import Loading from './components/Loading.vue'
import { AI, AIOptions, User } from 'aonweb'
import { ref } from 'vue'


const showLoading = ref(false);
const output=ref('')
const is_text = ref(false)
const is_audio = ref(false)
const is_video = ref(false)
const is_image = ref(false)

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const prediction = async () => {
  try {
    showLoading.value = true
    let user = new User()
    let is_login = await user.islogin()
    if (!is_login) {
        for (let i = 0; i < 10; i++) {
            let result = await user.getOwnedUsers()
            let userid = result && result._userIds && result._userIds.length && result._userIds[0]
            if (userid && userid.length) {
                break
            }
            await sleep(300)       
        }
        is_login = await user.islogin()
        if (!is_login) {
            console.log("login failed,please try again later");
            showLoading.value = false
            return
        }
    }
    // const ai_options = new AIOptions({
    //     appId: REPLACE_APP_ID //replace app id
    // })
    const ai_options = new AIOptions({
        appId: '55VCW0J_mK6PqgPlml.9C5ZdA39tYqTiIUdMxvTLWE4A' //replace app id
    })
  
    let price = 8
    const ai = new AI(ai_options)
    let response = await ai.prediction("/predictions/ai/minigpt-4",
    {
      input:{
        "image": "https://replicate.delivery/pbxt/IqG1MbemhULihtfr62URRZbI29XtcPsnOYASrTDQ6u5oSqv9/llama_13b.png",
        "top_p": 0.9,
        "prompt": "This llama's name is Dave. Write me a story about how Dave found his skateboard.",
        "num_beams": 5,
        "max_length": 4000,
        "temperature": 1.32,
        "max_new_tokens": 3000,
        "repetition_penalty": 1
      }
    },price);
    showLoading.value = false
    if (response && response.code == 200 && response.data) {
        response = response.data
    }
    if (response.task.exec_code == 200 && response.task.is_success) {
        console.log("test",response.output);
        let url = response.output
        output.value = url
        if (Array.isArray(response.output)) {
          url = response.output && response.output.length && response.output[0]
        }
        
        if (typeof url == 'object' || typeof url == 'Object') {
          return
        }
      is_text.value = true
    }
  } catch (error) {
    console.log("prediction error = ",error)
    showLoading.value = false
  }
}

</script>

<template>
  <Loading v-if="showLoading" :showLoading="showLoading" />
	<div>
		<!-- 页面内容 -->
		<div class="">
      <button class="" @click="prediction">
        <text>生成</text>
      </button>
      <div class="uni-form-item uni-column">
        <div v-if="is_image">
        <!-- 展示图像 -->
        <img class="res_img" :src="output" mode="" />
        </div>
        <div v-else-if="is_audio">
          <!-- 展示音频 -->
          <audio :src="output.audioUrl" controls></audio>
        </div>
        <div v-else-if="is_video">
          <!-- 展示视频 -->
          <audio :src="output" controls></audio>
        </div>
        <div v-else-if="is_text">
          <!-- 展示文本 -->
          <textarea readonly>{{ output }}</textarea>
        </div>
      </div>
		</div>
	</div>
</template>

<style scoped>

.container {
	padding: 0 6.4vw 18.4vw;
	margin: 0;
}

</style>
