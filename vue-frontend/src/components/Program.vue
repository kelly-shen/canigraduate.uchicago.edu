<template>
  <v-card v-if="program">
    <v-card-media>
      <v-tabs centered v-if="root.extensions">
        <v-tabs-bar class="white">
          <v-tabs-slider></v-tabs-slider>
          <v-tabs-item router exact :to="{name: 'catalog', params: {id, extension: null}}">Major</v-tabs-item>
          <v-tabs-item v-for="(extension, name) in root.extensions" :key="name" router :to="{name: 'catalog', params: {id, extension: name}}">
            {{extension.name}}
          </v-tabs-item>
        </v-tabs-bar>
      </v-tabs>
    </v-card-media>
    <v-card-text>
      <div class="subheading">Program requirements</div>
      <requirement :requirement="program"></requirement>
      <div class="metadata">
        <div class="subheading">Meta</div>
        <p v-if="program.metadata.catalog">
          View the
          <a :href="program.metadata.catalog">college catalog page</a>.
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import Requirement from '@/components/Requirement';
import EventBus from '@/EventBus';
import { mapState } from 'vuex';

export default {
  components: { Requirement },
  props: {
    id: { type: String, required: true },
    extension: { type: String, required: false },
  },
  computed: {
    ...mapState('transcript', { transcript: state => state }),
    ...mapState('institution', { endpoints: state => state.endpoints }),
  },
  beforeRouteLeave(to, from, next) {
    EventBus.$emit('set-title', null);
    next();
  },
  subscriptions() {
    this.$watchAsObservable(() => this.transcript, { immediate: true }).map(
      x => x.newValue,
    );
    const id = this.$watchAsObservable(() => this.id, { immediate: true }).map(
      x => x.newValue,
    );
    const extension = this.$watchAsObservable(() => this.extension, {
      immediate: true,
    }).map(x => x.newValue);
    const root = this.endpoints
      .programs()
      .combineLatest(id, (programs, id) => programs[id]);
    return {
      root: root.do(program => {
        EventBus.$emit('set-title', program.name);
      }),
      program: root.combineLatest(extension, (root, extension) => {
        return root && extension ? root.extensions[extension] : root;
      }),
    };
  },
};
</script>
