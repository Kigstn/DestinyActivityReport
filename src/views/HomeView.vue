<script setup lang="ts">
import {AccordionContent, AccordionHeader, AccordionItem, AccordionRoot, AccordionTrigger} from 'radix-vue'
import FaqItem from "@/components/Misc/FaqItem.vue";
</script>

<template>
  <div class="flex flex-col gap-8 text-center w-4/5">
    <div class="flex flex-col text-text_bright text-sm">
      <div class="flex justify-center">
        <svg width="40" height="40" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M11.1464 6.85355C11.3417 7.04882 11.6583 7.04882 11.8536 6.85355C12.0488 6.65829 12.0488 6.34171 11.8536 6.14645L7.85355 2.14645C7.65829 1.95118 7.34171 1.95118 7.14645 2.14645L3.14645 6.14645C2.95118 6.34171 2.95118 6.65829 3.14645 6.85355C3.34171 7.04882 3.65829 7.04882 3.85355 6.85355L7.5 3.20711L11.1464 6.85355ZM11.1464 12.8536C11.3417 13.0488 11.6583 13.0488 11.8536 12.8536C12.0488 12.6583 12.0488 12.3417 11.8536 12.1464L7.85355 8.14645C7.65829 7.95118 7.34171 7.95118 7.14645 8.14645L3.14645 12.1464C2.95118 12.3417 2.95118 12.6583 3.14645 12.8536C3.34171 13.0488 3.65829 13.0488 3.85355 12.8536L7.5 9.20711L11.1464 12.8536Z"
              fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path>
        </svg>
      </div>
      <div>
        Use the search bar to search (duh) players
      </div>
    </div>

    <div class="bg-accent h-0.5"/>

    <div class="flex flex-col gap-2">
      <p class="text-3xl text-text_bright font-bold">
        Welcome to Destiny Activity Report!
      </p>
      <p>
        Destiny Activity Report is a static website which let's Destiny 2 players interactively view all of their activity stats! Activities dynamically loaded from the bungie API, so the website will always automatically represent the current state of the game.
      </p>
      <p>
        If you have any feedback, feature requests, or if you find any of the purposefully included bugs - please reach
        out to me by creating an issue on GitHub or by writing me an email. Links can be found below :)
      </p>
    </div>

    <div class="flex flex-col gap-2 mt-8">
      <p class="text-2xl text-text_bright">
        FAQ
      </p>

      <AccordionRoot
          class="flex flex-col gap-1"
          type="single"
          :collapsible="true"
      >
        <FaqItem
            question="Why doesn't this website differentiate between checkpoints and full clears? Raid.Report does that!">
          <p>
            In theory I could do that.
            However, that would require me to call a different API endpoint which only returns one activity per call.
            The endpoint I currently use returns 250 activities at once - but includes a bit less information.
            That includes the information if the activity was started as a CP or fresh.
          </p>
          <p>
            I'm sure you can see where this is going...
          </p>
          <p>
            Doing this would increase page load time from a couple of seconds to ~10mins per 2000h played (rough
            estimate).
            This works for Raid.Report since they keep track of all activities server side and send that to you.
            This website makes ALL request from the client side.
          </p>
          <p>
            If you want this feature, please pester Bungie to add a new endpoint to their API! :)
          </p>
        </FaqItem>
        <FaqItem
            question="Why does my clear not have any special tags? I cleared it solo - but nothing shows up :(">
          <p>
            Did you maybe clear it in a timeframe that we do not give any tags for? <a class="hyperlink"
                                                                                       href="https://github.com/Kigstn/DestinyActivityReport/tree/main/src/data/blacklistedTimeframes.ts">You
            can view a full list of those dates here.</a>
          </p>
          <p>
            Why did I do this? Well.. There are a bunch of times in destiny history where special tags were MUCH easier
            to get. Think the busted weapon crafting period [<a class="hyperlink" href="/pgcr/13863578720">Example</a>].
            Sometimes there are also timeframes where the API was broken and was awarding clears for stuff that
            obviously was no clear [<a class="hyperlink" href="/pgcr/13863578720">Example</a>].
          </p>
          <p>
            Why unfortunate for those affected, I feel like it makes it much fairer for those who achieved the tags the
            hard way!
          </p>
          <p>
            If you feel like a timeframe is missing, please let me know. 100% I forgot something :D
          </p>
          <p>
            In addition, clears that are shorter than 2 minutes are excluded by default. Noone is that quick :)
          </p>
        </FaqItem>
        <FaqItem question="Why does it say I did over a thousand black armory forge clears? That's wrong...">
          <p>
            Blame bungie!
          </p>
          <p>
            History lesson: Forges had a very low timer which you extended by throwing batteries at the thingy. If you ran out of time, you failed.
          </p>
          <p>
            However, if you failed, the API still shows the activity as completed [<a class="hyperlink" href="/pgcr/5516405893">Example</a>]. No way for me to know which forge was cleared, and which you failed sadly.
          </p>
        </FaqItem>
        <FaqItem question="What information do you collect and save?">
          <p>
            Nothing!
          </p>
          <p>
            A bunch of information is saved locally in your browser, but that's only to cache frequently requested
            information to make page loads quicker.
          </p>
        </FaqItem>
        <FaqItem question="Destiny just updated - when are you updating this side to include the new stuff?">
          <p>
            Not necessary! Everything is dynamically looked up by bungie - if they don't change anything drastic, new
            activities should show up automatically.
          </p>
        </FaqItem>
        <FaqItem question="What's your favorite activity?">
          <p>
            Scourge of the Past!
          </p>
        </FaqItem>
      </AccordionRoot>

    </div>
  </div>
</template>
