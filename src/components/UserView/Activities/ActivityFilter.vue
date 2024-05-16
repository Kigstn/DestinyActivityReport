<script setup lang="ts">
import {type Ref, ref, watch} from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText,
  TagsInputRoot
} from 'radix-vue'
import {Icon} from '@iconify/vue'


const props = defineProps<{
  placeholder: string,
  options: string[],
  values: string[]
}>()
const emit = defineEmits(["filterChange"])

const searchTerm = ref("")

watch(
    props.values,
    () => {
        searchTerm.value = ""
        console.log("Emitted Filter Change")
        emit("filterChange")
    },
    {deep: true}
)

</script>

<template>
  <ComboboxRoot
      class="relative mx-auto"
      v-model="props.values"
      v-model:search-term="searchTerm"
      multiple
  >
    <ComboboxAnchor
        class="bg-accent rounded-lg p-2 w-60 3xl:w-40 inline-flex items-center justify-between leading-none min-h-10 outline-none"
    >
      <TagsInputRoot
          v-slot="{ modelValue: tags }"
          :model-value="props.values"
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
              :placeholder="`${placeholder}...`"
              class="flex-1 w-full !bg-transparent outline-none text-text_normal data-[state=closed]:border-none"
              :class="(values.length == 0) ? 'placeholder-text_dull' : 'placeholder-transparent'"
              @keydown.enter.prevent
          />
        </ComboboxInput>
      </TagsInputRoot>


      <ComboboxTrigger>
        <Icon icon="radix-icons:chevron-down" class="h-4 w-4 text-text_bright"/>
      </ComboboxTrigger>
    </ComboboxAnchor>

    <ComboboxContent
        class="bg-accent text-text_normal absolute z-10 w-full mt-2 min-w-[160px] max-h-80 overflow-y-scroll rounded-lg will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade">
      <ComboboxViewport class="p-[5px]">
        <ComboboxEmpty class="text-text_dull text-xs text-center p-1"/>

        <ComboboxGroup>
          <ComboboxItem
              v-for="(option, index) in options"
              class="text-sm leading-none rounded-lg flex items-center h-6 px-6 relative select-none data-[highlighted]:outline-none data-[highlighted]:bg-text_bright data-[highlighted]:text-bg_site"
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
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxRoot>
</template>