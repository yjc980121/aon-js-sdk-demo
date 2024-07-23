<script setup>
import { ref } from 'vue'
import { AI, AIOptions, User } from 'aonweb'

defineProps({
  msg: String,
})

const count = ref(0)
const imageUrl = ref('')

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const prediction = async () => {
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
          showToast("login failed,please try again later");
          return
      }
  }
  // const ai_options = new AIOptions({
  //     appId: REPLACE_APP_ID //replace app id
  // })
  const ai_options = new AIOptions({
      appId: 'k3ebyfaSz8b87xJb_VyEGXx_AJ0MM8ngqU7Ym3AKeW8A' //replace app id
  })
  
  let price = 10
	const ai = new AI(ai_options)
  let response = await ai.prediction("/predictions/ai/stable-diffusion-3",
  {
      input:{
          "prompt": "with smoke, half ice and half fire and ultra realistic in detail.wolf, typography, dark fantasy, wildlife photography, vibrant, cinematic and on a black background",
          "cfg": 3.5,
          "steps": 28,
          "aspect_ratio": "9:16",
          "output_format": "png",
          "output_quality": 90,
          "negative_prompt": "",
          "prompt_strength": 0.85
      }
  },price);
  if (response && response.code == 200 && response.data) {
      response = response.data
  }
  if (response.task.exec_code == 200 && response.task.is_success) {
      console.log("test",response.output);
      let url = response.output
			if (Array.isArray(response.output)) {
				url = response.output && response.output.length && response.output[0]
			}
			if (typeof url == 'object' || typeof url == 'Object') {
				return
			}
      imageUrl.value = url
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
        <img class="res_img" :src="imageUrl" mode=""></img> 
			</div>
		</div>
	</div>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
