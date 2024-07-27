<script setup lang="ts">
import {onMounted, type Ref, ref, toRef, toRefs, watch} from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator, ComboboxLabel,
  ComboboxRoot, ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText,
  TagsInputRoot
} from 'radix-vue'
import {Icon} from '@iconify/vue'
import {useMouseInElement} from "@vueuse/core";
import LoadingDiv from "@/components/Misc/LoadingDiv.vue";

const props = defineProps<{
  placeholder: string,
  options: string[] | { [id: string]: string[] },
  content: string[],
  loading: boolean,
}>()
const emit = defineEmits(["filterChange"])

const searchTerm = ref("")
const _content = toRef(props, "content")
const content: Ref<string[]> = ref(props.content)

watch(_content,
    (value) => {
      content.value = _content.value
    },
    {deep: true}
)

watch(
    content,
    () => {
      searchTerm.value = ""
      emit("filterChange", content.value)
    },
    {deep: true}
)

// add event listener to close doc if clicked outside
const viewport = ref(null)
const open = ref(false)
const {isOutside: viewportOutside} = useMouseInElement(viewport)
onMounted(() => {
  document.addEventListener("click", (e) => {
    if (viewportOutside.value && open.value) {
      open.value = false
    }
  })
})
</script>

<template>
  <div v-if="loading" class="h-14 w-full">
    <LoadingDiv/>
  </div>

  <ComboboxRoot
      v-else
      class="relative group/clickable"
      v-model="content"
      v-model:search-term="searchTerm"
      v-model:open="open"
      multiple
      ref="viewport"
  >
    <div
        class="absolute top-1 left-1 text-xs !text-text_normal z-10 text-clickable text-clickable-style group-hover/clickable:no-underline">
      {{ placeholder }}
    </div>

    <ComboboxAnchor
        class="clickable p-2 pt-6 w-60 3xl:w-full inline-flex items-center justify-between leading-none min-h-14 outline-none"
    >
      <TagsInputRoot
          v-slot="{ modelValue: tags }"
          :model-value="content"
          delimiter=""
          class="flex gap-2 items-center flex-wrap text-sm"
      >
        <TagsInputItem
            v-for="item in tags" :key="item"
            :value="item"
            class="flex items-center justify-center gap-2 text-accent bg-text_bright rounded-lg px-1 py-0.5 "
        >
          <TagsInputItemText class="text-sm"/>
          <TagsInputItemDelete>
            <Icon icon="lucide:x"/>
          </TagsInputItemDelete>
        </TagsInputItem>

        <ComboboxInput as-child>
          <TagsInputInput
              placeholder="Type here..."
              class="flex-1 w-full !bg-transparent outline-none text-text_bright data-[state=closed]:border-none"
              :class="(content.length == 0) ? 'placeholder-text_dull' : 'placeholder-transparent'"
              @keydown.enter.prevent
          />
        </ComboboxInput>
      </TagsInputRoot>


      <ComboboxTrigger>
        <Icon icon="radix-icons:chevron-down" class="h-4 w-4 text-text_bright"/>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
        class="bg-accent text-text_normal absolute z-20 w-full mt-2 min-w-[160px] rounded-lg will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
    >
      <ComboboxViewport class="p-[5px]">
        <ComboboxEmpty class="text-text_dull text-xs text-center p-1"/>

        <!-- Render Arrays-->
        <ComboboxGroup v-if="Array.isArray(options)" class="max-h-80 overflow-y-scroll">
          <ComboboxItem
              v-for="(option, index) in options"
              class="text-sm leading-none rounded-lg flex items-center min-h-6 px-6 py-1 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-text_bright data-[highlighted]:text-bg_site"
              :key="index"
              :value="option"
          >
            <ComboboxItemIndicator
                class="absolute left-0 w-6 inline-flex items-center justify-center"
            >
              <Icon icon="radix-icons:check"/>
            </ComboboxItemIndicator>
            <span>
              {{ option }}
            </span>
          </ComboboxItem>
        </ComboboxGroup>

        <!-- Render Dicts-->
        <div v-else>
          <ComboboxGroup v-for="(value, key, index) in options">
            <ComboboxLabel class="px-6 text-xs leading-4 text-text_dull">
              {{ key }}
            </ComboboxLabel>

            <ComboboxItem
                v-for="(option, index) in value"
                class="text-sm leading-none rounded-lg flex items-center min-h-6 px-6 py-1 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-text_bright data-[highlighted]:text-bg_site"
                :key="index"
                :value="option"
            >
              <ComboboxItemIndicator
                  class="absolute left-0 w-6 inline-flex items-center justify-center"
              >
                <Icon icon="radix-icons:check"/>
              </ComboboxItemIndicator>

              <span>
                {{ option }}
              </span>
            </ComboboxItem>

            <ComboboxSeparator v-if="(Object.keys(options).length - 1) > index" class="h-0.5 bg-text_dull/50 m-1"/>
          </ComboboxGroup>
        </div>
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>
